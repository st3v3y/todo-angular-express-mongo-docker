FROM node:6.5.0
WORKDIR /api
RUN npm install nodemon -g
COPY package.json /api/package.json
RUN npm install
COPY server.js /api
EXPOSE 3000