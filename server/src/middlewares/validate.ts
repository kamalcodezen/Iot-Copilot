import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';

interface ValidationSchemas {
  body?: z.ZodTypeAny;
  params?: z.ZodTypeAny;
  query?: z.ZodTypeAny;
}

// Parses the matching part of the request against its zod schema. On failure
// the ZodError is passed to `next`, and the central errorHandler formats the
// 400 response — this file must not format validation errors itself.
export const validate = (schemas: ValidationSchemas) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    try {
      schemas.body?.parse(req.body);
      schemas.params?.parse(req.params);
      schemas.query?.parse(req.query);
      next();
    } catch (error) {
      next(error);
    }
  };
};
