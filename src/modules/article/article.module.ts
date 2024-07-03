import { ArticlesViewController } from './article-view.controller';
import { forwardRef, Module } from '@nestjs/common';
import { ArticlesService } from './article.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Article, ArticleSchema } from './schemas/article.schema';
import { ProductsModule } from '../products/products.module';
import { ArticlesApiController } from './article-api.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Article.name, schema: ArticleSchema }]),
    forwardRef(() => ProductsModule),
  ],
  providers: [ArticlesService],
  controllers: [ArticlesApiController, ArticlesViewController],
  exports: [ArticlesService],
})
export class ArticlesModule {}
