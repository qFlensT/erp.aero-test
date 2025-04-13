export abstract class DomainError extends Error {
  static isDomainError(error: any): error is DomainError {
    return error instanceof DomainError;
  }

  constructor(message: string) {
    super(message);
    this.name = this.constructor.name;
  }
}
