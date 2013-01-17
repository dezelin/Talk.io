
var mongoose = require('mongoose')
  , Schema = mongoose.Schema
  , Email = mongoose.SchemaTypes.Email
  , bcrypt = require('bcrypt');


var AccountSchema = Schema({
  // Shard key
  shard: { type: String, unique: true },

  // Email address
  email: { type: Email, unique: true },

  // bcrypt salted password hash 
  hash: { type: String, required: true },

  // User first and last name
  name: {
    first: { type: String, required: true },
    last: { type: String, required: true }
  }
});

AccountSchema.virtuals.password.get(function () {
  return this._password;
});

AccountSchema.virtuals.password.set(function (password) {
  this._password = password;
  var salt = bcrypt.genSaltSync(10); // 10 rounds of salt processing
  this.hash = bcrypt.hashSync(password, salt);
});

AccountSchema.methods.checkPassword = function (password, callback) {
  bcrypt.compare(password, this.hash, callback);
}

AccountSchema.statics.authenticate = function (email, password, callback) {
  this.findOne({ email: email }, function (err, user) {
    if (err)
      return callback(err);

    if (!user)
      return callback(null, false);

    user.checkPassword(password, function (err, passwordCorrect) {
      if (err)
        return callback(err);

      if (!passwordCorrect)
        return callback(null, false);

      return callback(null, true);
    });
  });
}

module.exports = mongoose.model('Account', AccountSchema);
