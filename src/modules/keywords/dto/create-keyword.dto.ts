import { IsNotEmpty } from 'class-validator';

export class CreateKeywordDto {
  /* 名称 */
  @IsNotEmpty()
  title: string;

  /* 类型 */
  @IsNotEmpty()
  type: string;

  /* 语言 */
  @IsNotEmpty()
  lang: string;
}
