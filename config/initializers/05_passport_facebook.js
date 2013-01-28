
var async = require('async')
  , assert = require('assert')
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

    function createProviderAccount() {
      var account = new ProviderAccount();
      account.authDomain = authDomain;
      account.uid = profile.id;

      var token = { kind: 'oauth', token: accessToken,
        attributes: { tokenSecret: refreshToken }
      };
      account.tokens.push(token);
      return account;
    };

    process.nextTick(function () {

      if (!req.user) {
        logger.info('User not logged-in. Authenticate based on Facebook account.');

        // Not logged-in. Authenticate based on Facebook account.
        async.waterfall([
          function authenticateNotLoggedIn(callback) {
            logger.info('Authenticating provider account: ' + profile.id);
            ProviderAccount.authenticate(authDomain, profile.id, callback);
          },
          function returnAccountOrCreate(account, callback) {
            if (account) {
              logger.info('Provider account \'' + profile.id + '\' already exists.');
              return done(null, account);
            }

            account = createProviderAccount();
            logger.info('Created new provider account \'' + account.uid + '\'');
            account.save(callback);
          },
          function finish(account, callback) {
            // Redirect to the show page
            logger.info('Provider account has been saved. Redirecting user to the show page.');
            return done(null, account);
          }
        ],
        function(err, result) {
          logger.info('Error: ' + err);
          return done(err, result);
        });
      } else {

        console.log('req.user not defined.');

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
        ],
        function ignore(err, user) {
          // Ignore errors
          if (err)
            logger.error(err);
        });

        return done(null, req.user);
      }
    });
  }));
}
