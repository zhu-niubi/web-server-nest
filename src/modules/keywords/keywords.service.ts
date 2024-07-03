import { PaginationDto } from './../../dto/pagination.dto';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId } from 'mongoose';
import { CreateKeywordDto } from './dto/create-keyword.dto';
import { UpdateKeywordDto } from './dto/update-keyword.dto';
import { KeywordDocument, Keyword } from './schemas/keyword.schema';
import { NotFoundDataException } from 'src/exceptions/noDataException.exception';

@Injectable()
export class KeywordsService {
  constructor(
    @InjectModel(Keyword.name)
    private readonly keywordModel: Model<KeywordDocument>,
  ) {}
  create(createKeywordDto: CreateKeywordDto) {
    return this.keywordModel.create(createKeywordDto);
  }

  async findAll(pagination: PaginationDto) {
    const [result, count] = await Promise.all([
      this.keywordModel
        .find()
        .limit(pagination.pageSize)
        .skip((pagination.pageIndex - 1) * pagination.pageSize),
      this.keywordModel.count(),
    ]);

    return { data: result, count };
  }

  findOne(id: ObjectId) {
    return this.keywordModel.findById(id);
  }

  async update(id: ObjectId, updateKeywordDto: UpdateKeywordDto) {
    const result = await this.keywordModel.findByIdAndUpdate(
      id,
      updateKeywordDto,
      {
        new: true,
      },
    );
    if (!result) throw new NotFoundDataException();
    return result;
  }

  async delete(id: ObjectId) {
    const result = await this.keywordModel.findByIdAndDelete(id);
    if (!result) throw new NotFoundDataException();

    return result;
  }
}
