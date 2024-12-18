import pino from 'pino';

const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  browser: {
    asObject: true,
  },
  formatters: {
    level: (label) => ({ level: label.toUpperCase() }),
  },
  timestamp: pino.stdTimeFunctions.isoTime,
});

// For development only pretty printing
if (process.env.NODE_ENV !== 'production') {
  logger.level = 'debug';
}

export default logger;
