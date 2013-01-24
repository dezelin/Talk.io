var assert = require('assert')
  , nconf = require('nconf');


DEVELOPMENT_ENV = 'development';
PRODUCTION_ENV = 'production';


var StacksEnum = { 'LOCAL': 0, 'APPFROG': 1 };
Object.freeze(StacksEnum);

function getStackType () {
  assert(nconf.env, 'Environment not loaded.');
  var type = nconf.env.VCAP_SERVICES ?
    StacksEnum.APPFROG : StacksEnum.LOCAL;
  return type;
}

var FacebookInfo = function () {
  
}

FacebookInfo.prototype.getAppID = function () {
  var id;
  var type = getStackType();
  switch (type) {
    case StacksEnum.LOCAL:
      {
        id = nconf.get('FACEBOOK_APP_ID');
        break;
      }
    case StacksEnum.APPFROG:
      {
        id = nconf.get('FACEBOOK_APP_ID');
        break;
      }
    default:
      {
        assert(false, 'Unknown stack type.');
      }
  }

  assert(id, 'FACEBOOK_APP_ID is not defined.');
  return id;
}

FacebookInfo.prototype.getAppSecret = function () {
  var secret;
  var type = getStackType();
  switch (type) {
    case StacksEnum.LOCAL:
      {
        secret = nconf.get('FACEBOOK_APP_SECRET');
        break;
      }
    case StacksEnum.APPFROG:
      {
        secret = nconf.get('FACEBOOK_APP_SECRET');
        break;
      }
    default:
      {
        assert(false, 'Unknown stack type.');
      }
  }

  assert(secret, 'FACEBOOK_APP_SECRET is not defined.');
  return secret;
}

var StackInfo = function () {
  this.Facebook = new FacebookInfo();
}

StackInfo.prototype.getType = function () {
  return getStackType();
}

StackInfo.prototype.getEnvironment = function () {
  assert(nconf.stores.file, 'config.json not loaded.');
  assert(nconf.stores.env, 'Environment not loaded.');

  var environment;
  var type = this.getType();

  switch (type) {
    case StacksEnum.LOCAL:
      {
        environment = nconf.get('environment');
        break;
      }
    case StacksEnum.APPFROG:
      {
        environment = nconf.get('NODE_ENV');
        break;
      }
    default:
      {
        assert(false, 'Unknown stack type.');
      }
  }

  assert(environment, 'Node environment is not defined.');
  return environment;
}

StackInfo.prototype.getServerURL = function () {
  assert(nconf.stores.file, 'config.json not loaded.');
  assert(nconf.stores.env, 'Environment not loaded.');

  var serverURL;
  var type = this.getType();
  switch (type) {
    case StacksEnum.LOCAL:
      {
        serverURL = nconf.get('serverURL');
        break;
      }
    case StacksEnum.APPFROG:
      {
        serverURL = nconf.get('serverURL');
        break;
      }
    default:
      {
        assert(false, 'Unknown stack type.');
      }
  }

  assert(serverURL, 'Server URL is not defined.');
  return serverURL;
}

StackInfo.prototype.getServerHost= function () {
  assert(nconf.stores.file, 'config.json not loaded.');
  assert(nconf.stores.env, 'Environment not loaded.');

  var serverHost;
  var type = this.getType();
  switch (type) {
    case StacksEnum.LOCAL:
      {
        serverHost = nconf.get('serverHost');
        break;
      }
    case StacksEnum.APPFROG:
      {
        serverHost = nconf.get('VCAP_APP_HOST');
        break;
      }
    default:
      {
        assert(false, 'Unknown stack type.');
      }
  }

  assert(serverHost, 'Server host address is not defined.');
  return serverHost;
}

StackInfo.prototype.getServerPort = function () {
  assert(nconf.stores.file, 'config.json not loaded.');
  assert(nconf.stores.env, 'Environment not loaded.');

  var serverPort;
  var type = this.getType();
  switch (type) {
    case StacksEnum.LOCAL:
      {
        serverPort = nconf.get('serverPort');
        break;
      }
    case StacksEnum.APPFROG:
      {
        serverPort = nconf.get('VCAP_APP_PORT');
        break;
      }
    default:
      {
        assert(false, 'Unknown stack type.');
      }
  }

  assert(serverPort, 'Server port is not defined.');
  return serverPort;
}

module.exports = new StackInfo();
