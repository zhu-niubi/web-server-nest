import { IsNotEmpty } from 'class-validator';
enum TypeValue {
  SUCCESS = 0,
  ERROR = 1,
  RUNNING = 2,
}
export class CreateWebsiteConfigDTO {
  /* 类型 */
  @IsNotEmpty()
  type: TypeValue;

  /* 数据 */
  @IsNotEmpty()
  data: any;

  /* 语言 */
  @IsNotEmpty()
  lang: string;
}
