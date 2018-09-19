require('dotenv').config();

const environment = ['NODE_ENV', 'DATABASE', 'PORT', 'CORS_WHITELIST', 'CLIENT_ID', 'CLIENT_SECRET', 'IS_SILENT_AUTH']; 

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
  CLIENT_ID: process.env.CLIENT_ID,
  CLIENT_SECRET: process.env.CLIENT_SECRET,
  IS_SILENT_AUTH: process.env.IS_SILENT_AUTH,
};
