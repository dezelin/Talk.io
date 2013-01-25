var assert = require('assert'),
	nconf = require('nconf');

var EnvType = {
	"DEV": 0,
	"PROD": 1
};

Object.freeze(EnvType);

module.exports.Type = EnvType;
