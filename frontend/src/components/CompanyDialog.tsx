import React, { useState } from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  TextField,
  Alert,
  Box,
  CircularProgress,
} from '@mui/material';
import { CompanyValidator } from '../utils/companyValidator';

interface CompanyDialogProps {
  open: boolean;
  editing: boolean;
  form: any;
  onClose: () => void;
  onSave: () => Promise<void>;
  onFormChange: (field: string, value: string) => void;
}

export default function CompanyDialog({
  open,
  editing,
  form,
  onClose,
  onSave,
  onFormChange,
}: CompanyDialogProps) {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showGeneralError, setShowGeneralError] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    onFormChange(field, value);

    // Validação em tempo real dos campos digitados
    const fieldError = CompanyValidator.validateField(field, value);
    setErrors(prev => ({
      ...prev,
      [field]: fieldError || ''
    }));
  };

  const handleSave = async () => {
    const validation = CompanyValidator.validate(form, editing);

    if (!validation.isValid) {
      const errorMap: Record<string, string> = {};
      validation.errors.forEach(error => {
        errorMap[error.field] = error.message;
      });
      setErrors(errorMap);
      setShowGeneralError(true);
      return;
    }

    setErrors({});
    setShowGeneralError(false);

    try {
      setLoading(true);
      await onSave();
    } catch (error) {
      setShowGeneralError(true);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setErrors({});
    setShowGeneralError(false);
    setLoading(false);
    onClose();
  };

  // Se for uma edição, o campo CNPJ não é obrigatório
  const isFormValid = () => {
    const requiredFields = editing
      ? ['name', 'tradeName', 'street', 'number', 'district', 'city', 'state', 'postalCode']
      : ['name', 'cnpj', 'tradeName', 'street', 'number', 'district', 'city', 'state', 'postalCode'];

    return requiredFields.every(field => {
      const value = form[field];
      return value && value.toString().trim() !== '';
    });
  };

  // Formatações de CNPJ e CEP
  const formatCNPJ = (value: string) => {
    const digits = value.replace(/\D/g, '');
    return digits
      .replace(/(\d{2})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1/$2')
      .replace(/(\d{4})(\d)/, '$1-$2')
      .slice(0, 18);
  };

  const formatCEP = (value: string) => {
    const digits = value.replace(/\D/g, '');
    return digits.replace(/(\d{5})(\d)/, '$1-$2').slice(0, 9);
  };

  const handleCNPJChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCNPJ(e.target.value);
    onFormChange('cnpj', formatted);

    const fieldError = CompanyValidator.validateField('cnpj', formatted);
    setErrors(prev => ({
      ...prev,
      cnpj: fieldError || ''
    }));
  };

  const handleCEPChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCEP(e.target.value);
    onFormChange('postalCode', formatted);

    const fieldError = CompanyValidator.validateField('postalCode', formatted);
    setErrors(prev => ({
      ...prev,
      postalCode: fieldError || ''
    }));
  };

  const handleStateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toUpperCase().slice(0, 2);
    onFormChange('state', value);

    const fieldError = CompanyValidator.validateField('state', value);
    setErrors(prev => ({
      ...prev,
      state: fieldError || ''
    }));
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
      <DialogTitle>{editing ? 'Editar Empresa' : 'Nova Empresa'}</DialogTitle>
      <DialogContent>
        {showGeneralError && (
          <Alert severity="error" sx={{ mb: 2 }}>
            Por favor, corrija os campos abaixo antes de continuar
          </Alert>
        )}

        <Stack spacing={2} sx={{ mt: 1 }}>
          <TextField
            label="Nome"
            value={form.name || ''}
            onChange={handleChange('name')}
            error={!!errors.name}
            helperText={errors.name}
            fullWidth
            required
          />

          {!editing && (
            <TextField
              label="CNPJ"
              value={form.cnpj || ''}
              onChange={handleCNPJChange}
              error={!!errors.cnpj}
              helperText={errors.cnpj || 'Ex: 12.345.678/0001-90'}
              placeholder="00.000.000/0000-00"
              fullWidth
              required
            />
          )}

          <TextField
            label="Nome Fantasia"
            value={form.tradeName || ''}
            onChange={handleChange('tradeName')}
            error={!!errors.tradeName}
            helperText={errors.tradeName}
            fullWidth
            required
          />

          <Box sx={{ display: 'flex', gap: 2 }}>
            <TextField
              label="Rua"
              value={form.street || ''}
              onChange={handleChange('street')}
              error={!!errors.street}
              helperText={errors.street}
              fullWidth
              required
              sx={{ flex: 3 }}
            />

            <TextField
              label="Número"
              value={form.number || ''}
              onChange={handleChange('number')}
              error={!!errors.number}
              helperText={errors.number}
              required
              sx={{ flex: 1 }}
              inputProps={{ inputMode: 'numeric' }}
            />
          </Box>

          <TextField
            label="Bairro"
            value={form.district || ''}
            onChange={handleChange('district')}
            error={!!errors.district}
            helperText={errors.district}
            fullWidth
            required
          />

          <Box sx={{ display: 'flex', gap: 2 }}>
            <TextField
              label="Cidade"
              value={form.city || ''}
              onChange={handleChange('city')}
              error={!!errors.city}
              helperText={errors.city}
              fullWidth
              required
              sx={{ flex: 2 }}
            />

            <TextField
              label="Estado"
              value={form.state || ''}
              onChange={handleStateChange}
              error={!!errors.state}
              helperText={errors.state || 'Ex: MG, SP'}
              placeholder="UF"
              required
              sx={{ flex: 1 }}
              inputProps={{ style: { textTransform: 'uppercase' } }}
            />
          </Box>

          <TextField
            label="CEP"
            value={form.postalCode || ''}
            onChange={handleCEPChange}
            error={!!errors.postalCode}
            helperText={errors.postalCode || 'Ex: 12345-678'}
            placeholder="00000-000"
            fullWidth
            required
          />

          <TextField
            label="Complemento"
            value={form.complemento || ''}
            onChange={handleChange('complemento')}
            error={!!errors.complemento}
            helperText={errors.complemento || 'Opcional'}
            fullWidth
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} disabled={loading}>
          Cancelar
        </Button>
        <Button
          variant="contained"
          onClick={handleSave}
          disabled={loading || !isFormValid()}
          startIcon={loading ? <CircularProgress size={20} /> : null}
        >
          {loading ? 'Salvando...' : 'Salvar'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
