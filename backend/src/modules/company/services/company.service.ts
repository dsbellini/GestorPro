import {
  Injectable,
  NotFoundException,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { CreateCompanyDto } from '../dtos/create-company.dto';
import { UpdateCompanyDto } from '../dtos/update-company.dto';
import { EmailService } from '../../../common/utils/email.service';
import type { ICompanyService } from '../../../common/interfaces';
import type { CompanyWithAddress, ID } from '../../../common/types';

@Injectable()
export class CompanyService implements ICompanyService {
  constructor(
    private prisma: PrismaService,
    private emailService: EmailService,
  ) {}

  async create(
    createCompanyDto: CreateCompanyDto,
  ): Promise<CompanyWithAddress> {
    try {
      const existingCompany = await this.prisma.company.findUnique({
        where: { cnpj: createCompanyDto.cnpj },
      });

      if (existingCompany)
        throw new BadRequestException(
          `CNPJ ${createCompanyDto.cnpj} já cadastrado`,
        );

      const company = await this.prisma.company.create({
        data: {
          name: createCompanyDto.name,
          cnpj: createCompanyDto.cnpj,
          tradeName: createCompanyDto.tradeName,
          address: {
            create: {
              street: createCompanyDto.street,
              number: createCompanyDto.number,
              district: createCompanyDto.district,
              city: createCompanyDto.city,
              state: createCompanyDto.state,
              postalCode: createCompanyDto.postalCode,
              complemento: createCompanyDto.complemento,
            },
          },
        },
        include: { address: true },
      });

      await this.emailService.sendNewCompanyNotification(company);

      return company;
    } catch (error) {
      if (error instanceof BadRequestException) throw error;
      throw new InternalServerErrorException('Erro ao criar empresa');
    }
  }

  async findAll(): Promise<CompanyWithAddress[]> {
    try {
      const companies = await this.prisma.company.findMany({
        include: { address: true },
      });

      return companies;
    } catch (error) {
      throw new InternalServerErrorException('Erro ao buscar empresas');
    }
  }

  async findOne(id: ID): Promise<CompanyWithAddress> {
    try {
      const company = await this.prisma.company.findUnique({
        where: { id },
        include: { address: true },
      });
      if (!company) throw new NotFoundException('Empresa não encontrada');
      return company;
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Erro ao buscar empresa');
    }
  }

  async update(
    id: ID,
    updateCompanyDto: UpdateCompanyDto,
  ): Promise<CompanyWithAddress> {
    try {
      const existingCompany = await this.prisma.company.findUnique({
        where: { id },
        include: { address: true },
      });

      if (!existingCompany)
        throw new NotFoundException(`Empresa não encontrada`);

      const {
        name,
        tradeName,
        street,
        number,
        district,
        city,
        state,
        postalCode,
        complemento,
      } = updateCompanyDto;

      const companyData = {
        ...(name && { name }),
        ...(tradeName && { tradeName }),
      };

      const addressData = {
        ...(street && { street }),
        ...(number && { number }),
        ...(district && { district }),
        ...(city && { city }),
        ...(state && { state }),
        ...(postalCode && { postalCode }),
        ...(complemento !== undefined && { complemento }),
      };

      const updatedCompany = await this.prisma.company.update({
        where: { id },
        data: {
          ...companyData,
          address: { update: addressData },
        },
        include: { address: true },
      });

      return updatedCompany;
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Erro ao atualizar empresa');
    }
  }

  async remove(id: ID): Promise<CompanyWithAddress> {
    try {
      const existingCompany = await this.prisma.company.findUnique({
        where: { id },
      });

      if (!existingCompany)
        throw new NotFoundException(`Empresa não encontrada`);

      return await this.prisma.company.delete({
        where: { id },
        include: { address: true },
      });
    } catch (error: any) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Erro ao remover empresa');
    }
  }
}
