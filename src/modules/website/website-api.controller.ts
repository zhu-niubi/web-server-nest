import { TransformInterceptor } from 'src/interceptors/transform.interceptor';
import { UpdateWebsiteConfigDTO } from './dto/update-websiteConfig.dto';
import { ParseObjectIdPipe } from 'src/pipes/objectIdParser.pipe';

import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { WebsiteService } from './website.service';
import { CreateWebsiteConfigDTO } from './dto/create-websiteConfig.dto';
import { CreateNewLangDto } from './dto/createNewLang.dto';
import { FindWebsiteConfigDto } from './dto/find-websiteConfig.dto';
import { GetOneWebsiteConfigDto } from './dto/get-one-websiteConfig.dto';
import { Public } from '../../decorators/public.decorator';

@Controller('api/websiteConfig')
@UseInterceptors(TransformInterceptor)
export class WebsiteAPIController {
  constructor(private readonly websiteService: WebsiteService) {}

  /**
   * WebsiteConfig
   */

  @Post()
  createConfig(@Body() data: CreateWebsiteConfigDTO) {
    return this.websiteService.createOneConfig(data);
  }

  /** */
  @Post('lang')
  createLang(@Body() data: CreateNewLangDto) {
    return this.websiteService.createLangAndInit(data);
  }

  @Get()
  @Public()
  findAllConfig(@Query() query: FindWebsiteConfigDto) {
    return this.websiteService.findAllConfigByPagination({
      pagination: { pageIndex: query.pageIndex, pageSize: query.pageSize },
      lang: query.lang,
    });
  }

  @Get('lang/:lang')
  getOneLangConfig(@Param() param: GetOneWebsiteConfigDto) {
    // console.log(param);
    return this.websiteService.getALangConfig({ lang: param.lang });
  }

  @Get('lang')
  getLangConfig() {
    return this.websiteService.getLangConfig();
  }

  @Get(':id')
  @Public()
  findOneConfig(@Param('id', ParseObjectIdPipe) id) {
    return this.websiteService.findOneConfig(id);
  }

  @Patch(':id')
  updateOneConfig(
    @Param('id', ParseObjectIdPipe) id,
    @Body() body: UpdateWebsiteConfigDTO,
  ) {
    return this.websiteService.updateOneConfig(id, body);
  }

  @Delete('/lang/:key')
  deleteLangAndConfig(@Param('key') key) {
    if (!key)
      throw new HttpException('please input key', HttpStatus.BAD_REQUEST);
    return this.websiteService.deleteLangAndConfig(key);
  }

  @Delete(':id')
  deleteOneConfig(@Param('id', ParseObjectIdPipe) id) {
    return this.websiteService.deleteOneConfig(id);
  }
}
