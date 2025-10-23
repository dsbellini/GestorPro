import { useMemo, useState, useEffect } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline, Box, GlobalStyles } from '@mui/material';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { NotificationProvider } from './contexts/NotificationContext';
import Home from './pages/Home';
import Manager from './pages/Manager';
import ThemeToggle from './components/ThemeToggle';

function App() {
  const [mode, setMode] = useState<'light' | 'dark'>(() => {
    try {
      const v = localStorage.getItem('theme_mode');
      return (v === 'dark' ? 'dark' : 'light');
    } catch {
      return 'light';
    }
  });

  useEffect(() => {
    try { localStorage.setItem('theme_mode', mode); } catch { }
  }, [mode]);

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
        },
      }),
    [mode],
  );

  const toggleMode = () => setMode((m) => (m === 'light' ? 'dark' : 'light'));

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <GlobalStyles
        styles={{
          'html, body, #root': { transition: 'background-color 300ms ease, color 300ms ease' },
        }}
      />
      <NotificationProvider>
        <Box sx={{ position: 'fixed', top: 12, right: 12, zIndex: 1300 }}>
          <ThemeToggle mode={mode} toggleMode={toggleMode} />
        </Box>

        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/manager" element={<Manager />} />
          </Routes>
        </BrowserRouter>
      </NotificationProvider>
    </ThemeProvider>
  );
}

export default App;
