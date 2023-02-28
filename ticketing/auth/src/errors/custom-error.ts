export abstract class CustomError extends Error {
  abstract statusCode: number;
  abstract serializeErrors(): {message: string; field?: string;}[]

  constructor () {
    super();
    // Only because we are extending a builtin class
    Object.setPrototypeOf(this, CustomError.prototype);
  }
}
