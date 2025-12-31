import { Database } from "@nozbe/watermelondb";
import SQLiteAdapter from "@nozbe/watermelondb/adapters/sqlite";
import { appSchema, tableSchema } from "@nozbe/watermelondb/Schema";
import { Product } from "../models/Product";

const mySchema = appSchema({
  version: 1,
  tables: [
    tableSchema({
      name: "products",
      columns: [
        { name: "name", type: "string" },
        { name: "description", type: "string" },
        { name: "image_uri", type: "string", isOptional: true },
        { name: "server_id", type: "string", isOptional: true },
        { name: "is_synced", type: "boolean" },
        { name: "created_at", type: "number" },
        { name: "updated_at", type: "number" },
      ],
    }),
  ],
});

const adapter = new SQLiteAdapter({
  schema: mySchema,
  dbName: "offlineFirst",
  onSetUpError: (error) => {
    console.error("Database setup error:", error);
  },
});

export const database = new Database({
  adapter,
  modelClasses: [Product],
});
