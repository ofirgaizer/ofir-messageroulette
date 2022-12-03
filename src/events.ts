import { DotenvConfigOutput } from "dotenv";
import LoggerHandler from "./logger-config";
import { Server, Socket } from 'socket.io';
import Utils from "./utils-functions";
import SocketInitializer from "./initialize-socket";

export default class Events {
    io: Server
    config: DotenvConfigOutput
    logger: LoggerHandler
    controllers: Utils
    adapter: SocketInitializer
    constructor(io: Server, config: DotenvConfigOutput, logger: LoggerHandler) {
        this.config = config
        this.logger = logger;
        this.io = io;
        this.controllers = new Utils(logger);
    }
    spinEvent(connectedUsers: string[]) {
        try {

            var randomUser = this.controllers.fetchRandomUser(connectedUsers);
            this.io.to(randomUser).emit("spin", `hello random user ${randomUser}`);
            this.logger.logger.info(`sent to random user ${randomUser}`);

        }
        catch (err) {
            this.logger.logger.error(err);
        }

    }
    wildEvent(connectedUsers: string[],socket:Socket) {
        try {
            this.io.emit(`incomeMessage`, "How many users would you like to send to?")
            let message;
            socket.on('message', (msg) => {
                message=msg;
                while(!message.numOfRandoms||!(message.numOfRandoms<'9'&&message.numOfRandoms>'0'))
                {
                    this.io.emit(`incomeMessage`, "The syntax is incorrect please send a number")
                    socket.on('message', (newMsg) => {
                        message=newMsg;
                    })

                }
                var randomUsers = this.controllers.fetchRandomUsers(msg.numOfRandoms, connectedUsers);
                this.io.to([...randomUsers]).emit(`incomeMessage`, `hello picking randoms ${randomUsers}`);
                this.logger.logger.info(`sent to random users ${randomUsers}`);
            })

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
    ListenFactory(socket: Socket, connectedUsers: string[]) {
        socket.on("spin", () => this.spinEvent(connectedUsers));
        socket.on("wild", () => this.wildEvent(connectedUsers,socket));
        socket.on("blast", () => this.blastEvent());
    }

}