/** 
The entire code is copied without permission
@see https://github.com/hansputera/my-whatsapp-bot/blob/master/src/objects/logger.ts
*/
import pino from 'pino';

/**
 * Use this function to create logger instance.
 * @param {string} serviceName - Service logger name.
 * @return {pino.Logger}
 */
export const createLogger = (serviceName: string): pino.Logger => pino({
  name: serviceName,
  transport: {
    target: 'pino-pretty',
    options: {
      colorize: true,
      ignore: 'hostname',
    },
  },
});