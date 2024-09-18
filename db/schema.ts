import {
  pgTable,
  serial,
  text,
  varchar,
  boolean,
  timestamp,
  decimal,
  uuid,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

export const stores = pgTable("stores", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  userId: text("userId").notNull(),
  createdAt: timestamp("createdAt").defaultNow(),
  updatedAt: timestamp("updatedAt")
    .defaultNow()
    .$onUpdateFn(() => new Date()),
});

export const billboards = pgTable("billboards", {
  id: uuid("id").defaultRandom().primaryKey(),
  label: text("label").notNull(),
  imageUrl: text("imageUrl").notNull(),
  storeId: uuid("storeId").references(() => stores.id),
  createdAt: timestamp("createdAt").defaultNow(),
  updatedAt: timestamp("updatedAt")
    .defaultNow()
    .$onUpdateFn(() => new Date()),
});

export const categories = pgTable("categories", {
  id: uuid("id").defaultRandom().primaryKey(),
  storeId: uuid("storeId").references(() => stores.id),
  billboardId: uuid("billboardId").references(() => billboards.id),
  name: text("name").notNull(),
  createdAt: timestamp("createdAt").defaultNow(),
  updatedAt: timestamp("updatedAt")
    .defaultNow()
    .$onUpdateFn(() => new Date()),
});

export const sizes = pgTable("sizes", {
  id: uuid("id").defaultRandom().primaryKey(),
  storeId: uuid("storeId").references(() => stores.id),
  name: text("name").notNull(),
  value: text("value").notNull(),
  createdAt: timestamp("createdAt").defaultNow(),
  updatedAt: timestamp("updatedAt")
    .defaultNow()
    .$onUpdateFn(() => new Date()),
});

export const colors = pgTable("colors", {
  id: uuid("id").defaultRandom().primaryKey(),
  storeId: uuid("storeId").references(() => stores.id),
  name: text("name").notNull(),
  value: text("value").notNull(),
  createdAt: timestamp("createdAt").defaultNow(),
  updatedAt: timestamp("updatedAt")
    .defaultNow()
    .$onUpdateFn(() => new Date()),
});

export const products = pgTable("products", {
  id: uuid("id").defaultRandom().primaryKey(),
  storeId: uuid("storeId").references(() => stores.id),
  categoriesId: uuid("categoriesId").references(() => categories.id),
  sizesId: uuid("sizesId").references(() => sizes.id),
  colorId: uuid("colorId").references(() => colors.id),
  name: text("name").notNull(),
  price: decimal("price").notNull(),
  descriptionMark: text("descriptionMark"),
  ytURL: text("ytURL"),
  featured: boolean("featured").default(false),
  archived: boolean("archived").default(false),
  createdAt: timestamp("createdAt").defaultNow(),
  updatedAt: timestamp("updatedAt")
    .defaultNow()
    .$onUpdateFn(() => new Date()),
});

export const images = pgTable("images", {
  id: uuid("id").defaultRandom().primaryKey(),
  productId: uuid("productId").references(() => products.id),
  url: text("url").notNull(),
  createdAt: timestamp("createdAt").defaultNow(),
  updatedAt: timestamp("updatedAt")
    .defaultNow()
    .$onUpdateFn(() => new Date()),
});

export const orders = pgTable("orders", {
  id: uuid("id").defaultRandom().primaryKey(),
  storeId: uuid("storeId").references(() => stores.id),
  name: text("name").default("Lorem ipsum"),
  email: text("email").default("loremipsum@random.com"),
  isPaid: boolean("isPaid").default(false),
  phone: text("phone").default(""),
  address: text("address").default(""),
  createdAt: timestamp("createdAt").defaultNow(),
  updatedAt: timestamp("updatedAt")
    .defaultNow()
    .$onUpdateFn(() => new Date()),
});

export const orderItems = pgTable("orderItems", {
  id: uuid("id").defaultRandom().primaryKey(),
  orderId: uuid("orderId").references(() => orders.id),
  productId: uuid("productId").references(() => products.id),
});

// Relations
export const storeRelations = relations(stores, ({ many }) => ({
  billboards: many(billboards),
  categories: many(categories),
  sizes: many(sizes),
  colors: many(colors),
  products: many(products),
  orders: many(orders),
}));

export const billboardRelations = relations(billboards, ({ one, many }) => ({
  store: one(stores, { fields: [billboards.storeId], references: [stores.id] }),
  categories: many(categories),
}));

export const categoryRelations = relations(categories, ({ one, many }) => ({
  store: one(stores, { fields: [categories.storeId], references: [stores.id] }),
  billboard: one(billboards, {
    fields: [categories.billboardId],
    references: [billboards.id],
  }),
  products: many(products),
}));

export const sizeRelations = relations(sizes, ({ one, many }) => ({
  store: one(stores, { fields: [sizes.storeId], references: [stores.id] }),
  products: many(products),
}));

export const colorRelations = relations(colors, ({ one, many }) => ({
  store: one(stores, { fields: [colors.storeId], references: [stores.id] }),
  products: many(products),
}));

export const productRelations = relations(products, ({ one, many }) => ({
  store: one(stores, { fields: [products.storeId], references: [stores.id] }),
  category: one(categories, {
    fields: [products.categoriesId],
    references: [categories.id],
  }),
  size: one(sizes, { fields: [products.sizesId], references: [sizes.id] }),
  color: one(colors, { fields: [products.colorId], references: [colors.id] }),
  images: many(images),
  orderItems: many(orderItems),
}));

export const imageRelations = relations(images, ({ one }) => ({
  product: one(products, {
    fields: [images.productId],
    references: [products.id],
  }),
}));

export const orderRelations = relations(orders, ({ one, many }) => ({
  store: one(stores, { fields: [orders.storeId], references: [stores.id] }),
  orderItems: many(orderItems),
}));

export const orderItemRelations = relations(orderItems, ({ one }) => ({
  order: one(orders, { fields: [orderItems.orderId], references: [orders.id] }),
  product: one(products, {
    fields: [orderItems.productId],
    references: [products.id],
  }),
}));

export type InsertStore = typeof stores.$inferInsert;
export type InsertBillboard = typeof billboards.$inferInsert;
export type InsertCategory = typeof categories.$inferInsert;
export type InsertSize = typeof sizes.$inferInsert;
export type InsertColor = typeof colors.$inferInsert;
export type InsertProduct = typeof products.$inferInsert;
export type InsertImage = typeof images.$inferInsert;
export type InsertOrder = typeof orders.$inferInsert;
export type InsertOrderItem = typeof orderItems.$inferInsert;

export type SelectStore = typeof stores.$inferSelect;
export type SelectBillboard = typeof billboards.$inferSelect;
export type SelectCategory = typeof categories.$inferSelect;
export type SelectSize = typeof sizes.$inferSelect;
export type SelectColor = typeof colors.$inferSelect;
export type SelectProduct = typeof products.$inferSelect;
export type SelectImage = typeof images.$inferSelect;
export type SelectOrder = typeof orders.$inferSelect;
export type SelectOrderItem = typeof orderItems.$inferSelect;
