import { Request, Response, NextFunction } from "express";

export interface AppError extends Error {
  statusCode: number;
  isOperational: boolean;
}

export class ApiError extends Error implements AppError {
  statusCode: number;
  isOperational: boolean;

  constructor(statusCode: number, message: string, isOperational = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    Object.setPrototypeOf(this, ApiError.prototype);
  }
}

// Paths to ignore in error logging
const IGNORED_PATHS = [
  "/favicon.ico",
  "/.well-known",
  "/robots.txt",
  "/sitemap.xml",
];

export const errorHandler = (
  err: Error | AppError,
  req: Request,
  res: Response,
  _next: NextFunction
): void => {
  const statusCode = (err as AppError).statusCode || 500;
  const message = err.message || "Internal Server Error";
  const shouldIgnore = IGNORED_PATHS.some((path) => req.path.startsWith(path));

  // Only log errors that aren't from ignored paths
  if (!shouldIgnore) {
    if (statusCode === 404) {
      console.log(`[404] ${req.method} ${req.path}`);
    } else {
      console.error(`[Error] ${statusCode}: ${message}`, {
        path: req.path,
        method: req.method,
        ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
      });
    }
  }

  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === "development" && statusCode !== 404 && { stack: err.stack }),
  });
};

export const notFoundHandler = (
  req: Request,
  _res: Response,
  next: NextFunction
): void => {
  next(new ApiError(404, `Route not found`));
};
