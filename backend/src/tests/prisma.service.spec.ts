import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../prisma/prisma.service';

describe('PrismaService', () => {
  let service: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PrismaService],
    }).compile();

    service = module.get<PrismaService>(PrismaService);
  });

  describe('onModuleInit', () => {
    it('Deve conectar ao banco de dados', async () => {
      const consoleSpy = jest.spyOn(console, 'log');
      service.$connect = jest.fn().mockResolvedValue(undefined);

      await service.onModuleInit();

      expect(service.$connect).toHaveBeenCalled();
      expect(consoleSpy).toHaveBeenCalledWith(
        'Prisma connected to the database',
      );

      consoleSpy.mockRestore();
    });
  });

  describe('onModuleDestroy', () => {
    it('Deve desconectar do banco de dados', async () => {
      const consoleSpy = jest.spyOn(console, 'log');
      service.$disconnect = jest.fn().mockResolvedValue(undefined);

      await service.onModuleDestroy();

      expect(service.$disconnect).toHaveBeenCalled();
      expect(consoleSpy).toHaveBeenCalledWith(
        'Prisma disconnected from the database',
      );

      consoleSpy.mockRestore();
    });
  });
});
