
export class HttpError extends Error {
  constructor(
    public message: string,
    public statusCode: number,
    public code: string,
    public description?: string
  ) {
    super(message);
    this.name = new.target.name;
    Error.captureStackTrace(this, new.target);

    console.error(`[HttpError] ${statusCode} ${code}: ${message}${description ? ` - ${description}` : ''}`);
  }
}
