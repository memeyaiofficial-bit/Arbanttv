import { pgTable, text, integer, boolean, timestamp } from 'drizzle-orm/pg-core';
import { users } from './users';

export const playlists = pgTable('playlists', {
  id:          text('id').primaryKey(),
  title:       text('title').notNull(),
  description: text('description'),
  imageUrl:    text('image_url'),
  priceKes:    integer('price_kes').default(600).notNull(),
  isFree:      boolean('is_free').default(false).notNull(),
  creatorId:   text('creator_id').references(() => users.id, { onDelete: 'set null' }),
  createdAt:   timestamp('created_at').defaultNow().notNull(),
  updatedAt:   timestamp('updated_at').defaultNow().notNull(),
});

export type Playlist    = typeof playlists.$inferSelect;
export type NewPlaylist = typeof playlists.$inferInsert;
