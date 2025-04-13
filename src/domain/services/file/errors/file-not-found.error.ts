import { DomainError } from '../../../abstract/domain.error';

export class FileNotFoundError extends DomainError {
  constructor(fileName?: string) {
    const msg = `File not found${fileName ? `: ${fileName}` : ''}`;
    super(msg);
  }
}
