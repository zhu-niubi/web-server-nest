import { IsArray, IsNotEmpty } from 'class-validator';
export class CreateTDKDto {
  /* 页面名称:对应模板索引 */
  @IsNotEmpty()
  index: string;

  /* 标题 */
  @IsNotEmpty()
  title: string;

  /* 描述 */
  @IsNotEmpty()
  description: string;

  /* 关键字 */
  @IsNotEmpty()
  @IsArray()
  keywords: string[];
}
