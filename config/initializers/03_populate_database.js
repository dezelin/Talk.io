var assert = require('assert')
  , util = require('../../app/common/util')
  , data = require('../../app/common/populate_database')
  , stackInfo = require('../../app/common/stack_info');

module.exports = function () {
  var environment = stackInfo.getEnvironment();
  switch (environment) {
    case DEVELOPMENT_ENV:
      {
        data.populateDevelopmentData();
        break;
      }
    case PRODUCTION_ENV:
      {
        data.populateProductionData();
        break;
      }
    default:
      {
        assert(false, 'Unsupported Node.js environment.');
      }
  }
}