
var async = require('async')
  , assert = require('assert')
  , passport = require('passport')
  , logger = require('winston')
  , GoogleStrategy = require('passport-google-oauth').OAuth2Strategy
  , Account = require('../../app/models/account')
  , ProviderAccount = require('../../app/models/provider_account')
  , stackInfo = require('../../app/common/stack_info').StackInfo
  , GoogleAuthProviderFactory = require('../../app/common/auth/google_provider').Factory
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

  var clientId = stackInfo.getGoogleClientId();
  var clientSecret = stackInfo.getGoogleClientSecret();
  var authProvider = GoogleAuthProviderFactory.create();
  var callbackUrl = authProvider.getCallbackUrl();
  var authDomain = authProvider.getAuthDomain();

  logger.info('Google client id: ' + clientId);
  logger.info('Google client secret: ' + clientSecret);
  logger.info('Google callback: ' + callbackUrl);

  assert(callbackUrl && authDomain,
    'Internal error. Callback URL and domain are not defined.');
  assert(clientId && clientSecret,
    'Please define GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET in your environment.');

  passport.use(new GoogleStrategy({
    clientID: clientId,
    clientSecret: clientSecret,
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
        logger.info('User not logged-in. Authenticate based on Google account.');

        // Not logged-in. Authenticate based on Google account.
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

        // Logged in. Associate Google account with user.  Preserve the login
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
