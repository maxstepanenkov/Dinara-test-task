export class ApiError extends Error {
  status: number;
  errors: Array<Object>;

  constructor(status: number, message: string, errors: Array<Object> = []) {
    super(message);
    this.status = status;
    this.errors = errors; 
  }

  static UnauthorizedError() {
    return new ApiError(401, 'User not authorized');
  }
  
  static BadRequest(message: string, errors: Array<Object> = []) {
    return new ApiError(400, message, errors);
  }
}