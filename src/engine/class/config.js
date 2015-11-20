var fs = require('fs');

/**
 * Read and write properties file
 * @class
 */
var Config = function() {
	this.file = 'src/config.json';
};

/**
 * Read properties file
 * @return {Object} Json parse object
 * @private
 */
Config.prototype.read = function() {
	var content = fs.readFileSync(fs.realpathSync(this.file));
	return JSON.parse(content);
};

/**
 * Override the properties file
 * @param {Object} [json] All properties files object
 * @private
 */
Config.prototype.write = function(json) {
	var content = JSON.stringify(json);
	fs.writeFileSync(fs.realpathSync(this.file),content);
};

/**
 * Find the properties in the [config] Object
 * @param {Object} [config] Properties object
 * @param {String} [property] The querry
 * @return {Object} the value of the property requested
 * @private
 */
Config.prototype.inceptionRead = function(config, property) {
  var elems = Array.isArray(property) ? property : property.split('.');
  var name = elems[0];
  var value = config[name];
  
  if(elems.length <= 1) return value;
  else return this.inceptionRead(value,elems.slice(1));	
};

/**
 * Update the property value
 * @param {Object} [config] Properties object
 * @param {String} [property] Property key
 * @param {Object} [value] Property value
 * @returns {Object} Json parse object
 * @private
 */
Config.prototype.inceptionWrite = function(config, property, value) {
	var elems = Array.isArray(property) ? property : property.split('.');
	var name = elems[0];
	
	if (elems.length <= 1) {
		// Last elems
		config[name] = value;
		return config;
	}
	else {
		// new inceptionWrite
		if (config[name] == undefined) config[name] = {};
		config[name] = this.inceptionWrite(config[name],elems.slice(1),value);
		return config;
	}
};

/**
 * Get the property value with the key
 * @param {String} Property key
 * @param {Object} Default value if properties don't exist
 * @return {Object} Properties requested
 *
 * @example
 * <caption>Get properties</caption>
 *
 * var config = require('config');
 * var value = config.get("database.path");
 *
 */
Config.prototype.get = function(property, defaultValue) {
	// Verify if property is correctly set
	if(property === null || property === undefined) throw new Error('Call config.get with null or undefined parameter');
	// Get current configuration
	var config = this.read();
	// Extract correct value
	var value = this.inceptionRead(config,property);
	// Throw error if property not defined
	if (value === undefined) {
        if (defaultValue === null || defaultValue === undefined) throw new Error('config property '+property+' is not defined');	
        else return defaultValue;
    }
	// return value	
	return value;
};

/**
 * Verify if the propertiy exist
 * @param {String} [property] Property key
 * @return {Boolean} return true if the property exist
 */
Config.prototype.has = function(property) {
	try{
		this.get(property);
		return true;
	}catch(e){
		return false;
	}
};

/**
 * Update the property value
 * @param {String} [property] Property key
 * @param {String} [value] Property value
 *
 * @example
 * <caption>Set properties</caption>
 *
 * var config = require('config');
 * config.set("database.name", "src/test");
 *
 */
Config.prototype.set = function(property, value) {
	// Verify if property is correctly setted
	if (property === null || property === undefined) throw new Error('Call config.set with null or undefined property parameter');
	else if (value === null || value === undefined) throw new Error('Call config.set with null or undefined value parameter');
	// Get current configuration
	var config = this.read();
	// Replace data
	var newconfig = this.inceptionWrite(config, property, value);
	// Write data
	this.write(newconfig);
};

module.exports = new Config();