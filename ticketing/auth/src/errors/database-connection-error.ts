import { ValidationError } from 'express-validator';
import { CustomError } from './custom-error';

export class DatabaseConnectionError extends CustomError {
  statusCode = 500;
  reason = 'Error connecting to database';
  constructor ( ) {
    super();

    // Only because we are extending a builtin class
    Object.setPrototypeOf(this, DatabaseConnectionError.prototype);
  }

  serializeErrors (): { message: string; field?: string }[] {
    return [];
  }
}
