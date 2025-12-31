import { Q } from "@nozbe/watermelondb";
import NetInfo from "@react-native-community/netinfo";
import { API_BASE_URL } from "../constants/api";
import { Product } from "../models/Product";
import { database } from "./database";

interface ProductData {
  name: string;
  description: string;
  imageUri?: string;
}

export class SyncService {
  private static instance: SyncService;
  private isOnline: boolean = false;
  private syncInProgress: boolean = false;

  private constructor() {
    this.initNetworkListener();
    this.checkInitialNetworkState();
  }

  static getInstance(): SyncService {
    if (!SyncService.instance) {
      SyncService.instance = new SyncService();
    }
    return SyncService.instance;
  }

  private async checkInitialNetworkState() {
    const state = await NetInfo.fetch();
    this.isOnline = state.isConnected ?? false;
  }

  private initNetworkListener() {
    NetInfo.addEventListener((state) => {
      const wasOffline = !this.isOnline;
      this.isOnline = state.isConnected ?? false;

      if (wasOffline && this.isOnline) {
        console.log("Network connected, syncing pending products...");
        this.syncPendingProducts();
      }
    });
  }

  async addProduct(productData: ProductData): Promise<Product> {
    const isOnline = await this.checkNetworkStatus();

    // Always save to WatermelonDB first
    const product = await database.write(async () => {
      return await database.collections
        .get<Product>("products")
        .create((product) => {
          product.name = productData.name;
          product.description = productData.description;
          product.imageUri = productData.imageUri || undefined;
          product.isSynced = false;
          product.createdAt = new Date();
          product.updatedAt = new Date();
        });
    });

    // Try to sync to API if online
    if (isOnline) {
      try {
        await this.syncProductToServer(product);
      } catch (error) {
        console.error("Failed to sync product to server:", error);
        // Product is already saved locally, will sync later
      }
    }

    return product;
  }

  private async checkNetworkStatus(): Promise<boolean> {
    const state = await NetInfo.fetch();
    this.isOnline = state.isConnected ?? false;
    return this.isOnline;
  }

  private async syncProductToServer(product: Product): Promise<void> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

    try {
      const response = await fetch(`${API_BASE_URL}/products`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: product.name,
          description: product.description,
          imageUri: product.imageUri,
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const serverProduct = await response.json();

      // Update product with server ID and mark as synced
      await database.write(async () => {
        await product.update((p) => {
          p.serverId = serverProduct.id?.toString() || null;
          p.isSynced = true;
          p.updatedAt = new Date();
        });
      });

      console.log("Product synced to server:", product.id);
    } catch (error: any) {
      clearTimeout(timeoutId);
      if (error.name === "AbortError") {
        throw new Error("Request timeout: Server did not respond in time");
      }
      console.error("Error syncing product to server:", error);
      throw error;
    }
  }

  async syncPendingProducts(): Promise<void> {
    if (this.syncInProgress) {
      return;
    }

    const isOnline = await this.checkNetworkStatus();
    if (!isOnline) {
      return;
    }

    this.syncInProgress = true;

    try {
      const pendingProducts = await database.collections
        .get<Product>("products")
        .query(Q.where("is_synced", false))
        .fetch();

      console.log(`Syncing ${pendingProducts.length} pending products...`);

      for (const product of pendingProducts) {
        try {
          await this.syncProductToServer(product);
        } catch (error) {
          console.error(`Failed to sync product ${product.id}:`, error);
          // Continue with next product even if one fails
        }
      }

      console.log("Sync completed");
    } catch (error) {
      console.error("Error during sync:", error);
    } finally {
      this.syncInProgress = false;
    }
  }

  async getProducts(): Promise<Product[]> {
    return await database.collections.get<Product>("products").query().fetch();
  }

  async getProductSynced(): Promise<Product[]> {
    return await database.collections
      .get<Product>("products")
      .query(Q.where("is_synced", true))
      .fetch();
  }

  async getProductUnsynced(): Promise<Product[]> {
    return await database.collections
      .get<Product>("products")
      .query(Q.where("is_synced", false))
      .fetch();
  }

  async getProduct(id: string): Promise<Product | undefined> {
    return await database.collections.get<Product>("products").find(id);
  }

  async deleteProduct(id: string): Promise<void> {
    const product = await this.getProduct(id);
    if (!product) {
      throw new Error(`Product with id ${id} not found`);
    }

    const isOnline = await this.checkNetworkStatus();
    const hasServerId = product.serverId;

    // Delete from server first if online and has serverId
    if (isOnline && hasServerId) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

        await fetch(`${API_BASE_URL}/products/${product.serverId}`, {
          method: "DELETE",
          signal: controller.signal,
        });

        clearTimeout(timeoutId);
      } catch (error) {
        console.error("Failed to delete product from server:", error);
        // Continue with local deletion even if server deletion fails
      }
    }

    // Delete from WatermelonDB
    await database.write(async () => {
      await product.destroyPermanently();
    });

    console.log("Product deleted:", id);
  }

  async forceSync(): Promise<void> {
    await this.syncPendingProducts();
  }
}

export const syncService = SyncService.getInstance();
