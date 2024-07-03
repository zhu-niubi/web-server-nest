import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

export type ArticleDocument = Article & Document;

@Schema({ timestamps: true })
export class Article {
  @Prop({ type: Types.ObjectId })
  id: Types.ObjectId;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true, type: Date })
  time: Date;

  @Prop({ required: true })
  author: string;

  @Prop({ required: true })
  content: string;

  @Prop({ required: true })
  cover: string;

  @Prop()
  digest: string;

  @Prop({ required: true })
  urlIndex: string;

  @Prop({ default: [] })
  relatedProducts: string[];

  @Prop({ default: [] })
  tags: string[];

  /* 语言 */
  @Prop({ default: 'cn' })
  lang: string;
}

export const ArticleSchema = SchemaFactory.createForClass(Article);
