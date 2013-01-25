var assert = require('assert'),
    nconf = require('nconf'),
    FacebookStackInfoFactory = require('./config/facebook_info').Factory,
    ServerStackInfoFactory = require('./config/server_info').Factory,
    StackType = require('./config/stack_type');


function StackInfo () {
  this.facebookInfo = FacebookStackInfoFactory.create();
  this.serverInfo = ServerStackInfoFactory.create();
  this.stackType = StackType.getStackType();
}

StackInfo.prototype.getStackType = function () {
  return this.stackType;
}

StackInfo.prototype.getServerNodeEnv = function () {
  return this.serverInfo.getServerNodeEnv();
}

StackInfo.prototype.getServerNodeEnvAsString = function () {
  return this.serverInfo.getServerNodeEnvAsString();
}

StackInfo.prototype.getServerUrl = function () {
  return this.serverInfo.getServerUrl();
}

StackInfo.prototype.getServerHost = function () {
  return this.serverInfo.getServerHost();
}

StackInfo.prototype.getServerPort = function () {
  return this.serverInfo.getServerPort();
}

StackInfo.prototype.getFacebookAppId = function () {
  return this.facebookInfo.getAppId();
}

StackInfo.prototype.getFacebookAppSecret = function () {
  return this.facebookInfo.getAppSecret();
}

module.exports.StackInfo = new StackInfo();
