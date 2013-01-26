var locomotive = require ('locomotive'),
    nconf = require('nconf'),
    util = require('util'),
    logger = require('winston');

//
// Setup nconf to use (in-order):
//   1. Command-line arguments
//   2. Environment variables
//   3. A file located at 'path/to/config.json'
//
nconf.argv().env().file({
  file: 'config/config.json',
  format: nconf.formats.json
});

logger.info('Full stack environment:');
logger.info('=======================\n');
logger.info(util.inspect(nconf.stores, false, null));
logger.info('=======================\n');

var StackInfo = require('./app/common/stack_info').StackInfo,
    env = StackInfo.getServerNodeEnvAsString(),
    port = StackInfo.getServerPort(),
    address = StackInfo.getServerHost();

locomotive.boot(__dirname, env, function (err, server) {
  if (err) { throw err; }
  server.listen(port, address, function () {
    var addr = this.address();
    console.log('listening on %s:%d', addr.address, addr.port);
  });
});
