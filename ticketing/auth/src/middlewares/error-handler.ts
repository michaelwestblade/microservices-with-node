import e, { Response, Request, NextFunction } from 'express';
import { RequestValidationError } from '../errors/request-validation-error';
import { DatabaseConnectionError } from '../errors/database-connection-error';

export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {

  if (err instanceof RequestValidationError) {
    console.log('Handling this error as a request validation error.');
    const formattedErrors = err.errors.map(error => ({message: error.msg, field: error.param}));
    return res.status(400).send({errors: formattedErrors});
  }

  if (err instanceof DatabaseConnectionError) {
    console.log('Handling this error as a DB connection error.');
    return res.status(500).send({errors: [
        {message: err.reason}
      ]});
  }

  res.status(400).send({message: err.message});
}
