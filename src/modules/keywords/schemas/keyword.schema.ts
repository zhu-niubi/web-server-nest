import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type KeywordDocument = Keyword & Document;

@Schema({ timestamps: true })
export class Keyword {
  /* 名称 */
  @Prop({ required: true })
  title: string;

  /* 类型 */
  @Prop({ required: true })
  type: string;

  /* 语言 */
  @Prop({ required: true })
  lang: string;
}

export const KeywordSchema = SchemaFactory.createForClass(Keyword);
