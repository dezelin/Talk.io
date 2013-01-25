var assert = require('assert'),
    util = require('../../app/common/util'),
    data = require('../../app/common/populate_database'),
    EnvType = require('../../app/common/config/env_type').Type,
    stackInfo = require('../../app/common/stack_info').StackInfo;

module.exports = function () {
  var envType = stackInfo.getServerNodeEnv();
  switch (envType) {
    case EnvType.DEV: {
        data.populateDevelopmentData();
        break;
    }
    case EnvType.PROD: {
        data.populateProductionData();
        break;
    }
    default: {
        assert(false, 'Unsupported Node.js environment.');
    }
  }
}
