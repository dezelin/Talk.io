var assert = require('assert'),
	url = require('url'),
	StackType = require('../config/stack_type').Type,
	stackInfo = require('../stack_info').StackInfo;

function AuthProvider(options) {
	this.options = options || {};
}

AuthProvider.prototype.getCallbackUrl = function() {
  var serverUrl = stackInfo.getServerUrl();
  var webUrl = url.parse(serverUrl);
  var port = stackInfo.getServerPort();

  var callbackUrl = {};
  callbackUrl.protocol = webUrl.protocol;
  callbackUrl.hostname = webUrl.hostname;
  callbackUrl.pathname = this.options.pathname || '';
  if (stackInfo.getStackType() == StackType.LOCAL)
  	callbackUrl.port = port;

  // Return formatted URL
  return url.format(callbackUrl);
}

module.exports.Type = AuthProvider;
