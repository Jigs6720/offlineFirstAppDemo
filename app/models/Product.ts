import { Model } from "@nozbe/watermelondb";
import { date, field } from "@nozbe/watermelondb/decorators";

export class Product extends Model {
  static table = "products";

  @field("name") name!: string;
  @field("description") description!: string;
  @field("image_uri") imageUri?: string;
  @field("server_id") serverId?: string;
  @field("is_synced") isSynced!: boolean;
  @date("created_at") createdAt!: Date;
  @date("updated_at") updatedAt!: Date;
}
