import { mysqlTable, int, varchar, text, timestamp } from "drizzle-orm/mysql-core";
import { sql } from "drizzle-orm";
import { players } from "./Players";

// Player Development table
export const playerDevelopment = mysqlTable("player_development", {
  id: int("id").primaryKey().autoincrement(),
  player_id: int("player_id").notNull().references(() => players.id, { onDelete: "cascade" }),
  overall_rating: int("overall_rating").default(0).notNull(),
  last_evaluation: timestamp("last_evaluation").default(sql`CURRENT_TIMESTAMP`).notNull(),
  status: varchar("status", { length: 50 }).default("stable").notNull(), // improving, stable, needs-attention
  created_at: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
  updated_at: timestamp("updated_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
});

// Player Skill Ratings table
export const playerSkillRatings = mysqlTable("player_skill_ratings", {
  id: int("id").primaryKey().autoincrement(),
  player_development_id: int("player_development_id").notNull().references(() => playerDevelopment.id, { onDelete: "cascade" }),
  technical: int("technical").default(0).notNull(),
  physical: int("physical").default(0).notNull(),
  mental: int("mental").default(0).notNull(),
  tactical: int("tactical").default(0).notNull(),
  created_at: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
  updated_at: timestamp("updated_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
});

// Player Goals table
export const playerGoals = mysqlTable("player_goals", {
  id: int("id").primaryKey().autoincrement(),
  player_development_id: int("player_development_id").notNull().references(() => playerDevelopment.id, { onDelete: "cascade" }),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  target_date: timestamp("target_date").notNull(),
  progress: int("progress").default(0).notNull(), // 0-100
  category: varchar("category", { length: 50 }).notNull(), // technical, physical, mental, tactical
  status: varchar("status", { length: 50 }).default("active").notNull(), // active, completed, overdue
  created_at: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
  updated_at: timestamp("updated_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
});
