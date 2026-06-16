import { eq, and } from 'drizzle-orm';
import { db } from '../db';
import { playlistAccess } from '../db/schema';
import type { PlaylistAccessCreateInput, PlaylistAccessUpdateInput } from '../validations/playlist-access';
import { User } from '@supabase/supabase-js';

export const createPlaylistAccessService = async (data: PlaylistAccessCreateInput, authUser: User) => {
  try {
    const isAdmin = authUser.user_metadata?.role === 'admin' || authUser.role === 'admin';
    if (!isAdmin) throw { status: 403, message: 'Forbidden: Admin access required' };

    const [newAccess] = await db.insert(playlistAccess).values({
      userId: data.userId,
      playlistId: data.playlistId,
      transactionId: data.transactionId,
      expiresAt: data.expiresAt ? new Date(data.expiresAt) : null,
    }).returning();
    return newAccess;
  } catch (err: any) {
    if (err.code === '42501') throw { status: 403, message: 'Forbidden by RLS' };
    if (err.status) throw err;
    throw err;
  }
};

export const findPlaylistAccessByIdService = async (userId: string, playlistId: string, authUser: User) => {
  try {
    const isAdmin = authUser.user_metadata?.role === 'admin' || authUser.role === 'admin';
    if (!isAdmin && authUser.id !== userId) throw { status: 403, message: 'Forbidden' };

    const [access] = await db.select().from(playlistAccess).where(
      and(
        eq(playlistAccess.userId, userId),
        eq(playlistAccess.playlistId, playlistId)
      )
    );
    if (!access) return null;
    return access;
  } catch (err: any) {
    if (err.code === '42501') throw { status: 403, message: 'Forbidden by RLS' };
    if (err.status) throw err;
    throw err;
  }
};

export const findAllPlaylistAccessService = async (limit = 10, offset = 0, authUser: User) => {
  try {
    const isAdmin = authUser.user_metadata?.role === 'admin' || authUser.role === 'admin';
    if (!isAdmin) {
      return await db.select().from(playlistAccess).where(eq(playlistAccess.userId, authUser.id)).limit(limit).offset(offset);
    }
    return await db.select().from(playlistAccess).limit(limit).offset(offset);
  } catch (err: any) {
    if (err.code === '42501') throw { status: 403, message: 'Forbidden by RLS' };
    throw err;
  }
};

export const updatePlaylistAccessService = async (userId: string, playlistId: string, data: PlaylistAccessUpdateInput, authUser: User) => {
  try {
    const isAdmin = authUser.user_metadata?.role === 'admin' || authUser.role === 'admin';
    if (!isAdmin) throw { status: 403, message: 'Forbidden: Admin access required' };

    const [updated] = await db.update(playlistAccess)
      .set({
        ...(data.transactionId && { transactionId: data.transactionId }),
        ...(data.expiresAt !== undefined && { expiresAt: data.expiresAt ? new Date(data.expiresAt) : null }),
      })
      .where(
        and(
          eq(playlistAccess.userId, userId),
          eq(playlistAccess.playlistId, playlistId)
        )
      )
      .returning();
      
    if (!updated) throw { status: 404, message: 'Not found' };
    return updated;
  } catch (err: any) {
    if (err.code === '42501') throw { status: 403, message: 'Forbidden by RLS' };
    if (err.status) throw err;
    throw err;
  }
};

export const deletePlaylistAccessService = async (userId: string, playlistId: string, authUser: User) => {
  try {
    const isAdmin = authUser.user_metadata?.role === 'admin' || authUser.role === 'admin';
    if (!isAdmin) throw { status: 403, message: 'Forbidden: Admin access required' };

    const [deleted] = await db.delete(playlistAccess).where(
      and(
        eq(playlistAccess.userId, userId),
        eq(playlistAccess.playlistId, playlistId)
      )
    ).returning();
    
    if (!deleted) throw { status: 404, message: 'Not found' };
    return deleted;
  } catch (err: any) {
    if (err.code === '42501') throw { status: 403, message: 'Forbidden by RLS' };
    if (err.status) throw err;
    throw err;
  }
};
