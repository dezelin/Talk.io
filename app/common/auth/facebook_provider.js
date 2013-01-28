var assert = require('assert'),
	AuthProvider = require('./auth_provider').Type,
	AuthProviderFactory = require('./auth_provider_factory').Factory,
	StackType = require('../config/stack_type').Type;

AUTH_DOMAIN = 'facebook.com';
CALLBACK_PATHNAME = '/auth/facebook/callback';

function FacebookAuthProvider() {
	AuthProvider.call(this, { pathname: CALLBACK_PATHNAME });
}

FacebookAuthProvider.prototype = new AuthProvider();

FacebookAuthProvider.prototype.getAuthDomain = function() {
	return AUTH_DOMAIN;
}

function FacebookLocalAuthProvider() {
	FacebookAuthProvider.call(this);
}

FacebookLocalAuthProvider.prototype = new FacebookAuthProvider();
FacebookLocalAuthProvider.prototype.stackType = StackType.LOCAL;

function FacebookAppFogAuthProvider() {
	FacebookAuthProvider.call(this);
}

FacebookAppFogAuthProvider.prototype = new FacebookAuthProvider();
FacebookAppFogAuthProvider.prototype.stackType = StackType.APPFOG;

var FacebookAuthProviderFactory = (function(){

	var factoryType = 'FacebookAuthProvider';

	function create() {
		return AuthProviderFactory.create(factoryType);
	}

	function register(stackType, FacebookAuthProvider) {
		AuthProviderFactory.register(factoryType, stackType,
			FacebookAuthProvider);
		return FacebookAuthProviderFactory;
	}

	return {
		create: create,
		register: register
	};
})();

FacebookAuthProviderFactory.register(StackType.LOCAL, FacebookLocalAuthProvider);
FacebookAuthProviderFactory.register(StackType.APPFOG, FacebookAppFogAuthProvider);

module.exports.Factory = FacebookAuthProviderFactory;
