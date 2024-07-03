import { UpdateProductTypeDTO } from './dto/update-productType.dto';
import { PaginationDto } from './../../dto/pagination.dto';
import { ProductType, ProductTypeDocument } from './schemas/productType.schema';
import { Product, ProductDocument } from './schemas/product.schema';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CreateProductDto } from './dto/create-product.dto';
import { Model, ObjectId } from 'mongoose';
import { isMongoId } from 'class-validator';
import { UpdateProductDto } from './dto/udpate-product.dto';
import { NotFoundDataException } from 'src/exceptions/noDataException.exception';
import { CreateProductTypeDTO } from './dto/create-productType.dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product.name)
    private productModel: Model<ProductDocument>,
    @InjectModel(ProductType.name)
    private productTypeModel: Model<ProductTypeDocument>,
  ) {}

  /**
   *
   * Schema: Products
   * 产品
   */

  createProduct(createProductDto: CreateProductDto) {
    return this.productModel.create(createProductDto);
  }

  updateOrCreateProduct(filter: any, createProductDto: CreateProductDto) {
    return this.productModel.findOneAndUpdate(filter, createProductDto, {
      upsert: true,
    });
  }

  findAllProducts({
    type,
    lang,
    disabled,
  }: {
    type?: string;
    lang: string;
    disabled?: any;
  }) {
    const q: any = { lang };

    if (type) q.type = type;
    if (disabled) q.disabled = disabled;

    return this.productModel.aggregate([
      { $match: q },
      // 联查producttype
      {
        $lookup: {
          from: 'producttypes',
          localField: 'type',
          foreignField: '_id',
          as: 'productType',
        },
      },
      { $unwind: '$productType' },
    ]);
  }

  async findOneProduct(id: ObjectId) {
    const result: any = await this.productModel
      .findById(id)
      .populate('type', 'name');
    if (!result)
      throw new HttpException('NOT FOUND THIS PRODUCT', HttpStatus.NOT_FOUND);

    result.typeName = result.type?.name;
    result.type = result.type?._id;

    return result;
  }

  /* 分页查询 */
  async findAllProductsByPatination({
    pagination,
    filter,
    lang,
  }: {
    pagination: PaginationDto;
    filter: string;
    lang?: string;
  }) {
    const q: { name?: object; lang?: string } = {};

    if (filter) q.name = { $regex: filter, $options: 'si' };

    if (lang) q.lang = lang;

    const [result, count] = await Promise.all([
      this.productModel
        .find(q)
        .limit(pagination.pageSize)
        .skip((pagination.pageIndex - 1) * pagination.pageSize)
        .populate('type', 'name'),
      this.productModel.countDocuments(q),
    ]);
    const data = result.map((r: any) => {
      r = r.toObject();
      r.typeName = r.type?.name;

      r.type = r.type?._id;
      return r;
    });
    return { data, count };
  }

  /* 根据id或索引及语言 查询 */
  findOneByIndex({ id, lang = 'cn' }) {
    return this.productModel.findOne({
      $or: [{ _id: isMongoId(id) ? id : undefined }, { urlIndex: id }],
      lang,
    });
  }

  /* 用于文章模块 查询关联产品 */
  async findLikelyProducts({ keywords, lang = 'cn' }) {
    const [keywordResult, typeResult] = await Promise.all([
      this.productModel.find({ type: { $in: keywords }, lang }).limit(2), // 根据类型查找最多2个
      this.productModel.find({
        urlIndex: { $in: keywords },
        lang,
      }),
    ]);

    return [...keywordResult, ...typeResult];
  }

  async updateOneProduct(id: ObjectId, data: UpdateProductDto) {
    const result = await this.productModel.findByIdAndUpdate(id, data, {
      new: true,
    });
    if (!result) throw new NotFoundDataException();
    return result;
  }

  async deleteOneProduct(id: ObjectId) {
    const result = await this.productModel.findByIdAndDelete(id);
    if (!result) throw new NotFoundDataException();
    return result;
  }
  /**
   *
   * Schema: ProductType
   * 产品类型
   */

  /* 创建产品类型 */
  createProductType(data: CreateProductTypeDTO) {
    return this.productTypeModel.create(data);
  }

  async findAllProductTypeByPagination({
    pagination,
    lang,
  }: {
    pagination: PaginationDto;
    lang: string;
  }) {
    const conditions: { lang?: string } = {};

    if (lang) conditions.lang = lang;

    const [data, count] = await Promise.all([
      this.productTypeModel
        .find(conditions)
        .limit(pagination.pageSize)
        .skip((pagination.pageIndex - 1) * pagination.pageSize),
      this.productTypeModel.count(conditions),
    ]);

    return {
      data: data.map((d) => {
        const tmp: ProductType & { parentProductTypeName?: string } =
          d.toJSON();
        tmp.parentProductTypeName = d.parentProductType?.name;
        if (tmp.parentProductType) delete tmp.parentProductType;
        return tmp;
      }),
      count,
    };
  }

  async findOneProductType(q) {
    const result: ProductType & { parentProductTypeName?: string } = (
      await this.productTypeModel.findById(q)
    )?.toJSON();

    if (result?.parentProductType) {
      result.parentProductTypeName = result.parentProductType.name;
      delete result.parentProductType;
    }

    return result;
  }

  async findAllProductType(q) {
    const result: ProductType[] = await this.productTypeModel.find(q);

    return result;
  }

  updateOrCreateProductType(filter: any, createProductTypeDto) {
    return this.productTypeModel.findOneAndUpdate(
      filter,
      createProductTypeDto,
      {
        upsert: true,
      },
    );
  }

  /* 获取指定语言产品类型 */
  getProductTypesByLang({ lang = 'en' }) {
    return this.productTypeModel.find({ lang });
  }

  async updateOneProductType(id: ObjectId, data: UpdateProductTypeDTO) {
    const result = await this.productTypeModel.findByIdAndUpdate(id, data, {
      new: true,
    });
    if (!result) throw new NotFoundDataException();
    return result;
  }

  async deleteOneProductType(id: ObjectId) {
    return this.productTypeModel.findByIdAndDelete(id);
  }

  /**
   * 获取全部父类型
   */
  getAllParentProductTypes() {
    return this.productTypeModel.aggregate([
      {
        $match: { parentProductType: { $exists: true } },
      },
      {
        $unwind: '$parentProductType',
      },
      { $replaceRoot: { newRoot: '$parentProductType' } },

      { $group: { _id: '$name' } },
      {
        $project: {
          _id: false,
          name: '$_id',
        },
      },
    ]);
  }

  /**
   * 获取全部根类型
   */
  async getAllRootProductTypes({ lang }) {
    // 分别获取两组数据：noParentTypes,haveParentTypes=>没有父类型的产品类型,有父类型的产品类型
    const [noParentTypes, haveParentTypes] = await Promise.all([
      this.productTypeModel
        .find({
          parentProductType: { $exists: false },
          lang,
        })
        .select('-_id name key'),
      this.productTypeModel.aggregate([
        { $match: { parentProductType: { $exists: true }, lang } },
        {
          $group: {
            _id: '$parentProductType.name',
            children: { $push: { key: '$key', name: '$name' } },
          },
        },
        {
          $project: {
            _id: false,
            name: '$_id',
            children: '$children',
          },
        },
      ]),
    ]);

    return [...noParentTypes, ...haveParentTypes];
  }
}
