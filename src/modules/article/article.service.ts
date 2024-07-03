import { NotFoundDataException } from 'src/exceptions/noDataException.exception';
import { PaginationDto } from '../../dto/pagination.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { Article, ArticleDocument } from './schemas/article.schema';
import { Model, Types, ObjectId } from 'mongoose';
import { isMongoId } from 'class-validator';

/**
 * 文章
 */
@Injectable()
export class ArticlesService {
  constructor(
    @InjectModel(Article.name) private articleModel: Model<ArticleDocument>,
  ) {}

  create(createArticleDto: CreateArticleDto) {
    return this.articleModel.create(createArticleDto);
  }

  /* 根据语言查找 */
  findAllByLang({ lang = 'cn' }) {
    return this.articleModel.find({ lang }).sort('time');
  }

  async findAllByPagination(pagination: PaginationDto) {
    const [result, count] = await Promise.all([
      this.articleModel
        .find()
        .limit(pagination.pageSize)
        .skip((pagination.pageIndex - 1) * pagination.pageSize),
      this.articleModel.count(),
    ]);

    return { data: result, count };
  }

  async findOne(id: ObjectId) {
    const result = await this.articleModel.findById(id);
    return result;
  }

  /* 根据语言和索引查找 */
  async findOneByLang({ id, lang }) {
    const result = await this.articleModel.findOne({
      $or: [{ _id: isMongoId(id) ? id : undefined }, { urlIndex: id }],
      lang,
    });
    return result;
  }

  /* 找最近几条新闻 */
  async findNearly({ lang = 'cn', number = 4 }) {
    return this.articleModel.find({ lang }).sort('time').limit(number);
  }

  /* 根据产品关键字找到相关文章 */
  async findLikelyArticles(keyword: string[]) {
    const result = await this.articleModel.find({
      relatedProducts: { $in: keyword },
    });
    return result;
  }

  async update(id: Types.ObjectId, updateArticleDto: UpdateArticleDto) {
    const result = await this.articleModel.findByIdAndUpdate(
      id,
      updateArticleDto,
      {
        new: true,
      },
    );
    if (!result) throw new NotFoundDataException();
    return result;
  }

  async delete(id: Types.ObjectId) {
    const result = await this.articleModel.findByIdAndDelete(id);
    if (!result) throw new NotFoundDataException();
    return result;
  }
}
