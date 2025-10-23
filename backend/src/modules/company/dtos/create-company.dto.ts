import {
  IsNotEmpty,
  IsString,
  IsOptional,
  Matches,
  Length,
  IsEnum,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { BrazilianStates } from '../../../common/enums';
import type { CNPJ, CEP } from '../../../common/types';

export class CreateCompanyDto {
  // Dados da empresa
  @IsNotEmpty({ message: 'Nome é obrigatório' })
  @IsString({ message: 'Nome deve ser um texto' })
  @Length(2, 100, { message: 'Nome deve ter entre 2 e 100 caracteres' })
  name: string;

  @IsNotEmpty({ message: 'CNPJ é obrigatório' })
  @IsString({ message: 'CNPJ deve ser um texto' })
  @Transform(({ value }) =>
    typeof value === 'string' ? value.replace(/[^\d]/g, '') : value,
  )
  @Matches(/^\d{14}$/, { message: 'CNPJ deve conter exatamente 14 dígitos' })
  cnpj: CNPJ;

  @IsNotEmpty({ message: 'Nome fantasia é obrigatório' })
  @IsString({ message: 'Nome fantasia deve ser um texto' })
  @Length(2, 100, {
    message: 'Nome fantasia deve ter entre 2 e 100 caracteres',
  })
  tradeName: string;

  // Dados do endereço
  @IsNotEmpty({ message: 'Rua é obrigatória' })
  @IsString({ message: 'Rua deve ser um texto' })
  @Length(2, 200, { message: 'Rua deve ter entre 2 e 200 caracteres' })
  street: string;

  @IsNotEmpty({ message: 'Número é obrigatório' })
  @IsString({ message: 'Número deve ser um texto' })
  @Matches(/^\d+$/, { message: 'Número deve conter apenas dígitos' })
  number: string;

  @IsNotEmpty({ message: 'Bairro é obrigatório' })
  @IsString({ message: 'Bairro deve ser um texto' })
  @Length(2, 100, { message: 'Bairro deve ter entre 2 e 100 caracteres' })
  district: string;

  @IsNotEmpty({ message: 'Cidade é obrigatória' })
  @IsString({ message: 'Cidade deve ser um texto' })
  @Length(2, 100, { message: 'Cidade deve ter entre 2 e 100 caracteres' })
  city: string;

  @IsNotEmpty({ message: 'Estado é obrigatório' })
  @IsEnum(BrazilianStates, {
    message: 'Estado deve ser uma sigla válida (ex: MG, SP, RJ)',
  })
  state: BrazilianStates;

  @IsNotEmpty({ message: 'CEP é obrigatório' })
  @IsString({ message: 'CEP deve ser um texto' })
  @Transform(({ value }) =>
    typeof value === 'string' ? value.replace(/[^\d]/g, '') : value,
  )
  @Matches(/^\d{8}$/, { message: 'CEP deve conter exatamente 8 dígitos' })
  postalCode: CEP;

  @IsOptional()
  @IsString({ message: 'Complemento deve ser um texto' })
  @Length(0, 100, { message: 'Complemento deve ter no máximo 100 caracteres' })
  complemento?: string;
}
