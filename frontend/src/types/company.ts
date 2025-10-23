export interface Company {
  id: number;
  name: string;
  cnpj: string;
  tradeName: string;
  addressId: number;
  createdAt: Date;
  updatedAt: Date;
  address?: Address;
}

export interface Address {
  id: number;
  street: string;
  number: string;
  district: string;
  city: string;
  state: string;
  postalCode: string;
  complemento?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateCompanyDto {
  name: string;
  cnpj: string;
  tradeName: string;
  street: string;
  number: string;
  district: string;
  city: string;
  state: string;
  postalCode: string;
  complemento?: string;
}

export interface UpdateCompanyDto {
  name?: string;
  tradeName?: string;
  street?: string;
  number?: string;
  district?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  complemento?: string;
}

export interface CompanyFormData {
  name: string;
  cnpj: string;
  tradeName: string;
  street: string;
  number: string;
  district: string;
  city: string;
  state: string;
  postalCode: string;
  complemento?: string;
}

export interface ValidationError {
  field: string;
  message: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
}