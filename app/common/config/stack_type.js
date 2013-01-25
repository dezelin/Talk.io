var assert = require('assert'),
	Enum = require('enum'),
	nconf = require('nconf');

var StackType = new Enum({
	'UNKNOWN': 1,
	'LOCAL': 2, 
	'APPFOG': 3
});

function getStackType() {
  assert(nconf.env, 'nconf not initialized.');
  return nconf.env.VCAP_SERVICES ? StackType.APPFROG 
    : StackType.LOCAL;
}

module.exports.Type = StackType;
module.exports.getStackType = getStackType;
