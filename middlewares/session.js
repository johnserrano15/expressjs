const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const Connect = require('../conecction.js');

require('dotenv').config();

const dataSession = {
  secret: process.env.SESSION_SECRET || 'some-secret',
  // resave: true, investigar mas -> https://www.npmjs.com/package/express-session
  resave: false,
  // saveUninitialized: true,
  saveUninitialized: false,
}

if (process.env.SESSION_MONGO === 'test') {
  dataSession['cookie'] = { maxAge: 60000 }
  dataSession['expires'] = new Date(Date.now() + (900000))
  dataSession['maxAge'] = new Date(Date.now() + (900000))
}

console.info(dataSession)

if (process.env.SESSION_MONGO != 'test') {
  const db = new Connect();
  const conn = db.connect();
  
  console.info(conn.readyState)

  dataSession['store'] = new MongoStore({
    mongooseConnection: conn,
    // ttl: 14 * 24 * 60 * 60 // = 14 days. Default
  })
} 

module.exports = session(dataSession);
