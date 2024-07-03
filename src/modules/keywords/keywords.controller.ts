import { TransformInterceptor } from './../../interceptors/transform.interceptor';
import { PaginationDto } from './../../dto/pagination.dto';
import { ParseObjectIdPipe } from 'src/pipes/objectIdParser.pipe';
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { KeywordsService } from './keywords.service';
import { CreateKeywordDto } from './dto/create-keyword.dto';
import { UpdateKeywordDto } from './dto/update-keyword.dto';

@Controller('api/keywords')
@UseInterceptors(TransformInterceptor)
export class KeywordsController {
  constructor(private readonly keywordsService: KeywordsService) {}

  @Post()
  create(@Body() createKeywordDto: CreateKeywordDto) {
    return this.keywordsService.create(createKeywordDto);
  }

  @Get()
  findAll(@Query() query: PaginationDto) {
    return this.keywordsService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id', ParseObjectIdPipe) id) {
    return this.keywordsService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseObjectIdPipe) id,
    @Body() updateKeywordDto: UpdateKeywordDto,
  ) {
    return this.keywordsService.update(id, updateKeywordDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseObjectIdPipe) id) {
    return this.keywordsService.delete(id);
  }
}
