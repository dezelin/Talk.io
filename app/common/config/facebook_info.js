var assert = require('assert'),
	logger = require('winston'),
	nconf = require('nconf'),
	StackType = require('./stack_type').Type,
	StackInfoFactory = require('./stack_info_factory').Factory;

FACEBOOK_APP_ID = 'FACEBOOK_APP_ID';
FACEBOOK_APP_SECRET = 'FACEBOOK_APP_SECRET';

function FacebookLocalStackInfo() {
}

// Stack type
FacebookLocalStackInfo.prototype.stackType = StackType.LOCAL;

FacebookLocalStackInfo.prototype.getAppId = function () {
	return nconf.get(FACEBOOK_APP_ID);
}

FacebookLocalStackInfo.prototype.getAppSecret = function () {
	return nconf.get(FACEBOOK_APP_SECRET);
}

function FacebookAppFogStackInfo() {
}

// Stack type
FacebookAppFogStackInfo.prototype.stackType = StackType.APPFOG;

FacebookAppFogStackInfo.prototype.getAppId = function () {
	return nconf.get(FACEBOOK_APP_ID);
}

FacebookAppFogStackInfo.prototype.getAppSecret = function () {
	return nconf.get(FACEBOOK_APP_SECRET);
}

var FacebookStackInfoFactory = (function () {

	var factoryType = 'FacebookStackInfo';

	function create() {
		return StackInfoFactory.create(factoryType);
	}

	function register(stackType, FacebookStackInfo) {
		StackInfoFactory.register(factoryType, stackType, FacebookStackInfo);
		return FacebookStackInfoFactory;
	}

	return {
		create: create,
		register: register
	};
})();


FacebookStackInfoFactory.register(StackType.LOCAL, FacebookLocalStackInfo);
FacebookStackInfoFactory.register(StackType.APPFOG, FacebookAppFogStackInfo);

module.exports.Factory = FacebookStackInfoFactory;
