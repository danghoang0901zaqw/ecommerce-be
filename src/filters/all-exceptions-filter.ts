import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  Injectable,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { PinoLogger } from 'nestjs-pino';
import { CORRELATION_ID_HEADER } from 'src/constants/correlation-id';
import {
  buildApiErrorPayload,
  extractFromHttpExceptionBody,
  payloadFromUnknownException,
} from 'src/helpers/api-error-response';

@Catch()
@Injectable()
export class AllExceptionFilter implements ExceptionFilter {
  constructor(private readonly logger: PinoLogger) {
    this.logger.setContext(AllExceptionFilter.name);
  }
  catch(exception: unknown, host: ArgumentsHost) {
    if (host.getType() !== 'http') return;
    const httpContext = host.switchToHttp();
    const req = httpContext.getRequest<Request>();
    const res = httpContext.getResponse<Response>();

    const ctx = {
      requestId: (req.headers[CORRELATION_ID_HEADER] as string) ?? '',
      path: req.url,
    };

    // http exceptions (NotFoundException, BadRequestException,...)
    if (exception instanceof HttpException) {
      const statusCode = exception.getStatus();
      const rawErrorRes = exception.getResponse();

      if (typeof rawErrorRes === 'string') {
        // todo: build error payload
        res
          .status(statusCode)
          .json(buildApiErrorPayload(statusCode, rawErrorRes, undefined, ctx));
        return;
      }

      //res is an object
      //todo: extract error from body
      const { message, error } = extractFromHttpExceptionBody(
        rawErrorRes,
        exception.message,
      );
      // todo: build error payload
      res
        .status(statusCode)
        .json(buildApiErrorPayload(statusCode, message, error, ctx));
      return;
    }
    // Unknown exceptions (Database error, Internal Server Error)
    this.logger.error({
      msg: 'unhandled.inception',
      requestId: ctx.requestId,
      path: ctx.path,
      error:
        exception instanceof Error ? exception.message : 'Unknown exception',
      stack: exception instanceof Error ? exception.stack : undefined,
    });
    // todo: build error payload for unknown exception
    const payload = payloadFromUnknownException(exception, ctx);
    res.status(payload.statusCode).json(payload);
    return;
  }
}
