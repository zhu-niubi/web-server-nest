import { Module } from '@nestjs/common';
import { MagazinesService } from './magazines.service';
import { MagazinesController } from './magazines.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Magazine, MagezineSchema } from './schema/magazine.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Magazine.name, schema: MagezineSchema },
    ]),
  ],
  controllers: [MagazinesController],
  providers: [MagazinesService],
  exports: [MagazinesService],
})
export class MagazinesModule {}
