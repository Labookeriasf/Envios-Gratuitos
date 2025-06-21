import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

export const institutions = pgTable("institutions", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  code: text("code").notNull().unique(),
  isActive: boolean("is_active").notNull().default(true),
  shopifyDiscountId: text("shopify_discount_id"),
  shopifyPageUrl: text("shopify_page_url"), // URL de la página específica de la institución
  allowedCollections: text("allowed_collections").array(), // IDs de colecciones permitidas
  allowedProducts: text("allowed_products").array(), // IDs de productos específicos permitidos
  restrictToProducts: boolean("restrict_to_products").notNull().default(false), // Si debe restringir a productos específicos
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const discountUsage = pgTable("discount_usage", {
  id: serial("id").primaryKey(),
  institutionId: integer("institution_id").notNull().references(() => institutions.id),
  orderId: text("order_id").notNull(),
  discountAmount: integer("discount_amount").notNull(), // in cents
  usedAt: timestamp("used_at").notNull().defaultNow(),
});

export const institutionsRelations = relations(institutions, ({ many }) => ({
  discountUsage: many(discountUsage),
}));

export const discountUsageRelations = relations(discountUsage, ({ one }) => ({
  institution: one(institutions, {
    fields: [discountUsage.institutionId],
    references: [institutions.id],
  }),
}));

export const insertInstitutionSchema = createInsertSchema(institutions).omit({
  id: true,
  code: true,
  shopifyDiscountId: true,
  createdAt: true,
  updatedAt: true,
}).extend({
  allowedCollections: z.array(z.string()).optional(),
  allowedProducts: z.array(z.string()).optional(),
});

export const insertDiscountUsageSchema = createInsertSchema(discountUsage).omit({
  id: true,
  usedAt: true,
});

export type InsertInstitution = z.infer<typeof insertInstitutionSchema>;
export type Institution = typeof institutions.$inferSelect;
export type InsertDiscountUsage = z.infer<typeof insertDiscountUsageSchema>;
export type DiscountUsage = typeof discountUsage.$inferSelect;

// Remove old user tables
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
