import { mysqlTable, int, varchar, timestamp, boolean } from "drizzle-orm/mysql-core";

export const players = mysqlTable("players", {
  id: int("id").primaryKey().autoincrement(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  phone_no: varchar("phone_no", { length: 20 }),
  position: varchar("position", { length: 100 }),
  attending: boolean("attending").default(false),  // 👈 boolean flag
  status: varchar("status", { length: 50 }).default("active"),
  image: varchar("image", { length: 500 }).default(""),
  created_at: timestamp("created_at").defaultNow().notNull(),
});
