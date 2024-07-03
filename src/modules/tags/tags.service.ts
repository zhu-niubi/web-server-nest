import { NotFoundDataException } from './../../exceptions/noDataException.exception';
import { PaginationDto } from './../../dto/pagination.dto';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId } from 'mongoose';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { Tag, TagDocument } from './schemas/tag.schema';

@Injectable()
export class TagsService {
  constructor(
    @InjectModel(Tag.name) private readonly tagModel: Model<TagDocument>,
  ) {}

  create(createTagDto: CreateTagDto) {
    return this.tagModel.create(createTagDto);
  }

  async findAll(pagination: PaginationDto) {
    const [result, count] = await Promise.all([
      this.tagModel
        .find()
        .limit(pagination.pageSize)
        .skip((pagination.pageIndex - 1) * pagination.pageSize),
      this.tagModel.count(),
    ]);

    return { data: result, count };
  }

  findOne(id: ObjectId) {
    return this.tagModel.findById(id);
  }

  async update(id: ObjectId, updateTagDto: UpdateTagDto) {
    const result = await this.tagModel.findByIdAndUpdate(id, updateTagDto, {
      new: true,
    });
    if (!result) throw new NotFoundDataException();
    return result;
  }

  async remove(id: ObjectId) {
    const result = await this.tagModel.findByIdAndDelete(id);
    if (!result) throw new NotFoundDataException();
    return result;
  }
}
