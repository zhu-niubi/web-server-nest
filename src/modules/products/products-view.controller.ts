import { ArticlesService } from 'src/modules/article/article.service';
import { GlobalService } from '../../global/global.service';
import {
  Controller,
  forwardRef,
  Get,
  Inject,
  Param,
  Render,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { TDK } from 'src/decorators/tdk.decorator';
import { Public } from 'src/decorators/public.decorator';

@Controller(':local/products')
export class ProductsController {
  constructor(
    private readonly productsService: ProductsService,
    private readonly globalService: GlobalService,
    @Inject(forwardRef(() => ArticlesService)) // 循环依赖
    private readonly articleService: ArticlesService,
  ) {}

  /* 产品类别页 */
  @Public()
  @Render('products/products')
  @Get(':type.html')
  async products(@Param() params, @TDK() tdk) {
    const productTypes = await this.productsService.getProductTypesByLang({
      lang: params.local,
    });

    const productType: any =
      productTypes.find((p) => p.key === params.type) || {};

    const products = await this.productsService.findAllProducts({
      type: productType._id,
      lang: params.local,
      disabled: { $in: [false, undefined] },
    });

    const configuration = await this.globalService.getConfiguration(
      params.local,
    );

    return {
      data: { products, productType },
      ...configuration,
      ...tdk,
      local: params.local,
    };
  }

  /* 产品详情页 */
  @Public()
  @Get('detail/:index.html')
  @Render('products/product-detail')
  async productDetail(
    @Param() params: { index: string; local: string },
    @TDK() tdk,
  ) {
    const product = await this.productsService.findOneByIndex({
      id: params.index,
      lang: params.local,
    });
    const configuration = await this.globalService.getConfiguration(
      params.local,
    );

    const relevantArticles = await this.articleService.findLikelyArticles([
      product.urlIndex,
    ]);
    const productType = await this.productsService.findOneProductType(
      product.type,
    );


    console.log(product);
    product.image[0] = typeof product.image[0] === 'string' ? product.image[0] : Array.isArray(product.image[0]) ? product.image[0][0] : null;

    return {
      data: { product, relevantArticles, productType },
      ...configuration,
      ...tdk,
      local: params.local,
    };
  }
}
