var assert = require('assert'),
	Enum = require('enum'),
	nconf = require('nconf');

var StackType = new Enum({
	'UNKNOWN': 1,
	'LOCAL': 2,
	'APPFOG': 3
});

VCAP_APPLICATION = 'VCAP_APPLICATION';

function getStackType() {
  assert(nconf.env, 'nconf not initialized.');
  return nconf.get(VCAP_APPLICATION) ? StackType.APPFOG
    : StackType.LOCAL;
}

module.exports.Type = StackType;
module.exports.getStackType = getStackType;
