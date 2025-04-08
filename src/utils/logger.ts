import pino from 'pino';

const isDev = process.env.NODE_ENV === 'development';

export const logger = pino(
  isDev
    ? {
      transport: {
        target: 'pino-pretty',
        options: {
          colorize: true,
          translateTime: 'SYS:standard',
          ignore: 'pid,hostname',
          levelFirst: true,
        },
      },
    }
    : {
      // Producción: salida JSON lista para logs externos
      formatters: {
        level(label) {
          return { level: label };
        },
      },
      timestamp: pino.stdTimeFunctions.isoTime,
    }
);
