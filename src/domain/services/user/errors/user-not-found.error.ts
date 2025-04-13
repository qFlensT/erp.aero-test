import { DomainError } from '../../../abstract/domain.error';

export class UserNotFoundError extends DomainError {
  constructor() {
    const msg = `User not found`;
    super(msg);
  }
}
