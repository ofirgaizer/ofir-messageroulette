import { Server } from 'socket.io';
import dotenv from 'dotenv';
import Middleware from './middleware';
import LoggerConfig from './logger-config';
import SocketInitializer from './initialize-socket';
import Events from './routes';
const config = dotenv.config();
const logger = new LoggerConfig();
const io = new Server();
const adapter = new SocketInitializer(io, config, logger);
adapter.initializeAdapter();



