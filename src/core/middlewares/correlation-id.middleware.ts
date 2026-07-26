import { NestMiddleware } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { Request, Response, NextFunction } from 'express';
import { CORRELATION_ID_HEADER } from 'src/shared/constants/correlation-id';

export class CorrelationIdMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const isExistRequestId = req.headers[CORRELATION_ID_HEADER];
    const requestId = isExistRequestId ?? randomUUID();
    req.headers[CORRELATION_ID_HEADER] = requestId;
    res.setHeader(CORRELATION_ID_HEADER, requestId);
    next();
  }
}
