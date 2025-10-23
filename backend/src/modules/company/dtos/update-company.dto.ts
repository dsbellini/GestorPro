import { PartialType, OmitType } from '@nestjs/mapped-types';
import { CreateCompanyDto } from './create-company.dto';

// Remove o CNPJ do DTO de update pois não pode ser alterado
export class UpdateCompanyDto extends PartialType(
  OmitType(CreateCompanyDto, ['cnpj'] as const),
) {}
