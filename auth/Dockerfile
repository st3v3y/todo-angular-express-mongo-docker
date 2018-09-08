FROM node:8.11.1-alpine
WORKDIR /auth

COPY package.json /api/package.json
RUN npm install
COPY index.js /auth

ENV NODE_ENV=development
ENV DATABASE=mongodb://db:27017/auth
ENV PORT=3099

EXPOSE 3099