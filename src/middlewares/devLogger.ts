import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger.js';

const isDev = process.env.NODE_ENV === 'development';

export function devLogger(req: Request, res: Response, next: NextFunction) {
  if (!isDev) return next();

  const start = process.hrtime();

  res.on('finish', () => {
    const [s, ns] = process.hrtime(start);
    const ms = (s * 1e3 + ns / 1e6).toFixed(2);

    logger.info({
      method: req.method,
      url: req.originalUrl,
      status: res.statusCode,
      time: `${ms}ms`,
    }, `[Request] ${req.method} ${req.originalUrl}`);
  });

  next();
}
