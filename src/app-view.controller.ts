import { GlobalService } from './global/global.service';
import { ProductsService } from './modules/products/products.service';
import { PagesService } from './modules/pages/pages.service';
import { Controller, Get, Param, Render } from '@nestjs/common';
import { ArticlesService } from './modules/article/article.service';
import { WebsiteService } from './modules/website/website.service';
import { TDK } from './decorators/tdk.decorator';
import { Public } from './decorators/public.decorator';

@Controller(':local')
export class AppViewController {
  constructor(
    private readonly articleervice: ArticlesService,
    private readonly websiteService: WebsiteService,
    private readonly pagesService: PagesService,
    private readonly productService: ProductsService,
    private readonly globalService: GlobalService,
  ) {}

  @Public()
  @Get('index.html')
  @Render('index')
  async index(@TDK() tdk, @Param('local') local) {
    const slides = await this.websiteService.getSlides(local);
    const article = await this.articleervice.findNearly({ lang: local });

    const configuration = await this.globalService.getConfiguration(local);

    const products: any = await this.productService.findAllProducts({
      lang: local,
      disabled: { $in: [undefined, false] },
    });
    const productGroups = {};
    const yParentGroups = [];
    for (const pt of configuration.productType) {
      if (pt.parentProductType?.name !== 'CLEAR PPF') {
        productGroups[pt.key] = {
          productType: pt,
          products: products.filter((p) => {
            return p?.type?.toString() === pt._id?.toString();
          }),
        };
      } else {
        yParentGroups.push(pt);
      }
    }

    // console.log(productGroups['sunroof'].products);
    return {
      data: {
        slides: slides?.data || [],
        article,
        productGroups,
        yParentGroups,
      },
      ...configuration,
      ...tdk,
      local,
    };
  }

  @Public()
  @Get('/contactUs.html')
  @Render('contactUs')
  async contactUs(@TDK() tdk, @Param('local') local) {
    const configuration = await this.globalService.getConfiguration(local);
    return {
      ...configuration,
      ...tdk,
      local,
    };
  }
}
