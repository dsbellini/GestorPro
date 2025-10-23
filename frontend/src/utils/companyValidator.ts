import type { CompanyFormData, ValidationError, ValidationResult } from '../types/company';

export class CompanyValidator {
  private static readonly REQUIRED_FIELDS = [
    'name',
    'cnpj', 
    'tradeName',
    'street',
    'number',
    'district',
    'city',
    'state',
    'postalCode'
  ];

  static validate(form: Partial<CompanyFormData>, isEditing: boolean = false): ValidationResult {
    const errors: ValidationError[] = [];

    const requiredFields = isEditing 
      ? this.REQUIRED_FIELDS.filter(field => field !== 'cnpj')
      : this.REQUIRED_FIELDS;

    requiredFields.forEach(field => {
      const value = form[field as keyof CompanyFormData];
      if (!value || value.toString().trim() === '') {
        errors.push({
          field,
          message: `${this.getFieldLabel(field)} é obrigatório`
        });
      }
    });

    // Validação específica do CNPJ (somente na criação)
    if (!isEditing && form.cnpj) {
      const cnpjError = this.validateCNPJ(form.cnpj);
      if (cnpjError) {
        errors.push({
          field: 'cnpj',
          message: cnpjError
        });
      }
    }

    if (form.number) {
      const numberError = this.validateNumber(form.number);
      if (numberError) {
        errors.push({
          field: 'number',
          message: numberError
        });
      }
    }

    if (form.state) {
      const stateError = this.validateState(form.state);
      if (stateError) {
        errors.push({
          field: 'state',
          message: stateError
        });
      }
    }

    if (form.postalCode) {
      const cepError = this.validateCEP(form.postalCode);
      if (cepError) {
        errors.push({
          field: 'postalCode',
          message: cepError
        });
      }
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  private static validateCNPJ(cnpj: string): string | null {
    const cleanCNPJ = cnpj.replace(/\D/g, '');
    
    if (cleanCNPJ.length !== 14) {
      return 'CNPJ deve ter exatamente 14 dígitos';
    }

    if (!/^\d+$/.test(cleanCNPJ)) {
      return 'CNPJ deve conter apenas números';
    }

    return null;
  }

  private static validateNumber(number: string): string | null {
    const cleanNumber = number.trim();
    
    if (!/^\d+$/.test(cleanNumber)) {
      return 'Número deve conter apenas dígitos';
    }

    const num = parseInt(cleanNumber);
    if (num <= 0) {
      return 'Número deve ser maior que zero';
    }

    return null;
  }

  private static validateState(state: string): string | null {
    const cleanState = state.trim().toUpperCase();
    
    if (cleanState.length !== 2) {
      return 'Estado deve ter exatamente 2 letras (ex: MG, SP)';
    }

    if (!/^[A-Z]{2}$/.test(cleanState)) {
      return 'Estado deve conter apenas letras';
    }

    // Lista dos estados brasileiros válidos
    const validStates = [
      'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 
      'MA', 'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 
      'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
    ];

    if (!validStates.includes(cleanState)) {
      return 'Estado deve ser uma sigla válida (ex: MG, SP, RJ)';
    }

    return null;
  }

  private static validateCEP(cep: string): string | null {
    const cleanCEP = cep.replace(/\D/g, '');
    
    if (cleanCEP.length !== 8) {
      return 'CEP deve ter exatamente 8 dígitos';
    }

    if (!/^\d+$/.test(cleanCEP)) {
      return 'CEP deve conter apenas números';
    }

    return null;
  }

  private static getFieldLabel(field: string): string {
    const labels: Record<string, string> = {
      name: 'Nome',
      cnpj: 'CNPJ',
      tradeName: 'Nome Fantasia',
      street: 'Rua',
      number: 'Número',
      district: 'Bairro',
      city: 'Cidade',
      state: 'Estado',
      postalCode: 'CEP',
      complemento: 'Complemento'
    };

    return labels[field] || field;
  }

  static validateField(field: string, value: string): string | null {
    // Validação de campo obrigatório
    if (this.REQUIRED_FIELDS.includes(field) && (!value || value.trim() === '')) {
      return `${this.getFieldLabel(field)} é obrigatório`;
    }

    switch (field) {
      case 'cnpj':
        return this.validateCNPJ(value);
      case 'number':
        return this.validateNumber(value);
      case 'state':
        return this.validateState(value);
      case 'postalCode':
        return this.validateCEP(value);
      default:
        return null;
    }
  }
}