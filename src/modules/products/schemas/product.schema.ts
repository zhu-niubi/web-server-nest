import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Schema as S } from 'mongoose';
import { ProductType, ProductTypeSchema } from './productType.schema';

export type ProductDocument = Product & Document;

@Schema({ timestamps: true })
export class Product {
  _id: string;
  /* 名称 */
  @Prop({ required: true })
  name: string;

  /* 图片 */
  @Prop({ required: true })
  image: string[];

  /* 内容 */
  @Prop({ required: true })
  content: string;

  /* 路径索引 */
  @Prop({ required: true })
  urlIndex: string;

  /* 标签 */
  @Prop({ default: [] })
  tags: string[];

  /* 类型 */
  @Prop({ required: true, type: S.Types.ObjectId, ref: ProductType.name })
  type: string;

  /* 语言 */
  @Prop({ default: 'cn' })
  lang: string;

  /* 隐藏 */
  @Prop({ default: false })
  disabled: boolean;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
