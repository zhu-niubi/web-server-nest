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
import { VideosService } from './videos.service';
import { CreateVideoDto } from './dto/create-video.dto';
import { UpdateVideoDto } from './dto/update-video.dto';
import { PaginationDto } from '../../dto/pagination.dto';
import { ParseObjectIdPipe } from '../../pipes/objectIdParser.pipe';
import { UpdateMagazineDto } from '../magazines/dto/update-magazine.dto';
import { Public } from '../../decorators/public.decorator';

@Controller('api/videos')
export class VideosController {
  constructor(private readonly videosService: VideosService) {}

  @Post()
  create(@Body() createVideoDto: CreateVideoDto) {
    return this.videosService.create(createVideoDto);
  }

  @Get()
  @Public()
  findAll(@Query() query: PaginationDto) {
    return this.videosService.findAll(query);
  }

  @Get(':id')
  @Public()
  findOne(@Param('id', ParseObjectIdPipe) id) {
    return this.videosService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id', ParseObjectIdPipe) id, @Body() body: UpdateMagazineDto) {
    return this.videosService.update(id, body);
  }

  @Delete(':id')
  delete(@Param('id', ParseObjectIdPipe) id) {
    return this.videosService.delete(id);
  }
}
