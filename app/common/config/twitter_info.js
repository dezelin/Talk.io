var assert = require('assert'),
	logger = require('winston'),
	nconf = require('nconf'),
	StackType = require('./stack_type').Type,
	StackInfoFactory = require('./stack_info_factory').Factory;

TWITTER_CONSUMER_KEY = 'TWITTER_CONSUMER_KEY';
TWITTER_CONSUMER_SECRET = 'TWITTER_CONSUMER_SECRET';

function TwitterLocalStackInfo() {
}

// Stack type
TwitterLocalStackInfo.prototype.stackType = StackType.LOCAL;

TwitterLocalStackInfo.prototype.getConsumerKey = function () {
	return nconf.get(TWITTER_CONSUMER_KEY);
}

TwitterLocalStackInfo.prototype.getConsumerSecret = function () {
	return nconf.get(TWITTER_CONSUMER_SECRET);
}

function TwitterAppFogStackInfo() {
}

// Stack type
TwitterAppFogStackInfo.prototype.stackType = StackType.APPFOG;

TwitterAppFogStackInfo.prototype.getConsumerKey = function () {
	return nconf.get(TWITTER_CONSUMER_KEY);
}

TwitterAppFogStackInfo.prototype.getConsumerSecret = function () {
	return nconf.get(TWITTER_CONSUMER_SECRET);
}

var TwitterStackInfoFactory = (function () {

	var factoryType = 'TwitterStackInfo';

	function create() {
		return StackInfoFactory.create(factoryType);
	}

	function register(stackType, TwitterStackInfo) {
		StackInfoFactory.register(factoryType, stackType, TwitterStackInfo);
		return TwitterStackInfoFactory;
	}

	return {
		create: create,
		register: register
	};
})();


TwitterStackInfoFactory.register(StackType.LOCAL, TwitterLocalStackInfo);
TwitterStackInfoFactory.register(StackType.APPFOG, TwitterAppFogStackInfo);

module.exports.Factory = TwitterStackInfoFactory;
