import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger('HttpException');
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const logFormat = `Request original url: ${request.originalUrl} Method: ${
      request.method
    } IP: ${
      request.ip
    } Status code: ${status} Response: ${exception.toString()}`;
    this.logger.error(logFormat);
    let message = exception.message
      ? exception.message
      : `${status >= 500 ? 'Service Error' : 'Client Error'}`;

    const expResponse = exception.getResponse() as any;

    if (expResponse.message instanceof Array && expResponse.message.length >= 0)
      message = expResponse.message[0];
    const errorResponse = {
      statusCode: status,
      data: {
        errorMsg: message,
      },
      message: message,
      code: 1, // 自定义code
      url: request.originalUrl, // 错误的url地址
    };
    // 设置返回的状态码、请求头、发送错误信息
    response.status(status);
    response.header('Content-Type', 'application/json; charset=utf-8');
    response.send(errorResponse);
  }
}
