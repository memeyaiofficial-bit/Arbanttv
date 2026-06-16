import { Request, Response, NextFunction } from 'express';
import * as playlistsService from '../services/playlists';
import { extractUser } from '../utils/supabase';

export const createPlaylist = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authUser = extractUser(req);
    if (!authUser) {
      res.status(401).json({ success: false, error: 'Unauthorized' });
      return;
    }
    const playlist = await playlistsService.createPlaylistService(req.body, authUser);
    res.status(201).json({ success: true, data: playlist });
  } catch (error: any) {
    if (error.status === 403) {
      res.status(403).json({ success: false, error: error.message });
      return;
    }
    next(error);
  }
};

export const getPlaylistById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const playlist = await playlistsService.findPlaylistByIdService(req.params.id as string);
    if (!playlist) {
      res.status(404).json({ success: false, error: 'Playlist not found' });
      return;
    }
    res.status(200).json({ success: true, data: playlist });
  } catch (error: any) {
    if (error.status === 403) {
      res.status(403).json({ success: false, error: error.message });
      return;
    }
    next(error);
  }
};

export const getPlaylists = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const limit = parseInt(req.query.limit as string) || 10;
    const offset = parseInt(req.query.offset as string) || 0;
    const allPlaylists = await playlistsService.findAllPlaylistsService(limit, offset);
    res.status(200).json({ success: true, data: allPlaylists });
  } catch (error: any) {
    if (error.status === 403) {
      res.status(403).json({ success: false, error: error.message });
      return;
    }
    next(error);
  }
};

export const updatePlaylist = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authUser = extractUser(req);
    if (!authUser) {
      res.status(401).json({ success: false, error: 'Unauthorized' });
      return;
    }
    const playlist = await playlistsService.updatePlaylistService(req.params.id as string, req.body, authUser);
    res.status(200).json({ success: true, data: playlist });
  } catch (error: any) {
    if (error.status === 403) {
      res.status(403).json({ success: false, error: error.message });
      return;
    }
    next(error);
  }
};

export const deletePlaylist = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authUser = extractUser(req);
    if (!authUser) {
      res.status(401).json({ success: false, error: 'Unauthorized' });
      return;
    }
    const playlist = await playlistsService.deletePlaylistService(req.params.id as string, authUser);
    res.status(200).json({ success: true, data: playlist });
  } catch (error: any) {
    if (error.status === 403) {
      res.status(403).json({ success: false, error: error.message });
      return;
    }
    next(error);
  }
};
