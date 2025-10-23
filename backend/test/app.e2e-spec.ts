import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from './../src/app.module';
import { HttpExceptionFilter } from '../src/common/filters/http-exception.filter';
import setupRoutes from '../src/routes';

describe('AppController', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    // Configurações iguais ao main.ts
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );
    app.useGlobalFilters(new HttpExceptionFilter());
    app.enableCors();

    setupRoutes(app);

    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('Health Check', () => {
    it('/health (GET)', () => {
      return request(app.getHttpServer())
        .get('/health')
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('status', 'ok');
          expect(res.body).toHaveProperty('timestamp');
          expect(res.body).toHaveProperty('uptime');
        });
    });
  });

  describe('Root Routes', () => {
    it('/ (GET) deve redirecionar para /manager', () => {
      return request(app.getHttpServer())
        .get('/')
        .expect(302)
        .expect('Location', '/manager');
    });

    it('/api (GET) deve retornar a documentação da API', () => {
      return request(app.getHttpServer())
        .get('/api')
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('name', 'GestorPro API');
          expect(res.body).toHaveProperty('endpoints');
        });
    });
  });

  describe('Company API Endpoints', () => {
    it('GET /companies deve retornar um array', () => {
      return request(app.getHttpServer())
        .get('/companies')
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
        });
    });

    it('POST /companies deve validar campos obrigatórios', () => {
      const invalidData = { name: 'Apenas nome' };

      return request(app.getHttpServer())
        .post('/companies')
        .send(invalidData)
        .expect(400)
        .expect((res) => {
          expect(res.body).toHaveProperty('statusCode', 400);
        });
    });

    it('GET /companies/invalid-id deve retornar 400', () => {
      return request(app.getHttpServer())
        .get('/companies/invalid-id')
        .expect(400);
    });

    it('GET /companies/99999 deve retornar 404', () => {
      return request(app.getHttpServer()).get('/companies/99999').expect(404);
    });
  });

  describe('Error Handling', () => {
    it('Deve retornar 400 ao enviar dados inválidos', () => {
      return request(app.getHttpServer())
        .post('/companies')
        .send({})
        .expect(400)
        .expect((res) => {
          expect(res.body).toHaveProperty('statusCode', 400);
          expect(res.body).toHaveProperty('timestamp');
          expect(res.body).toHaveProperty('path', '/companies');
        });
    });

    it('deve retornar 404 ao buscar empresa inexistente', () => {
      return request(app.getHttpServer())
        .get('/companies/999999')
        .expect(404)
        .expect((res) => {
          expect(res.body).toHaveProperty('statusCode', 404);
          expect(res.body).toHaveProperty('timestamp');
          expect(res.body).toHaveProperty('path', '/companies/999999');
        });
    });
  });
});
