import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type PageDocument = Page & Document;

@Schema({ timestamps: true })
export class Page {
  _id: string;
  /* 名称 */
  @Prop({ required: true })
  name: string;

  /* 组名 */
  @Prop()
  group: string;

  /* 标题 */
  @Prop({ required: true })
  title: string;

  /* 内容 */
  @Prop({ required: true })
  content: string;

  /* 路径索引 */
  @Prop({ required: true })
  urlIndex: string;

  /* 标签 */
  @Prop({ default: [] })
  tags: string[];

  /* 封面 */
  @Prop({})
  cover: string;

  /* 语言 */
  @Prop({ default: 'cn' })
  lang: string;

  createdAt: Date;

  updatedAt: Date;
}

export const PageSchema = SchemaFactory.createForClass(Page);
