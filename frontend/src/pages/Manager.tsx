import { useEffect, useState } from 'react';
import { Box, Container } from '@mui/material';
import CompanyHeader from '../components/CompanyHeader';
import CompanyTable from '../components/CompanyTable';
import CompanyDialog from '../components/CompanyDialog';
import EmptyState from '../components/EmptyState';
import { companyService } from '../services/companyService';
import type { Company, UpdateCompanyDto } from '../types/company';

export default function Manager() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Company | null>(null);
  const [form, setForm] = useState<any>({});

  const load = async () => {
    try {
      const data = await companyService.getAll();
      setCompanies(data);
    } catch (error) {
      console.error('Erro ao carregar empresas:', error);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const openCreate = () => {
    setEditing(null);
    setForm({});
    setOpen(true);
  };

  const openEdit = (c: Company) => {
    setEditing(c);
    setForm({
      name: c.name,
      tradeName: c.tradeName,
      street: c.address?.street || '',
      number: c.address?.number || '',
      district: c.address?.district || '',
      city: c.address?.city || '',
      state: c.address?.state || '',
      postalCode: c.address?.postalCode || '',
      complemento: c.address?.complemento || '',
    });
    setOpen(true);
  };

  const handleSave = async () => {
    try {
      if (editing) {
        await companyService.update(editing.id, form as UpdateCompanyDto);
      } else {
        await companyService.create(form);
      }
      setOpen(false);
      load();
    } catch (error) {
      console.error('Operação cancelada:', error);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Deseja remover essa empresa?')) return;
    try {
      await companyService.delete(id);
      load();
    } catch (error) {
      console.error('Operação cancelada:', error);
    }
  };

  const handleFormChange = (field: string, value: string) => {
    setForm({ ...form, [field]: value });
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        pt: 8,
      }}
    >
      <Container maxWidth="lg" sx={{ maxWidth: 1000 }}>
        <CompanyHeader onCreateNew={openCreate} />

        {companies.length > 0 ? (
          <CompanyTable
            companies={companies}
            onEdit={openEdit}
            onDelete={handleDelete}
          />
        ) : (
          <EmptyState message='Nenhuma empresa cadastrada. Clique em "Nova empresa" para iniciar.' />
        )}

        <CompanyDialog
          open={open}
          editing={!!editing}
          form={form}
          onClose={() => setOpen(false)}
          onSave={handleSave}
          onFormChange={handleFormChange}
        />
      </Container>
    </Box>
  );
}
