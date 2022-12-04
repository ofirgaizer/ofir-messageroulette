# Message Roulette

Simple service which sends a message to random online users by a specific API.

## setup commands
start and run redis instance

```bash
 docker run --name some-redis -p 6379:6379 -d redis redis-server --save 60 1 --loglevel warning

```
start and run node(v14.15.4) app. npm(v8.18.0)

```bash
npm i
npm start
```

## Events

```typescript
import { Server, Socket } from 'socket.io';

# send a message to a random user
spinEvent()

# send a message to X random users. X will
wildEvent()

# sends a message to all users
blastEvent()
```
## initialize socket
initiate adapter and define events listeners. also handle the connection users state. 
```typescript
import { Server } from 'socket.io';
import { createClient, RedisClientType } from 'redis';
import { createAdapter } from '@socket.io/redis-adapter';
```
## middleware
not a requirement but i wanted to understand the handshake part.

## Cofiguration

```bash
import dotenv from 'dotenv';
const config = dotenv.config();


LOGGER_LEVEL=debug
NODE_ENV='dev'
REDIS_HOST=0.0.0.0
REDIS_PORT=6379
SECRET_KEY=OFIR
URL="http://localhost:3000"

```
## Logger
using winston npm package and write to temporary local txt files.
``` typescript 
import winston from 'winston'
import { Logger } from 'winston';
```

### exemple of client request
**I used postman for simulate client events
so i made collection with test cases**

[postmanCollection](https://go.postman.co/workspace/New-Team-Workspace~97316672-0aef-4533-98f9-46c55bb78561/collection/638b836003643997ed04d9e4)
