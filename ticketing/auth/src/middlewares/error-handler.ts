import { Response, Request, NextFunction } from 'express';
import { CustomError } from '../errors/custom-error';

export const errorHandler = (err: Error, req: Request, res: Response, _next: NextFunction) => {

  if (err instanceof CustomError) {
    console.log('Handling this error as a custom error');
    return res.status(err.statusCode).send({errors: err.serializeErrors()});
  }

  res.status(400).send({errors: [ {message: err.message} ]});
}
