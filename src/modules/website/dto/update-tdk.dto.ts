import { CreateTDKDto } from './create-tdk.dto';
import { PartialType } from '@nestjs/mapped-types';
export class UpdateTDKDto extends PartialType(CreateTDKDto) {}
