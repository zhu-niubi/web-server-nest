import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
export type VideoDocument = Video & Document;
@Schema({ timestamps: true })
export class Video {
  @Prop({ type: Types.ObjectId })
  id: Types.ObjectId;

  @Prop({ required: true })
  title: string;

  @Prop({ default: [] })
  cover: string[];
  @Prop({ required: true })
  des: string;
  @Prop({ default: 0 })
  typeId: number;
  @Prop({ default: [] })
  uri: string[];
  @Prop({ default: 1 })
  status: number;
}
export const VideoSchema = SchemaFactory.createForClass(Video);
