"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Middleware {
    constructor(io, config, logger) {
        this.config = config;
        this.io = io;
        this.secretKey = process.env.SECRET_KEY;
        this.logger = logger;
    }
    checkAuth() {
        try {
            this.io.use((socket, next) => {
                if (socket.handshake.headers['authorization'] === this.secretKey) {
                    this.logger.logger.info("user is authrized");
                    return next();
                }
                else {
                    this.logger.logger.error("User unauthorized");
                    return next(new Error('User unauthorized'));
                }
            });
        }
        catch (err) {
            this.logger.logger.error(`cant check auth ${err}`);
        }
    }
}
exports.default = Middleware;
//# sourceMappingURL=middleware.js.map