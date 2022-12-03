"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const controllers_1 = __importDefault(require("./controllers"));
class Routes {
    constructor(io, config, logger) {
        this.config = config;
        this.logger = logger;
        this.io = io;
        this.controllers = new controllers_1.default(logger);
    }
    spinEvent(connectedUsers) {
        try {
            var randomUser = this.controllers.fetchRandomUser(connectedUsers);
            this.io.to(randomUser).emit("spin", `hello random user ${randomUser}`);
            this.logger.logger.info(`sent to random user ${randomUser}`);
        }
        catch (err) {
            this.logger.logger.error(err);
        }
    }
    wildEvent(connectedUsers, msg) {
        try {
            var randomUsers = this.controllers.fetchRandomUsers(msg.numOfRandoms, connectedUsers);
            this.io.to([...randomUsers]).emit(`incomeMessage`, `hello picking randoms ${randomUsers}`);
            this.logger.logger.info(`sent to random users ${randomUsers}`);
        }
        catch (err) {
            this.logger.logger.error(err);
        }
    }
    blastEvent() {
        try {
            this.io.emit('incomeMessage', "hello everyone");
            console.log("blast");
        }
        catch (err) {
            this.logger.logger.error(err);
        }
    }
    ListenFactory(socket, connectedUsers) {
        socket.on("spin", () => this.spinEvent(connectedUsers));
        socket.on("wild", (msg) => this.wildEvent(connectedUsers, msg));
        socket.on("blast", () => this.blastEvent());
    }
}
exports.default = Routes;
//# sourceMappingURL=routes.js.map