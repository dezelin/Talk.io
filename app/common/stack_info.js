var assert = require('assert'),
    nconf = require('nconf'),
    GoogleStackInfoFactory = require('./config/google_info').Factory,
    TwitterStackInfoFactory = require('./config/twitter_info').Factory,
    FacebookStackInfoFactory = require('./config/facebook_info').Factory,
    ServerStackInfoFactory = require('./config/server_info').Factory,
    StackType = require('./config/stack_type');


function StackInfo () {
  this.googleInfo = GoogleStackInfoFactory.create();
  this.twitterInfo = TwitterStackInfoFactory.create();
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

StackInfo.prototype.getGoogleClientId = function () {
  return this.googleInfo.getClientId();
}

StackInfo.prototype.getGoogleClientSecret = function () {
  return this.googleInfo.getClientSecret();
}

StackInfo.prototype.getFacebookAppId = function () {
  return this.facebookInfo.getAppId();
}

StackInfo.prototype.getFacebookAppSecret = function () {
  return this.facebookInfo.getAppSecret();
}

StackInfo.prototype.getTwitterConsumerKey = function () {
  return this.twitterInfo.getConsumerKey();
}

StackInfo.prototype.getTwitterConsumerSecret = function () {
  return this.twitterInfo.getConsumerSecret();
}

module.exports.StackInfo = new StackInfo();
