FROM node:6.5
WORKDIR /api
RUN npm install nodemon -g
COPY package.json /api/package.json
RUN npm install
COPY server.js /api
# COPY api/models/* api/models/
# COPY api/controllers/* api/controllers/
# COPY api/routes/* api/routes/
EXPOSE 3000