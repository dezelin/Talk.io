
var assert = require('assert')
  , nconf = require('nconf')
  , url = require('url');


DEFAULT_MONGOOSE_SERVER = 'localhost';
DEFAULT_MONGOOSE_SERVER_PORT = '27017';
DEFAULT_MONGOOSE_DB = 'talk_io';

DEVELOPMENT_ENV = 'development';
PRODUCTION_ENV = 'production';

NCONF_WEB_APP_URL = 'webAppUrl';
DEFAULT_WEB_APP_URL = 'http://localhost/';

AUTH_PROVIDER_FACEBOOK = 'Facebook';

ASSERT_ILLEGAL_ARG = 'Illegal argument.';
ASSERT_ILLEGAL_TYPE = 'Illegal type.';

module.exports = exports = function() {
  
}

exports.parseMongooseOptions = function parseMongooseOptions(options) {
  assert(options, ASSERT_ILLEGAL_ARG);

  var hosts = options.hostnames || [DEFAULT_MONGOOSE_SERVER +
    ':' + DEFAULT_MONGOOSE_SERVER_PORT];
  var db_name = options.database || DEFAULT_DB_NAME;
  var user = options.username || '';
  var passw = options.password || '';

  var uri = '';
  hosts.forEach(function (val, index, array) {
    assert('string' == typeof val, ASSERT_ILLEGAL_TYPE);

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

exports.getAuthCallbackURL = function getAuthCallbackURL(options) {
  assert(options, ASSERT_ILLEGAL_ARG);
  assert(options.provider, ASSERT_ILLEGAL_ARG);

  var webAppUrl = nconf.get(NCONF_WEB_APP_URL) || DEFAULT_WEB_APP_URL;
  var URL = url.parse(webAppUrl);
  var port = URL.port || nconf.get('PORT');
  assert(port, 'Please specify port in \'' + NCONF_WEB_APP_URL + 
    '\' in config file or as the PORT environment variable.');

  var callbackURL = {};
  callbackURL.protocol = URL.protocol;
  callbackURL.hostname = URL.hostname;
  callbackURL.port = port;

  switch (options.provider) {
    case AUTH_PROVIDER_FACEBOOK:
      {
        callbackURL.pathname = '/auth/facebook/callback';
        break;
      }
    default:
      {
        assert(!"Unknown auth provider.");
      }
  }

  // Return formatted URL
  return url.format(callbackURL);
}
