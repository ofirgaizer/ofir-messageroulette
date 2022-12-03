FROM node:14

ENV NODE_ENV=dev

WORKDIR usr/src/app

COPY ["package.json", "package-lock.json*", "./"]

RUN npm install --dev

COPY . .
EXPOSE 3000
CMD [ "npm", "start" ]

