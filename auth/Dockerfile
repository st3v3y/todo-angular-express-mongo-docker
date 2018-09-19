FROM node:8.11.1-alpine
WORKDIR /auth

RUN npm install nodemon -g
COPY package.json /auth/package.json
RUN npm install
COPY server.js /auth

ENV NODE_ENV=development
ENV DATABASE=mongodb://db:27017/auth
ENV PORT=3099
ENV CORS_WHITELIST=["http://localhost:4200","http://api:3000"]
ENV IS_SILENT_AUTH="true"
ENV JWT_SECRET="supersecret"
ENV TOKEN_EXPIRES_IN=86400

EXPOSE 3099