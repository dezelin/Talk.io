var assert = require('assert')
  , mongoose = require('mongoose')
  , mongooseTypes = require('mongoose-types');

DEFAULT_MONGOOSE_SERVER = 'localhost';
DEFAULT_MONGOOSE_SERVER_PORT = '27017';
DEFAULT_MONGOOSE_DB = 'talk_io';

function parseUri(options) {
  assert(options, 'Illegal argument.');

  var hosts = options.hostnames || [DEFAULT_MONGOOSE_SERVER + 
    ':' + DEFAULT_MONGOOSE_SERVER_PORT];
  var db_name = options.database || DEFAULT_DB_NAME;
  var user = options.username || '';
  var passw = options.password || '';

  var uri = '';
  hosts.forEach(function (val, index, array) {
    assert('string' == typeof val, 'Illegal type.');

    var db_uri = 'mongodb://';
    if (user) {
      db_uri += user;
      if (passw)
        db_uri += ':\'' + passw + '\'';

      db_uri += '@';
    }

    db_uri += val + '/' + db_name;
    if (index < array.length - 1)
      db_uri += ',';

    uri += db_uri;
  });

  return uri;
}

module.exports = function () {
  // Any files in this directory will be `require()`'ed when the application
  // starts, and the exported function will be invoked with a `this` context of
  // the application itself.  Initializers are used to connect to databases and
  // message queues, and configure sub-systems such as authentication.

  // Async initializers are declared by exporting `function(done) { /*...*/ }`.
  // `done` is a callback which must be invoked when the initializer is
  // finished.  Initializers are invoked sequentially, ensuring that the
  // previous one has completed before the next one executes.

  var self = this;

  // Open default db connection
  var options = self.config.mongooseOptions;
  var db_uri = parseUri(options);
  self.db = mongoose.connect(db_uri, options);

  // Load additional mongoose types
  mongooseTypes.loadTypes(mongoose);
}
