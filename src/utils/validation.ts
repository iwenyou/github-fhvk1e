import { z } from 'zod';
import { showError } from './notifications';

export async function validateForm<T>(schema: z.ZodSchema<T>, data: unknown): Promise<T | null> {
  try {
    return schema.parse(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors = error.errors.map(err => ({
        field: err.path.join('.'),
        message: err.message
      }));
      showError(errors.map(e => `${e.field}: ${e.message}`).join('\n'));
    } else {
      showError(error);
    }
    return null;
  }
}

export function formatValidationErrors(error: z.ZodError) {
  return error.errors.map(err => ({
    field: err.path.join('.'),
    message: err.message
  }));
}