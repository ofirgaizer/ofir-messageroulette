import createServer from "http"
import  {Server, Socket} from  "socket.io"
import jest from 'jest'
import Client from "socket.io-client"
import dotenv from 'dotenv'
const config = dotenv.config();

let clients;

const URL = process.env.URL || "http://localhost:3000";
const POLLING_PERCENTAGE = 0.05;

const createClient = () => {
  const transports =
    Math.random() < POLLING_PERCENTAGE ? ["polling"] : ["polling", "websocket"];

  return Client(URL, {
    transports,
  });

}
describe("my awesome project", () => {
let io, serverSocket,clientSocket;

  beforeAll(() => {
    for (let i=0; i<10; i++)
    {
        clients.push(createClient())

    }
    clientSocket=createClient();
    const httpServer=createServer.createServer();
    io = new Server(httpServer);
    httpServer.listen();
    
      io.on("connection", (socket) => {
        serverSocket = socket;
      });
    });

  afterAll(() => {
    io.close();
  });

  test("try", (done) => {
    clientSocket.emit("wild", (message) => {
      expect(message).toBe("How many users would you like to send to");
      done();
    });
    serverSocket.emit("hello", "world");
  });  
  });
