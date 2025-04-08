// utils/errors/HttpError.ts
import { logger } from '../logger.js';

export class HttpError extends Error {
  constructor(
    public message: string,
    public statusCode: number,
    public code: string,
    public description?: any
  ) {
    super(message);
    this.name = new.target.name;
    Error.captureStackTrace(this, new.target);
  }
}
