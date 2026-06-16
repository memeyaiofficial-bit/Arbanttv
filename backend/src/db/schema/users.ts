import { pgTable, text, timestamp, pgEnum } from 'drizzle-orm/pg-core';

export const userRoleEnum = pgEnum('user_role', ['viewer', 'creator']);

export const users = pgTable('users', {
  id:        text('id').primaryKey(),
  email:     text('email').unique().notNull(),
  name:      text('name').notNull(),
  role:      userRoleEnum('role').default('viewer').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export type User    = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
