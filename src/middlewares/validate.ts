import { Request, Response, NextFunction } from 'express';
import { ZodSchema } from 'zod';
import { errors } from '../utils/errors/index.js';

export const validateBody = (schema: ZodSchema) =>
  (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      throw errors.badRequest('Datos inválidos', result.error.format())
    }
    req.body = result.data;
    next();
  }

export const validateParams = (schema: ZodSchema) =>
  (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.params);
    if (!result.success) {
      throw errors.badRequest('Datos inválidos', result.error.format())
    }
    req.params = result.data;
    next();
  }

export const validateQuery = (schema: ZodSchema) =>
  (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.query);
    if (!result.success) {
      throw errors.badRequest('Datos inválidos', result.error.format())
    }
    req.query = result.data;
    next();
  }