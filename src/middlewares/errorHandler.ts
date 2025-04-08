import { Request, Response, NextFunction } from 'express';
import { HttpError } from '../utils/errors/HttpError.js';
import { logger } from '../utils/logger.js';

export function errorHandler(err: any, req: Request, res: Response, next: NextFunction): any {
  if (err instanceof HttpError) {
    logger.warn(
      {
        url: req.originalUrl,
        method: req.method,
        statusCode: err.statusCode,
        code: err.code,
        description: err.description,
      },
      `[HttpError] ${err.message}`
    );

    return res.status(err.statusCode).json({
      error: {
        code: err.code,
        message: err.message,
        description: err.description,
      },
    });
  }

  // Error no controlado
  logger.error(
    {
      url: req.originalUrl,
      method: req.method,
      stack: err.stack,
    },
    `[UnhandledError] ${err.message || 'Error desconocido'}`
  );

  return res.status(500).json({
    error: {
      code: 'INTERNAL_SERVER_ERROR',
      message: 'Ha ocurrido un error inesperado',
    },
  });
}
