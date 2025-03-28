import 'express';

declare module 'express' {
  export interface Request {
    user?: {
      email: string;
      name?: string;
      picture?: string;
    };
  }
}
