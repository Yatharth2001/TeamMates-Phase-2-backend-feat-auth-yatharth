import { mysqlTable, int, varchar, text, timestamp, json } from "drizzle-orm/mysql-core";
import { sql } from "drizzle-orm";

// Formations table - stores pre-defined formations for different sports
export const formations = mysqlTable("formations", {
  id: int("id").primaryKey().autoincrement(),
  sport_id: varchar("sport_id", { length: 50 }).notNull(), // hockey, soccer, football, basketball
  name: varchar("name", { length: 100 }).notNull(), // e.g., "4-4-2", "1-2-2"
  description: text("description"),
  positions: json("positions").notNull(), // Array of {id, x, y, role}
  is_default: int("is_default").default(1).notNull(), // 1 for default formations, 0 for custom
  created_at: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
  updated_at: timestamp("updated_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
});

// Custom formations table - user-created formations
export const customFormations = mysqlTable("custom_formations", {
  id: int("id").primaryKey().autoincrement(),
  user_id: int("user_id"), // Optional: link to user if needed
  sport_id: varchar("sport_id", { length: 50 }).notNull(),
  name: varchar("name", { length: 100 }).notNull(),
  description: text("description"),
  positions: json("positions").notNull(),
  created_at: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
  updated_at: timestamp("updated_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
});

// Tactics table - stores tactics for each sport
export const tactics = mysqlTable("tactics", {
  id: int("id").primaryKey().autoincrement(),
  sport_id: varchar("sport_id", { length: 50 }).notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  is_template: int("is_template").default(1).notNull(), // 1 for templates, 0 for custom
  created_at: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
});

// Set Plays table - stores set plays for each sport
export const setPlays = mysqlTable("set_plays", {
  id: int("id").primaryKey().autoincrement(),
  sport_id: varchar("sport_id", { length: 50 }).notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  is_template: int("is_template").default(1).notNull(),
  created_at: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
});

// Game Plans table - stores complete game plans
export const gamePlans = mysqlTable("game_plans", {
  id: int("id").primaryKey().autoincrement(),
  user_id: int("user_id"), // Optional: link to user
  opponent: varchar("opponent", { length: 255 }),
  game_date: timestamp("game_date"),
  sport_id: varchar("sport_id", { length: 50 }).notNull(),
  formation_id: int("formation_id"),
  key_tactics: json("key_tactics"), // Array of tactic names
  set_plays: json("set_plays"), // Array of set play names
  notes: text("notes"),
  created_at: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
  updated_at: timestamp("updated_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
});
