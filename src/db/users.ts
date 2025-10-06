// import { mysqlTable, serial, varchar, timestamp } from 'drizzle-orm/mysql-core';

// export const users = mysqlTable('users', {
//   id: serial('id').primaryKey(),
//   email: varchar('email', { length: 255 }).notNull(),
//   password: varchar('password', { length: 255 }).notNull(),
//   created_at: timestamp('created_at').defaultNow().notNull(),
// });


import { mysqlTable, serial, varchar, timestamp } from "drizzle-orm/mysql-core";
import { sql } from "drizzle-orm";

export const users = mysqlTable("users", {
  id: serial("id").primaryKey(),
  email: varchar("email", { length: 255 }).notNull(),
  password: varchar("password", { length: 255 }).notNull(),
  created_at: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
});
