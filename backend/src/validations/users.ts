import { z } from 'zod';

export const userCreateSchema = z.object({
  body: z.object({
    id: z.string().uuid().optional(),
    email: z.string().email(),
    name: z.string().min(1),
    role: z.enum(['viewer', 'creator']).optional(),
  }),
});

export const userUpdateSchema = z.object({
  body: z.object({
    email: z.string().email().optional(),
    name: z.string().min(1).optional(),
    role: z.enum(['viewer', 'creator']).optional(),
  }),
  params: z.object({
    id: z.string().uuid(),
  }),
});

export const userIdSchema = z.object({
  params: z.object({
    id: z.string().uuid(),
  }),
});

export type UserCreateInput = z.infer<typeof userCreateSchema>['body'];
export type UserUpdateInput = z.infer<typeof userUpdateSchema>['body'];
