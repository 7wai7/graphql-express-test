export default class ApiError extends Error {
  statusCode: number;
  meta: {};

  constructor(statusCode = 500, message = "Internal Server Error", meta = {}) {
    super(message);
    this.name = "ApiError";
    this.statusCode = statusCode;
    this.meta = meta;
    Error.captureStackTrace(this, this.constructor);
  }
}
