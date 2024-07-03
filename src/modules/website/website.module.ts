import { Module } from '@nestjs/common';
import { WebsiteService } from './website.service';
import { WebsiteAPIController } from './website-api.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
  WebsiteConfig,
  WebsiteConfigSchema,
} from './schemas/websiteConfig.schema';
import { TDK, TDKSchema } from './schemas/tdk.schema';
import { TDKAPIController } from './tdk-api.controller';
import { ProductsModule } from '../products/products.module';
import { PagesModule } from '../pages/pages.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: WebsiteConfig.name, schema: WebsiteConfigSchema },
      { name: TDK.name, schema: TDKSchema },
    ]),
    ProductsModule,
    PagesModule,
  ],
  controllers: [WebsiteAPIController, TDKAPIController],
  providers: [WebsiteService],
  exports: [WebsiteService],
})
export class WebsiteModule {}
