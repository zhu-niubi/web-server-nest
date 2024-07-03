import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type TagDocument = Tag & Document;

@Schema({ timestamps: true })
export class Tag {
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

export const TagSchema = SchemaFactory.createForClass(Tag);
