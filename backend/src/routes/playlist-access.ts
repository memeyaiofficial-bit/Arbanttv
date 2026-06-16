import { Router } from 'express';
import * as playlistAccessController from '../controllers/playlist-access';
import { validate } from '../middlewares/validate';
import { authenticate } from '../middlewares/auth';
import { requireAdmin } from '../middlewares/roles';
import { playlistAccessCreateSchema, playlistAccessUpdateSchema, playlistAccessIdSchema } from '../validations/playlist-access';

const router = Router();

router.post('/', authenticate, requireAdmin, validate(playlistAccessCreateSchema), playlistAccessController.createPlaylistAccess);
router.get('/', authenticate, playlistAccessController.getPlaylistAccesses);
router.get('/:userId/:playlistId', authenticate, validate(playlistAccessIdSchema), playlistAccessController.getPlaylistAccessById);
router.put('/:userId/:playlistId', authenticate, requireAdmin, validate(playlistAccessUpdateSchema), playlistAccessController.updatePlaylistAccess);
router.delete('/:userId/:playlistId', authenticate, requireAdmin, validate(playlistAccessIdSchema), playlistAccessController.deletePlaylistAccess);

export default router;
