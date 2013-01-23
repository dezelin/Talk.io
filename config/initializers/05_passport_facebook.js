
var assert = require('assert')
  , nconf = require('nconf')
  , step = require('step')
  , passport = require('passport')
  , FacebookStrategy = require('passport-facebook').Strategy
  , Account = require('../../app/models/account')
  , ProviderAccount = require('../../app/models/provider_account')
  , util = require('../../app/common/util');

FACEBOOK_APP_ID = 'FACEBOOK_APP_ID';
FACEBOOK_APP_SECRET = 'FACEBOOK_APP_SECRET';
FACEBOOK_DOMAIN = 'facebook.com';

module.exports = function () {
  // Any files in this directory will be `require()`'ed when the application
  // starts, and the exported function will be invoked with a `this` context of
  // the application itself.  Initializers are used to connect to databases and
  // message queues, and configure sub-systems such as authentication.

  // Async initializers are declared by exporting `function(done) { /*...*/ }`.
  // `done` is a callback which must be invoked when the initializer is
  // finished.  Initializers are invoked sequentially, ensuring that the
  // previous one has completed before the next one executes.

  // Use the FacebookStrategy within Passport.

  var fbAppID = nconf.get(FACEBOOK_APP_ID);
  var fbAppSecret = nconf.get(FACEBOOK_APP_SECRET);
  var fbCallbackURL = util.getAuthCallbackURL({
    provider: GLOBAL.AUTH_PROVIDER_FACEBOOK
  });

  assert(fbAppID,
    'Please specify \'' + FACEBOOK_APP_ID + '\' in config file.');
  assert(fbAppSecret,
    'Please specify \'' + FACEBOOK_APP_SECRET + '\' in config file.');
  assert(fbCallbackURL,
    'Facebook callback URL cannot be constructed.');

  passport.use(new FacebookStrategy({
    clientID: fbAppID,
    clientSecret: fbAppSecret,
    callbackURL: fbCallbackURL,
    passReqToCallback: true
  },
  function (req, accessToken, refreshToken, profile, done) {

    function createProviderAccount() {
      var account = new ProviderAccount();
      account.domain = FACEBOOK_DOMAIN;
      account.uid = profile.id;

      var token = { kind: 'oauth', token: accessToken,
        attributes: { tokenSecret: refreshToken }
      };
      account.tokens.push(token);
      return account;
    };

    process.nextTick(function () {
      if (!req.user) {
        // Not logged-in. Authenticate based on Facebook account.
        step(
          function authenticateNotLoggedIn() {
            ProviderAccount.authenticate(FACEBOOK_DOMAIN, profile.id, this);
          },
          function finish(err, user) {
            if (err || user)
              return done(err, user);

            return done(null, createProviderAccount());
          }
        );
      } else {
        // Logged in. Associate Facebook account with user.  Preserve the login
        // state by supplying the existing user after association.
        var providerAccount;
        step(
          function authenticateLoggedIn() {
            ProviderAccount.authenticate(FACEBOOK_DOMAIN, profile.id, this);
          },
          function updateProviderAccount(err, user) {
            if (err || user)
              throw err;

            var account = createProviderAccount();
            account.save(this);
          },
          function findUserAccount(err, account) {
            if (err)
              throw err;

            providerAccount = account;
            Account.findOne({}, this);
          },
          function associateAccounts(err, user) {
            if (err)
              throw err;

            user.providerAccounts.push(account);
            user.save(this);
          },
          function ignore(err, user) {
            // Ignore errors
            if (err) 
              console.log(err);
          }
        );

        return done(null, req.user);
      }
    });
  }));
}