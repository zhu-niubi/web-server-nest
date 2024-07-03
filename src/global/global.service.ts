import { Injectable } from '@nestjs/common';
import { PagesService } from 'src/modules/pages/pages.service';
import { ProductsService } from 'src/modules/products/products.service';
import { WebsiteService } from 'src/modules/website/website.service';

@Injectable()
export class GlobalService {
  constructor(
    private readonly websiteService: WebsiteService,
    private readonly pagesService: PagesService,
    private readonly productService: ProductsService,
  ) {}
  async getConfiguration(lang) {
    const websiteConfig =
      (await this.websiteService.getConfig(lang))?.data || {};
    const langConfig = (await this.websiteService.getLangConfig())?.data || [];

    const groups = await this.pagesService.findAllByLang({ lang });

    const noGroupPage = await this.pagesService.findAllNoGroupObj({ lang });

    const productType = await this.productService.getProductTypesByLang({
      lang,
    });
    const rootProductType = await this.productService.getAllRootProductTypes({
      lang,
    });
    const sortOrder = ['CLEAR PPF', 'COLOR PPF', 'SUNROOF', 'LIGHT FILM'];

    rootProductType.sort((a, b) => {
      return sortOrder.indexOf(a.name) - sortOrder.indexOf(b.name);
    });
    // console.log('????', rootProductType);
    return {
      groups,
      noGroupPage,
      websiteConfig,
      productType,
      rootProductType,
      langConfig,
      currentLangConfig: langConfig.find((l) => l.key === lang),
    };
  }
}
