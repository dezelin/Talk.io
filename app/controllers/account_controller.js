var assert = require('assert'),
    locomotive = require('locomotive'),
    logger = require('winston'),
    passport = require('passport'),
    Controller = locomotive.Controller,
    Account = require('../models/account');

var AccountController = new Controller();

AccountController.new = function() {
  var self = this;
  self.render();
}

AccountController.create = function() {
  var self = this;
  var account = new Account();
  account.email = self.param('email');
  account.password = self.param('password');
  account.name.first = self.param('name.first');
  account.name.last = self.param('name.last');

  account.save(function(err) {
    if (err)
      return self.redirect(self.urlFor({ action: 'new' }));

    return self.redirect(self.urlFor({ action: 'login' }));
  });
}

AccountController.show = function() {
  var self = this;
  if (!self.req.isAuthenticated()) {
    // User has not been authenticated. Redirect him to the login page.
    logger.info('User has not been authenticated. Redirecting him to the login page.');
    return self.res.redirect(self.urlFor({ action: 'login' }));
  }

  assert(self.req.user, 'Request user is missing.');
  if (self.req.user.provisioned) {
    // Provider authentication has redirected us here so go to the signup page.
    logger.info('Provider authentication has brought us here. '
      + 'Redirecting user to the signup page.');
    return self.res.redirect(self.urlFor({ action: 'signup' }));
  }

  self.user = self.req.user;
  self.render();
}

AccountController.signup = function() {
  var self = this;
  self.render();
}

AccountController.signupForm = function() {
  var self = this;
  self.render();
}

AccountController.edit = function() {
  var self = this;
  self.render();
}

AccountController.update = function() {
  var self = this;
  self.render();
}

AccountController.destroy = function() {
  var self = this;
  self.render();
}

AccountController.login = function() {
  var self = this;
  passport.authenticate('local', {
    successRedirect: self.urlFor({ action: 'show' }),
    failureRedirect: self.urlFor({ action: 'login' })
  })(self.__req, self.__res, self.__next);
}

AccountController.loginForm = function() {
  var self = this;
  self.render();
}

AccountController.logout = function() {
  var self = this;
  self.req.logout();
  self.redirect('/');
}

module.exports = AccountController;
