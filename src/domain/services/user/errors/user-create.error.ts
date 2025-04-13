import { DomainError } from '../../../abstract/domain.error';

export class UserCreateError extends DomainError {
  constructor() {
    const msg = `User create error`;
    super(msg);
  }
}
