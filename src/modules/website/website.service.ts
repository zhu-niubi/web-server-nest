import { Product } from './../products/schemas/product.schema';
import { NotFoundDataException } from './../../exceptions/noDataException.exception';
import { UpdateTDKDto } from './dto/update-tdk.dto';
import { PaginationDto } from './../../dto/pagination.dto';
import { CreateTDKDto } from './dto/create-tdk.dto';
import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import mongoose, { Model, ObjectId } from 'mongoose';
import { TDK, TDKDocument } from './schemas/tdk.schema';
import {
  WebsiteConfig,
  WebsiteConfigDocument,
} from './schemas/websiteConfig.schema';
import { CreateWebsiteConfigDTO } from './dto/create-websiteConfig.dto';
import { UpdateWebsiteConfigDTO } from './dto/update-websiteConfig.dto';
import { inspect } from 'util';
import { CreateNewLangDto } from './dto/createNewLang.dto';
import initLangJson from './initLangJson';
import { ProductsService } from '../products/products.service';
import { PagesService } from '../pages/pages.service';
import { Page } from '../pages/schemas/page.schema';

const DEFAULT_LANG = 'en',
  DEFAULT_CONFIG_KEY = 'config',
  DEFAULT_LANG_KEY = 'lang',
  DEFAULT_SLIDES_KEY = 'slides',
  DEFAULT_LANG_NAME = 'English';

@Injectable()
export class WebsiteService {
  private readonly logger = new Logger('WebsiteService');

  constructor(
    @InjectModel(TDK.name) private tdkModel: Model<TDKDocument>,
    @InjectModel(WebsiteConfig.name)
    private websiteConfigModel: Model<WebsiteConfigDocument>,
    private productService: ProductsService,
    private pagesService: PagesService,
    @InjectConnection() private readonly connection: mongoose.Connection,
  ) {
    const load = async () => {
      const defaultConfig = await this.websiteConfigModel.findOne({
        // 查找默认配置,若没有则创建
        lang: DEFAULT_LANG,
        type: DEFAULT_CONFIG_KEY,
      });

      if (!defaultConfig)
        await this.websiteConfigModel.create({
          lang: DEFAULT_LANG,
          type: DEFAULT_CONFIG_KEY,
          data: {},
        });

      const defaultLang = await this.websiteConfigModel.findOne({
        type: DEFAULT_LANG_KEY,
      }); // 查找默认语言配置, 没有则创建

      this.logger.log('DEFAULT_LANG: ', inspect(defaultLang));

      if (!defaultLang)
        await this.websiteConfigModel.create({
          type: DEFAULT_LANG_KEY,
          data: [{ key: DEFAULT_LANG, name: DEFAULT_LANG_NAME }],
        });
    };
    load();
  }

  /**
   * 网站配置
   * 包括语言,基本配置,幻灯片
   */
  createOneConfig(data: CreateWebsiteConfigDTO) {
    return this.websiteConfigModel.create(data);
  }

  async findAllConfigByPagination({
    pagination,
    lang,
  }: {
    pagination: PaginationDto;
    lang?: string;
  }) {
    const q: { lang?: string } = {};
    if (lang) q.lang = lang;

    const [result, count] = await Promise.all([
      this.websiteConfigModel
        .find(q)
        .limit(pagination.pageSize)
        .skip((pagination.pageIndex - 1) * pagination.pageSize),
      this.websiteConfigModel.countDocuments(q),
    ]);
    return { data: result, count };
  }

  findOneConfig(id: ObjectId) {
    return this.websiteConfigModel.findById(id);
  }

  /* lang */
  getLangConfig() {
    return this.websiteConfigModel.findOne({ type: DEFAULT_LANG_KEY });
  }

  async getALangConfig({ lang }: { lang: string }) {
    const conditions = { lang };
    const result = await this.websiteConfigModel.find(conditions);

    return {
      slidesConfig: result.find(
        (r: WebsiteConfig) => r.type === DEFAULT_SLIDES_KEY,
      ),
      websiteConfig: result.find(
        (r: WebsiteConfig) => r.type === DEFAULT_CONFIG_KEY,
      ),
    };
  }

  /* config */
  getConfig(lang) {
    return this.websiteConfigModel.findOne({ type: DEFAULT_CONFIG_KEY, lang });
  }

  getSlides(lang) {
    return this.websiteConfigModel.findOne({ type: DEFAULT_SLIDES_KEY, lang });
  }

  async updateOneConfig(id: ObjectId, data: UpdateWebsiteConfigDTO) {
    const result = await this.websiteConfigModel.findByIdAndUpdate(id, data);
    if (!result) throw new NotFoundDataException();

    return result;
  }

  async deleteOneConfig(id: ObjectId) {
    const result = await this.websiteConfigModel.findByIdAndDelete(id);
    if (!result) throw new NotFoundDataException();

    return result;
  }
  /**
   * TDK
   * Title,Descriptions,Keywords
   */

  /* tdk */
  createTDK(data: CreateTDKDto) {
    return this.tdkModel.create(data);
  }

  async findAllTDKByPagination(pagination: PaginationDto) {
    const [result, count] = await Promise.all([
      this.tdkModel
        .find()
        .limit(pagination.pageSize)
        .skip((pagination.pageIndex - 1) * pagination.pageSize),
      this.tdkModel.count(),
    ]);

    return { data: result, count };
  }

