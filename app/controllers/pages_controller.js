var locomotive = require('locomotive')
  , Controller = locomotive.Controller;

var PagesController = new Controller();

PagesController.main = function () {
  var self = this;
  if (!self.req.isAuthenticated())
    return self.res.redirect(self.urlFor({ controller: 'account', action: 'login' }));

  self.title = 'Locomotive'
  self.render();
}

module.exports = PagesController;
