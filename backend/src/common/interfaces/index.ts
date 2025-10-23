import { Company } from '@prisma/client';
import { CompanyWithAddress, ID } from '../types';
import { CreateCompanyDto } from '../../modules/company/dtos/create-company.dto';
import { UpdateCompanyDto } from '../../modules/company/dtos/update-company.dto';

export interface ICompanyService {
  create(data: CreateCompanyDto): Promise<CompanyWithAddress>;
  findAll(): Promise<CompanyWithAddress[]>;
  findOne(id: ID): Promise<CompanyWithAddress>;
  update(id: ID, data: UpdateCompanyDto): Promise<CompanyWithAddress>;
  remove(id: ID): Promise<CompanyWithAddress>;
  findByCnpj?(cnpj: string): Promise<Company | null>;
}

export interface IEmailService {
  sendNewCompanyNotification(company: Company): Promise<void>;
  sendEmail(
    to: string | string[],
    subject: string,
    content: string,
  ): Promise<void>;
}
