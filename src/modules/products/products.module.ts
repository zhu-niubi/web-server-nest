import {
  ProductsAPIController,
  ProductsTypeAPIController,
} from './products-api.controller';
import { ArticlesModule } from '../article/article.module';
import { ProductType, ProductTypeSchema } from './schemas/productType.schema';
import { Product, ProductSchema } from './schemas/product.schema';
import { forwardRef, Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products-view.controller';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Product.name, schema: ProductSchema },
      { name: ProductType.name, schema: ProductTypeSchema },
    ]),
    forwardRef(() => ArticlesModule),
  ],
  controllers: [
    ProductsAPIController,
    ProductsTypeAPIController,
    ProductsController,
  ], // 顺序不可更改, 需要使得 app/* 在 :local/* 之前
  providers: [ProductsService],
  exports: [ProductsService],
})
export class ProductsModule {}
