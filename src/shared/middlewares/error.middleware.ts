import { Logger } from './../libs/logger.lib';
import { NextFunction, Request, Response } from "express";
import { StatusCodes, ReasonPhrases } from "http-status-codes";
import { TypeORMError } from "typeorm";
import { DatabaseException } from './../exceptions/database.exception';
import { HttpException } from '../exceptions/http.exception';

export function errorMiddleware(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  const errorData = parseError(err);
  Logger.error(`[${new Date().toISOString()}] ${err}`);

  res.status(errorData.statusCode).json({
    message: errorData.message,
    description: errorData.description,
  });
}

function parseError(error: unknown) {
  if (error instanceof HttpException) {
    return {
      description: error.description,
      message: error.message,
      statusCode: error.status,
    };
  }

  if (
    error instanceof DatabaseException ||
    error instanceof TypeORMError
  ) {
    return {
      description: "Database Error",
      message: error.message,
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
    };
  }

  if (error instanceof Error) {
    return {
      description: error.name,
      message: error.message,
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
    };
  }

  return {
    description: ReasonPhrases.INTERNAL_SERVER_ERROR,
    message: "Internal Server Error",
    statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
  };
}