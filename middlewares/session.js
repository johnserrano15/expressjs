const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const Connect = require('../conecction.js');

require('dotenv').config();

const db = new Connect();

const dataSession = {
  secret: process.env.SESSION_SECRET || 'some-secret',
  // resave: true, investigar mas -> https://www.npmjs.com/package/express-session
  resave: false,
  // saveUninitialized: true,
  saveUninitialized: false
}

if (process.env.SESSION_MONGO != 'test') {
  conn = db.connect();
  
  console.info(conn.readyState)

  dataSession['store'] = new MongoStore({
    mongooseConnection: conn,
  })
} 

module.exports = session(dataSession);
