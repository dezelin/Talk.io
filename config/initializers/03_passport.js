var passport = require('passport')
  , LocalStrategy = require('passport-local').Strategy
  , Account = require('../../app/models/account');

module.exports = function () {
  // Any files in this directory will be `require()`'ed when the application
  // starts, and the exported function will be invoked with a `this` context of
  // the application itself.  Initializers are used to connect to databases and
  // message queues, and configure sub-systems such as authentication.

  // Async initializers are declared by exporting `function(done) { /*...*/ }`.
  // `done` is a callback which must be invoked when the initializer is
  // finished.  Initializers are invoked sequentially, ensuring that the
  // previous one has completed before the next one executes.

  // Use the LocalStrategy within Passport.

  passport.use(new LocalStrategy({
    usernameField: 'email'
  },
    function (email, password, done) {
      // Find the user by username.  If there is no user with the given
      // username, or the password is not correct, set the user to `false` to
      // indicate failure.  Otherwise, return the authenticated `user`.
      Account.authenticate(email, password, function(err, user) {
        return done(err, user);
      });

      return done(null, null);
    }
  ));

  // Passport session setup.

  passport.serializeUser(function (user, done) {
    done(null, user._id);
  });

  passport.deserializeUser(function (id, done) {
    Account.findById(id, function (err, user) {
      done(err, user);
    });

    return done(null, null);
  });

}
