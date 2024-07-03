import { ProductsService } from './modules/products/products.service';
import { Injectable } from '@nestjs/common';
import { ArticlesService } from './modules/article/article.service';
import { PagesService } from './modules/pages/pages.service';
import { WebsiteService } from './modules/website/website.service';

@Injectable()
export class AppService {
  constructor(
    private readonly articleervice: ArticlesService,
    private readonly websiteService: WebsiteService,
    private readonly pagesService: PagesService,
    private readonly productService: ProductsService,
  ) {}
  getViewName(): any {
    throw new Error('Method not implemented.');
  }
  getHello(): string {
    return 'Hello World!';
  }
}
