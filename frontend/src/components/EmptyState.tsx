import { Box, Typography } from '@mui/material';

interface EmptyStateProps {
  message?: string;
}

export default function EmptyState({ message }: EmptyStateProps) {

  return (
    <Box sx={{ textAlign: 'center', mt: 4 }}>
      <Typography variant="body1" color="text.secondary">
        {message}
      </Typography>
    </Box>
  );
}
