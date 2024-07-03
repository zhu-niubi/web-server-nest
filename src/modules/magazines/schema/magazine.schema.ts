import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

export type MagazineDocument = Magazine & Document;

@Schema({ timestamps: true })
export class Magazine {
  @Prop({ type: Types.ObjectId })
  id: Types.ObjectId;

  @Prop({ required: true })
  title: string;

  @Prop({ default: [] })
  cover: string[];
  @Prop({ required: true })
  des: string;
  @Prop({ default: [] })
  pages: string[];
  @Prop({ default: 1 })
  status: number;
}
export const MagezineSchema = SchemaFactory.createForClass(Magazine);
