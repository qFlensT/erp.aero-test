import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  Logger,
} from '@nestjs/common';
import { Response } from 'express';
import { DomainError } from 'src/domain/abstract/domain.error';
import { DomainErrorToHttpMapper } from '../mapping/error.mapper';

@Catch()
export class DomainExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(DomainExceptionFilter.name);

  catch(exception: any, host: ArgumentsHost) {
    // Получаем контекст ответа
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    if (exception instanceof Error) {
      this.logger.error(
        exception.message,
        exception.stack || 'No stack trace',
        exception.constructor.name,
      );
    } else {
      this.logger.error('Unknown error happend, error:', exception);
    }

    if (exception instanceof HttpException) {
      return response
        .status(exception.getStatus())
        .json(exception.getResponse());
    } else if (DomainError.isDomainError(exception)) {
      const httpException = DomainErrorToHttpMapper.map(exception);
      return response
        .status(httpException.getStatus())
        .json(httpException.getResponse());
    }

    return response.status(500).json({
      statusCode: 500,
      message: 'Internal server error',
    });
  }
}
