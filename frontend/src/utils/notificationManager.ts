import type { AlertColor } from '@mui/material';

class NotificationManager {
  private static instance: NotificationManager;
  private notificationHandler: ((message: string, severity: AlertColor) => void) | null = null;

  static getInstance(): NotificationManager {
    if (!NotificationManager.instance) {
      NotificationManager.instance = new NotificationManager();
    }
    return NotificationManager.instance;
  }

  setNotificationHandler(handler: (message: string, severity: AlertColor) => void) {
    this.notificationHandler = handler;
  }

  showSuccess(message: string) {
    this.notificationHandler?.(message, 'success');
  }

  showError(message: string) {
    this.notificationHandler?.(message, 'error');
  }

  showWarning(message: string) {
    this.notificationHandler?.(message, 'warning');
  }

  showInfo(message: string) {
    this.notificationHandler?.(message, 'info');
  }
}

export const notificationManager = NotificationManager.getInstance();