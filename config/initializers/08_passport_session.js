var passport = require('passport'),
    logger = require('winston'),
    Account = require('../../app/models/account'),
    ProviderAccount = require('../../app/models/provider_account');

module.exports = function () {
    // Any files in this directory will be `require()`'ed when the application
    // starts, and the exported function will be invoked with a `this` context of
    // the application itself.  Initializers are used to connect to databases and
    // message queues, and configure sub-systems such as authentication.

    // Async initializers are declared by exporting `function(done) { /*...*/ }`.
    // `done` is a callback which must be invoked when the initializer is
    // finished.  Initializers are invoked sequentially, ensuring that the
    // previous one has completed before the next one executes.

    // Passport session setup.

    passport.serializeUser(function (user, done) {
        var tuple = { sessionId: user._id, provisioned: user.authDomain != null };
        logger.info('Serializing session for user \'' + tuple.sessionId
            + '\', provisioned = \'' + tuple.provisioned + '\'');
        done(null, tuple);
    });

    passport.deserializeUser(function (sessionTuple, done) {
        var tuple = sessionTuple || {};
        var id = tuple.sessionId || null;
        var provisioned = tuple.provisioned || null;
        if (!id) {
            logger.error('Missing session data.');
            return done(null, false);
        }

        logger.info('Deserializing session for user \'' + id
            + '\', provisioned = \'' + provisioned + '\'');
        if (provisioned) {
            ProviderAccount.findById(id, function (err, user) {
                if (err)
                    logger.error('Error: ' + err);

                return done(err, { account: user, provisioned: provisioned });
            });
        } else {
            Account.findById(id, function (err, user) {
                if (err)
                    logger.error('Error: ' + err);

                return done(err, { account: user, provisioned: provisioned });
            });
        }
    });
}

