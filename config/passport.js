const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const User = require('../models/user');
const UserFacebook = require('../models/userFacebook');
const config = require('../config');

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
    clientID: config.auth.facebook.clientID,
    clientSecret: config.auth.facebook.clientSecret,
    callbackURL: config.auth.facebook.callbackURL,
    profileFields: ['id', 'emails', 'displayName', 'picture']
  },
  function(accessToken, refreshToken, profile, done) {
    // console.info(profile)
    const userProfile = {
      provider_id: profile.id,
      name: profile.displayName,
      photo: profile.photos[0].value,
      email: profile.emails[0].value,
      provider: 'facebook'
    }

    //  process.nextTick(() => {
    //   UserFacebook.findOne({provider_id: profile.id}, (err, user) => {
    //     if (err) return done(err)
    //     if (user) return done(null, user)

    //     const newUser = new UserFacebook();
    //     newUser.provider_id = userInfo.provider_id
    //     newUser.name = userInfo.name
    //     newUser.photo = userInfo.photo
    //     newUser.email = userInfo.email
    //     newUser.provider = userInfo.provider

    //     newUser.save((err) => {
    //       if(err) throw err
    //       return done(null, newUser)
    //     })
    //   })
    // })

    findOrCreate(userProfile, function (err, user) {
      if (err) { return done(err); }
      console.info(user)
      done(null, user);
    });

    function findOrCreate(userInfo, cb) {
      console.info('_________________________')
      User.findOne({provider_id: userInfo.provider_id}, (err, user) => {
        console.info('data user mongo -> '+ user)

        if (err) return cb(err)
        if (user) return cb(null, user)
        
        // console.info(userInfo)
        const newUser = new User();

        newUser.provider_id = userInfo.provider_id
        newUser.name = userInfo.name
        newUser.photo = userInfo.photo
        newUser.email = userInfo.email
        newUser.provider = userInfo.provider

        newUser.save((err) => {
          if(err) throw err
          return cb(null, newUser)
        })
      })
    }
  }
));

exports.isAuthenticate = (req, res, next) => {
  // Este metodo isAuthenticated se envia gracias a passport
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).send("Tienes que hacer login.");
};