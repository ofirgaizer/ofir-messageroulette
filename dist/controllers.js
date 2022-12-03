"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Controllers {
    constructor(logger) {
        this.logger = logger;
    }
    fetchRandomUser(users) {
        this.logger.logger.info(`fetching random user`);
        return users[Math.floor(Math.floor(Math.random() * users.length))];
    }
    fetchRandomUsers(numOfUsers, users) {
        this.logger.logger.info(`fetching random users`);
        var randomUser = [];
        var random = Math.floor(Math.floor(Math.random() * numOfUsers));
        randomUser.push(users[random]);
        while (!randomUser[random] && randomUser.length < numOfUsers) {
            randomUser.push(users[random]);
            random = Math.floor(Math.floor(Math.random() * numOfUsers));
        }
        return randomUser;
    }
}
exports.default = Controllers;
//# sourceMappingURL=controllers.js.map