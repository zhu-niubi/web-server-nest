import { PartialType } from '@nestjs/mapped-types';

import { CreateProductTypeDTO } from './create-productType.dto';

export class UpdateProductTypeDTO extends PartialType(CreateProductTypeDTO) {}
