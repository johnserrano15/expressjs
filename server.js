const express = require('express');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session); // Se usa par aguardar las sessiones en mongodb ya que las sessiones por defecto se guardan en memoria del server.
const Connect = require('./conecction.js');
require('dotenv').config();
const db = new Connect();
const conn = db.connect();

const app = express();
const port = 3000;

// Esto es un middleware -> La función se ejecuta cada vez que la aplicación recibe una solicitud.
app.use(session({
  secret: process.env.SESSION_SECRET,
  // resave: true, investigar mas -> https://www.npmjs.com/package/express-session
  resave: false,
  // saveUninitialized: true,
  saveUninitialized: false,
  store: new MongoStore({
    mongooseConnection: conn,
  })
}));

app.get('/', (req, res) => {
  // console.log(req.session)
  // Cuenta es el nombre que le damos y lo agregamos al object session
  req.session.cuenta = req.session.cuenta ? req.session.cuenta + 1 : 1 
  res.status(200).send(`Hola has visto esta página ${req.session.cuenta}`)
})

conn.on('open', () => {
  app.listen(port, () => {
    console.log(`Escuchando en el port ${port}`)
  })
  console.log('Conexión a la base de datos establecidad....')
})