import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    // Log the error for internal tracking (e.g. to a file, Sentry, or console)
    console.error(`[GlobalExceptionFilter] Error on ${request.method} ${request.url}:`, exception);

    let message = 'Internal server error';

    if (exception instanceof HttpException) {
      const responseData = exception.getResponse();
      message = typeof responseData === 'string' ? responseData : (responseData as any).message || responseData;
    }

    // Hide stack trace and genericize message for Internal Server Errors (500)
    if (status === HttpStatus.INTERNAL_SERVER_ERROR) {
       message = 'Ocorreu um erro inesperado no servidor. Por favor, tente novamente mais tarde.';
    }

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message: message,
    });
  }
}
