import LoggerHandler from './logger-config'

export default class Utils {

    constructor(private logger: LoggerHandler) {
        this.logger = logger;

    }
    fetchRandomUser(users: string[]): string {
        this.logger.logger.info(`picking random user`);
        return users[Math.floor(Math.floor(Math.random() * users.length))];

    }
    fetchRandomUsers(numOfUsers: number, connectedUsers: string[]): Set<string> {
        var maxCollectionLength=Math.max(numOfUsers,connectedUsers.length);// +operator didnt work for me when i use > operator on if statment
        if (maxCollectionLength==numOfUsers) {
            return new Set(connectedUsers);
        }
        this.logger.logger.info(`picking random users`);
        let randomUsers = new Set<string>();
        while (randomUsers.size < maxCollectionLength) {
            randomUsers.add(this.fetchRandomUser(connectedUsers))
        }
        return randomUsers;
    }
}