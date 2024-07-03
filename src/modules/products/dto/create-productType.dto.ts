import { IsArray, IsNotEmpty, IsObject } from 'class-validator';

export class CreateProductTypeDTO {
  /* 名称 */
  @IsNotEmpty()
  name: string;

  /* 描述 */
  @IsNotEmpty()
  descriptions: string;

  /* 关键字 */
  @IsNotEmpty()
  key: string;

  /* 图片 */
  @IsArray()
  @IsNotEmpty()
  image: string[];

  /* 语言 */
  @IsNotEmpty()
  lang: string;

  /* 描述富文本 */
  @IsObject()
  descriptionContent: any;

  /* 父产品类型 */

  parentProductTypeName: string;
}
