var assert = require('assert')
  , util = require('../../app/common/util')
  , data = require('../../app/common/populate_database');

module.exports = function () {
  switch (process.env.NODE_ENV) {
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