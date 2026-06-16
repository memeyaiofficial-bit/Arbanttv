import { pgTable, text, timestamp, primaryKey } from 'drizzle-orm/pg-core';
import { users } from './users';
import { playlists } from './playlists';

export const playlistAccess = pgTable(
  'playlist_access',
  {
    userId:        text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
    playlistId:    text('playlist_id').notNull().references(() => playlists.id, { onDelete: 'cascade' }),
    transactionId: text('transaction_id').notNull(),
    grantedAt:     timestamp('granted_at').defaultNow().notNull(),
    expiresAt:     timestamp('expires_at'),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.userId, table.playlistId] }),
  })
);

export type PlaylistAccess    = typeof playlistAccess.$inferSelect;
export type NewPlaylistAccess = typeof playlistAccess.$inferInsert;
