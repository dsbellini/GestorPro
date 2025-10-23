import { Box, Button, Container, Typography, useTheme } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import gestorProLight from '../assets/gestorPro-sf.png';
import gestorProDark from '../assets/gestorPro.png';

export default function Home() {
  const navigate = useNavigate();
  const theme = useTheme();

  const logoSrc = theme.palette.mode === 'dark' ? gestorProDark : gestorProLight;

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Container maxWidth="sm" sx={{ textAlign: 'center' }}>
        <Box sx={{ mb: 4 }}>
          <img
            src={logoSrc}
            alt="GestorProLogo"
            style={{
              maxWidth: '300px',
              width: '100%',
              height: 'auto',
              borderRadius: theme.palette.mode === 'dark' ? '15px' : '0'
            }}
          />
        </Box>
        <Typography variant="subtitle1" sx={{ mb: 4 }}>
          GestorPro - Gestão de empresas simplificada
        </Typography>
        <Box>
          <Button
            variant="contained"
            color="primary"
            size="large"
            onClick={() => navigate('/manager')}
          >
            Iniciar
          </Button>
        </Box>
      </Container>
    </Box>
  );
}
