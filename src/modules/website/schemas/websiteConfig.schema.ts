import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Schema as S } from 'mongoose';

export type WebsiteConfigDocument = WebsiteConfig & Document;

@Schema({ timestamps: true })
export class WebsiteConfig {
  /* 类型 */
  @Prop({ required: true, enum: ['config', 'slides', 'lang'] })
  type: string;

  /* 数据 */
  @Prop({ required: false, type: S.Types.Mixed })
  data: any;

  /* 语言 */
  @Prop({})
  lang: string;
}

export const WebsiteConfigSchema = SchemaFactory.createForClass(WebsiteConfig);
