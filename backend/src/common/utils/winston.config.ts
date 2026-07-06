import * as winston from 'winston';

export const winstonConfig = {
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        winston.format.ms(),
        winston.format.colorize({ all: true }),
        winston.format.printf(({ timestamp, level, message, context, ms }) => {
          const ctx = context ? `[${context}] ` : '';
          return `[Nest] - ${timestamp} ${level}: ${ctx}${message} ${ms}`;
        }),
      ),
    }),
  ],
};
