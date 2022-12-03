"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const socket_io_1 = require("socket.io");
const dotenv_1 = __importDefault(require("dotenv"));
const logger_config_1 = __importDefault(require("./logger-config"));
const redis_adapter_handler_1 = __importDefault(require("./redis-adapter-handler"));
const config = dotenv_1.default.config();
const logger = new logger_config_1.default();
const io = new socket_io_1.Server();
const adapter = new redis_adapter_handler_1.default(io, config, logger);
adapter.initializeAdapter();
//# sourceMappingURL=app.js.map