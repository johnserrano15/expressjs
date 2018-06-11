const express = require('express');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session); // Se usa par aguardar las sessiones en mongodb ya que las sessiones por defecto se guardan en memoria del server.
const bodyParser = require('body-parser');
const passport = require('passport');
const passportConfig = require('./config/passport');
const Connect = require('./conecction.js');
const userCtrl = require('./controllers/user');

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

app.use(passport.initialize());
app.use(passport.session());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  // console.log(req.session)
  // Cuenta es el nombre que le damos y lo agregamos al object session
  req.session.cuenta = req.session.cuenta ? req.session.cuenta + 1 : 1 
  res.status(200).send(`Hola has visto esta página ${req.session.cuenta}`)
})

app.post('/signup', userCtrl.postSignup);
app.post('/login', userCtrl.postLogin);
app.get('/logout', passportConfig.estaAutenticado, userCtrl.logout); // S esta autenticado si haga el logout

app.get('/user/info', passportConfig.estaAutenticado, (req, res) => {
  res.json(req.user); // Gracias a passport no devuelve un req.user con toda la info del user
})

conn.on("error", console.error.bind(console, "connection error"));

conn.on('open', () => {
  app.listen(port, () => {
    console.log(`Escuchando en el port ${port}`)
  })
  console.log('Conexión a la base de datos establecidad....')
})