import { GlobalException } from './global-exception';

export class UserAlreadyExistsException extends GlobalException {
  constructor(email: string) {
    super(409, `User with email ${email} already exists`);
    this.name = 'UserAlreadyExistsException';
    Object.setPrototypeOf(this, UserAlreadyExistsException.prototype);
  }
}

export class UserNotFoundException extends GlobalException {
  constructor(identifier: string = 'User') {
    super(404, `${identifier} not found`);
    this.name = 'UserNotFoundException';
    Object.setPrototypeOf(this, UserNotFoundException.prototype);
  }
}

export class InvalidCredentialsException extends GlobalException {
  constructor() {
    super(401, 'Invalid email or password');
    this.name = 'InvalidCredentialsException';
    Object.setPrototypeOf(this, InvalidCredentialsException.prototype);
  }
}

export class PasswordChangeException extends GlobalException {
  constructor(message: string = 'Failed to change password') {
    super(400, message);
    this.name = 'PasswordChangeException';
    Object.setPrototypeOf(this, PasswordChangeException.prototype);
  }
}

export class ProfileUpdateException extends GlobalException {
  constructor(message: string = 'Failed to update profile') {
    super(400, message);
    this.name = 'ProfileUpdateException';
    Object.setPrototypeOf(this, ProfileUpdateException.prototype);
  }
}

