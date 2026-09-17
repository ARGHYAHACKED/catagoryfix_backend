import pino, { type Logger } from 'pino';

const REDACT_PATHS = [
  'password',
  'passwordHash',
  'token',
  'refreshToken',
  'accessToken',
  'authorization',
  'cookie',
  'stripeSecret',
  'encryptedCredentials',
  'apiKey',
  'OPENAI_API_KEY',
  'JWT_ACCESS_SECRET',
  'JWT_REFRESH_SECRET',
];

export function createLogger(service: string): Logger {
  return pino({
    level: process.env.LOG_LEVEL ?? 'info',
    base: { service },
    timestamp: pino.stdTimeFunctions.isoTime,
    redact: {
      paths: REDACT_PATHS,
      censor: '[REDACTED]',
    },
    formatters: {
      level(label) {
        return { level: label };
      },
    },
  });
}

export type { Logger };
