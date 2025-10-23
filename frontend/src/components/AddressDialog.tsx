import {
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Stack,
  Typography,
  Box,
} from '@mui/material';
import { Close } from '@mui/icons-material';

type Company = any;

interface AddressDialogProps {
  open: boolean;
  company: Company | null;
  onClose: () => void;
}

export default function AddressDialog({ open, company, onClose }: AddressDialogProps) {
  if (!company) return null;

  const address = company.address;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">Endereço da Empresa</Typography>
          <IconButton onClick={onClose} size="small">
            <Close />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent>
        <Stack spacing={2}>
          <Box>
            <Typography variant="subtitle2" color="text.secondary">
              Empresa
            </Typography>
            <Typography variant="body1">{company.name}</Typography>
          </Box>

          <Box>
            <Typography variant="subtitle2" color="text.secondary">
              CNPJ
            </Typography>
            <Typography variant="body1">{company.cnpj}</Typography>
          </Box>

          <Box>
            <Typography variant="subtitle2" color="text.secondary">
              Endereço Completo
            </Typography>
            <Typography variant="body1">
              {address?.street}, {address?.number}
              {address?.complemento && ` - ${address.complemento}`}
            </Typography>
            <Typography variant="body1">
              {address?.district} - {address?.city}, {address?.state}
            </Typography>
            <Typography variant="body1">CEP: {address?.postalCode}</Typography>
          </Box>

          {address?.complemento && (
            <Box>
              <Typography variant="subtitle2" color="text.secondary">
                Complemento
              </Typography>
              <Typography variant="body1">{address.complemento}</Typography>
            </Box>
          )}
        </Stack>
      </DialogContent>
    </Dialog>
  );
}