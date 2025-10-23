import { Company, Address } from '@prisma/client';

export type ID = number;
export type CNPJ = string;
export type CEP = string;

export interface CompanyWithAddress extends Company {
  address: Address;
}
