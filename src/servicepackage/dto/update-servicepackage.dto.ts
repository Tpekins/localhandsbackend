import { PartialType } from '@nestjs/mapped-types';
import { CreateServicepackageDto } from './create-servicepackage.dto';

export class UpdateServicepackageDto extends PartialType(
  CreateServicepackageDto,
) {}
