import winston from 'winston'
import { Logger } from 'winston';

export default  class LoggerConfig{
  logger:Logger;
constructor(){
  this.logger = winston.createLogger({
    level: 'error',
    format: winston.format.json(), 
    transports: [
      new winston.transports.File({ filename: 'error.log', level: 'error' }),
    
    ],
  });
}


}