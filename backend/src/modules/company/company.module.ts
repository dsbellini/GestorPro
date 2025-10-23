import { Module } from '@nestjs/common';
import { CompanyService } from './services/company.service';
import { CompanyController } from './controllers/company.controller';
import { PrismaModule } from '../../prisma/prisma.module';
import { EmailService } from '../../common/utils/email.service';

@Module({
  imports: [PrismaModule],
  controllers: [CompanyController],
  providers: [CompanyService, EmailService],
})
export class CompanyModule {}
