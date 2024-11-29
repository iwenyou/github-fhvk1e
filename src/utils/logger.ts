// Simple browser-compatible logger
const LOG_LEVELS = {
  ERROR: 'error',
  INFO: 'info',
  DEBUG: 'debug'
} as const;

type LogLevel = typeof LOG_LEVELS[keyof typeof LOG_LEVELS];

interface LogDetails {
  message: string;
  code?: string;
  details?: unknown;
  hint?: unknown;
  additionalInfo?: unknown;
  stack?: string;
}

const formatMessage = (context: string, message: string, data?: unknown) => {
  return `[${context}] ${message}${data ? ` | ${JSON.stringify(data)}` : ''}`;
};

export const logError = (context: string, error: any, additionalInfo?: unknown): LogDetails => {
  const details = {
    message: error?.message || 'Unknown error',
    code: error?.code,
    details: error?.details,
    hint: error?.hint,
    additionalInfo,
    stack: error?.stack
  };

  console.error(formatMessage(context, details.message, details));
  return details;
};

export const logInfo = (context: string, message: string, data?: unknown) => {
  console.info(formatMessage(context, message, data));
};

export const logDebug = (context: string, message: string, data?: unknown) => {
  if (import.meta.env.DEV) {
    console.debug(formatMessage(context, message, data));
  }
};