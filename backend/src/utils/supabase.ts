import { createClient, User } from '@supabase/supabase-js';
import { Request } from 'express';

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

export interface AuthenticatedRequest extends Request {
  user?: User;
}

export const extractUser = (req: Request): User | undefined => {
  return (req as AuthenticatedRequest).user;
};

export const checkOwnership = (req: Request, ownerId: string): boolean => {
  const user = extractUser(req);
  if (!user) return false;
  const role = user.user_metadata?.role || user.role;
  if (role === 'admin') return true;
  return user.id === ownerId;
};
