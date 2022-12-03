import { DotenvConfigOutput } from "dotenv";
import LoggerConfig from "./logger-config";
import { Server, Socket } from 'socket.io';
import Controllers from "./controllers";
import SocketInitializer from "./initialize-socket";

export default class Events{
    io:Server
    config:DotenvConfigOutput
    logger:LoggerConfig
    controllers:Controllers
    adapter:SocketInitializer
    constructor(io:Server,config:DotenvConfigOutput,logger:LoggerConfig){
        this.config=config
        this.logger=logger;
        this.io=io;       
        this.controllers=new Controllers(logger);
    }
    spinEvent(connectedUsers:string[])
    {
        try{
           
                var randomUser=this.controllers.fetchRandomUser(connectedUsers);
                this.io.to(randomUser).emit("spin",`hello random user ${randomUser}`);
                this.logger.logger.info(`sent to random user ${randomUser}`);
        
        }
       catch(err)
       {
        this.logger.logger.error(err);
       }
       
    }
    wildEvent(connectedUsers:string[],msg)
    {
       try{ 
            var randomUsers=this.controllers.fetchRandomUsers(msg.numOfRandoms,connectedUsers);
            this.io.to([...randomUsers]).emit(`incomeMessage`,`hello picking randoms ${randomUsers}`);
            this.logger.logger.info(`sent to random users ${randomUsers}`);
        }
        catch(err)
        {
            this.logger.logger.error(err);
        }
    }
    blastEvent()
    {
       try{ 
            this.io.emit('incomeMessage',"hello everyone");
            console.log("blast");
        }
        catch(err)
        {
            this.logger.logger.error(err);
        }
    }
   ListenFactory(socket:Socket,connectedUsers:string[])
   {
    socket.on("spin", () => this.spinEvent(connectedUsers));
    socket.on("wild", (msg) => this.wildEvent(connectedUsers, msg));
    socket.on("blast", () => this.blastEvent());
   }
    
}