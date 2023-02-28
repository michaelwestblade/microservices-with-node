import { CustomError } from './custom-error';

export class DatabaseConnectionError extends CustomError {
  statusCode = 500;
  reason = 'Error connecting to database';
  constructor () {
    super('Error connecting to DB');

    // Only because we are extending a builtin class
    Object.setPrototypeOf(this, DatabaseConnectionError.prototype);
  }

  serializeErrors (): { message: string; field?: string }[] {
    return [{message: 'Error connecting to DB'}];
  }
}
