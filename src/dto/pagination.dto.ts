import { Type } from 'class-transformer';
import { IsInt, IsNotEmpty, Min } from 'class-validator';

export class PaginationDto {
  @IsNotEmpty()
  @IsInt()
  @Type(() => Number)
  @Min(1)
  pageSize: number;

  @IsNotEmpty()
  @Type(() => Number)
  @Min(1)
  pageIndex: number;
}
