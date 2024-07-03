import { ProductsModule } from './../modules/products/products.module';
import { ArticlesModule } from '../modules/article/article.module';
import { PagesModule } from './../modules/pages/pages.module';
import { Global, Module } from '@nestjs/common';
import { WebsiteModule } from 'src/modules/website/website.module';
import { GlobalService } from './global.service';

@Global()
@Module({
  imports: [WebsiteModule, PagesModule, ArticlesModule, ProductsModule],
  providers: [GlobalService],
  exports: [GlobalService],
})
export class GlobalModule {}
