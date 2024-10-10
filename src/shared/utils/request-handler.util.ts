import { NextFunction, Request, Response } from "express";

export function requestHandler(
  handler: (
    req: Request,
    res: Response
  ) => Promise<void> | void | Promise<Response> | Response
) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await handler(req, res);
    } catch (error) {
      next(error);
    }
  };
}