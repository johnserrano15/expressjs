const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  provider_id: {type: String, unique: true},
  name: String,
  photo: String,
  email: {
    type: String,
    unique: true,
    required: true
  },
  provider: String
})

module.exports = mongoose.model('UserFacebook', UserSchema);
