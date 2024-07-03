import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type TDKDocument = TDK & Document;

@Schema({ timestamps: true })
export class TDK {
  /* 页面名称:对应模板索引 */
  @Prop({ required: true })
  index: string;

  /* 标题 */
  @Prop({ required: true })
  title: string;

  /* 描述 */
  @Prop({ required: true })
  description: string;

  /* 关键字 */
  @Prop({ required: true })
  keywords: string[];
}

export const TDKSchema = SchemaFactory.createForClass(TDK);
