import type { Request, Response, NextFunction } from "express";
import ApiError from "../utils/ApiError.js";

export default function errorMiddleware(err: any, req: Request, res: Response, next: NextFunction) {
  const isOperational =
    err instanceof ApiError || typeof err.statusCode === "number";
  const status = isOperational ? err.statusCode || 500 : 500;
  const message = err.message || "Internal Server Error";

  if (status >= 500) {
    console.error(err.stack || err);
  } else {
    console.warn(err.message);
  }

  const payload: any = { success: false, message };

  res.status(status).json(payload);
}
