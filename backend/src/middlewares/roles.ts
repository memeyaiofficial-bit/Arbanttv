import { Request, Response, NextFunction } from 'express';
import { supabaseAdmin, extractUser, AuthenticatedRequest } from '../utils/supabase';

export const requireAdmin = (req: Request, res: Response, next: NextFunction) => {
  const user = extractUser(req);
  if (!user) {
    res.status(401).json({ success: false, error: 'Unauthorized' });
    return;
  }

  const role = user.user_metadata?.role || user.role;
  if (role !== 'admin') {
    res.status(403).json({ success: false, error: 'Forbidden: Admin access required' });
    return;
  }

  next();
};

export const requireOwner = (ownerIdExtractor: (req: Request) => string) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = extractUser(req);
    if (!user) {
      res.status(401).json({ success: false, error: 'Unauthorized' });
      return;
    }

    const ownerId = ownerIdExtractor(req);
    const role = user.user_metadata?.role || user.role;
    
    if (role === 'admin' || user.id === ownerId) {
      next();
      return;
    }

    res.status(403).json({ success: false, error: 'Forbidden: Ownership required' });
  };
};

export const optionalAuth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      next();
      return;
    }

    const token = authHeader.split(' ')[1];
    const { data, error } = await supabaseAdmin.auth.getUser(token);
    
    if (!error && data.user) {
      (req as AuthenticatedRequest).user = data.user;
    }
    
    next();
  } catch (err) {
    next();
  }
};
