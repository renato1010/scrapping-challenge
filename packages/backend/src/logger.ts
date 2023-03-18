import pino from 'pino';
const rootLogger = pino(
  {
    level: 'debug',
  }
);
const logger = rootLogger.child({env: 'DEV'});
export { logger };