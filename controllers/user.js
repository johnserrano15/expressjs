const passport = require('passport');
const User = require('../models/user');

exports.postSignup = (req, res, next) => {
  const user = new User({
    email: req.body.email,
    name: req.body.name,
    password: req.body.password
  })

  User.findOne({ email: req.body.email }, (err, userExist) => {
    if(userExist) return res.status(400).send('Ya ese email esta registrado.');

    newUser.save((err) => {
      if (err) nex(err);
      // Esto es gracias a passport que nos da un login
      req.logIn(newUser, (err) => {
        if (err) next(err);

        res.status(200).send('User creado exitosamente.');
      })
    })
  })
}

exports.postLogin = (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) next(err)

    if (!user) return res.status(400).send('Email o password no válidos.');

    res.LogIn(user, (err) => {
      if (err) next(err)

      res.status(200).send('Login exitoso');
    })
  })(req, res, next)
}

exports.logout = (req, res) => {
  req.logout();
  // res.redirect('/');
  res.status(200).send('Logout exitoso.')
}