var assert = require('assert'),
	logger = require('winston'),
	StackInfoFactory = require('../config/stack_info_factory').Factory;

var AuthProviderFactory = (function() {

	function create(type) {
		return StackInfoFactory.create(type);
	}

	function register(type, stackType, AuthProvider) {
		var proto = AuthProvider.prototype;
		assert(proto.getCallbackUrl,
			'Class must fulfill the auth provider contract.');
		StackInfoFactory.register(type, stackType, AuthProvider);
		return AuthProviderFactory;
	}

	return {
		create: create,
		register: register
	};
})();

module.exports.Factory = AuthProviderFactory;
