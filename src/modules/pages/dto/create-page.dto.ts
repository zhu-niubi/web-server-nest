import { IsArray, IsNotEmpty, IsOptional } from 'class-validator';
export class CreatePageDto {
  /* 名称 */
  @IsNotEmpty()
  name: string;

  /* 组名 */
  @IsOptional()
  group: string;

  /* 内容 */
  @IsNotEmpty()
  content: string;

  /* 路径索引 */
  @IsNotEmpty()
  urlIndex: string;

  /* 标题 */
  title: string;

  /* 标签 */
  @IsArray()
  tags: string[];

  /* 封面 */
  cover: string;
}
