import e, { Response, Request, NextFunction } from 'express';
import { RequestValidationError } from '../errors/request-validation-error';
import { DatabaseConnectionError } from '../errors/database-connection-error';

export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {

  if (err instanceof RequestValidationError) {
    console.log('Handling this error as a request validation error.');
    return res.status(err.statusCode).send({errors: err.serializeErrors()});
  }

  if (err instanceof DatabaseConnectionError) {
    console.log('Handling this error as a DB connection error.');
    return res.status(err.statusCode).send({errors: err.serializeErrors()});
  }

  res.status(400).send({errors: [ {message: err.message} ]});
}
