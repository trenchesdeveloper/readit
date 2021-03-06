import { plainToClass } from "class-transformer";
import { validate, ValidationError } from "class-validator";
import * as express from "express";
import AppError from "../utils/appError";

function validationMiddleware(
  type: any,
  skipMissingProperties = false
): express.RequestHandler {
  return (req, _, next) => {
    validate(plainToClass(type, req.body), { skipMissingProperties }).then(
      (errors: ValidationError[]) => {
        if (errors.length > 0) {
          const message = errors
            .map((error: ValidationError) => Object.values(error.constraints!))
            .join(", ");
          next(new AppError(400, message));
        } else {
          next();
        }
      }
    );
  };
}

export default validationMiddleware;
