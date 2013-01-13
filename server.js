

var locomotive = require('locomotive');

locomotive.cli.server(process.cwd(), '0.0.0.0', process.env.PORT, 'development', {});
