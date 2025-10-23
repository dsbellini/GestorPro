import axios from 'axios';
import { notificationManager } from '../utils/notificationManager';
import { unformatCNPJ, unformatCEP } from '../utils/formatUtils';
import type { Company, CreateCompanyDto, UpdateCompanyDto } from '../types/company';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3001',
});

// Classe customizada para erros da API
export class CompanyServiceError extends Error {
  public statusCode: number;
  public originalError?: any;

  constructor(message: string, statusCode: number, originalError?: any) {
    super(message);
    this.name = 'CompanyServiceError';
    this.statusCode = statusCode;
    this.originalError = originalError;
  }
}

class NotificationService {
  static showError(message: string) {
    notificationManager.showError(message);
  }

  static showSuccess(message: string) {
    notificationManager.showSuccess(message);
  }
}

class CompanyService {

  private cleanFormData(data: CreateCompanyDto | UpdateCompanyDto): CreateCompanyDto | UpdateCompanyDto {
    const cleaned = { ...data };
    
    // Remove formatação do CNPJ e CEP para envio à API
    if ('cnpj' in cleaned && cleaned.cnpj) {
      cleaned.cnpj = unformatCNPJ(cleaned.cnpj);
    }
    
    if (cleaned.postalCode) {
      cleaned.postalCode = unformatCEP(cleaned.postalCode);
    }
    
    return cleaned;
  }

  private handleApiError(error: any): never {
    let message = 'Erro inesperado';
    let statusCode = 500;

    if (error.response?.data) {
      const data = error.response.data;
      statusCode = data.statusCode || error.response.status;
      
      if (data.message) {
        message = data.message;
      }
      else if (typeof data.error === 'string') {
        message = data.error;
      }
    }
    
    NotificationService.showError(message);
    
    throw new CompanyServiceError(message, statusCode, error);
  }

  async getAll(): Promise<Company[]> {
    try {
      const response = await api.get<Company[]>('/companies');
      return response.data;
    } catch (error) {
      this.handleApiError(error);
    }
  }

  async getById(id: number): Promise<Company> {
    try {
      const response = await api.get<Company>(`/companies/${id}`);
      return response.data;
    } catch (error) {
      this.handleApiError(error);
    }
  }

  async create(data: CreateCompanyDto): Promise<Company> {
    try {
      const cleanedData = this.cleanFormData(data) as CreateCompanyDto;
      const response = await api.post<Company>('/companies', cleanedData);
      NotificationService.showSuccess('Empresa criada com sucesso!');
      return response.data;
    } catch (error) {
      this.handleApiError(error);
    }
  }

  async update(id: number, data: UpdateCompanyDto): Promise<Company> {
    try {
      const cleanedData = this.cleanFormData(data) as UpdateCompanyDto;
      const response = await api.put<Company>(`/companies/${id}`, cleanedData);
      NotificationService.showSuccess('Empresa atualizada com sucesso!');
      return response.data;
    } catch (error) {
      this.handleApiError(error);
    }
  }

  async delete(id: number): Promise<void> {
    try {
      await api.delete(`/companies/${id}`);
      NotificationService.showSuccess('Empresa excluída com sucesso!');
    } catch (error) {
      this.handleApiError(error);
    }
  }
}

export const companyService = new CompanyService();
