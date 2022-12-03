import { DotenvConfigOutput } from "dotenv";
import LoggerHandler from "./logger-config";
import { Server} from 'socket.io';
import { createClient, RedisClientType} from 'redis';
import { createAdapter } from '@socket.io/redis-adapter';
import Middleware from "./middleware";
import Events from "./events";

export default class SocketInitializer {
    io: Server
    config: DotenvConfigOutput
    logger: LoggerHandler
    pubClient: RedisClientType
    subClient: RedisClientType
    socketOptions: any
    events: Events
    connectedUsers: string[]
    middleware: Middleware
    constructor(io: Server, config: DotenvConfigOutput, logger: LoggerHandler) {
        this.config = config
        this.logger = logger;
        this.io = io;
        this.socketOptions = {
            host: process.env.REDIS_HOST
            , port: process.env.REDIS_PORT
        }
        this.pubClient = createClient({ socket: { ...this.socketOptions } });
        this.subClient = this.pubClient.duplicate();
        this.middleware = new Middleware(this.io, this.config, this.logger);
        this.events = new Events(this.io, this.config, this.logger)
        this.connectedUsers = [];
    }

    async initializeAdapter(): Promise<void> {
        try {
                await Promise.all([this.pubClient.connect(), this.subClient.connect()])
                this.io.adapter(createAdapter(this.pubClient, this.subClient));
                this.io.listen(3000);
                await this.getConnectedList();
                this.onConnectionEvent();
            
        }
        catch (err) {
            this.logger.logger.error(`try connect redis adapter ${err}`);
        }
    }
    onConnectionEvent() {
        try {
            this.io.on('connection', (socket) => {
                this.connectedUsers.push(socket.id);
                this.io.use((socket, next) => (this.middleware.checkAuth(socket, next)));
                this.events.ListenFactory(socket, this.connectedUsers);
                this.logger.logger.info(`socket connected`)
                socket.on('disconnect', () => {
                    this.io.emit(`user ${socket.id} disconnected`);
                    this.connectedUsers = this.connectedUsers.filter(user => user != socket.id);
                    this.logger.logger.info(`socket disconnected`)
                })
            })
        }
        catch (err) {
            this.logger.logger.error(`cannot connect socket ${err}`)
        }
    }
    async getConnectedList(): Promise<void> {
        try {
            this.logger.logger.info(`fetching random users`);
            await this.io.of('/').adapter.sockets(new Set()).then((results) => {
                results.forEach(id => this.connectedUsers.push(id));
            });
            this.logger.logger.info("initialize connectedUsers");
        }
        catch (err) {
            this.logger.logger.error(`cannot extract connected users ${err}`)
        }
    }
}