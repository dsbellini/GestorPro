import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import type { ReactNode } from 'react';
import { Snackbar, Alert } from '@mui/material';
import type { AlertColor } from '@mui/material';
import { notificationManager } from '../utils/notificationManager';

interface NotificationState {
  open: boolean;
  message: string;
  severity: AlertColor;
}

interface NotificationContextType {
  showNotification: (message: string, severity: AlertColor) => void;
  showSuccess: (message: string) => void;
  showError: (message: string) => void;
  showWarning: (message: string) => void;
  showInfo: (message: string) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification deve ser usado dentro de um NotificationProvider');
  }
  return context;
};

interface NotificationProviderProps {
  children: ReactNode;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({ children }) => {
  const [notification, setNotification] = useState<NotificationState>({
    open: false,
    message: '',
    severity: 'info',
  });
  const autoCloseRef = useRef<number | null>(null);

  const AUTO_CLOSE_MS = 3000; // 3 segundos

  const showNotification = (message: string, severity: AlertColor) => {
    if (autoCloseRef.current) {
      clearTimeout(autoCloseRef.current);
      autoCloseRef.current = null;
    }

    setNotification({
      open: true,
      message,
      severity,
    });
  };

  const showSuccess = (message: string) => showNotification(message, 'success');
  const showError = (message: string) => showNotification(message, 'error');
  const showWarning = (message: string) => showNotification(message, 'warning');
  const showInfo = (message: string) => showNotification(message, 'info');

  // Conecta o manager global com o contexto local
  useEffect(() => {
    notificationManager.setNotificationHandler(showNotification);
  }, []);

  // Efeito que gerencia o timeout de auto-close sempre que a notificação abrir
  useEffect(() => {
    if (notification.open) {
      if (autoCloseRef.current) {
        clearTimeout(autoCloseRef.current);
      }

      autoCloseRef.current = window.setTimeout(() => {
        setNotification(prev => ({ ...prev, open: false }));
        autoCloseRef.current = null;
      }, AUTO_CLOSE_MS);
    }

    return () => {
      if (autoCloseRef.current) {
        clearTimeout(autoCloseRef.current);
        autoCloseRef.current = null;
      }
    };
  }, [notification.open]);

  const handleClose = (_event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    if (autoCloseRef.current) {
      clearTimeout(autoCloseRef.current);
      autoCloseRef.current = null;
    }

    setNotification(prev => ({ ...prev, open: false }));
  };

  const value: NotificationContextType = {
    showNotification,
    showSuccess,
    showError,
    showWarning,
    showInfo,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
      <Snackbar
        open={notification.open}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert
          onClose={handleClose}
          severity={notification.severity}
          sx={{ width: '100%' }}
          variant="filled"
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </NotificationContext.Provider>
  );
};