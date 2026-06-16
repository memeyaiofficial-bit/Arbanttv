import express from 'express';
import cors from 'cors';
import { errorHandler } from './middlewares/errorHandler';
import { usersRoutes, playlistsRoutes, transactionsRoutes, playlistAccessRoutes } from './routes';

const app = express();

app.use(cors({ origin: process.env.FRONTEND_URL || '*' }));
app.use(express.json());

app.use('/api/users', usersRoutes);
app.use('/api/playlists', playlistsRoutes);
app.use('/api/transactions', transactionsRoutes);
app.use('/api/playlist-access', playlistAccessRoutes);

app.use(errorHandler);

export default app;
