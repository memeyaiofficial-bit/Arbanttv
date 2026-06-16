import { z } from 'zod';

export const playlistAccessCreateSchema = z.object({
  body: z.object({
    userId: z.string().uuid(),
    playlistId: z.string().uuid(),
    transactionId: z.string().uuid(),
    expiresAt: z.string().datetime().optional().nullable(),
  }),
});

export const playlistAccessUpdateSchema = z.object({
  body: z.object({
    transactionId: z.string().uuid().optional(),
    expiresAt: z.string().datetime().optional().nullable(),
  }),
  params: z.object({
    userId: z.string().uuid(),
    playlistId: z.string().uuid(),
  }),
});

export const playlistAccessIdSchema = z.object({
  params: z.object({
    userId: z.string().uuid(),
    playlistId: z.string().uuid(),
  }),
});

export type PlaylistAccessCreateInput = z.infer<typeof playlistAccessCreateSchema>['body'];
export type PlaylistAccessUpdateInput = z.infer<typeof playlistAccessUpdateSchema>['body'];
