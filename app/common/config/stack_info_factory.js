var assert = require('assert'),
	logger = require('winston'),
	StackType = require('./stack_type');

var StackInfoFactory = (function () {

	// Storage for our stack info types
	var types = {};

	function create(type) {
		var bucket = StackType.getStackType();
		var typeName = type.toString();
		var StackInfo = types[bucket + typeName];
		logger.info('Creating stack info instance of the type \'' + typeName +
			'\' from bucket \'' + bucket + '\'');
		return (StackInfo ? new StackInfo() : null);
	}

	function register(type, stackType, StackInfo) {
		var proto = StackInfo.prototype;
		// Only register classes that fulfill the stack info contract
		assert(proto.stackType, 'Class must fulfill the stack info contract.');
		var bucket = stackType.toString();
		var typeName = type.toString();
		types[bucket + typeName] = StackInfo;
		logger.info('Registered stack info type \'' + typeName
			+ '\' into bucket \'' + bucket + '\'.');
		return StackInfoFactory;
	}

	return {
		create: create,
		register: register
	};
})();

module.exports.Factory = StackInfoFactory;
