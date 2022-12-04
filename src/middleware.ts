import { DotenvConfigOutput } from "dotenv";
import { Socket } from "socket.io";
import { Server } from 'socket.io';
import LoggerHandler from './logger-config'

export default class Middleware {
    private secretKey: any
    constructor(private io: Server, private config: DotenvConfigOutput, private logger: LoggerHandler) {
        this.config = config
        this.io = io;
        this.secretKey = process.env.SECRET_KEY
        this.logger = logger;
    }
    checkAuth(socket: Socket, next): void {
        try {
            if (socket.handshake.headers['authorization'] === this.secretKey) {
                this.logger.logger.info("user is authrized")
                return next();
            }
            else {
                this.logger.logger.error("User unauthorized")
                return next(new Error('User unauthorized'))
            }
        }
        catch (err) {
            this.logger.logger.error(`cant check auth ${err}`);
        }
    }
}
