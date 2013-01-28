var locomotive = require('locomotive')
  , passport = require('passport')
  , Controller = locomotive.Controller
  , Account = require('../models/account');

var AuthController = new Controller();

AuthController.facebook = function () {
  var self = this;
  passport.authenticate('facebook', function (req, res) {
    // The request will be redirected to Facebook for authentication, so
    // this function will not be called.
  })(self.__req, self.__res, self.__next);
}

AuthController.facebookCallback = function () {
  var self = this;
  passport.authenticate('facebook', {
    successRedirect: self.urlFor({ controller: 'account', action: 'show' }),
    failureRedirect: self.urlFor({ controller: 'account', action: 'login' })
  })(self.__req, self.__res, self.__next);
}

AuthController.twitter = function () {
  var self = this;
  passport.authenticate('twitter', function (req, res) {
    // The request will be redirected to Twitter for authentication, so
    // this function will not be called.
  })(self.__req, self.__res, self.__next);
}

AuthController.twitterCallback = function () {
  var self = this;
  passport.authenticate('twitter', {
    successRedirect: self.urlFor({ controller: 'account', action: 'show' }),
    failureRedirect: self.urlFor({ controller: 'account', action: 'login' })
  })(self.__req, self.__res, self.__next);
}

module.exports = AuthController;
