import { Server } from 'socket.io';
import dotenv from 'dotenv';
import LoggerHandler from './logger-config';
import SocketInitializer from './initialize-socket';
const config = dotenv.config();
const logger = new LoggerHandler(config);
const io = new Server();
const adapter = new SocketInitializer(io, config, logger);
adapter.initializeAdapter();



