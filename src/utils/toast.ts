import toast from 'react-hot-toast';

export const showSuccess = (message: string) => {
  toast.success(message, {
    duration: 3000,
    position: 'top-right',
  });
};

export const showError = (error: unknown) => {
  const message = error instanceof Error ? error.message : 'An unexpected error occurred';
  toast.error(message, {
    duration: 5000,
    position: 'top-right',
  });
};