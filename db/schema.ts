import {
  pgTable,
  text,
  boolean,
  timestamp,
  decimal,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createId } from "@paralleldrive/cuid2";

export const stores = pgTable("stores", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => createId()),
  name: text("name").notNull(),
  userId: text("userId").notNull(),
  createdAt: timestamp("createdAt").defaultNow(),
  updatedAt: timestamp("updatedAt")
    .defaultNow()
    .$onUpdateFn(() => new Date()),
});

export const billboards = pgTable("billboards", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => createId()),
  label: text("label").notNull(),
  imageUrl: text("imageUrl").notNull(),
  storeId: text("storeId").references(() => stores.id),
  createdAt: timestamp("createdAt").defaultNow(),
  updatedAt: timestamp("updatedAt")
    .defaultNow()
    .$onUpdateFn(() => new Date()),
});

export const categories = pgTable("categories", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => createId()),
  storeId: text("storeId").references(() => stores.id),
  billboardId: text("billboardId").references(() => billboards.id),
  name: text("name").notNull(),
  createdAt: timestamp("createdAt").defaultNow(),
  updatedAt: timestamp("updatedAt")
    .defaultNow()
    .$onUpdateFn(() => new Date()),
});

export const sizes = pgTable("sizes", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => createId()),
  storeId: text("storeId").references(() => stores.id),
  name: text("name").notNull(),
  value: text("value").notNull(),
  createdAt: timestamp("createdAt").defaultNow(),
  updatedAt: timestamp("updatedAt")
    .defaultNow()
    .$onUpdateFn(() => new Date()),
});

export const colors = pgTable("colors", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => createId()),
  storeId: text("storeId").references(() => stores.id),
  name: text("name").notNull(),
  value: text("value").notNull(),
  createdAt: timestamp("createdAt").defaultNow(),
  updatedAt: timestamp("updatedAt")
    .defaultNow()
    .$onUpdateFn(() => new Date()),
});

export const products = pgTable("products", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => createId()),
  storeId: text("storeId").references(() => stores.id),
  categoriesId: text("categoriesId").references(() => categories.id),
  sizesId: text("sizesId").references(() => sizes.id),
  colorId: text("colorId").references(() => colors.id),
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
  id: text("id")
    .primaryKey()
    .$defaultFn(() => createId()),
  productId: text("productId").references(() => products.id),
  url: text("url").notNull(),
  createdAt: timestamp("createdAt").defaultNow(),
  updatedAt: timestamp("updatedAt")
    .defaultNow()
    .$onUpdateFn(() => new Date()),
});

export const orders = pgTable("orders", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => createId()),
  storeId: text("storeId").references(() => stores.id),
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


export const orderitems = pgTable("orderitems", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => createId()),
  orderId: text("orderId").references(() => orders.id),
  productId: text("productId").references(() => products.id),
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
  orderItems: many(orderitems),
}));

export const imageRelations = relations(images, ({ one }) => ({
  product: one(products, {
    fields: [images.productId],
    references: [products.id],
  }),
}));

export const orderRelations = relations(orders, ({ one, many }) => ({
  store: one(stores, { fields: [orders.storeId], references: [stores.id] }),
  orderItems: many(orderitems),
}));

export const orderItemRelations = relations(orderitems, ({ one }) => ({
  order: one(orders, { fields: [orderitems.orderId], references: [orders.id] }),
  product: one(products, {
    fields: [orderitems.productId],
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
export type InsertOrderItem = typeof orderitems.$inferInsert;

export type SelectStore = typeof stores.$inferSelect;
export type SelectBillboard = typeof billboards.$inferSelect;
export type SelectCategory = typeof categories.$inferSelect;
export type SelectSize = typeof sizes.$inferSelect;
export type SelectColor = typeof colors.$inferSelect;
export type SelectProduct = typeof products.$inferSelect;
export type SelectImage = typeof images.$inferSelect;
export type SelectOrder = typeof orders.$inferSelect;
export type SelectOrderItem = typeof orderitems.$inferSelect;
