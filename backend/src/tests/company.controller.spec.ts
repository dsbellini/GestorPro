import { Test, TestingModule } from '@nestjs/testing';
import { CompanyController } from '../modules/company/controllers/company.controller';
import { CompanyService } from '../modules/company/services/company.service';
import { CreateCompanyDto } from '../modules/company/dtos/create-company.dto';
import { UpdateCompanyDto } from '../modules/company/dtos/update-company.dto';
import { BrazilianStates } from '../common/enums';

describe('CompanyController', () => {
  let controller: CompanyController;
  let service: CompanyService;

  const mockCompanyService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CompanyController],
      providers: [
        {
          provide: CompanyService,
          useValue: mockCompanyService,
        },
      ],
    }).compile();

    controller = module.get<CompanyController>(CompanyController);
    service = module.get<CompanyService>(CompanyService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('Deve criar uma empresa', async () => {
      const dto: CreateCompanyDto = {
        name: 'Empresa X',
        cnpj: '12345678000199',
        tradeName: 'Emp X',
        street: 'Rua A',
        number: '10',
        district: 'Bairro',
        city: 'Cidade',
        state: BrazilianStates.MG,
        postalCode: '00000-000',
      };

      const result = { id: 1, ...dto, address: {} };
      mockCompanyService.create.mockResolvedValue(result);

      expect(await controller.create(dto)).toEqual(result);
      expect(mockCompanyService.create).toHaveBeenCalledWith(dto);
    });
  });

  describe('findAll', () => {
    it('Deve retornar todas as empresas', async () => {
      const result = [
        { id: 1, name: 'Empresa 1' },
        { id: 2, name: 'Empresa 2' },
        { id: 3, name: 'Empresa 3' },
        { id: 4, name: 'Empresa 4' },
      ];
      mockCompanyService.findAll.mockResolvedValue(result);

      expect(await controller.findAll()).toEqual(result);
      expect(mockCompanyService.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('Deve retornar uma empresa por ID', async () => {
      const result = { id: 1, name: 'Empresa X' };
      mockCompanyService.findOne.mockResolvedValue(result);

      expect(await controller.findOne(1)).toEqual(result);
      expect(mockCompanyService.findOne).toHaveBeenCalledWith(1);
    });
  });

  describe('update', () => {
    it('Deve atualizar uma empresa', async () => {
      const updateDto: UpdateCompanyDto = { name: 'Novo Nome' };
      const result = { id: 1, name: 'Novo Nome' };
      mockCompanyService.update.mockResolvedValue(result);

      expect(await controller.update(1, updateDto)).toEqual(result);
      expect(mockCompanyService.update).toHaveBeenCalledWith(1, updateDto);
    });

    it('Deve filtrar valores undefined do DTO', async () => {
      const updateDto: UpdateCompanyDto = {
        name: 'Novo Nome',
        tradeName: undefined,
        street: '',
      };
      const result = { id: 1, name: 'Novo Nome' };
      mockCompanyService.update.mockResolvedValue(result);

      await controller.update(1, updateDto);
      expect(mockCompanyService.update).toHaveBeenCalledWith(1, {
        name: 'Novo Nome',
      });
    });
  });

  describe('remove', () => {
    it('Deve remover uma empresa', async () => {
      const result = { id: 1, name: 'Empresa X' };
      mockCompanyService.remove.mockResolvedValue(result);

      expect(await controller.remove(1)).toEqual(result);
      expect(mockCompanyService.remove).toHaveBeenCalledWith(1);
    });
  });
});
