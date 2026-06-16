import { z } from 'zod';

export const transactionCreateSchema = z.object({
  body: z.object({
    id: z.string().uuid().optional(),
    userId: z.string().uuid().optional().nullable(),
    checkoutRequestId: z.string().min(1),
    merchantRequestId: z.string().optional().nullable(),
    phoneNumber: z.string().min(1),
    amount: z.number().int().min(0),
    fullName: z.string().min(1),
    email: z.string().email(),
    accountReference: z.string().min(1),
    type: z.enum(['playlist_purchase', 'creator_subscription']),
    status: z.enum(['pending', 'success', 'failed', 'cancelled']).optional(),
    mpesaReceiptNumber: z.string().optional().nullable(),
    resultCode: z.number().int().optional().nullable(),
    resultDesc: z.string().optional().nullable(),
  }),
});

export const transactionUpdateSchema = z.object({
  body: z.object({
    userId: z.string().uuid().optional().nullable(),
    checkoutRequestId: z.string().min(1).optional(),
    merchantRequestId: z.string().optional().nullable(),
    phoneNumber: z.string().min(1).optional(),
    amount: z.number().int().min(0).optional(),
    fullName: z.string().min(1).optional(),
    email: z.string().email().optional(),
    accountReference: z.string().min(1).optional(),
    type: z.enum(['playlist_purchase', 'creator_subscription']).optional(),
    status: z.enum(['pending', 'success', 'failed', 'cancelled']).optional(),
    mpesaReceiptNumber: z.string().optional().nullable(),
    resultCode: z.number().int().optional().nullable(),
    resultDesc: z.string().optional().nullable(),
  }),
  params: z.object({
    id: z.string().uuid(),
  }),
});

export const transactionIdSchema = z.object({
  params: z.object({
    id: z.string().uuid(),
  }),
});

export type TransactionCreateInput = z.infer<typeof transactionCreateSchema>['body'];
export type TransactionUpdateInput = z.infer<typeof transactionUpdateSchema>['body'];
