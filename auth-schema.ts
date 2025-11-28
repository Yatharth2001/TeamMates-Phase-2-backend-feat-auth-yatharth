import {
  mysqlTable,
  varchar,
  text,
  timestamp,
  boolean,
  int,
} from "drizzle-orm/mysql-core";
import { sql } from "drizzle-orm";

export const user = mysqlTable("user", {
  id: varchar("id", { length: 36 }).primaryKey(),
  name: text("name").notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  emailVerified: boolean("email_verified").default(false).notNull(),
  image: text("image"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
});

export const session = mysqlTable("session", {
  id: varchar("id", { length: 36 }).primaryKey(),
  expiresAt: timestamp("expires_at").notNull(),
  token: varchar("token", { length: 255 }).notNull().unique(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  userId: varchar("user_id", { length: 36 })
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
});

export const account = mysqlTable("account", {
  id: varchar("id", { length: 36 }).primaryKey(),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  userId: varchar("user_id", { length: 36 })
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  accessTokenExpiresAt: timestamp("access_token_expires_at"),
  refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
  scope: text("scope"),
  password: text("password"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
});

export const verification = mysqlTable("verification", {
  id: varchar("id", { length: 36 }).primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
});

// Email tables
export const emails = mysqlTable("emails", {
  id: int("id").primaryKey().autoincrement(),
  sender_id: varchar("sender_id", { length: 36 }).notNull(), // Reference to user.id
  sender_name: varchar("sender_name", { length: 255 }).notNull(),
  sender_email: varchar("sender_email", { length: 255 }).notNull(),
  subject: varchar("subject", { length: 500 }).notNull(),
  content: text("content").notNull(),
  html_content: text("html_content"), // Optional HTML version
  attachments: text("attachments"), // Store as JSON array of URLs
  status: varchar("status", { length: 50 }).default("sent").notNull(), // sent, failed, pending
  sent_at: timestamp("sent_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
  created_at: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
});

export const emailRecipients = mysqlTable("email_recipients", {
  id: int("id").primaryKey().autoincrement(),
  email_id: int("email_id").notNull().references(() => emails.id, { onDelete: "cascade" }),
  recipient_type: varchar("recipient_type", { length: 50 }).notNull(), // 'player', 'user', 'external'
  recipient_id: int("recipient_id"), // Reference to players.id or users.id (nullable for external emails)
  recipient_name: varchar("recipient_name", { length: 255 }).notNull(),
  recipient_email: varchar("recipient_email", { length: 255 }).notNull(),
  is_read: boolean("is_read").default(false).notNull(),
  read_at: timestamp("read_at"),
  created_at: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
});
