FROM node:8.11.1-alpine
WORKDIR /api

RUN npm install nodemon -g
COPY package.json /api/package.json
RUN npm install
COPY server.js /api

ENV NODE_ENV=development
ENV DATABASE=mongodb://db:27017/nodeTodo
ENV PORT=3000

EXPOSE 3000