import toast from 'react-hot-toast';
import { logError } from './logger';

export const showSuccess = (message: string) => {
  toast.success(message, {
    duration: 3000,
    position: 'top-right',
  });
};

export const showError = (error: unknown) => {
  const errorDetails = logError('notifications', error);
  const message = errorDetails.message || 'An unexpected error occurred';
  
  toast.error(message, {
    duration: 5000,
    position: 'top-right',
  });
};

export const showWarning = (message: string) => {
  toast(message, {
    duration: 4000,
    position: 'top-right',
    icon: '⚠️',
    style: {
      background: '#fff7ed',
      color: '#9a3412',
      border: '1px solid #fed7aa',
    },
  });
};