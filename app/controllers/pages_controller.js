var locomotive = require('locomotive')
  , Controller = locomotive.Controller;

var PagesController = new Controller();

PagesController.main = function () {
  var self = this;
  self.render();
}

module.exports = PagesController;
