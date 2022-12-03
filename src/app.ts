import { Server } from 'socket.io';
import dotenv from 'dotenv';
import Middleware from './middleware';
import LoggerHandler from './logger-config';
import SocketInitializer from './initialize-socket';
import Events from './events';
const config = dotenv.config();
const logger = new LoggerHandler(config);
const io = new Server();
const adapter = new SocketInitializer(io, config, logger);
adapter.initializeAdapter();



