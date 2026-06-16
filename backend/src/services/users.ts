import { eq, and } from 'drizzle-orm';
import { db } from '../db';
import { users } from '../db/schema';
import type { UserCreateInput, UserUpdateInput } from '../validations/users';
import { User } from '@supabase/supabase-js';

export const createUserService = async (data: UserCreateInput, authUser: User) => {
  try {
    const [newUser] = await db.insert(users).values({
      id: authUser.id,
      email: data.email,
      name: data.name,
      role: data.role || 'viewer',
    }).returning();
    return newUser;
  } catch (err: any) {
    if (err.code === '42501') throw { status: 403, message: 'Forbidden by RLS' };
    throw err;
  }
};

export const findUserByIdService = async (id: string, authUser?: User) => {
  try {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    if (!user) return null;
    return user;
  } catch (err: any) {
    if (err.code === '42501') throw { status: 403, message: 'Forbidden by RLS' };
    throw err;
  }
};

export const findAllUsersService = async (limit = 10, offset = 0, authUser?: User) => {
  try {
    const isAdmin = authUser?.user_metadata?.role === 'admin' || authUser?.role === 'admin';
    if (!isAdmin) {
      throw { status: 403, message: 'Forbidden' };
    }
    return await db.select().from(users).limit(limit).offset(offset);
  } catch (err: any) {
    if (err.code === '42501') throw { status: 403, message: 'Forbidden by RLS' };
    throw err;
  }
};

export const updateUserService = async (id: string, data: UserUpdateInput, authUser: User) => {
  try {
    const isAdmin = authUser.user_metadata?.role === 'admin' || authUser.role === 'admin';
    const filter = isAdmin ? eq(users.id, id) : and(eq(users.id, id), eq(users.id, authUser.id));
    
    const [updated] = await db.update(users)
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

export const deleteUserService = async (id: string, authUser: User) => {
  try {
    const isAdmin = authUser.user_metadata?.role === 'admin' || authUser.role === 'admin';
    const filter = isAdmin ? eq(users.id, id) : and(eq(users.id, id), eq(users.id, authUser.id));

    const [deleted] = await db.delete(users).where(filter).returning();
    if (!deleted) throw { status: 403, message: 'Forbidden or not found' };
    return deleted;
  } catch (err: any) {
    if (err.code === '42501') throw { status: 403, message: 'Forbidden by RLS' };
    if (err.status) throw err;
    throw err;
  }
};
