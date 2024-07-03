import { IsArray, IsBoolean, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateProductDto {
  /* 名称 */
  @IsNotEmpty()
  name: string;

  /* 图片 */
  @IsNotEmpty()
  @IsArray()
  image: string[];

  /* 内容 */
  @IsNotEmpty()
  content: string;

  /* 路径索引 */
  @IsNotEmpty()
  urlIndex: string;

  /* 标签 */
  @IsNotEmpty()
  @IsArray()
  tags: string[];

  /* 类型 */
  @IsNotEmpty()
  type: string;

  /* 语言 */
  @IsNotEmpty()
  lang: string;

  @IsOptional()
  @IsBoolean()
  disabled: boolean;
}
