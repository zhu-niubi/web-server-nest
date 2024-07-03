import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Controller } from '@nestjs/common/interfaces';
import mongoose, { Schema } from 'mongoose';

export const TDK = createParamDecorator(
  async (data: string, ctx: ExecutionContext) => {


    await mongoose.connect(process.env.MONGO_SECRET_URL);
    const result =
      (await mongoose.connection.db
        .collection('tdks')
        .findOne({ index: ctx.getArgs()[0].originalUrl })) ||
      (await mongoose.connection.db.collection('tdks').findOne({ index: '/' }));

    const request = ctx.switchToHttp().getRequest();
    const user = request.user;

    return result;
  },
);
