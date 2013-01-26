var assert = require('assert'),
	Enum = require('enum')
	nconf = require('nconf');

var EnvType = new Enum({
	"UNKNOWN": 0,
	"DEV": 1,
	"PROD": 2
});

module.exports.Type = EnvType;
