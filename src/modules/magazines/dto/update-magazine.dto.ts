import { PartialType } from '@nestjs/mapped-types';
import { CreateMagazineDto } from './create-magazine.dto';

export class UpdateMagazineDto extends PartialType(CreateMagazineDto) {}
