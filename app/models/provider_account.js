var mongoose = require('mongoose')
  , Schema = mongoose.Schema;

var __TokensSchema = Schema({
  // Token type
  kind: { type: String, required: true },

  // Token
  token: { type: String, required: true },

  // Token attributes
  attributes: { type: Schema.Types.Mixed }
});

var ProviderAccountSchema = Schema({
  // OAuth user domain: 'twitter.com', 'facebook.com', 'google.com'...
  authDomain: { type: String, required: true },

  // OAuth user id
  uid: { type: String, required: true },

  // OAuth tokens
  tokens: { type: [__TokensSchema] }
},
{
  shardkey: {
    uid: 1
  }
});

ProviderAccountSchema.statics.authenticate = function (domain, uid, callback) {
  this.findOne({ authDomain: domain, uid: uid }, function (err, user) {
    if (err)
      return callback(err);

    if (!user)
      return callback(null, false);

    return callback(null, user);
  });
}

module.exports = mongoose.model('ProviderAccount', ProviderAccountSchema);
