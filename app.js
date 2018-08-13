const express = require('express');
// const session = require('express-session');
// const MongoStore = require('connect-mongo')(session); // Se usa par aguardar las sessiones en mongodb ya que las sessiones por defecto se guardan en memoria del server.
const bodyParser = require('body-parser');
const passport = require('passport');
const auth = require('./auth');
// const Connect = require('./conecction.js');
const userCtrl = require('./controllers/user');
const middleSession = require('./middlewares/session');
const jwt = require('express-jwt');
// require('dotenv').config();
// const db = new Connect();
// const conn = db.connect();

const app = express();

/* // Esto es un middleware -> La función se ejecuta cada vez que la aplicación recibe una solicitud.
app.use(session({
  secret: process.env.SESSION_SECRET || 'some-secret',
  // resave: true, investigar mas -> https://www.npmjs.com/package/express-session
  resave: false,
  // saveUninitialized: true,
  saveUninitialized: false,
  store: new MongoStore({
    mongooseConnection: conn,
  })
})); */

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// app.use(bodyParser.urlencoded({ extended: false }));

app.set('view engine', 'pug');
// app.set('views', `${__dirname}/views`)
app.use(middleSession);

app.use(passport.initialize());
app.use(passport.session());

passport.use(auth.LocalStrategy);
passport.use(auth.FacebookStrategy);
passport.deserializeUser(auth.deserializeUser);
passport.serializeUser(auth.serializeUser);

app.get('/', (req, res) => {
  // console.log(req.session)
  // console.info(req.user)
  // Cuenta es el nombre que le damos y lo agregamos al object session
  req.session.cuenta = req.session.cuenta ? req.session.cuenta + 1 : 1
  res.status(200).send(`Hola has visto esta página ${req.session.cuenta}`)
  // res.status(200).send('ok bien')
})

app.get('/login/facebook', (req, res) => {
  res.render('index', { title: 'Hey', message: 'Hello there!'});
})

app.get('/user', auth.isAuthenticate, (req, res) => {
  res.render('user', {user: req.user})
})

app.post('/signup', userCtrl.postSignup);
app.post('/login', userCtrl.postLogin);

app.get('/logout', auth.isAuthenticate, userCtrl.logout); // Si esta autenticado, si haga el logout

app.get('/auth/facebook', passport.authenticate('facebook', { scope : ['email'] } ));
app.get('/auth/facebook/callback', passport.authenticate('facebook', {
  successRedirect: '/user',
  failureRedirect: '/login/facebook'
}));

app.get('/user/info', auth.isAuthenticate, (req, res) => {
  res.json(req.user); // Gracias a passport no devuelve un req.user con toda la info del user
});
/*
Payload
{
  "permissions":{
    "metrics":"read"
  },
  "username":"jandrey15",
  "admin":true,
  "iat":1516239022
}
*/
app.get('/protected', jwt({ secret: 'andrey' }), (req, res) => {
  const { user } = req;
  if (!user || !user.username) {
    return res.status(404).send('Not authorized')
  }

  console.log(user)
  if (!req.user.admin) return res.sendStatus(401);
  res.status(200).send(user)
})

module.exports = app;
