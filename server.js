

var locomotive = require('locomotive');

process.env.NODE_ENV = 'development';
process.env.PORT = 3000;

locomotive.cli.server(process.cwd(), '0.0.0.0', process.env.PORT, process.env.NODE_ENV, {});
