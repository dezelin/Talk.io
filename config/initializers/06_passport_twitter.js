var assert = require('assert'),
	passport = require('passport'),
	logger = require('winston'),
	TwitterStrategy = require('passport-twitter').Strategy,
	stackInfo = require('../../app/common/stack_info').StackInfo,
	TwitterAuthProviderFactory = require('../../app/common/auth/twitter_provider').Factory;

module.exports = function() {
  // Any files in this directory will be `require()`'ed when the application
  // starts, and the exported function will be invoked with a `this` context of
  // the application itself.  Initializers are used to connect to databases and
  // message queues, and configure sub-systems such as authentication.

  // Async initializers are declared by exporting `function(done) { /*...*/ }`.
  // `done` is a callback which must be invoked when the initializer is
  // finished.  Initializers are invoked sequentially, ensuring that the
  // previous one has completed before the next one executes.

  // Use the TwitterStrategy within Passport.

  var consumerKey = stackInfo.getTwitterConsumerKey();
  var consumerSecret = stackInfo.getTwitterConsumerSecret();
  var authProvider = TwitterAuthProviderFactory.create();
  var callbackUrl = authProvider.getCallbackUrl();
  var authDomain = authProvider.getAuthDomain();

  logger.info('Twitter consumer key: ' + consumerKey);
  logger.info('Twitter consumer secret: ' + consumerSecret);
  logger.info('Twitter callback: ' + callbackUrl);

  passport.use(new TwitterStrategy({
  	consumerKey: consumerKey,
  	consumerSecret: consumerSecret,
  	callbackURL: callbackUrl
  },
  function(token, tokenSecret, profile, done) {
    var u = require('util');
    logger.info('Twitter returned!!!');
    logger.info('token: ' + u.inspect(token, true, null));
    logger.info('tokenSecret: ' + u.inspect(tokenSecret, true, null));
    logger.info('profile: ' + u.inspect(profile , true, null));
    done(null, false);
  }));
}
