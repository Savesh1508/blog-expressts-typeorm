import { NextFunction, Request, Response } from "express";
import { validate } from "class-validator";
import { plainToClass } from "class-transformer";

export function validateRequestBody<T extends object>(dtoClass: new () => T) {
  return async (req: Request, res: Response, next: NextFunction) => {
    const dtoObject = plainToClass(dtoClass, req.body);
    const errors = await validate(dtoObject);

    if (errors.length > 0) {
      const errorMessages = errors.flatMap(error =>
        Object.values(error.constraints || {})
      );

      return res.status(400).json({
        message: "Bad Request",
        errors: errorMessages,
      });
    }

    next();
  };
}