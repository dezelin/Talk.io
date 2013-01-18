
var assert = require('assert');


DEFAULT_MONGOOSE_SERVER = 'localhost';
DEFAULT_MONGOOSE_SERVER_PORT = '27017';
DEFAULT_MONGOOSE_DB = 'talk_io';

DEVELOPMENT_ENV = 'development';
PRODUCTION_ENV = 'production';

module.exports = exports = function() {
  
}

exports.parseMongooseOptions = function parseMongooseOptions(options) {
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
