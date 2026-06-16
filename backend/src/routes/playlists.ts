import { Router } from 'express';
import * as playlistsController from '../controllers/playlists';
import { validate } from '../middlewares/validate';
import { authenticate } from '../middlewares/auth';
import { playlistCreateSchema, playlistUpdateSchema, playlistIdSchema } from '../validations/playlists';

const router = Router();

router.post('/', authenticate, validate(playlistCreateSchema), playlistsController.createPlaylist);
router.get('/', playlistsController.getPlaylists);
router.get('/:id', validate(playlistIdSchema), playlistsController.getPlaylistById);
router.put('/:id', authenticate, validate(playlistUpdateSchema), playlistsController.updatePlaylist);
router.delete('/:id', authenticate, validate(playlistIdSchema), playlistsController.deletePlaylist);

export default router;
