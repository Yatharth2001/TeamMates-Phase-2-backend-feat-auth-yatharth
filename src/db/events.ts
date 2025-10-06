// schema/events.js
import { mysqlTable, int, varchar, text, boolean, date, time } from "drizzle-orm/mysql-core";

export const events = mysqlTable("events", {
  id: int("id").primaryKey().autoincrement(),
  type: varchar("type", { length: 50 }).notNull(),        // game, practice, etc.
  title: varchar("title", { length: 255 }).notNull(),
  date: date("date").notNull(),
  startTime: time("start_time"),
  endTime: time("end_time"),

  // Game-specific
  opponent: varchar("opponent", { length: 255 }),
  gameType: varchar("game_type", { length: 50 }), // home, away, neutral
  arrivalTime: time("arrival_time"),
  uniform: varchar("uniform", { length: 100 }),

  // Practice-specific
  dressCode: varchar("dress_code", { length: 255 }),
  focusAreas: varchar("focus_areas", { length: 255 }),

  // Location
  location: varchar("location", { length: 255 }),
  address: varchar("address", { length: 255 }),

  description: text("description"),
  notifyTeam: boolean("notify_team").default(true),
});
