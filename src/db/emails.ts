import { mysqlTable, int, varchar, text, timestamp, boolean } from "drizzle-orm/mysql-core";
import { sql } from "drizzle-orm";

// Main emails table
export const emails = mysqlTable("emails", {
  id: int("id").primaryKey().autoincrement(),
  sender_id: varchar("sender_id", { length: 36 }).notNull(), // Reference to user.id from auth-schema
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

// Email recipients table (many-to-many relationship)
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
