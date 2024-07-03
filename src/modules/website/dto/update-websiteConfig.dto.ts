import { PartialType } from '@nestjs/mapped-types';
import { CreateWebsiteConfigDTO } from './create-websiteConfig.dto';

export class UpdateWebsiteConfigDTO extends PartialType(
  CreateWebsiteConfigDTO,
) {}
