require('dotenv').config();

const environment = ['NODE_ENV', 'DATABASE', 'PORT', 'CORS_WHITELIST', 'JWT_SECRET', 'IS_SILENT_AUTH', 'TOKEN_EXPIRES_IN']; 

environment.forEach((name) => {
  if (!process.env[name]) {
    throw new Error(`${name}: ${process.env[name]}`);
  }
});

module.exports = {
  NODE_ENV: process.env.NODE_ENV,
  DATABASE: process.env.DATABASE,
  PORT: process.env.PORT,
  CORS_WHITELIST: process.env.CORS_WHITELIST,
  JWT_SECRET: process.env.JWT_SECRET,
  IS_SILENT_AUTH: process.env.IS_SILENT_AUTH,
  TOKEN_EXPIRES_IN: process.env.TOKEN_EXPIRES_IN
};
