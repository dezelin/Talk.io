var express = require('express');

module.exports = function () {
  var self = this;
  self.use(express.errorHandler({ dumpExceptions: true, showStack: true }));

  // Turn on pretty HTML printing
  self.express.locals.pretty = true;
}
