import {
  Card,
  CardContent,
  Typography,
  IconButton,
  Box,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Grid,
} from '@mui/material';
import {
  Delete,
  Edit,
  ExpandMore,
  Business,
  LocationOn,
} from '@mui/icons-material';
import { formatCNPJ, formatCEP } from '../utils/formatUtils';

type Company = any;

interface CompanyTableProps {
  companies: Company[];
  onEdit: (company: Company) => void;
  onDelete: (id: number) => void;
}

interface CompanyCardProps {
  company: Company;
  onEdit: (company: Company) => void;
  onDelete: (id: number) => void;
}

function CompanyCard({ company, onEdit, onDelete }: CompanyCardProps) {
  return (
    <Card
      sx={{
        mb: 2,
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: 4
        }
      }}
    >
      <CardContent sx={{ pb: 1 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Business color="primary" />
            <Typography variant="h6" component="div" sx={{ fontWeight: 600 }}>
              {company.name}
            </Typography>
          </Box>
          <Box>
            <IconButton
              onClick={() => onEdit(company)}
              color="primary"
              size="small"
              sx={{ mr: 0.5 }}
            >
              <Edit />
            </IconButton>
            <IconButton
              onClick={() => onDelete(company.id)}
              color="error"
              size="small"
            >
              <Delete />
            </IconButton>
          </Box>
        </Box>

        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              <strong>CNPJ:</strong> {formatCNPJ(company.cnpj)}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              <strong>Nome Fantasia:</strong> {company.tradeName}
            </Typography>
          </Grid>
        </Grid>

        {company.address && (
          <Accordion sx={{ mt: 2, '&:before': { display: 'none' } }}>
            <AccordionSummary
              expandIcon={<ExpandMore />}
              sx={{
                minHeight: 'auto',
                '& .MuiAccordionSummary-content': { margin: '8px 0' }
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <LocationOn color="action" fontSize="small" />
                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                  Visualizar endereço
                </Typography>
              </Box>
            </AccordionSummary>
            <AccordionDetails sx={{ pt: 0 }}>
              <Grid container spacing={1}>
                <Grid item xs={12}>
                  <Typography variant="body2" color="text.secondary">
                    <strong>Rua:</strong> {company.address.street}, {company.address.number}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="text.secondary">
                    <strong>Bairro:</strong> {company.address.district}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="text.secondary">
                    <strong>CEP:</strong> {formatCEP(company.address.postalCode)}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="text.secondary">
                    <strong>Cidade:</strong> {company.address.city}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="text.secondary">
                    <strong>Estado:</strong> {company.address.state}
                  </Typography>
                </Grid>
                {company.address.complemento && (
                  <Grid item xs={12}>
                    <Typography variant="body2" color="text.secondary">
                      <strong>Complemento:</strong> {company.address.complemento}
                    </Typography>
                  </Grid>
                )}
              </Grid>
            </AccordionDetails>
          </Accordion>
        )}
      </CardContent>
    </Card>
  );
}

export default function CompanyTable({ companies, onEdit, onDelete }: CompanyTableProps) {
  return (
    <Box sx={{ width: '100%' }}>
      {companies.map((company) => (
        <CompanyCard
          key={company.id}
          company={company}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </Box>
  );
}
