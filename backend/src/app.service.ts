import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHealthCheck(): object {
    return {
      status: 'ok',
      message: 'GestorPro API está funcionando!',
      timestamp: new Date().toISOString(),
      version: '1.0.0',
      uptime: process.uptime(),
    };
  }
}