  findOneTDK(id: ObjectId) {
    return this.tdkModel.findById(id);
  }

  /* 通过索引获得tdk */
  async getTDK(index) {
    const result = await this.tdkModel.findOne({ index });

    return result || (await this.tdkModel.findOne({ index: 'index' }));
  }

  async updateOneTDK(id: ObjectId, data: UpdateTDKDto) {
    const result = await this.tdkModel.findByIdAndUpdate(id, data, {
      new: true,
    });
    if (!result) throw new NotFoundDataException();

    return result;
  }

  async deleteOneTDK(id: ObjectId) {
    const result = await this.tdkModel.findByIdAndDelete(id);
    if (!result) throw new NotFoundDataException();

    return result;
  }

  /**
   * 创建新语言并初始化
   */
  async createLangAndInit(langData: CreateNewLangDto) {
    const session = await this.connection.startSession();

    session.startTransaction();

    const langConfig = await this.websiteConfigModel.findOne({
      type: DEFAULT_LANG_KEY,
    });

    if (langConfig.data.find((l) => l.key === langData.key))
      throw new HttpException(
        langData.key + ' is already created',
        HttpStatus.BAD_REQUEST,
      );

    const result: { newWebsiteConfig?: any; newSlidesConfig?: any } = {};

    try {
      langConfig.data = [
        ...langConfig.data,
        { key: langData.key, name: langData.name },
      ];

      await langConfig.save(); // 新增语言

      const newWebSiteConfig =
          (
            await this.websiteConfigModel.findOne({
              type: DEFAULT_CONFIG_KEY,
              lang: DEFAULT_LANG,
            })
          )?.data || initLangJson.websiteConfig,
        newSlideConfig =
          (
            await this.websiteConfigModel.findOne({
              type: DEFAULT_SLIDES_KEY,
              lang: DEFAULT_LANG,
            })
          )?.data || initLangJson.slidesConfig;

      if (
        !(await this.websiteConfigModel.findOne({
          type: DEFAULT_CONFIG_KEY,
          lang: langData.key,
        }))
      )
        result.newWebsiteConfig = await this.websiteConfigModel.create(
          [
            {
              type: DEFAULT_CONFIG_KEY,
              data: newWebSiteConfig,
              lang: langData.key,
            },
          ],
          {},
        );

      if (
        !(await this.websiteConfigModel.findOne({
          type: DEFAULT_SLIDES_KEY,
          lang: langData.key,
        }))
      )
        result.newSlidesConfig = await this.websiteConfigModel.create(
          [
            {
              type: DEFAULT_SLIDES_KEY,
              data: newSlideConfig,
              lang: langData.key,
            },
          ],
          {},
        );

      //   初始化产品类型
      const productTypes = await this.productService.findAllProductType({
        lang: DEFAULT_LANG,
      });

      const productTypesResult = await Promise.all(
        productTypes.map((p: any) => {
          p = p.toObject();
          delete p._id;

          return this.productService.updateOrCreateProductType(
            { key: p.key, lang: langData.key },
            {
              ...p,
              lang: langData.key,
            },
          );
        }),
      );

      // 初始化产品
      const products = await this.productService.findAllProducts({
        lang: DEFAULT_LANG,
      });

      const newProductTypes = await this.productService.findAllProductType({
        lang: langData.key,
      });
      await Promise.all(
        products.map(
          (p: Product & { productType: { _id: string; key: string } }) => {
            delete p._id;

            p.type = newProductTypes.find(
              (pt) => pt?.key === p.productType?.key,
            )?._id;

            return this.productService.updateOrCreateProduct(
              { urlIndex: p.urlIndex, lang: langData.key },
              {
                ...p,
                lang: langData.key,
              },
            );
          },
        ),
      );

      // 初始化单页面
      const noGroupPages = await this.pagesService.findAllNoGroupPages({
        lang: DEFAULT_LANG,
      });

      await Promise.all(
        noGroupPages.map((n: any) => {
          n = n.toObject();
          delete n._id;

          return this.pagesService.updateOrCreatePages(
            { urlIndex: n.urlIndex, lang: langData.key },
            {
              ...n,
              lang: langData.key,
            },
          );
        }),
      );

      await session.commitTransaction();
    } catch (error) {
      console.error('transcation error: ' + error);
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
    return result;
  }

  /**
   * 删除某语言
   */
  async deleteLangAndConfig(langKey: string) {
    const langConfig = await this.websiteConfigModel.findOne({
      type: DEFAULT_LANG_KEY,
    });

    if (!langConfig.data.find((l) => l.key === langKey))
      throw new HttpException(
        langKey + ' is not exists',
        HttpStatus.BAD_REQUEST,
      );

    const session = await this.connection.startSession();

    session.startTransaction();

    let result: any = {};

    try {
      langConfig.data = langConfig.data.filter((l) => l.key !== langKey);

      result = await langConfig.save();

      //   await this.websiteConfigModel.findOneAndRemove({
      //     type: DEFAULT_CONFIG_KEY,
      //     lang: langKey,
      //   });
      //   await this.websiteConfigModel.findOneAndRemove({
      //     type: DEFAULT_SLIDES_KEY,
      //     lang: langKey,
      //   });

      await session.commitTransaction();
    } catch (error) {
      console.log(error);
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
    return result;
  }
}
