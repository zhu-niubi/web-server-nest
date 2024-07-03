import { IsOptional } from 'class-validator';
import { PaginationDto } from 'src/dto/pagination.dto';

export class FindWebsiteConfigDto extends PaginationDto {
  /* 语言 */
  @IsOptional()
  lang: string;
}
