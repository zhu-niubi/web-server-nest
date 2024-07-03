import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateVideoDto } from './dto/create-video.dto';
import { UpdateVideoDto } from './dto/update-video.dto';
import { PaginationDto } from '../../dto/pagination.dto';
import { Model, ObjectId, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Video, VideoDocument } from './schema/video.schema';

@Injectable()
export class VideosService {
  constructor(
    @InjectModel(Video.name) private videoModel: Model<VideoDocument>,
  ) {}
  create(createVideoDto: CreateVideoDto) {
    return this.videoModel.create(createVideoDto);
  }

  async findAll(pagination: PaginationDto) {
    const [result, count] = await Promise.all([
      this.videoModel
        .find({ status: 1 })
        .limit(pagination.pageSize)
        .skip((pagination.pageIndex - 1) * pagination.pageSize),
      this.videoModel.count(),
    ]);
    return { data: result, count };
  }

  async findOne(id: ObjectId) {
    const res: any = await this.videoModel.findById(id).where({ status: 1 });
    return res;
  }

  async update(id: Types.ObjectId, UpdateVideoDto: UpdateVideoDto) {
    const result = await this.videoModel.findByIdAndUpdate(id, UpdateVideoDto, {
      new: true,
    });
    if (!result) {
      throw new NotFoundException('Magazine not found');
    }
    return result;
  }

  async delete(id: Types.ObjectId) {
    const result = await this.videoModel
      .findByIdAndUpdate(id, { status: 0 }, { new: true })
      .where({ status: 1 }); // 添加过滤条件 status=1
    if (!result) {
      throw new NotFoundException('Magazine not found');
    }
    return result;
  }
}
