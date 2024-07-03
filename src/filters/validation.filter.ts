import { ArgumentsHost, Catch, ExceptionFilter, Logger } from '@nestjs/common';
import { Error } from 'mongoose';
import { Request, Response } from 'express';

@Catch(Error.ValidationError)
export class validationFilter implements ExceptionFilter {
  private readonly logger = new Logger('MongooseException');
  catch(exception: Error.ValidationError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = 400;

    const logFormat = `Request original url: ${request.originalUrl} Method: ${
      request.method
    } IP: ${
      request.ip
    } Status code: ${status} Response: ${exception.toString()}`;
    this.logger.error(logFormat);
    const message = exception.message;

    const errorResponse = {
      statusCode: status,
      data: {
        error: message,
      },
      message: 'The request failed',
      code: 1, // 自定义code
      url: request.originalUrl, // 错误的url地址
    };
    // 设置返回的状态码、请求头、发送错误信息
    response.status(status);
    response.header('Content-Type', 'application/json; charset=utf-8');
    response.send(errorResponse);
  }
}
