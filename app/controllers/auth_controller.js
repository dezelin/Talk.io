var locomotive = require('locomotive')
  , passport = require('passport')
  , Controller = locomotive.Controller
  , Account = require('../models/account');

var AuthController = new Controller();

AuthController.facebook = function () {
  passport.authenticate('facebook', function (req, res) {
    // The request will be redirected to Facebook for authentication, so
    // this function will not be called.
  });
}

AuthController.facebookCallback = function () {
  var self = this;
  passport.authenticate('facebook', {
    successRedirect: self.urlFor({ action: 'show' }),
    failureRedirect: self.urlFor({ action: 'login' })
  });
}

module.exports = AuthController;