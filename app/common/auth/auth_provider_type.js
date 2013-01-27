var Enum = require('enum');


var AuthProviderType = Enum({
	'UNKNOWN': 0,
	'FACEBOOK': 1,
	'TWITTER': 2,
	'GOOGLE': 3
});

module.exports.Type = AuthProviderType;
