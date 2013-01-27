var assert = require('assert'),
	logger = require('winston'),
	StackType = require('./stack_type'),
	util = require('../util');

var StackInfoFactory = (function () {

	// Storage for our stack info types
	var types = {};

	function create(type) {
		var bucket = StackType.getStackType();
		var typeName = type.toString();
		var StackInfo = types[bucket + typeName];
		var className = util.getObjectClass(StackInfo);
		logger.info('Creating stack info instance of the type \'' + className +
			'\' from bucket \'' + bucket + '\'');
		return (StackInfo ? new StackInfo() : null);
	}

	function register(type, stackType, StackInfo) {
		var proto = StackInfo.prototype;
		// Only register classes that fulfill the stack info contract
		assert(proto.stackType, 'Class must fulfill the stack info contract.');
		var bucket = stackType.toString();
		var typeName = type.toString();
		var className = util.getObjectClass(StackInfo);
		types[bucket + typeName] = StackInfo;
		logger.info('Registered stack info type \'' + className
			+ '\' into bucket \'' + bucket + '\'.');
		return StackInfoFactory;
	}

	return {
		create: create,
		register: register
	};
})();

module.exports.Factory = StackInfoFactory;
