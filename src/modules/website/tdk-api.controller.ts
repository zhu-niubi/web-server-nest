import { TransformInterceptor } from 'src/interceptors/transform.interceptor';
import { UpdateTDKDto } from './dto/update-tdk.dto';
import { ParseObjectIdPipe } from 'src/pipes/objectIdParser.pipe';
import { PaginationDto } from '../../dto/pagination.dto';
import { CreateTDKDto } from './dto/create-tdk.dto';
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
import { WebsiteService } from './website.service';

@Controller('api/tdk')
@UseInterceptors(TransformInterceptor)
export class TDKAPIController {
  constructor(private readonly websiteService: WebsiteService) {}

  /**
   * TDK
   */

  @Post()
  createTDK(@Body() tdk: CreateTDKDto) {
    return this.websiteService.createTDK(tdk);
  }

  @Get()
  findAllTDK(@Query() query: PaginationDto) {
    return this.websiteService.findAllTDKByPagination(query);
  }

  @Get(':id')
  findOneTDK(@Param('id', ParseObjectIdPipe) id) {
    return this.websiteService.findOneTDK(id);
  }

  @Patch(':id')
  updateOneTDK(@Param('id', ParseObjectIdPipe) id, @Body() body: UpdateTDKDto) {
    return this.websiteService.updateOneTDK(id, body);
  }

  @Delete(':id')
  deleteOneTDK(@Param('id', ParseObjectIdPipe) id) {
    return this.websiteService.deleteOneTDK(id);
  }
}
