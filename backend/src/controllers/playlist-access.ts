import { Request, Response, NextFunction } from 'express';
import * as playlistAccessService from '../services/playlist-access';
import { extractUser } from '../utils/supabase';

export const createPlaylistAccess = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authUser = extractUser(req);
    if (!authUser) {
      res.status(401).json({ success: false, error: 'Unauthorized' });
      return;
    }
    const access = await playlistAccessService.createPlaylistAccessService(req.body, authUser);
    res.status(201).json({ success: true, data: access });
  } catch (error: any) {
    if (error.status === 403) {
      res.status(403).json({ success: false, error: error.message });
      return;
    }
    next(error);
  }
};

export const getPlaylistAccessById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authUser = extractUser(req);
    if (!authUser) {
      res.status(401).json({ success: false, error: 'Unauthorized' });
      return;
    }
    const access = await playlistAccessService.findPlaylistAccessByIdService(req.params.userId as string, req.params.playlistId as string, authUser);
    if (!access) {
      res.status(404).json({ success: false, error: 'Playlist access not found' });
      return;
    }
    res.status(200).json({ success: true, data: access });
  } catch (error: any) {
    if (error.status === 403) {
      res.status(403).json({ success: false, error: error.message });
      return;
    }
    next(error);
  }
};

export const getPlaylistAccesses = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authUser = extractUser(req);
    if (!authUser) {
      res.status(401).json({ success: false, error: 'Unauthorized' });
      return;
    }
    const limit = parseInt(req.query.limit as string) || 10;
    const offset = parseInt(req.query.offset as string) || 0;
    const allAccesses = await playlistAccessService.findAllPlaylistAccessService(limit, offset, authUser);
    res.status(200).json({ success: true, data: allAccesses });
  } catch (error: any) {
    if (error.status === 403) {
      res.status(403).json({ success: false, error: error.message });
      return;
    }
    next(error);
  }
};

export const updatePlaylistAccess = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authUser = extractUser(req);
    if (!authUser) {
      res.status(401).json({ success: false, error: 'Unauthorized' });
      return;
    }
    const access = await playlistAccessService.updatePlaylistAccessService(req.params.userId as string, req.params.playlistId as string, req.body, authUser);
    res.status(200).json({ success: true, data: access });
  } catch (error: any) {
    if (error.status === 403 || error.status === 404) {
      res.status(error.status).json({ success: false, error: error.message });
      return;
    }
    next(error);
  }
};

export const deletePlaylistAccess = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authUser = extractUser(req);
    if (!authUser) {
      res.status(401).json({ success: false, error: 'Unauthorized' });
      return;
    }
    const access = await playlistAccessService.deletePlaylistAccessService(req.params.userId as string, req.params.playlistId as string, authUser);
    res.status(200).json({ success: true, data: access });
  } catch (error: any) {
    if (error.status === 403 || error.status === 404) {
      res.status(error.status).json({ success: false, error: error.message });
      return;
    }
    next(error);
  }
};
