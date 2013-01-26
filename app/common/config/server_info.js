var assert = require('assert'),
	logger = require('winston'),
	nconf = require('nconf'),
	EnvType = require('./env_type').Type,
	StackType = require('./stack_type').Type
	StackInfoFactory = require('./stack_info_factory').Factory;

SERVER_LOCAL_URL = 'serverUrl';
SERVER_LOCAL_HOST = 'serverHost';
SERVER_LOCAL_PORT = 'serverPort';
SERVER_LOCAL_NODE_ENV = 'environment';

SERVER_APPFOG_URL = 'serverUrl';
SERVER_APPFOG_HOST = 'VCAP_APP_HOST';
SERVER_APPFOG_PORT = 'VCAP_APP_PORT';
SERVER_APPFOG_NODE_ENV = 'NODE_ENV';

DEVELOPMENT_ENV_LOCAL = 'development';
PRODUCTION_ENV_LOCAL = 'production';

DEVELOPMENT_ENV_APPFOG = 'development';
PRODUCTION_ENV_APPFOG = 'production';

function ServerLocalStackInfo() {
};

// Stack type
ServerLocalStackInfo.prototype.stackType = StackType.LOCAL;

ServerLocalStackInfo.prototype.getServerNodeEnv = function () {
	var envType;
	var nodeEnv = nconf.get(SERVER_LOCAL_NODE_ENV);
	switch (nodeEnv) {
		case DEVELOPMENT_ENV_LOCAL: {
			envType = EnvType.DEV;
			break;
		}
		case PRODUCTION_ENV_LOCAL: {
			envType = EnvType.PROD;
			break;
		}
		default: {
			assert(false, 'Unknown environment type.');
		}
	}

	return envType;
}

ServerLocalStackInfo.prototype.getServerNodeEnvAsString = function () {
	var nodeEnv = nconf.get(SERVER_LOCAL_NODE_ENV);
	switch (nodeEnv) {
		case DEVELOPMENT_ENV_LOCAL:
		case PRODUCTION_ENV_LOCAL:
			break;
		default: {
			assert(false, 'Unknown environment type.');
		}
	}

	return nodeEnv;
}

ServerLocalStackInfo.prototype.getServerUrl = function () {
	return nconf.get(SERVER_LOCAL_URL);
}

ServerLocalStackInfo.prototype.getServerHost = function () {
	return nconf.get(SERVER_LOCAL_HOST);
}

ServerLocalStackInfo.prototype.getServerPort = function () {
	return nconf.get(SERVER_LOCAL_PORT);
}

function ServerAppFogStackInfo () {
}

// Stack type
ServerAppFogStackInfo.prototype.stackType = StackType.APPFOG;

ServerAppFogStackInfo.prototype.getServerNodeEnv = function () {
	var envType;
	var nodeEnv = nconf.get(SERVER_APPFOG_NODE_ENV);
	switch (nodeEnv) {
		case DEVELOPMENT_ENV_APPFOG: {
			envType = EnvType.DEV;
			break;
		}
		case PRODUCTION_ENV_APPFOG: {
			envType = EnvType.PROD;
			break;
		}
		default: {
			assert(false, 'Unknown environment type.');
		}
	}

	return envType;
}

ServerAppFogStackInfo.prototype.getServerNodeEnvAsString = function () {
	var nodeEnv = nconf.get(SERVER_APPFOG_NODE_ENV);
	switch (nodeEnv) {
		case DEVELOPMENT_ENV_APPFOG:
		case PRODUCTION_ENV_APPFOG:
			break;
		default: {
			assert(false, 'Unknown environment type.');
		}
	}

	return nodeEnv;
}

ServerAppFogStackInfo.prototype.getServerUrl = function () {
	return nconf.get(SERVER_APPFOG_URL);
}

ServerAppFogStackInfo.prototype.getServerHost = function () {
	return nconf.get(SERVER_APPFOG_HOST);
}

ServerAppFogStackInfo.prototype.getServerPort = function () {
	return nconf.get(SERVER_APPFOG_PORT);
}

var ServerStackInfoFactory = (function () {

	var factoryType = 'ServerStackInfo';

	function create() {
		return StackInfoFactory.create(factoryType);
	}

	function register(stackType, ServerStackInfo) {
		return StackInfoFactory.register(factoryType, stackType,
			ServerStackInfo);
	}

	return {
		create: create,
		register: register
	};
})();


ServerStackInfoFactory.register(StackType.LOCAL, ServerLocalStackInfo);
ServerStackInfoFactory.register(StackType.APPFOG, ServerAppFogStackInfo);

module.exports.Factory = ServerStackInfoFactory;
