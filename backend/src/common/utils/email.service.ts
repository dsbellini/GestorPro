import { Injectable, InternalServerErrorException } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { Company } from '@prisma/client';
import type { IEmailService } from '../interfaces';

@Injectable()
export class EmailService implements IEmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    if (!process.env.SMTP_HOST || !process.env.SMTP_USER) {
      console.warn(
        'SMTP não configurado. Configure as variáveis de ambiente SMTP',
      );
    }

    // Configuração SMTP
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT) || 587,
      secure: process.env.SMTP_PORT === '465',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }

  async sendNewCompanyNotification(company: Company) {
    try {
      if (!process.env.NOTIFY_EMAILS) {
        console.warn('Nenhum email de notificação configurado');
        return;
      }

      const info = await this.transporter.sendMail({
        from: `"GestorPro" <${process.env.SMTP_USER}>`,
        to: process.env.NOTIFY_EMAILS,
        subject: 'Nova Empresa Cadastrada',
        text: `Uma nova empresa foi cadastrada:\n\nNome: ${company.name}\nCNPJ: ${company.cnpj}\nNome Fantasia: ${company.tradeName}`,
        html: `
          <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px;">
            <h2 style="color: #2c3e50;">🏢 Nova Empresa Cadastrada</h2>
            <p>Uma nova empresa foi cadastrada no sistema GestorPro:</p>
            <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
              <tr>
                <td style="padding: 10px; border: 1px solid #ddd; background-color: #f8f9fa; font-weight: bold;">Nome:</td>
                <td style="padding: 10px; border: 1px solid #ddd;">${company.name}</td>
              </tr>
              <tr>
                <td style="padding: 10px; border: 1px solid #ddd; background-color: #f8f9fa; font-weight: bold;">CNPJ:</td>
                <td style="padding: 10px; border: 1px solid #ddd;">${company.cnpj}</td>
              </tr>
              <tr>
                <td style="padding: 10px; border: 1px solid #ddd; background-color: #f8f9fa; font-weight: bold;">Nome Fantasia:</td>
                <td style="padding: 10px; border: 1px solid #ddd;">${company.tradeName}</td>
              </tr>
            </table>
            <p style="color: #7f8c8d; font-size: 12px; margin-top: 30px;">
              Esta é uma notificação automática do sistema GestorPro.
            </p>
          </div>
        `,
      });
    } catch (err) {
      throw new InternalServerErrorException('Erro ao enviar e-mail');
    }
  }

  async sendEmail(
    to: string | string[],
    subject: string,
    content: string,
  ): Promise<void> {
    try {
      const info = await this.transporter.sendMail({
        from: `"GestorPro" <${process.env.SMTP_USER}>`,
        to: Array.isArray(to) ? to.join(',') : to,
        subject,
        html: content,
      });
    } catch (err) {
      throw new InternalServerErrorException('Erro ao enviar e-mail');
    }
  }
}
