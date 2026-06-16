import { eq, and } from 'drizzle-orm';
import { db } from '../db';
import { transactions } from '../db/schema';
import crypto from 'crypto';
import type { TransactionCreateInput, TransactionUpdateInput } from '../validations/transactions';
import { User } from '@supabase/supabase-js';

export const createTransactionService = async (data: TransactionCreateInput, authUser: User) => {
  try {
    const isAdmin = authUser.user_metadata?.role === 'admin' || authUser.role === 'admin';
    const [newTransaction] = await db.insert(transactions).values({
      id: data.id || crypto.randomUUID(),
      userId: isAdmin && data.userId ? data.userId : authUser.id,
      checkoutRequestId: data.checkoutRequestId,
      merchantRequestId: data.merchantRequestId,
      phoneNumber: data.phoneNumber,
      amount: data.amount,
      fullName: data.fullName,
      email: data.email,
      accountReference: data.accountReference,
      type: data.type,
      status: data.status || 'pending',
      mpesaReceiptNumber: data.mpesaReceiptNumber,
      resultCode: data.resultCode,
      resultDesc: data.resultDesc,
    }).returning();
    return newTransaction;
  } catch (err: any) {
    if (err.code === '42501') throw { status: 403, message: 'Forbidden by RLS' };
    throw err;
  }
};

export const findTransactionByIdService = async (id: string, authUser: User) => {
  try {
    const isAdmin = authUser.user_metadata?.role === 'admin' || authUser.role === 'admin';
    const filter = isAdmin ? eq(transactions.id, id) : and(eq(transactions.id, id), eq(transactions.userId, authUser.id));

    const [transaction] = await db.select().from(transactions).where(filter);
    if (!transaction) return null;
    return transaction;
  } catch (err: any) {
    if (err.code === '42501') throw { status: 403, message: 'Forbidden by RLS' };
    throw err;
  }
};

export const findAllTransactionsService = async (limit = 10, offset = 0, authUser: User) => {
  try {
    const isAdmin = authUser.user_metadata?.role === 'admin' || authUser.role === 'admin';
    if (!isAdmin) {
      return await db.select().from(transactions).where(eq(transactions.userId, authUser.id)).limit(limit).offset(offset);
    }
    return await db.select().from(transactions).limit(limit).offset(offset);
  } catch (err: any) {
    if (err.code === '42501') throw { status: 403, message: 'Forbidden by RLS' };
    throw err;
  }
};

export const updateTransactionService = async (id: string, data: TransactionUpdateInput, authUser: User) => {
  try {
    const isAdmin = authUser.user_metadata?.role === 'admin' || authUser.role === 'admin';
    if (!isAdmin) throw { status: 403, message: 'Forbidden: Admin access required' };

    const [updated] = await db.update(transactions)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(transactions.id, id))
      .returning();
      
    if (!updated) throw { status: 404, message: 'Not found' };
    return updated;
  } catch (err: any) {
    if (err.code === '42501') throw { status: 403, message: 'Forbidden by RLS' };
    if (err.status) throw err;
    throw err;
  }
};

export const deleteTransactionService = async (id: string, authUser: User) => {
  try {
    const isAdmin = authUser.user_metadata?.role === 'admin' || authUser.role === 'admin';
    if (!isAdmin) throw { status: 403, message: 'Forbidden: Admin access required' };

    const [deleted] = await db.delete(transactions).where(eq(transactions.id, id)).returning();
    if (!deleted) throw { status: 404, message: 'Not found' };
    return deleted;
  } catch (err: any) {
    if (err.code === '42501') throw { status: 403, message: 'Forbidden by RLS' };
    if (err.status) throw err;
    throw err;
  }
};
