import { eq, and } from 'drizzle-orm';
import { db } from '../db';
import { playlists } from '../db/schema';
import crypto from 'crypto';
import type { PlaylistCreateInput, PlaylistUpdateInput } from '../validations/playlists';
import { User } from '@supabase/supabase-js';

export const createPlaylistService = async (data: PlaylistCreateInput, authUser: User) => {
  try {
    const [newPlaylist] = await db.insert(playlists).values({
      id: data.id || crypto.randomUUID(),
      title: data.title,
      description: data.description,
      imageUrl: data.imageUrl,
      priceKes: data.priceKes !== undefined ? data.priceKes : 600,
      isFree: data.isFree !== undefined ? data.isFree : false,
      creatorId: authUser.id,
    }).returning();
    return newPlaylist;
  } catch (err: any) {
    if (err.code === '42501') throw { status: 403, message: 'Forbidden by RLS' };
    throw err;
  }
};

export const findPlaylistByIdService = async (id: string) => {
  try {
    const [playlist] = await db.select().from(playlists).where(eq(playlists.id, id));
    if (!playlist) return null;
    return playlist;
  } catch (err: any) {
    if (err.code === '42501') throw { status: 403, message: 'Forbidden by RLS' };
    throw err;
  }
};

export const findAllPlaylistsService = async (limit = 10, offset = 0) => {
  try {
    return await db.select().from(playlists).limit(limit).offset(offset);
  } catch (err: any) {
    if (err.code === '42501') throw { status: 403, message: 'Forbidden by RLS' };
    throw err;
  }
};

export const updatePlaylistService = async (id: string, data: PlaylistUpdateInput, authUser: User) => {
  try {
    const isAdmin = authUser.user_metadata?.role === 'admin' || authUser.role === 'admin';
    const filter = isAdmin ? eq(playlists.id, id) : and(eq(playlists.id, id), eq(playlists.creatorId, authUser.id));

    const [updated] = await db.update(playlists)
      .set({ ...data, updatedAt: new Date() })
      .where(filter)
      .returning();
      
    if (!updated) throw { status: 403, message: 'Forbidden or not found' };
    return updated;
  } catch (err: any) {
    if (err.code === '42501') throw { status: 403, message: 'Forbidden by RLS' };
    if (err.status) throw err;
    throw err;
  }
};

export const deletePlaylistService = async (id: string, authUser: User) => {
  try {
    const isAdmin = authUser.user_metadata?.role === 'admin' || authUser.role === 'admin';
    const filter = isAdmin ? eq(playlists.id, id) : and(eq(playlists.id, id), eq(playlists.creatorId, authUser.id));

    const [deleted] = await db.delete(playlists).where(filter).returning();
    if (!deleted) throw { status: 403, message: 'Forbidden or not found' };
    return deleted;
  } catch (err: any) {
    if (err.code === '42501') throw { status: 403, message: 'Forbidden by RLS' };
    if (err.status) throw err;
    throw err;
  }
};
