const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const User = require('../models/user');

// Primero encriptamos la data del object mongoose que no llega por decirlo de alguna manera nos llega ese object y le damos de alta con done y solo pasamos el id de ese user
passport.serializeUser((user, done) => {
  done(null, user._id);
})

// Lo segundo es desencrriptar ese id que nos llega para buscar el user y darle de alta con toda la info de ese user
passport.deserializeUser((id, done) => {
  User.findById(id, (err, user) => {
    done(err, user);
  })
})

passport.use(new LocalStrategy(
  { usernameField: 'email' }, (email, password, done) => {
    User.findOne({ email }, (err, user) => {
      if (err) {
        return done(err);
      }
      if(!user){
        return done(null, false, { message: `Este email: ${email} no esta registrado.`})
      } else {
        user.comparePassword(password, (err, isMatch) => {
          if(isMatch) {
            return done(null, user)
          } else {
            return done(null, false, { message: 'La contrasea no es válida.'})
          }
        });
      }
    })
  }
))

passport.use(new FacebookStrategy({
    clientID: FACEBOOK_APP_ID,
    clientSecret: FACEBOOK_APP_SECRET,
    callbackURL: "http://localhost:3000/auth/facebook/callback"
  },
  function(accessToken, refreshToken, profile, cb) {
    User.findOrCreate({ facebookId: profile.id }, function (err, user) {
      return cb(err, user);
    });
  }
));

exports.isAuthenticate = (req, res, next) => {
  // Este metodo isAuthenticated se envia gracias a passport
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).send("Tienes que hacer login.");
};