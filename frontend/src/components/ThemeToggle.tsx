import { IconButton, Tooltip } from '@mui/material';
import { Brightness4, Brightness7 } from '@mui/icons-material';

export default function ThemeToggle({ mode, toggleMode }: { mode: 'light' | 'dark'; toggleMode: () => void }) {
  return (
    <Tooltip title={`Modo ${mode === 'light' ? 'claro' : 'escuro'}`}>
      <IconButton onClick={toggleMode} color="inherit">
        {mode === 'light' ? <Brightness4 /> : <Brightness7 />}
      </IconButton>
    </Tooltip>
  );
}
