import { execSync } from 'child_process';
import * as dotenv from 'dotenv';
import { join } from 'path';

dotenv.config({ path: join(__dirname, '..', '.env.test') });

beforeAll(async () => {
  // Cria o banco de dados de teste se não existir
  try {
    console.log('Configurando banco de dados de teste...');

    // Executa as migrações para o banco de teste
    execSync('npx prisma migrate deploy', {
      stdio: 'inherit',
      env: { ...process.env, DATABASE_URL: process.env.DATABASE_URL },
    });

    console.log('Banco de dados de teste configurado');
  } catch (error) {
    console.error('Erro ao configurar banco de teste:', error);
    throw error;
  }
});

afterAll(async () => {
  console.log('Limpando recursos de teste...');
});
