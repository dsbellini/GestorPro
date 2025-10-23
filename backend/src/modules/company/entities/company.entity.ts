import type { ID, CNPJ } from '../../../common/types';

export class Company {
  id: ID;
  name: string;
  cnpj: CNPJ;
  tradeName: string;
  addressId: ID;
  createdAt: Date;
  updatedAt: Date;
}

export class Address {
  id: ID;
  street: string;
  number: string;
  district: string;
  city: string;
  state: string;
  postalCode: string;
  complemento?: string;
}
