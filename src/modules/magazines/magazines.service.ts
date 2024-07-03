import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateMagazineDto } from './dto/create-magazine.dto';
import { UpdateMagazineDto } from './dto/update-magazine.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types, ObjectId } from 'mongoose';
import { Magazine, MagazineDocument } from './schema/magazine.schema';
import { PaginationDto } from '../../dto/pagination.dto';

@Injectable()
export class MagazinesService {
  constructor(
    @InjectModel(Magazine.name) private magazineModel: Model<MagazineDocument>,
  ) {}
  create(createMagazineDto: CreateMagazineDto) {
    return this.magazineModel.create(createMagazineDto);
  }

  async findAll(pagination: PaginationDto) {
    const [result, count] = await Promise.all([
      this.magazineModel
        .find({ status: 1 })
        .limit(pagination.pageSize)
        .skip((pagination.pageIndex - 1) * pagination.pageSize),
      this.magazineModel.count(),
    ]);
    return { data: result, count };
  }

  async findOne(id: ObjectId) {
    const res: any = await this.magazineModel.findById(id).where({ status: 1 });
    return res;
  }

  async update(id: Types.ObjectId, UpdateMagazineDto: UpdateMagazineDto) {
    const result = await this.magazineModel.findByIdAndUpdate(
      id,
      UpdateMagazineDto,
      { new: true },
    );
    if (!result) {
      throw new NotFoundException('Magazine not found');
    }
    return result;
  }

  async delete(id: Types.ObjectId) {
    const result = await this.magazineModel
      .findByIdAndUpdate(id, { status: 0 }, { new: true })
      .where({ status: 1 }); // 添加过滤条件 status=1
    if (!result) {
      throw new NotFoundException('Magazine not found');
    }
    return result;
  }
}
