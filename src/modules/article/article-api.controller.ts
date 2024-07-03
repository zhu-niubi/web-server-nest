import { TransformInterceptor } from '../../interceptors/transform.interceptor';
import { ProductsService } from 'src/modules/products/products.service';
import { GlobalService } from '../../global/global.service';
import { Response } from 'express';
import { ArticlesService } from './article.service';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  Param,
  Patch,
  Post,
  Query,
  Render,
  Res,
  UseInterceptors,
} from '@nestjs/common';
import * as moment from 'moment';
import { Public } from 'src/decorators/public.decorator';
import { PaginationDto } from 'src/dto/pagination.dto';
import { CreateArticleDto } from './dto/create-article.dto';
import { ParseObjectIdPipe } from 'src/pipes/objectIdParser.pipe';
import { UpdateArticleDto } from './dto/update-article.dto';

/**
 * API
 */
@Controller('api/article')
@UseInterceptors(TransformInterceptor)
export class ArticlesApiController {
  constructor(private readonly articleervice: ArticlesService) {}

  @Post()
  createOne(@Body() body: CreateArticleDto) {
    return this.articleervice.create(body);
  }

  @Get(':id')
  findOne(@Param('id', ParseObjectIdPipe) id) {
    return this.articleervice.findOne(id);
  }

  @Get()
  findAll(@Query() query: PaginationDto) {
    return this.articleervice.findAllByPagination(query);
  }
  @Patch(':id')
  updateOne(
    @Param('id', ParseObjectIdPipe) id,
    @Body() body: UpdateArticleDto,
  ) {
    return this.articleervice.update(id, body);
  }

  @Delete(':id')
  delete(@Param('id', ParseObjectIdPipe) id) {
    return this.articleervice.delete(id);
  }
}
