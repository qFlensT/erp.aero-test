import {
  BadRequestException,
  HttpException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { DomainError } from 'src/domain/abstract/domain.error';
import { FileDeleteError } from 'src/domain/services/file/errors/file-delete.error';
import { FileNotFoundError } from 'src/domain/services/file/errors/file-not-found.error';
import { FileSaveError } from 'src/domain/services/file/errors/file-save.error';
import { FileUpdateError } from 'src/domain/services/file/errors/file-update.error';
import { UserCreateError } from 'src/domain/services/user/errors/user-create.error';
import { UserNotFoundError } from 'src/domain/services/user/errors/user-not-found.error';

type ErrorMapperFunction = (error: DomainError) => HttpException;

export type DomainErrorConstructor<T extends DomainError = DomainError> = new (
  ...args: any[]
) => T;

const errorMapping: Array<[DomainErrorConstructor, ErrorMapperFunction]> = [
  [
    FileDeleteError,
    (error: DomainError) => new BadRequestException(error.message),
  ],
  [
    FileNotFoundError,
    (error: DomainError) => new NotFoundException(error.message),
  ],
  [
    FileSaveError,
    (error: DomainError) => new InternalServerErrorException(error.message),
  ],
  [
    FileUpdateError,
    (error: DomainError) => new BadRequestException(error.message),
  ],
  [
    UserCreateError,
    (error: DomainError) => new BadRequestException(error.message),
  ],
  [
    UserNotFoundError,
    (error: DomainError) => new NotFoundException(error.message),
  ],
];

export class DomainErrorToHttpMapper {
  static map(error: DomainError): HttpException {
    for (const [ErrorClass, mapper] of errorMapping) {
      if (error instanceof ErrorClass) {
        return mapper(error);
      }
    }

    // Поведение по умолчанию, если тип ошибки не распознан:
    return new InternalServerErrorException(error.message);
  }
}
