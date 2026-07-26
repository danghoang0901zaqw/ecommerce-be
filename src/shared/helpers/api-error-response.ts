import { HttpStatus } from '@nestjs/common';

export type ApiErrorPayload = {
  success: false;
  statusCode: number;
  message: string;
  error?: string;
  requestId: string;
  path: string;
  timestamp: string;
};

export type ApiErrorCtx = {
  requestId: string;
  path: string;
};

export const buildApiErrorPayload = (
  statusCode: number,
  message: string | string[],
  error: string | undefined,
  ctx: ApiErrorCtx,
): ApiErrorPayload => {
  const msg = Array.isArray(message) ? message.join('; ') : message;
  return {
    success: false,
    statusCode,
    message: formatClientErrorMsg(msg),
    error: error ?? '',
    requestId: ctx.requestId,
    path: ctx.path,
    timestamp: new Date().toISOString(),
  };
};

const formatClientErrorMsg = (message: string | string[]) => {
  if (Array.isArray(message)) {
    return message
      .map((msg) => msg.trim())
      .filter(Boolean)
      .join(' ');
  }
  return message;
};

// extract error and message from error response
type NestHttpErrorBody = {
  statusCode?: number;
  message?: string | string[];
  error?: string;
};

export const extractFromHttpExceptionBody = (
  body: Record<string, unknown> | NestHttpErrorBody,
  fallbackMsg: string,
) => {
  const b = body as NestHttpErrorBody;
  const message = b.message !== undefined ? b.message : fallbackMsg;
  const error =
    typeof b.error === 'string' && b.error !== '' ? b.error : undefined;
  return {
    message,
    error,
  };
};

// unknown exception
export const payloadFromUnknownException = (
  exception: unknown,
  ctx: ApiErrorCtx,
): ApiErrorPayload => {
  const prod = process.env.NODE_ENV === 'production';
  if (exception instanceof Error) {
    return buildApiErrorPayload(
      HttpStatus.INTERNAL_SERVER_ERROR,
      prod ? 'Internal server error' : exception.message,
      'Internal server error',
      ctx,
    );
  }
  return buildApiErrorPayload(
    HttpStatus.INTERNAL_SERVER_ERROR,
    'Internal server error',
    'Internal server error',
    ctx,
  );
};
