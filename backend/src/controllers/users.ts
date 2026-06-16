import { Request, Response, NextFunction } from 'express';
import * as usersService from '../services/users';
import { extractUser } from '../utils/supabase';

export const createUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authUser = extractUser(req);
    if (!authUser) {
      res.status(401).json({ success: false, error: 'Unauthorized' });
      return;
    }
    const user = await usersService.createUserService(req.body, authUser);
    res.status(201).json({ success: true, data: user });
  } catch (error: any) {
    if (error.status === 403) {
      res.status(403).json({ success: false, error: error.message });
      return;
    }
    next(error);
  }
};

export const getUserById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authUser = extractUser(req);
    const user = await usersService.findUserByIdService(req.params.id as string, authUser);
    if (!user) {
      res.status(404).json({ success: false, error: 'User not found' });
      return;
    }
    res.status(200).json({ success: true, data: user });
  } catch (error: any) {
    if (error.status === 403) {
      res.status(403).json({ success: false, error: error.message });
      return;
    }
    next(error);
  }
};

export const getUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authUser = extractUser(req);
    const limit = parseInt(req.query.limit as string) || 10;
    const offset = parseInt(req.query.offset as string) || 0;
    const allUsers = await usersService.findAllUsersService(limit, offset, authUser);
    res.status(200).json({ success: true, data: allUsers });
  } catch (error: any) {
    if (error.status === 403) {
      res.status(403).json({ success: false, error: error.message });
      return;
    }
    next(error);
  }
};

export const updateUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authUser = extractUser(req);
    if (!authUser) {
      res.status(401).json({ success: false, error: 'Unauthorized' });
      return;
    }
    const user = await usersService.updateUserService(req.params.id as string, req.body, authUser);
    res.status(200).json({ success: true, data: user });
  } catch (error: any) {
    if (error.status === 403) {
      res.status(403).json({ success: false, error: error.message });
      return;
    }
    next(error);
  }
};

export const deleteUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authUser = extractUser(req);
    if (!authUser) {
      res.status(401).json({ success: false, error: 'Unauthorized' });
      return;
    }
    const user = await usersService.deleteUserService(req.params.id as string, authUser);
    res.status(200).json({ success: true, data: user });
  } catch (error: any) {
    if (error.status === 403) {
      res.status(403).json({ success: false, error: error.message });
      return;
    }
    next(error);
  }
};
