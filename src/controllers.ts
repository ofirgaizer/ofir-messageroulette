import LoggerConfig from './logger-config'

export default class Controllers {
    logger: LoggerConfig

    constructor(logger: LoggerConfig) {
        this.logger = logger;

    }
    fetchRandomUser(users: string[]): string {
        this.logger.logger.info(`picking random user`);
        return users[Math.floor(Math.floor(Math.random() * users.length))];

    }
    fetchRandomUsers(numOfUsers: number, users: string[]): string[] {
        this.logger.logger.info(`picking random users`);
        var randomUser: string[] = [];
        var random = Math.floor(Math.floor(Math.random() * numOfUsers));
        randomUser.push(users[random]);
        while (!randomUser[random] && randomUser.length < numOfUsers) {
            randomUser.push(users[random])
            random = Math.floor(Math.floor(Math.random() * numOfUsers))
        }
        return randomUser;
    }
}