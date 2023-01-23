// Create an express instance that connects to our db!
require('dotenv').config({ path: `${process.cwd()}/../../.env` });
const express = require('express');
const router = require('./api/routes.cjs');
const session = require('express-session');
const { default: pool } = require('./db.cjs');

const port = process.env.BACKEND_HTTP_PORT;
const api_url = process.env.API_URL;

const server = express();

// salt for cookie hash generation
let salt;

// if we are running in production mode and no password salt or short password salt exit
if (!process.env.COOKIE_SALT) {
  console.log('NOT Using .env COOKIE_SALT, shutting down');
  process.exit();
} else if (process.env.COOKIE_SALT.length < 32) {
  console.log('.env variable COOKIE_SALT too short!');
  process.exit();
} else {
  salt = process.env.COOKIE_SALT;
}

const store = new (require('connect-pg-simple')(session))({
  conObject: pool,
  conString: process.env.CON_STRING,
});

server.use(
  session({
    secret: salt,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: 'auto' },
    store: store,
  })
);
// Limiting the body to 50KB
server.use(express.json({ limit: '50KB' }));
server.use(api_url, router);
server.listen(port, () => console.log(`Server live at ${port}`));
