"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const redis_1 = require("redis");
const redis_adapter_1 = require("@socket.io/redis-adapter");
const middleware_1 = __importDefault(require("./middleware"));
const routes_1 = __importDefault(require("./routes"));
class RedisAdapter {
    constructor(io, config, logger) {
        this.config = config;
        this.logger = logger;
        this.io = io;
        this.socketOptions = {
            host: process.env.REDIS_HOST,
            port: process.env.REDIS_PORT
        };
        this.pubClient = (0, redis_1.createClient)({ socket: Object.assign({}, this.socketOptions) });
        this.subClient = this.pubClient.duplicate();
        this.middleware = new middleware_1.default(this.io, this.config, this.logger);
        this.events = new routes_1.default(this.io, this.config, this.logger);
        this.connectedUsers = [];
    }
    initializeAdapter() {
        try {
            Promise.all([this.pubClient.connect(), this.subClient.connect()]).then(() => {
                this.io.adapter((0, redis_adapter_1.createAdapter)(this.pubClient, this.subClient));
                this.io.listen(3000);
                console.log("listen");
                this.onConnectionEvent();
            });
        }
        catch (err) {
            this.logger.logger.error(`try connect redis adapter ${err}`);
        }
    }
    onConnectionEvent() {
        try {
            this.io.on('connection', (socket) => __awaiter(this, void 0, void 0, function* () {
                this.middleware.checkAuth();
                yield this.getConnectedList();
                this.events.ListenFactory(socket, this.connectedUsers);
                this.logger.logger.info(`socket connected`);
                socket.on('disconnect', () => {
                    this.io.emit(`user ${socket.id} disconnected`);
                    const presentUser = this.connectedUsers.find(id => id == socket.id);
                    this.connectedUsers = this.connectedUsers.filter(user => user != presentUser);
                    this.logger.logger.info(`socket disconnected`);
                    console.log("disconnect");
                });
            }));
        }
        catch (err) {
            this.logger.logger.error(`cannot connect socket ${err}`);
        }
    }
    getConnectedList() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.io.of('/').adapter.sockets(new Set()).then((results) => {
                    results.forEach(id => this.connectedUsers.push(id));
                });
                console.log("initialize connectedUsers");
                this.logger.logger.info("initialize connectedUsers");
            }
            catch (err) {
                this.logger.logger.error(`cannot extract connected users ${err}`);
            }
        });
    }
}
exports.default = RedisAdapter;
//# sourceMappingURL=redis-adapter-handler.js.map