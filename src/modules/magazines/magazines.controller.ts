import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { MagazinesService } from './magazines.service';
import { CreateMagazineDto } from './dto/create-magazine.dto';
import { UpdateMagazineDto } from './dto/update-magazine.dto';
import { PaginationDto } from '../../dto/pagination.dto';
import { ParseObjectIdPipe } from '../../pipes/objectIdParser.pipe';
import { Public } from '../../decorators/public.decorator';

@Controller('api/magazines')
export class MagazinesController {
  constructor(private readonly magazinesService: MagazinesService) {}

  @Post()
  create(@Body() createMagazineDto: CreateMagazineDto) {
    return this.magazinesService.create(createMagazineDto);
  }

  @Get()
  @Public()
  findAll(@Query() query: PaginationDto) {
    return this.magazinesService.findAll(query);
  }

  @Get(':id')
  @Public()
  findOne(@Param('id', ParseObjectIdPipe) id) {
    return this.magazinesService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id', ParseObjectIdPipe) id, @Body() body: UpdateMagazineDto) {
    return this.magazinesService.update(id, body);
  }

  @Delete(':id')
  delete(@Param('id', ParseObjectIdPipe) id) {
    return this.magazinesService.delete(id);
  }
}
