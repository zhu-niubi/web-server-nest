import { HttpException, HttpStatus } from '@nestjs/common';

export class NotFoundDataException extends HttpException {
  constructor() {
    super('Not found data by this id!', HttpStatus.NOT_FOUND);
  }
}
