import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import reviewRoutes from './routes/reviewRoutes.js';
import messageRoutes from './routes/messageRoutes.js';
import favoriteRoutes from './routes/favoriteRoutes.js';
import paramsRoutes from './routes/paramsRoutes.js';
import { errorHandler } from './middlewares/errorHandler.js';
import { devLogger } from './middlewares/devLogger.js';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use(devLogger);

app.use('/api/params', paramsRoutes);

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/favorites', favoriteRoutes);

app.get('/', (_req, res) => {
  res.send('Climbers backend funcionando 🎯');
});

app.use(errorHandler);

export default app;
