const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const Connect = require('../conecction.js');

const db = new Connect();
const conn = db.createConnection();

module.exports = session({
  secret: process.env.SESSION_SECRET || 'some-secret',
  // resave: true, investigar mas -> https://www.npmjs.com/package/express-session
  resave: false,
  // saveUninitialized: true,
  saveUninitialized: false,
  store: new MongoStore({
    mongooseConnection: conn,
  })
})

// module.exports = conn;