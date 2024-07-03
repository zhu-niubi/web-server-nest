import { IsNotEmpty } from 'class-validator';
export class CreateTagDto {
  /* 名称 */
  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  type: string;

  @IsNotEmpty()
  lang: string;
}
