import { z } from 'zod';

export const playlistCreateSchema = z.object({
  body: z.object({
    id: z.string().uuid().optional(),
    title: z.string().min(1),
    description: z.string().optional(),
    imageUrl: z.string().url().optional(),
    priceKes: z.number().int().min(0).optional(),
    isFree: z.boolean().optional(),
    creatorId: z.string().uuid().optional(),
  }),
});

export const playlistUpdateSchema = z.object({
  body: z.object({
    title: z.string().min(1).optional(),
    description: z.string().optional(),
    imageUrl: z.string().url().optional(),
    priceKes: z.number().int().min(0).optional(),
    isFree: z.boolean().optional(),
    creatorId: z.string().uuid().optional().nullable(),
  }),
  params: z.object({
    id: z.string().uuid(),
  }),
});

export const playlistIdSchema = z.object({
  params: z.object({
    id: z.string().uuid(),
  }),
});

export type PlaylistCreateInput = z.infer<typeof playlistCreateSchema>['body'];
export type PlaylistUpdateInput = z.infer<typeof playlistUpdateSchema>['body'];
