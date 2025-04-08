// middlewares/errorHandler.ts
import { Request, Response, NextFunction } from 'express';
import { HttpError } from '../utils/HttpError';

export function errorHandler(err: any, req: Request, res: Response, next: NextFunction): any {
  if (err instanceof HttpError) {
    return res.status(err.statusCode).json({
      error: {
        code: err.code,
        message: err.message,
        description: err.description,
      },
    });
  }

  console.error('[ERROR NO CONTROLADO]', err);

  return res.status(500).json({
    error: {
      code: 'INTERNAL_SERVER_ERROR',
      message: 'Ha ocurrido un error inesperado',
    },
  });
}
