import LoggerHandler from './logger-config'

export default class Utils {
    logger: LoggerHandler

    constructor(logger: LoggerHandler) {
        this.logger = logger;

    }
    fetchRandomUser(users: string[]): string {
        this.logger.logger.info(`picking random user`);
        return users[Math.floor(Math.random() * users.length)];

    }
    fetchRandomUsers(numOfUsers: number, users: string[]): string[] {
        this.logger.logger.info(`picking random users`);
        let randomUsers: string[] = [];
        let userIndex = Math.floor(Math.random() * numOfUsers);
        randomUsers.push(users[userIndex]);
        while (!randomUsers[userIndex] && randomUsers.length < numOfUsers) {
            randomUsers.push(users[userIndex])
            userIndex = Math.floor(Math.floor(Math.random() * numOfUsers))
        }
        return randomUsers;
    }
}