
export class HttpError extends Error {
  constructor(
    public message: string,
    public statusCode: number,
    public code: string,
    public description?: string
  ) {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}
