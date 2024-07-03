import { IsNotEmpty, IsString } from 'class-validator';
export class GetOneWebsiteConfigDto {
  /* 语言 */
  @IsNotEmpty()
  @IsString()
  lang: string;
}
