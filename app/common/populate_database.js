
var assert = require('assert'),
    mongoose = require('mongoose'),
    logger = require('winston'),
    Account = require('../models/account'),
    ProviderAccount = require('../models/provider_account');


function populateAccount(data) {
  Object.keys(data).forEach(function (key) {
    var userInfo = data[key];
    var account = new Account();
    account.email = userInfo.email;
    account.password = userInfo.password;
    account.name.first = userInfo.firstName;
    account.name.last = userInfo.lastName;

    account.save(function (err) {
      logger.info('Inserting new account ' + JSON.stringify(userInfo));
      assert(!err, 'Account \'' + userInfo.email + '\' couldn\'t be added.');
    });

  });
}

function populateDevelAccount() {
  var data = {
    _0: {
      email: 'test0@talk.io',
      password: 'test0',
      firstName: 'test0_firstName',
      lastName: 'test0_lastName'
    },
    _1: {
      email: 'test1@talk.io',
      password: 'test1',
      firstName: 'test1_firstName',
      lastName: 'test1_lastName'
    },
    _2: {
      email: 'test2@talk.io',
      password: 'test2',
      firstName: 'test2_firstName',
      lastName: 'test2_lastName'
    },
    _3: {
      email: 'test3@talk.io',
      password: 'test3',
      firstName: 'test3_firstName',
      lastName: 'test3_lastName'
    },
    _4: {
      email: 'test4@talk.io',
      password: 'test4',
      firstName: 'test4_firstName',
      lastName: 'test4_lastName'
    }
  };

  logger.info('Droping Account schema...');
  Account.collection.drop();

  logger.info('Droping ProviderAccount schema...');
  ProviderAccount.collection.drop();

  populateAccount(data);
}

function populateProdAccount() {
  var data = {
    admin: {
      email: 'admin@talk.io',
      password: 'admin',
      firstName: '',
      lastName: ''
    }
  };

  populateAccount(data);
}


module.exports = exports = function() {

}

module.exports.populateDevelopmentData = function populateDevelopmentData() {
  populateDevelAccount();
}

module.exports.populateProductionData = function populateProductionData() {
  populateProdAccount();
}
