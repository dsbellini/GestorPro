import { Test, TestingModule } from '@nestjs/testing';
import { EmailService } from '../common/utils/email.service';
import { InternalServerErrorException } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

jest.mock('nodemailer', () => ({
  createTransport: jest.fn(),
}));

describe('EmailService', () => {
  let service: EmailService;
  let mockTransporter: any;

  beforeEach(async () => {
    process.env.SMTP_HOST = 'smtp.test.com';
    process.env.SMTP_USER = 'test@test.com';
    process.env.SMTP_PASS = 'testpass';
    process.env.NOTIFY_EMAILS = 'notify@test.com';

    mockTransporter = {
      sendMail: jest.fn(),
    };

    const mockCreateTransporter =
      nodemailer.createTransport as jest.MockedFunction<
        typeof nodemailer.createTransport
      >;
    mockCreateTransporter.mockReturnValue(mockTransporter);

    const module: TestingModule = await Test.createTestingModule({
      providers: [EmailService],
    }).compile();

    service = module.get<EmailService>(EmailService);
  });

  afterEach(() => {
    jest.clearAllMocks();
    delete process.env.SMTP_HOST;
    delete process.env.SMTP_USER;
    delete process.env.SMTP_PASS;
    delete process.env.NOTIFY_EMAILS;
  });

  describe('Envia e-mail de notificação ao criar uma nova empresa', () => {
    it('Deve enviar e-mail de notificação com sucesso', async () => {
      const company = {
        id: 1,
        name: 'Empresa Teste',
        cnpj: '12345678000199',
        tradeName: 'Emp Teste',
        addressId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockTransporter.sendMail.mockResolvedValue({ messageId: '123' });

      await service.sendNewCompanyNotification(company);

      expect(mockTransporter.sendMail).toHaveBeenCalledWith(
        expect.objectContaining({
          subject: 'Nova Empresa Cadastrada',
          text: expect.stringContaining(company.name),
          html: expect.stringContaining(company.name),
        }),
      );
    });

    it('Deve lançar InternalServerErrorException em caso de erro', async () => {
      const company = {
        id: 1,
        name: 'Empresa Teste',
        cnpj: '12345678000199',
        tradeName: 'Emp Teste',
        addressId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockTransporter.sendMail.mockRejectedValue(new Error('SMTP error'));

      await expect(service.sendNewCompanyNotification(company)).rejects.toThrow(
        InternalServerErrorException,
      );
    });

    it('Deve retornar sem fazer nada quando NOTIFY_EMAILS não está configurado', async () => {
      delete process.env.NOTIFY_EMAILS;

      const company = {
        id: 1,
        name: 'Empresa Teste',
        cnpj: '12345678000199',
        tradeName: 'Emp Teste',
        addressId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();

      await service.sendNewCompanyNotification(company);

      expect(consoleSpy).toHaveBeenCalledWith(
        'Nenhum email de notificação configurado',
      );
      expect(mockTransporter.sendMail).not.toHaveBeenCalled();

      consoleSpy.mockRestore();
    });
  });

  describe('Envio de e-mail com erro', () => {
    it('Deve lançar InternalServerErrorException quando sendEmail falhar', async () => {
      mockTransporter.sendMail.mockRejectedValue(new Error('Falha no envio'));

      await expect(
        service.sendEmail('test@example.com', 'Teste', 'Conteúdo'),
      ).rejects.toThrow(InternalServerErrorException);
    });
  });

  describe('Configuração SMTP', () => {
    it('Deve exibir warning quando SMTP não está configurado', () => {
      delete process.env.SMTP_HOST;
      delete process.env.SMTP_USER;

      const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();

      new EmailService();

      expect(consoleSpy).toHaveBeenCalledWith(
        'SMTP não configurado. Configure as variáveis de ambiente SMTP',
      );

      consoleSpy.mockRestore();
    });

    it('Deve configurar SMTP corretamente quando variáveis estão definidas', () => {
      const mockCreateTransporter =
        nodemailer.createTransport as jest.MockedFunction<
          typeof nodemailer.createTransport
        >;

      new EmailService();

      expect(mockCreateTransporter).toHaveBeenCalledWith({
        host: process.env.SMTP_HOST,
        port: 587,
        secure: false,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });
    });
  });
});
