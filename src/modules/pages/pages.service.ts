import { NotFoundDataException } from './../../exceptions/noDataException.exception';
import { UpdatePageDTO } from './dto/update-page.dto';
import { PaginationDto } from './../../dto/pagination.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Injectable, UseInterceptors } from '@nestjs/common';
import { CreatePageDto } from './dto/create-page.dto';
import { Page, PageDocument } from './schemas/page.schema';
import { Model, ObjectId } from 'mongoose';
import { isMongoId } from 'class-validator';
import { TransformInterceptor } from 'src/interceptors/transform.interceptor';

/**
 * 单页面
 */
@Injectable()
@UseInterceptors(TransformInterceptor)
export class PagesService {
  constructor(@InjectModel(Page.name) private pageModel: Model<PageDocument>) {}

  create(createPageDto: CreatePageDto) {
    return this.pageModel.create(createPageDto);
  }

  async findAllByPagination({
    query = {},
    pagination,
  }: {
    query: any;
    pagination: PaginationDto;
  }) {
    const [result, count] = await Promise.all([
      this.pageModel
        .find(query)
        .limit(pagination.pageSize)
        .skip((pagination.pageIndex - 1) * pagination.pageSize),
      this.pageModel.count(),
    ]);

    return { data: result, count };
  }

  findOne(id: ObjectId) {
    return this.pageModel.findById(id);
  }

  async findAllNoGroupObj({ lang = 'en' }) {
    const pages = await this.pageModel.find({
      lang,
      $or: [{ group: { $exists: false } }, { group: '' }],
    });

    const result = {};

    for (let i = 0; i < pages.length; i++) result[pages[i].urlIndex] = pages[i];

    return result;
  }

  async findAllNoGroupPages({ lang = 'en' }) {
    return this.pageModel.find({
      lang,
      $or: [{ group: { $exists: false } }, { group: '' }],
    });
  }

  updateOrCreatePages(filter, page: Page) {
    return this.pageModel.findOneAndUpdate(filter, page, { upsert: true });
  }

  async findAllByLang({ lang = 'en' }) {
    const singlePages = await this.pageModel.find({ lang });

    const result = {};

    for (const sp of singlePages) {
      if (!sp.group) continue;
      if (!result[sp.group]) {
        result[sp.group] = [];
        result[sp.group].push(sp);
      } else {
        result[sp.group].push(sp);
      }
    }

    return result;
  }

  async findOneByLang({ id, lang = 'cn' }) {
    const result = await this.pageModel.findOne({
      $or: [{ _id: isMongoId(id) ? id : undefined }, { urlIndex: id }],
      lang,
    });

    return result;
  }

  async updateOne(id: ObjectId, data: UpdatePageDTO) {
    const result = await this.pageModel.findByIdAndUpdate(id, data, {
      new: true,
    });
    if (!result) throw new NotFoundDataException();
    return result;
  }

  async deleteOne(id: ObjectId) {
    const result = await this.pageModel.findByIdAndDelete(id);
    if (!result) throw new NotFoundDataException();
    return result;
  }
}
