var assert = require('assert'),
	AuthProvider = require('./auth_provider').Type,
	AuthProviderFactory = require('./auth_provider_factory').Factory,
	StackType = require('../config/stack_type').Type;

AUTH_DOMAIN = 'Google.com';
CALLBACK_PATHNAME = '/auth/google/callback';

function GoogleAuthProvider() {
	AuthProvider.call(this, { pathname: CALLBACK_PATHNAME });
}

GoogleAuthProvider.prototype = new AuthProvider();

GoogleAuthProvider.prototype.getAuthDomain = function() {
	return AUTH_DOMAIN;
}

function GoogleLocalAuthProvider() {
	GoogleAuthProvider.call(this);
}

GoogleLocalAuthProvider.prototype = new GoogleAuthProvider();
GoogleLocalAuthProvider.prototype.stackType = StackType.LOCAL;

function GoogleAppFogAuthProvider() {
	GoogleAuthProvider.call(this);
}

GoogleAppFogAuthProvider.prototype = new GoogleAuthProvider();
GoogleAppFogAuthProvider.prototype.stackType = StackType.APPFOG;

var GoogleAuthProviderFactory = (function(){

	var factoryType = 'GoogleAuthProvider';

	function create() {
		return AuthProviderFactory.create(factoryType);
	}

	function register(stackType, GoogleAuthProvider) {
		AuthProviderFactory.register(factoryType, stackType,
			GoogleAuthProvider);
		return GoogleAuthProviderFactory;
	}

	return {
		create: create,
		register: register
	};
})();

GoogleAuthProviderFactory.register(StackType.LOCAL, GoogleLocalAuthProvider);
GoogleAuthProviderFactory.register(StackType.APPFOG, GoogleAppFogAuthProvider);

module.exports.Factory = GoogleAuthProviderFactory;
