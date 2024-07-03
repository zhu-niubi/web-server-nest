import { PartialType } from '@nestjs/mapped-types';
import { CreatePageDto } from './create-page.dto';
export class UpdatePageDTO extends PartialType(CreatePageDto) {}
