import { IsArray, IsNotEmpty } from 'class-validator';
import { Prop } from '@nestjs/mongoose';
export class CreateMagazineDto {
  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  cover: string[];
  @Prop({ required: true })
  des: string;
  @IsNotEmpty()
  pages: string[];
  @Prop({ default: 1 })
  status: number;
}
