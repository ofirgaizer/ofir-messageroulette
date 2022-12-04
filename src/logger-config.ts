import { DotenvConfigOutput } from 'dotenv';
import winston from 'winston'
import { Logger } from 'winston';

export default class LoggerHandler {
  logger: Logger;
  constructor(private config: DotenvConfigOutput) {
    this.config = config;
    this.logger = winston.createLogger({
      level: process.env.LOGGER_LEVEL,
      format: winston.format.json(),
      transports: [
        new winston.transports.Console({ level: 'info' }),
        new winston.transports.File({ filename: 'log.txt', level: 'error' }),

      ],
    });
  }


}