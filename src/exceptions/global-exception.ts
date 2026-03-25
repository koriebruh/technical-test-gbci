export class GlobalException extends Error {
  constructor(
    public statusCode: number,
    public message: string,
  ) {
    super(message);
    this.name = 'GlobalException';
    Object.setPrototypeOf(this, GlobalException.prototype);
  }
}

export class ValidationException extends GlobalException {
  constructor(message: string) {
    super(400, message, 'VALIDATION_ERROR');
    this.name = 'ValidationException';
    Object.setPrototypeOf(this, ValidationException.prototype);
  }
}

export class InternalServerException extends GlobalException {
  constructor(message: string = 'Internal Server Error') {
    super(500, message, 'INTERNAL_SERVER_ERROR');
    this.name = 'InternalServerException';
    Object.setPrototypeOf(this, InternalServerException.prototype);
  }
}

export class NotFoundException extends GlobalException {
  constructor(message: string = 'Resource not found') {
    super(404, message, 'NOT_FOUND');
    this.name = 'NotFoundException';
    Object.setPrototypeOf(this, NotFoundException.prototype);
  }
}

export class UnauthorizedException extends GlobalException {
  constructor(message: string = 'Unauthorized') {
    super(401, message, 'UNAUTHORIZED');
    this.name = 'UnauthorizedException';
    Object.setPrototypeOf(this, UnauthorizedException.prototype);
  }
}

