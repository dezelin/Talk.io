var express = require('express')
  , poweredBy = require('connect-powered-by')
  , passport = require('passport')
  , mongoose = require('mongoose')
  , mongooseDataStore = require('locomotive-mongoose')
  , nconf = require('nconf')
  , util = require('util')
  , logger = require('winston');


module.exports = function () {
  var self = this;
  // Warn of version mismatch between global "lcm" binary and local installation
  // of Locomotive.
  if (self.version !== require('locomotive').version) {
    logger.warn(util.format('version mismatch between local (%s) and global (%s) Locomotive module', require('locomotive').version, self.version));
  }

  // Configure application settings.  Consult the Express API Reference for a
  // list of the available [settings](http://expressjs.com/api.html#app-settings).
  self.set('views', __dirname + '/../../app/views');
  //self.set('view engine', 'ejs');
  self.set('view engine', 'jade');
  self.set('view options', {
    layout: false
  });

  // Register EJS as a template engine.
  //self.engine('ejs', require('ejs').__express);
  self.engine('jade', require('jade').__express);

  // Override default template extension.  By default, Locomotive finds
  // templates using the `name.format.engine` convention, for example
  // `index.html.ejs`  For some template engines, such as Jade, that find
  // layouts using a `layout.engine` notation, self results in mixed conventions
  // that can cuase confusion.  If self occurs, you can map an explicit
  // extension to a format.
  self.format('html', { extension: '.jade' });

  // Register formats for content negotiation.  Using content negotiation,
  // different formats can be served as needed by different clients.  For
  // example, a browser is sent an HTML response, while an API client is sent a
  // JSON or XML response.
  /* self.format('xml', { engine: 'xmlb' }); */

  // Load config file.
  var config_store = nconf.stores.file.store;

  // Use middleware.  Standard [Connect](http://www.senchalabs.org/connect/)
  // middleware is built-in, with additional [third-party](https://github.com/senchalabs/connect/wiki)
  // middleware available as separate modules.
  self.use(poweredBy('Locomotive'));
  self.use(express.logger());
  self.use(express.favicon());
  self.use(express.static(__dirname + '/../../public'));
  self.use(express.static(__dirname + '/../../components'));
  self.use(express.bodyParser());
  self.use(express.methodOverride());
  self.use(express.cookieParser());
  self.use(express.session({
    secret: config_store.sessionSecret
  }));
  self.use(passport.initialize());
  self.use(passport.session());
  self.use(self.router);

  self.datastore(mongooseDataStore);
}
