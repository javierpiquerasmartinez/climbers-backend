
import { HttpError } from './HttpError.js';

export const errors = {
  badRequest: (message = 'Bad request', description?: string) =>
    new HttpError(message, 400, 'BAD_REQUEST', description),

  unauthorized: (message = 'Unauthorized', description?: string) =>
    new HttpError(message, 401, 'UNAUTHORIZED', description),

  forbidden: (message = 'Forbidden', description?: string) =>
    new HttpError(message, 403, 'FORBIDDEN', description),

  notFound: (message = 'Not found', description?: string) =>
    new HttpError(message, 404, 'NOT_FOUND', description),

  conflict: (message = 'Conflict', description?: string) =>
    new HttpError(message, 409, 'CONFLICT', description),

  internal: (message = 'Internal server error', description?: string) =>
    new HttpError(message, 500, 'INTERNAL_SERVER_ERROR', description),
};
