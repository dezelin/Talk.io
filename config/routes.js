// Draw routes.  Locomotive's router provides expressive syntax for drawing
// routes, including support for resourceful routes, namespaces, and nesting.
// MVC routes can be mapped mapped to controllers using convenient
// `controller#action` shorthand.  Standard middleware in the form of
// `function(req, res, next)` is also fully supported.  Consult the Locomotive
// Guide on [routing](http://locomotivejs.org/guide/routing.html) for additional
// information.
module.exports = function routes() {
  var self = this;
  self.root('pages#main');
  self.resource('account');
  self.resource('auth');
  self.match('login', 'account#loginForm', { via: 'GET' });
  self.match('login', 'account#login', { via: 'POST' });
  self.match('logout', 'account#logout');
  self.match('signup', 'account#signupForm', { via: 'GET' });
  self.match('signup', 'account#signup', { via: 'POST' });
  self.match('auth/facebook', 'auth#facebook');
  self.match('auth/facebook/callback', 'auth#facebookCallback');
  self.match('auth/twitter', 'auth#twitter');
  self.match('auth/twitter/callback', 'auth#twitterCallback');
  self.match('auth/google', 'auth#google');
  self.match('auth/google/callback', 'auth#googleCallback');
}
