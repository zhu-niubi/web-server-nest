import { Keyword } from './schemas/keyword.schema';
import { KeywordSchema } from './schemas/keyword.schema';
import { Module } from '@nestjs/common';
import { KeywordsService } from './keywords.service';
import { KeywordsController } from './keywords.controller';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Keyword.name, schema: KeywordSchema }]),
  ],
  controllers: [KeywordsController],
  providers: [KeywordsService],
})
export class KeywordsModule {}
