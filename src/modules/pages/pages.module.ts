import { PageSchema, Page } from './schemas/page.schema';
import { Module } from '@nestjs/common';
import { PagesService } from './pages.service';
import { PagesViewController } from './pages-view.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { PagesApiController } from './pages-api.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Page.name, schema: PageSchema }]),
  ],
  controllers: [PagesApiController, PagesViewController],
  providers: [PagesService],
  exports: [PagesService],
})
export class PagesModule {}
