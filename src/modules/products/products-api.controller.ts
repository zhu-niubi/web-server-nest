import { UpdateProductTypeDTO } from './dto/update-productType.dto';
import { PaginationDto } from './../../dto/pagination.dto';
import { CreateProductDto } from './dto/create-product.dto';
import { ArticlesService } from 'src/modules/article/article.service';
import { GlobalService } from './../../global/global.service';
import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Query,
  Patch,
  UseInterceptors,
  Delete,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { UpdateProductDto } from './dto/udpate-product.dto';
import { TransformInterceptor } from '../../interceptors/transform.interceptor';
import { ParseObjectIdPipe } from 'src/pipes/objectIdParser.pipe';
import { CreateProductTypeDTO } from './dto/create-productType.dto';
import { Roles } from 'src/decorators/roles.decoartor';
import { Role } from '../auth/role.enum';
import { Public } from '../../decorators/public.decorator';

/**
 * Products
 * 产品
 */
@Controller('api/products')
@UseInterceptors(TransformInterceptor)
export class ProductsAPIController {
  constructor(private readonly productsService: ProductsService) {}

  /* 新增产品 */
  @Post()
  createProduct(@Body() body: CreateProductDto) {
    return this.productsService.createProduct(body);
  }

  /* 查询全部 */
  // @Roles(Role.User)
  @Get()
  @Public()
  async findAll(
    @Query() query: PaginationDto,
    @Query('filter') filter: string,
    @Query('lang') lang: string,
  ) {
    const result = await this.productsService.findAllProductsByPatination({
      pagination: query,
      filter,
      lang,
    });
    return result;
  }

  /* 查询单个 */
  @Get(':id')
  @Public()
  async findOne(@Param('id', ParseObjectIdPipe) id) {
    const result = await this.productsService.findOneProduct(id);
    return result;
  }

  /* 更新单个 */
  @Patch(':id')
  async updateOne(
    @Param('id', ParseObjectIdPipe) id, // 校验 mongoose.Types.ObjectId 的pipe
    @Body() body: UpdateProductDto,
  ) {
    return this.productsService.updateOneProduct(id, body);
  }

  /* 删除单个 */
  @Delete(':id')
  async deleteOne(@Param('id', ParseObjectIdPipe) id) {
    return this.productsService.deleteOneProduct(id);
  }
}

/**
 * productType
 * 产品类型
 */
@Controller('api/productType')
@UseInterceptors(TransformInterceptor)
export class ProductsTypeAPIController {
  constructor(
    private readonly productsService: ProductsService,
    private readonly globalService: GlobalService,
    private readonly articleService: ArticlesService,
  ) {}

  /* 创建产品类型 */
  @Post()
  createType(@Body() body: CreateProductTypeDTO) {
    const newData: any = body;
    if (body.parentProductTypeName)
      newData.parentProductType = { name: body.parentProductTypeName };
    delete newData.parentProductTypeName;
    return this.productsService.createProductType(newData);
  }

  /* 查询全部 */
  @Get()
  @Public()
  async findAll(@Query() query: PaginationDto, @Query('lang') lang: string) {
    const result = await this.productsService.findAllProductTypeByPagination({
      pagination: { pageIndex: query.pageIndex, pageSize: query.pageSize },
      lang,
    });
    console.log(result);
    return result;
  }

  /* 获取父产品类型 */
  @Get('parentType')
  async getAllParentProductTypes() {
    return this.productsService.getAllParentProductTypes();
  }

  /* 获取父产品类型 */
  @Get('rootType')
  async getAllRootProductTypes(@Query() query) {
    return this.productsService.getAllRootProductTypes({ lang: query.lang });
  }

  /* 查询单个 */
  @Get(':id')
  @Public()
  async findOne(@Param('id', ParseObjectIdPipe) id) {
    const result = await this.productsService.findOneProductType(id);
    return result;
  }

  /* 更新单个 */
  @Patch(':id')
  async updateOne(
    @Param('id', ParseObjectIdPipe) id, // 校验 mongoose.Types.ObjectId 的pipe
    @Body() body: UpdateProductTypeDTO,
  ) {
    const newData: any = body;
    if (body.parentProductTypeName === '')
      newData.$unset = { parentProductType: 1 };
    else if (body.parentProductTypeName)
      newData.parentProductType = { name: body.parentProductTypeName };

    delete newData.parentProductTypeName;
    return this.productsService.updateOneProductType(id, body);
  }

  /* 删除单个 */
  @Delete(':id')
  async deleteOne(@Param('id', ParseObjectIdPipe) id) {
    return this.productsService.deleteOneProductType(id);
  }
}
