import { Module } from '@nestjs/common';
import { TagsService } from './tags.service';
import { TagsAPIController } from './tags-api.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Tag, TagSchema } from './schemas/tag.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: Tag.name, schema: TagSchema }])],
  controllers: [TagsAPIController],
  providers: [TagsService],
})
export class TagsModule {}
