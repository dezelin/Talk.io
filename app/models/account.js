
var mongoose = require('mongoose')
  , Schema = mongoose.Schema
  , Email = mongoose.SchemaTypes.Email
  , bcrypt = require('bcrypt')
  , ProviderAccount = require('./provider_account');


var AccountSchema = Schema({
  // Email address
  email: { type: Email, unique: true },

  // bcrypt salted password hash 
  hash: { type: String, required: true },

  // User first and last name
  name: {
    first: { type: String, trim: true, required: true },
    last: { type: String, trim: true, required: true }
  },

  // Associated service provider accounts
  providerAccounts: { type: Schema.Types.ObjectId, ref: 'ProviderAccount' }
}
, {
  shardkey: {
    hash: 1
  }
});

AccountSchema.virtual('password').get(function () {
  return this._password;
});

AccountSchema.virtual('password').set(function (password) {
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

      return callback(null, user);
    });
  });
}

module.exports = mongoose.model('Account', AccountSchema);
