import { IsArray, IsDateString, IsNotEmpty } from 'class-validator';

export class CreateArticleDto {
  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  @IsDateString()
  time: string;

  @IsNotEmpty()
  author: string;

  @IsNotEmpty()
  content: string;

  @IsNotEmpty()
  cover: string;

  digest: string;

  @IsNotEmpty()
  urlIndex: string;

  @IsNotEmpty()
  @IsArray()
  relatedProducts: string[];

  @IsNotEmpty()
  tags: string[];

  /* 语言 */
  @IsNotEmpty()
  lang: string;
}
