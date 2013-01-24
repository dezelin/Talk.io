var locomotive = require ('locomotive')
  , nconf = require('nconf')
  , stackInfo = require('./app/common/stack_info');


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

var env = stackInfo.getEnvironment()
	, port = stackInfo.getServerPort()
	, address = stackInfo.getServerHost();

locomotive.boot(__dirname, env, function (err, server) {
  if (err) { throw err; }
  server.listen(port, address, function () {
    var addr = this.address();
    console.log('listening on %s:%d', addr.address, addr.port);
  });
});
