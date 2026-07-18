import { mysqlTable, serial, varchar, text, mysqlEnum, timestamp } from "drizzle-orm/mysql-core";

export const schools = mysqlTable("schools", {
  id: serial("id").primaryKey(),
  npsn: varchar("npsn", { length: 8 }).notNull().unique(),
  name: varchar("name", { length: 255 }).notNull(),
  level: mysqlEnum("level", ["SMP", "SMA"]).notNull(),
  address: text("address"),
  phone: varchar("phone", { length: 20 }),
  status: mysqlEnum("status", ["Negeri", "Swasta"]).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow(),
});
