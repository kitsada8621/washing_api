FROM node:14.18-alpine

ENV NODE_ENV=production

WORKDIR /usr/src/app
COPY package*.json ./

RUN  npm install

COPY . .

EXPOSE 3000

RUN chown -R node /usr/src/app

USER node

CMD npm run migrate && npm run seed && npm start

