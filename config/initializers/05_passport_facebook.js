
var async = require('async')
  , assert = require('assert')
  , nconf = require('nconf')
  , passport = require('passport')
  , logger = require('winston')
  , FacebookStrategy = require('passport-facebook').Strategy
  , Account = require('../../app/models/account')
  , ProviderAccount = require('../../app/models/provider_account')
  , stackInfo = require('../../app/common/stack_info').StackInfo
  , FacebookAuthProviderFactory = require('../../app/common/auth/facebook_provider').Factory
  , util = require('../../app/common/util');

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

  var appId = stackInfo.getFacebookAppId();
  var appSecret = stackInfo.getFacebookAppSecret();
  var authProvider = FacebookAuthProviderFactory.create();
  var callbackUrl = authProvider.getCallbackUrl();
  var authDomain = authProvider.getAuthDomain();

  logger.info('Facebook app. id: ' + appId);
  logger.info('Facebook app. secret: ' + appSecret);
  logger.info('Facebook callback: ' + callbackUrl);

  passport.use(new FacebookStrategy({
    clientID: appId,
    clientSecret: appSecret,
    callbackURL: callbackUrl,
    passReqToCallback: true
  },
  function (req, accessToken, refreshToken, profile, done) {

    var u = require('util');
    logger.info('Facebook returned!!!');
    logger.info('req: ' + u.inspect(req, true, null));
    logger.info('accessToken: ' + u.inspect(accessToken, true, null));
    logger.info('refreshToken: ' + u.inspect(refreshToken, true, null));
    logger.info('profile: ' + u.inspect(profile , true, null));

    function createProviderAccount() {
      var account = new ProviderAccount();
      account.domain = authDomain;
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
        async.waterfall([
          function authenticateNotLoggedIn(callback) {
            ProviderAccount.authenticate(authDomain, profile.id, this);
          },
          function finish(user, callback) {
            if (!user)
              return callback('No user.');

            return callback(null, createProviderAccount());
          }
        ], function(err, result) {
          return done(err, result);
        });
      } else {
        // Logged in. Associate Facebook account with user.  Preserve the login
        // state by supplying the existing user after association.
        var providerAccount;
        async.waterfall([
          function authenticateLoggedIn(callback) {
            ProviderAccount.authenticate(authDomain, profile.id, callback);
          },
          function updateProviderAccount(user, callback) {
            if (!user)
              return callback('No user.');

            var account = createProviderAccount();
            account.save(callback);
          },
          function findUserAccount(account, callback) {
            if (!account)
              return callback('No account.');

            providerAccount = account;
            Account.findOne({}, callback);
          },
          function associateAccounts(user, callback) {
            if (!user)
              return callback('No user.');

            user.providerAccounts.push(account);
            user.save(callback);
          }
        ], function ignore(err, user) {
          // Ignore errors
          if (err)
            logger.error(err);
        });

        return done(null, req.user);
      }
    });
  }));
}
