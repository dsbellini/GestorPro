import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../app.module';
import { AppController } from '../app.controller';
import { AppService } from '../app.service';

describe('AppModule', () => {
  let module: TestingModule;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
  });

  it('Deve ter AppController registrado', () => {
    const controller = module.get<AppController>(AppController);
    expect(controller).toBeDefined();
  });

  it('Deve ter AppService registrado', () => {
    const service = module.get<AppService>(AppService);
    expect(service).toBeDefined();
  });
});
