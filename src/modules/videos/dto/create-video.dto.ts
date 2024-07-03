import { IsArray, IsNotEmpty } from 'class-validator';
import { Prop } from '@nestjs/mongoose';
export class CreateVideoDto {
  @IsNotEmpty()
  @Prop({ required: true })
  title: string;

  @IsNotEmpty()
  @Prop({ default: [] })
  cover: string[];

  @Prop({ required: true })
  des: string;

  @IsNotEmpty()
  @Prop({ default: [] })
  uri: string[];

  @Prop({ default: null })
  typeId: number;

  @Prop({ default: 1 })
  status: number;
}
