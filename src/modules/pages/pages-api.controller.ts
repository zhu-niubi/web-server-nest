import { ParseObjectIdPipe } from 'src/pipes/objectIdParser.pipe';
import { CreatePageDto } from './dto/create-page.dto';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { PagesService } from './pages.service';
import { PaginationDto } from 'src/dto/pagination.dto';
import { UpdatePageDTO } from './dto/update-page.dto';
import { TransformInterceptor } from 'src/interceptors/transform.interceptor';

@Controller('api/pages')
@UseInterceptors(TransformInterceptor)
export class PagesApiController {
  constructor(private readonly pagesService: PagesService) {}

  @Post()
  create(@Body() body: CreatePageDto) {
    return this.pagesService.create(body);
  }

  @Get()
  getAll(@Query() query: PaginationDto, @Query('lang') lang: string) {
    return this.pagesService.findAllByPagination({
      query: { lang },
      pagination: { pageSize: query.pageSize, pageIndex: query.pageIndex },
    });
  }

  @Get(':id')
  getOne(@Param('id', ParseObjectIdPipe) id) {
    return this.pagesService.findOne(id);
  }

  @Patch(':id')
  updateOne(@Param('id', ParseObjectIdPipe) id, @Body() body: UpdatePageDTO) {
    return this.pagesService.updateOne(id, body);
  }

  @Delete(':id')
  deleteOne(@Param('id', ParseObjectIdPipe) id) {
    return this.pagesService.deleteOne(id);
  }
}
