
// Utilitários para formatação de dados brasileiros

export const formatCNPJ = (cnpj: string): string => {
  if (!cnpj || cnpj.length !== 14) return cnpj;
  
  return cnpj.replace(
    /^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/,
    '$1.$2.$3/$4-$5'
  );
};


export const formatCEP = (cep: string): string => {
  if (!cep || cep.length !== 8) return cep;
  
  return cep.replace(/^(\d{5})(\d{3})$/, '$1-$2');
};

export const unformatCNPJ = (cnpj: string): string => {
  return cnpj.replace(/[^\d]/g, '');
};

export const unformatCEP = (cep: string): string => {
  return cep.replace(/[^\d]/g, '');
};

export const maskCNPJ = (value: string): string => {
  const numbers = value.replace(/[^\d]/g, '');
  
  if (numbers.length <= 2) return numbers;
  if (numbers.length <= 5) return `${numbers.slice(0, 2)}.${numbers.slice(2)}`;
  if (numbers.length <= 8) return `${numbers.slice(0, 2)}.${numbers.slice(2, 5)}.${numbers.slice(5)}`;
  if (numbers.length <= 12) return `${numbers.slice(0, 2)}.${numbers.slice(2, 5)}.${numbers.slice(5, 8)}/${numbers.slice(8)}`;
  
  return `${numbers.slice(0, 2)}.${numbers.slice(2, 5)}.${numbers.slice(5, 8)}/${numbers.slice(8, 12)}-${numbers.slice(12, 14)}`;
};


export const maskCEP = (value: string): string => {
  const numbers = value.replace(/[^\d]/g, '');
  
  if (numbers.length <= 5) return numbers;
  
  return `${numbers.slice(0, 5)}-${numbers.slice(5, 8)}`;
};