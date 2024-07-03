import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Schema as S } from 'mongoose';

export type ProductTypeDocument = ProductType & Document;

@Schema({ timestamps: true })
class ParentProductType {
  /* 名称 */
  @Prop({ required: true })
  name: string;
}

@Schema({ timestamps: true })
export class ProductType {
  _id: string;

  /* 名称 */
  @Prop({ required: true })
  name: string;

  /* 描述 */
  @Prop({ required: true })
  descriptions: string;

  /* 关键字 */
  @Prop({ required: true })
  key: string;

  /* 图片 */
  @Prop({ required: true })
  image: string[];

  /* 语言 */
  @Prop({ default: 'cn' })
  lang: string;

  /* 描述富文本 */
  @Prop({ default: {}, type: S.Types.Mixed })
  descriptionContent: any;

  /* 父产品类型 */
  @Prop({ type: ParentProductType })
  parentProductType: ParentProductType;
}

export const ProductTypeSchema = SchemaFactory.createForClass(ProductType);
