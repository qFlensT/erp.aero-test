import { DomainError } from '../../../abstract/domain.error';

export class FileUpdateError extends DomainError {
  constructor(fileName?: string) {
    const msg = `File error update file${fileName ? `: ${fileName}` : ''}`;
    super(msg);
  }
}
