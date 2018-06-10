const passport = require('passport');
const User = require('../models/user');

exports.postSignup = (req, res, next) => {
  const user = new User({
    email: req.body.email,
  })
}