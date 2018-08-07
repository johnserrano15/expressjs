const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const Connect = require('../conecction.js');

require('dotenv').config();

const db = new Connect();
conn = db.connect();
const dataSession = {
  secret: process.env.SESSION_SECRET || 'some-secret',
  // resave: true, investigar mas -> https://www.npmjs.com/package/express-session
  resave: false,
  // saveUninitialized: true,
  saveUninitialized: false,
  store: new MongoStore({
    mongooseConnection: conn
  })
}

if (process.env.SESSION_MONGO != 'test') {
  conn = db.connect();
  
  console.info(conn.readyState)

  dataSession['store'] = new MongoStore({
    mongooseConnection: conn,
    // ttl: 14 * 24 * 60 * 60 // = 14 days. Default
  })
} 

module.exports = session(dataSession);
