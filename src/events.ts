import { DotenvConfigOutput } from "dotenv";
import LoggerHandler from "./logger-config";
import { Server, Socket } from 'socket.io';
import Utils from "./utils-functions";

export default class Events {

    private utilsFunctions: Utils
    constructor(private io: Server, private config: DotenvConfigOutput, private logger: LoggerHandler) {
        this.config = config
        this.logger = logger;
        this.io = io;
        this.utilsFunctions = new Utils(logger);
    }
    spinEvent(connectedUsers: string[]) {
        try {

            let randomUser = this.utilsFunctions.fetchRandomUser(connectedUsers);
            this.io.to(randomUser).emit(`incomeMessage`, `hello random user ${randomUser}`);
            this.logger.logger.info(`sent to random user ${randomUser}`);

        }
        catch (err) {
            this.logger.logger.error(err);
        }

    }
    wildEvent(connectedUsers: string[],message) {
        try {
                
                if (!message.numOfRandoms||!(message.numOfRandoms>'0'&&message.numOfRandoms<`${connectedUsers.length+1}`)) {
                    this.io.emit(`incomeMessage`, "The syntax is incorrect please send a number in wild message")
                    this.logger.logger.info(`message not valid`);

                }
                else{
                let randomUsers = this.utilsFunctions.fetchRandomUsers(message.numOfRandoms, connectedUsers);
                this.io.to([...randomUsers]).emit(`incomeMessage`, `hello picking randoms ${[...randomUsers]}`);
                this.logger.logger.info(`sent to random users ${[...randomUsers]}`);
        
                }
                

        }
        catch (err) {
            this.logger.logger.error(err);
        }
    }
    blastEvent() {
        try {
            this.io.emit('incomeMessage', "hello everyone");
        }
        catch (err) {
            this.logger.logger.error(err);
        }
    }
    ListenFactory(socket: Socket, connectedUsers: string[]) {
        socket.on("spin", () => this.spinEvent(connectedUsers));
        socket.on("wild", (message) => this.wildEvent(connectedUsers,message));
        socket.on("blast", () => this.blastEvent());
    }

}