FROM node:8.11.1-alpine
WORKDIR /api

RUN npm install nodemon -g
COPY package.json /api/package.json
RUN npm install
COPY server.js /api

ENV NODE_ENV=development
ENV DATABASE=mongodb://db:27017/nodeTodo
ENV PORT=3000
ENV CORS_WHITELIST=["http://localhost:4200","http://web:3200","http://auth:3099"]
ENV CLIENT_ID="497c5285585932288e862dab0ee0f1e8"
ENV CLIENT_SECRET="de7f01d082e6ca05444f6c2b294f61ca60f00f56e677bcfe4c8507f7d62bd0bd"
ENV IS_SILENT_AUTH="true"

EXPOSE 3000