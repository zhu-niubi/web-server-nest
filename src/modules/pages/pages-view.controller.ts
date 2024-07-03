import { Controller, Get, Param, Render } from '@nestjs/common';
import { PagesService } from './pages.service';
import { GlobalService } from '../../global/global.service';
import { TDK } from 'src/decorators/tdk.decorator';
import { Public } from 'src/decorators/public.decorator';
import * as moment from 'moment';
import { Page } from './schemas/page.schema';

@Controller(':local/pages')
export class PagesViewController {
  constructor(
    private readonly pagesService: PagesService,
    private readonly globalService: GlobalService,
  ) {}
  /* 单页面 */
  @Public()
  @Get(':index.html')
  @Render('pages')
  async findOne(@Param() params: { index: string; local: string }, @TDK() tdk) {
    const pageResult = await this.pagesService.findOneByLang({
      id: params.index,
      lang: params.local,
    });
    const page: Omit<Page, 'createdAt' | 'updatedAt'> & {
      createdAt: string;
      updatedAt: string;
    } = {
      ...pageResult.toJSON(),
      createdAt: moment(pageResult.createdAt).format('LLLL'),
      updatedAt: moment(pageResult.updatedAt).format('LLLL'),
    };

    if (page) {
    }

    const configuration = await this.globalService.getConfiguration(
      params.local,
    );

    return {
      data: { page },
      ...configuration,
      ...tdk,
      local: params.local,
    };
  }
}
