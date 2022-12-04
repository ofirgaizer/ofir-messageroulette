import { DotenvConfigOutput } from "dotenv";
import LoggerHandler from "./logger-config";
import { Server } from 'socket.io';
import { createClient, RedisClientType } from 'redis';
import { createAdapter } from '@socket.io/redis-adapter';
import Middleware from "./middleware";
import Events from "./events";

export default class SocketInitializer {
    private pubClient: RedisClientType
    private subClient: RedisClientType
    private socketOptions: any
    private events: Events
    private connectedUsers: string[]
    private middleware: Middleware
    constructor(private io: Server, private config: DotenvConfigOutput, private logger: LoggerHandler) {
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
            this.io.listen(+process.env.PORT);
            this.io.use((socket, next) => (this.middleware.checkAuth(socket, next)));
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