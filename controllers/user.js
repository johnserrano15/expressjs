const passport = require('passport');
const User = require('../models/user');
const jwt = require('../auth/index')

exports.postSignup = (req, res, next) => {
  const newUser = new User({
    email: req.body.email,
    name: req.body.name,
    password: req.body.password
  })

  User.findOne({ email: req.body.email }, (err, userExist) => {
    if(userExist) return res.status(400).send('Ya ese email esta registrado.');

    newUser.save((err) => {
      if (err) return next(err);
      // Esto es gracias a passport que nos da un login
      req.logIn(newUser, (err) => {
        if (err) return next(err);

        const token = jwt.sign(newUser, 'andrey')
        console.log('Este es el token -> ', token)
        req.session.token = req.session.token ? req.session.token : req.session.token = token

        res.status(200).send({ message: 'User creado exitosamente.', token: token });
      })
    })
  })
}

/*
  app.post('/login', 
  passport.authenticate('local', { failureRedirect: '/login' }),
  function(req, res) {
    res.redirect('/');
  });
*/

exports.postLogin = (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) return next(err)

    if (!user) return res.status(400).send('Email o password no válidos.');

    req.logIn(user, (err) => {
      if (err) return next(err)

      const payload = { name: user.name, email: user.email }
      const token = jwt.sign(payload, 'andrey')
      console.log('Este es el token -> ', token)
      req.session.token = req.session.token ? req.session.token : req.session.token = token

      // res.status(200).send({ message: 'Login exitoso', token: token });
      res.status(200).render('user');
    })
  })(req, res, next)
}

exports.logout = (req, res) => {
  req.logout();
  // res.redirect('/');
  // res.status(200).send('Logout exitoso.')
  res.status(200).render('index');
}