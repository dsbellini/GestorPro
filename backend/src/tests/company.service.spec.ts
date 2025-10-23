import { Test, TestingModule } from '@nestjs/testing';
import { CompanyService } from '../modules/company/services/company.service';
import { PrismaService } from '../prisma/prisma.service';
import { EmailService } from '../common/utils/email.service';
import { CreateCompanyDto } from '../modules/company/dtos/create-company.dto';
import { UpdateCompanyDto } from '../modules/company/dtos/update-company.dto';
import { BrazilianStates } from '../common/enums';
import {
  NotFoundException,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';

describe('CompanyService', () => {
  let service: CompanyService;
  let prisma: PrismaService;
  let emailService: EmailService;

  const mockPrisma = {
    company: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  };

  const mockEmailService = {
    sendNewCompanyNotification: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CompanyService,
        { provide: PrismaService, useValue: mockPrisma },
        { provide: EmailService, useValue: mockEmailService },
      ],
    }).compile();

    service = module.get<CompanyService>(CompanyService);
    prisma = module.get<PrismaService>(PrismaService);
    emailService = module.get<EmailService>(EmailService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('Deve criar uma empresa com sucesso', async () => {
      const dto: CreateCompanyDto = {
        name: 'Empresa X',
        cnpj: '12345678000199',
        tradeName: 'Emp X',
        street: 'Rua A',
        number: '10',
        district: 'Bairro',
        city: 'Cidade',
        state: BrazilianStates.MG,
        postalCode: '00000000',
        complemento: 'Sala 1',
      };

      const companyMock = {
        id: 1,
        name: dto.name,
        cnpj: dto.cnpj,
        tradeName: dto.tradeName,
        addressId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
        address: {
          id: 1,
          street: dto.street,
          number: dto.number,
          district: dto.district,
          city: dto.city,
          state: dto.state,
          postalCode: dto.postalCode,
          complemento: dto.complemento,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      };

      mockPrisma.company.findUnique.mockResolvedValue(null);
      mockPrisma.company.create.mockResolvedValue(companyMock);

      const result = await service.create(dto);
      expect(result).toEqual(companyMock);
      expect(mockEmailService.sendNewCompanyNotification).toHaveBeenCalledWith(
        companyMock,
      );
    });

    it('Deve lançar BadRequestException se CNPJ já existe', async () => {
      const dto: CreateCompanyDto = {
        name: 'Empresa X',
        cnpj: '12345678000199',
        tradeName: 'Emp X',
        street: 'Rua A',
        number: '10',
        district: 'Bairro',
        city: 'Cidade',
        state: BrazilianStates.MG,
        postalCode: '00000000',
      };

      mockPrisma.company.findUnique.mockResolvedValue({
        id: 1,
        cnpj: dto.cnpj,
      });

      await expect(service.create(dto)).rejects.toThrow(BadRequestException);
    });

    it('Deve lançar InternalServerErrorException em erro genérico', async () => {
      const dto: CreateCompanyDto = {
        name: 'Empresa X',
        cnpj: '12345678000199',
        tradeName: 'Emp X',
        street: 'Rua A',
        number: '10',
        district: 'Bairro',
        city: 'Cidade',
        state: BrazilianStates.MG,
        postalCode: '00000000',
      };

      mockPrisma.company.findUnique.mockResolvedValue(null);
      mockPrisma.company.create.mockRejectedValue(new Error('Database error'));

      await expect(service.create(dto)).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });

  describe('findAll', () => {
    it('Deve retornar todas as empresas', async () => {
      const companies = [
        { id: 1, name: 'Empresa 1', address: {} },
        { id: 2, name: 'Empresa 2', address: {} },
      ];

      mockPrisma.company.findMany.mockResolvedValue(companies);

      const result = await service.findAll();
      expect(result).toEqual(companies);
      expect(mockPrisma.company.findMany).toHaveBeenCalledWith({
        include: { address: true },
      });
    });

    it('Deve lançar InternalServerErrorException em erro', async () => {
      mockPrisma.company.findMany.mockRejectedValue(
        new Error('Database error'),
      );

      await expect(service.findAll()).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });

  describe('findOne', () => {
    it('Deve retornar uma empresa por ID', async () => {
      const company = { id: 1, name: 'Empresa X', address: {} };

      mockPrisma.company.findUnique.mockResolvedValue(company);

      const result = await service.findOne(1);
      expect(result).toEqual(company);
    });

    it('Deve lançar NotFoundException se empresa não existe', async () => {
      mockPrisma.company.findUnique.mockResolvedValue(null);

      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
    });

    it('Deve lançar InternalServerErrorException em erro genérico', async () => {
      mockPrisma.company.findUnique.mockRejectedValue(
        new Error('Database error'),
      );

      await expect(service.findOne(1)).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });

  describe('update', () => {
    it('Deve atualizar o nome de uma empresa', async () => {
      const updateDto: UpdateCompanyDto = { name: 'Novo Nome' };
      const companyExisting = {
        id: 1,
        name: 'Empresa X',
        tradeName: 'Emp X',
        cnpj: '12345678000199',
        address: { id: 1 },
      };

      mockPrisma.company.findUnique.mockResolvedValue(companyExisting);
      mockPrisma.company.update.mockResolvedValue({
        ...companyExisting,
        name: updateDto.name,
      });

      const result = await service.update(1, updateDto);
      expect(result.name).toBe('Novo Nome');
    });

    it('Deve atualizar o endereço de uma empresa', async () => {
      const updateDto: UpdateCompanyDto = {
        street: 'Rua B',
        city: 'Outra Cidade',
      };
      const companyExisting = {
        id: 1,
        name: 'Empresa X',
        tradeName: 'Emp X',
        address: {
          id: 1,
          street: 'Rua A',
          city: 'Cidade',
          state: 'ST',
          postalCode: '00000-000',
          number: '10',
          district: 'Bairro',
          complemento: '',
        },
      };

      mockPrisma.company.findUnique.mockResolvedValue(companyExisting);
      mockPrisma.company.update.mockResolvedValue({
        ...companyExisting,
        address: { ...companyExisting.address, ...updateDto },
      });

      const result = await service.update(1, updateDto);
      expect(result.address.street).toBe('Rua B');
    });

    it('Deve lançar NotFoundException ao atualizar se a empresa não existir', async () => {
      mockPrisma.company.findUnique.mockResolvedValue(null);

      await expect(service.update(1, { name: 'Novo Nome' })).rejects.toThrow(
        NotFoundException,
      );
    });

    it('Deve lançar InternalServerErrorException em erro genérico', async () => {
      const companyExisting = {
        id: 1,
        name: 'Empresa X',
        address: { id: 1 },
      };

      mockPrisma.company.findUnique.mockResolvedValue(companyExisting);
      mockPrisma.company.update.mockRejectedValue(new Error('Database error'));

      await expect(service.update(1, { name: 'Novo Nome' })).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });

  describe('remove', () => {
    it('Deve remover uma empresa', async () => {
      const companyMock = { id: 1, name: 'Empresa X', address: { id: 1 } };
      mockPrisma.company.findUnique.mockResolvedValue(companyMock);
      mockPrisma.company.delete.mockResolvedValue(companyMock);

      const result = await service.remove(1);
      expect(result).toEqual(companyMock);
    });

    it('Deve lançar NotFoundException ao remover se a empresa não existir', async () => {
      mockPrisma.company.findUnique.mockResolvedValue(null);

      await expect(service.remove(1)).rejects.toThrow(NotFoundException);
    });

    it('Deve lançar InternalServerErrorException em erro genérico', async () => {
      const companyMock = { id: 1, name: 'Empresa X' };
      mockPrisma.company.findUnique.mockResolvedValue(companyMock);
      mockPrisma.company.delete.mockRejectedValue(new Error('Database error'));

      await expect(service.remove(1)).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });
});
