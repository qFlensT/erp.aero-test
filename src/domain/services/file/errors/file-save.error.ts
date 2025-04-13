import { DomainError } from '../../../abstract/domain.error';

export class FileSaveError extends DomainError {
  constructor(fileName?: string) {
    const msg = `Error saving file${fileName ? `: ${fileName}` : ''}`;
    super(msg);
  }
}
