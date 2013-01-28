var assert = require('assert'),
	AuthProvider = require('./auth_provider').Type,
	AuthProviderFactory = require('./auth_provider_factory').Factory,
	StackType = require('../config/stack_type').Type;

AUTH_DOMAIN = 'twitter.com';
CALLBACK_PATHNAME = '/auth/twitter_callback';

function TwitterAuthProvider() {
	AuthProvider.call(this, { pathname: CALLBACK_PATHNAME });
}

TwitterAuthProvider.prototype = new AuthProvider();

TwitterAuthProvider.prototype.getAuthDomain = function() {
	return AUTH_DOMAIN;
}

function TwitterLocalAuthProvider() {
	TwitterAuthProvider.call(this);
}

TwitterLocalAuthProvider.prototype = new TwitterAuthProvider();
TwitterLocalAuthProvider.prototype.stackType = StackType.LOCAL;

function TwitterAppFogAuthProvider() {
	TwitterAuthProvider.call(this);
}

TwitterAppFogAuthProvider.prototype = new TwitterAuthProvider();
TwitterAppFogAuthProvider.prototype.stackType = StackType.APPFOG;

var TwitterAuthProviderFactory = (function(){

	var factoryType = 'TwitterAuthProvider';

	function create() {
		return AuthProviderFactory.create(factoryType);
	}

	function register(stackType, TwitterAuthProvider) {
		AuthProviderFactory.register(factoryType, stackType,
			TwitterAuthProvider);
		return TwitterAuthProviderFactory;
	}

	return {
		create: create,
		register: register
	};
})();

TwitterAuthProviderFactory.register(StackType.LOCAL, TwitterLocalAuthProvider);
TwitterAuthProviderFactory.register(StackType.APPFOG, TwitterAppFogAuthProvider);

module.exports.Factory = TwitterAuthProviderFactory;
