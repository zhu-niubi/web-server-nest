import { IsNotEmpty } from 'class-validator';

export class CreateNewLangDto {
  /* 语言关键字 */
  @IsNotEmpty()
  key: string;

  /* 语言名称 */
  @IsNotEmpty()
  name: string;
}
