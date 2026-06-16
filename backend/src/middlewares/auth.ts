import { Request, Response, NextFunction } from 'express';
import { supabaseAdmin, AuthenticatedRequest } from '../utils/supabase';

export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({ success: false, error: 'Unauthorized: Missing or invalid token format' });
      return;
    }

    const token = authHeader.split(' ')[1];
    
    const { data, error } = await supabaseAdmin.auth.getUser(token);
    
    if (error || !data.user) {
      res.status(401).json({ success: false, error: 'Unauthorized: Invalid token' });
      return;
    }

    (req as AuthenticatedRequest).user = data.user;
    next();
  } catch (err) {
    next(err);
  }
};
