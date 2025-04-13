import { DomainError } from '../../../abstract/domain.error';

export class FileDeleteError extends DomainError {
  constructor(fileName?: string) {
    const msg = `Error delete file${fileName ? `: ${fileName}` : ''}`;
    super(msg);
  }
}
