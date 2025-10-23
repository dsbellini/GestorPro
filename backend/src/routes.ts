import { INestApplication } from '@nestjs/common';

export function setupRoutes(app: INestApplication) {
  const httpAdapter = app.getHttpAdapter();

  httpAdapter.get('/health', (_req, res) => {
    res.status(200).json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    });
  });

  // API info - documentação das rotas disponíveis
  httpAdapter.get('/api', (_req, res) => {
    res.status(200).json({
      name: 'GestorPro API',
      version: '1.0.0',
      endpoints: {
        companies: {
          list: 'GET /companies',
          create: 'POST /companies',
          get: 'GET /companies/:id',
          update: 'PUT /companies/:id',
          delete: 'DELETE /companies/:id',
        },
        health: 'GET /health',
        info: 'GET /api',
      },
      frontend: {
        home: 'GET /',
        manager: 'GET /manager',
      },
    });
  });

  httpAdapter.get('/', (_req, res) => {
    res.redirect(302, '/manager');
  });
}

export default setupRoutes;
