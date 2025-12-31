import React, { useEffect, useState } from "react";
import {
  Alert,
  Image,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Product } from "../models/Product";
import { syncService } from "../store/syncService";

export default function TabTwoScreen() {
  const [products, setProducts] = useState<Product[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    syncService.getProducts().then((products) => {
      setProducts(products);
    });
  }, []);

  if (products.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No products yet</Text>
        <Text style={styles.emptySubtext}>
          Add products from the Home tab to see them here
        </Text>
      </View>
    );
  }

  const onRefresh = async () => {
    setRefreshing(true);
    await syncService.getProducts().then((products) => {
      setProducts(products);
    });
    setRefreshing(false);
  };

  const handleDeleteProduct = (productId: string, productName: string) => {
    Alert.alert(
      "Delete Product",
      `Are you sure you want to delete "${productName}"?`,
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await syncService.deleteProduct(productId);
              // Refresh the products list
              const updatedProducts = await syncService.getProducts();
              setProducts(updatedProducts);
            } catch (error) {
              Alert.alert("Error", "Failed to delete product");
              console.error("Error deleting product:", error);
            }
          },
        },
      ]
    );
  };

  return (
    <ScrollView
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
      style={styles.container}
    >
      <View style={styles.header}>
        <Text style={styles.title}>Products ({products.length})</Text>
      </View>
      <View style={styles.productsList}>
        {products.map((product) => (
          <View key={product.id} style={styles.productCard}>
            {product.imageUri && (
              <Image
                source={{ uri: product.imageUri }}
                style={styles.productImage}
              />
            )}
            <View style={styles.productInfo}>
              <Text style={styles.productName}>{product.name}</Text>
              <Text style={styles.productDescription}>
                {product.description}
              </Text>
            </View>
            <Pressable
              onPress={() => handleDeleteProduct(product.id, product.name)}
              style={styles.deleteButton}
            >
              <Text style={styles.deleteButtonText}>Delete</Text>
            </Pressable>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#333",
  },
  productsList: {
    padding: 20,
  },
  productCard: {
    backgroundColor: "#f9f9f9",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    flexDirection: "row",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  productImage: {
    width: 100,
    height: 100,
    borderRadius: 8,
    resizeMode: "cover",
    marginRight: 16,
    backgroundColor: "#e0e0e0",
  },
  productInfo: {
    flex: 1,
    justifyContent: "center",
  },
  productName: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 8,
    color: "#333",
  },
  productDescription: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
  },
  deleteButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: "#ff3b30",
    borderRadius: 8,
    justifyContent: "center",
    alignSelf: "center",
  },
  deleteButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: "600",
    color: "#999",
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: "#bbb",
    textAlign: "center",
  },
});
