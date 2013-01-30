var assert = require('assert'),
	logger = require('winston'),
	nconf = require('nconf'),
	StackType = require('./stack_type').Type,
	StackInfoFactory = require('./stack_info_factory').Factory;

GOOGLE_CLIENT_ID = 'GOOGLE_CLIENT_ID';
GOOGLE_CLIENT_SECRET = 'GOOGLE_CLIENT_SECRET';

function GoogleLocalStackInfo() {
}

// Stack type
GoogleLocalStackInfo.prototype.stackType = StackType.LOCAL;

GoogleLocalStackInfo.prototype.getClientId = function () {
	return nconf.get(GOOGLE_CLIENT_ID);
}

GoogleLocalStackInfo.prototype.getClientSecret = function () {
	return nconf.get(GOOGLE_CLIENT_SECRET);
}

function GoogleAppFogStackInfo() {
}

// Stack type
GoogleAppFogStackInfo.prototype.stackType = StackType.APPFOG;

GoogleAppFogStackInfo.prototype.getClientId = function () {
	return nconf.get(GOOGLE_CLIENT_ID);
}

GoogleAppFogStackInfo.prototype.getClientSecret = function () {
	return nconf.get(GOOGLE_CLIENT_SECRET);
}

var GoogleStackInfoFactory = (function () {

	var factoryType = 'GoogleStackInfo';

	function create() {
		return StackInfoFactory.create(factoryType);
	}

	function register(stackType, GoogleStackInfo) {
		StackInfoFactory.register(factoryType, stackType, GoogleStackInfo);
		return GoogleStackInfoFactory;
	}

	return {
		create: create,
		register: register
	};
})();


GoogleStackInfoFactory.register(StackType.LOCAL, GoogleLocalStackInfo);
GoogleStackInfoFactory.register(StackType.APPFOG, GoogleAppFogStackInfo);

module.exports.Factory = GoogleStackInfoFactory;
