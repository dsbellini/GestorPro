import { Box, Button, Stack, Typography } from '@mui/material';
import { Add } from '@mui/icons-material';

interface CompanyHeaderProps {
  onCreateNew: () => void;
}

export default function CompanyHeader({ onCreateNew }: CompanyHeaderProps) {
  return (
    <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
      <Typography variant="h4">Gerenciador de Empresas</Typography>
      <Box>
        <Button variant="contained" startIcon={<Add />} onClick={onCreateNew}>
          Nova Empresa
        </Button>
        <Button onClick={() => window.history.back()} variant="outlined" sx={{ ml: 1 }}>
          Voltar
        </Button>
      </Box>
    </Stack>
  );
}
