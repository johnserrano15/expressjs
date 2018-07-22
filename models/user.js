const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  email: {
    type: String,
    unique: true,
    lowercase: true,
    required: true
  },
  password: { type: String },
  name: { type: String, required: true },
  provider_id: {type: String, unique: true},
  photo: String,
  provider: String
}, {
  timestamps: true
})

UserSchema.pre('save', function(next) {
  let user = this;
  // Si el password no a cambiado le damos next esto es en el caso cuando el user ya esta creado y se cambia el nombre por ejemplo.
  if(!user.isModified('password')) return next()

  bcrypt.genSalt(10, (err, salt) => {
    if (err) return next(err)

    bcrypt.hash(user.password, salt, null, (err, hash) => {
      if (err) return next(err)

      user.password = hash;
      next()
    })
  })  
})

UserSchema.methods.comparePassword = function (password, cb) {
  bcrypt.compare(password, this.password, function (err, isMatch) {
    if (err) return cb(err);
    cb(null, isMatch);
  });
}

module.exports = mongoose.model('User', UserSchema);
