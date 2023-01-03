// Create an express instance that connects to our db!
require('dotenv').config({ path: `${process.cwd()}/../../.env` });
const express = require('express');
const router = require('./api/routes');

const port = process.env.HTTP_PORT;
const api_url = process.env.API_URL;

const server = express();

server.use(api_url, router);
server.use(express.json({ limit: '100mb' }));
server.listen(port, () => console.log(`Server live at ${port}`));

// salt for cookie hash generation
let salt = 'someUnusualStringThatIsUniqueForThisProject';

// if we are running in production mode and no password salt or short password salt exit
if (process.env.PRODUCTION) {
  if (!process.env.COOKIE_SALT) {
    console.log(
      'Shutting down, in production and missing env. variable COOKIE_SALT'
    );
    process.exit();
  } else if (process.env.COOKIE_SALT.length < 32) {
    console.log('Shutting down, env. variable COOKIE_SALT too short.');
    process.exit();
  } else {
    salt = process.env.COOKIE_SALT;
  }
}

server.use(
  session({
    secret: salt,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: 'auto' },
    // store: store({ dbPath: '' }), !TODO
  })
);
