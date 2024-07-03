import { ProductsService } from 'src/modules/products/products.service';
import { GlobalService } from '../../global/global.service';
import { Response } from 'express';
import { ArticlesService } from './article.service';
import {
  Controller,
  Get,
  HttpException,
  Param,
  Render,
  Res,
} from '@nestjs/common';
import * as moment from 'moment';
import { Public } from 'src/decorators/public.decorator';

@Controller(':local/article')
export class ArticlesViewController {
  constructor(
    private readonly articleervice: ArticlesService,
    private readonly globalService: GlobalService,
    private readonly productService: ProductsService,
  ) {}

  @Get('index.html')
  @Public()
  @Render('article/article')
  async index(
    @Res()
    res: Response,
    @Param('local') local,
  ) {
    const article = await this.articleervice.findAllByLang({ lang: local });
    const configuration = await this.globalService.getConfiguration(local);

    return {
      data: article,
      ...configuration,
      local,
    };
  }

  @Public()
  @Get(':id.html')
  @Render('article/article-detail')
  async getDetail(@Param() params) {
    const result = await this.articleervice.findOneByLang({
      id: params.id,
      lang: params.local,
    });
    if (!result) throw new HttpException('NO article', 400);
    const configuration = await this.globalService.getConfiguration(
      params.local,
    );
    const relevantProducts = await this.productService.findLikelyProducts({
      keywords: result?.relatedProducts,
      lang: params.local,
    });

    return {
      data: {
        ...result.toJSON(),
        time: moment(result.time).format('YYYY-MM-DD HH:mm:ss'),
        relevantProducts,
      },
      ...configuration,
      local: params.local,
    };
  }
}
