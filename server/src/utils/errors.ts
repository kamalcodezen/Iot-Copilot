export class AppError extends Error {
  public statusCode: number;
  public code: string;
  public details?: Record<string, unknown>;

  constructor(statusCode: number, code: string, message: string, details?: Record<string, unknown>) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
    Object.setPrototypeOf(this, AppError.prototype);
  }
}

export class ValidationError extends AppError {
  constructor(message: string, details?: Record<string, unknown>) {
    super(400, 'VALIDATION_ERROR', message, details);
    Object.setPrototypeOf(this, ValidationError.prototype);
  }
}

export class AuthError extends AppError {
  constructor(message = 'Authentication required') {
    super(401, 'AUTH_ERROR', message);
    Object.setPrototypeOf(this, AuthError.prototype);
  }
}

export class ForbiddenError extends AppError {
  constructor(message = 'Forbidden') {
    super(403, 'FORBIDDEN', message);
    Object.setPrototypeOf(this, ForbiddenError.prototype);
  }
}

export class NotFoundError extends AppError {
  constructor(message = 'Resource not found') {
    super(404, 'NOT_FOUND', message);
    Object.setPrototypeOf(this, NotFoundError.prototype);
  }
}

export class ConflictError extends AppError {
  constructor(message = 'Resource already exists') {
    super(409, 'CONFLICT', message);
    Object.setPrototypeOf(this, ConflictError.prototype);
  }
}

export class RateLimitError extends AppError {
  constructor(message = 'Too many requests. Please try again later.') {
    super(429, 'RATE_LIMIT', message);
    Object.setPrototypeOf(this, RateLimitError.prototype);
  }
}
