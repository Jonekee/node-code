/**
 * @fileOverview 	I am the applications logging mechnisim.
 * @author 			John Allen <johnfallen@gmail.com>
 * @version 		0.0.1
 * @module 			Logger
 */
'use strict';
/* *************************** Required Classes **************************** */
var path = require('path');
var fs = require('fs');
var util = require('util');
var winston = require('winston');

/* *************************** Constructor Code **************************** */
var rootPath = path.normalize(__dirname + '/../..');
var logDirectory = rootPath + '/logs';
var verboseLogging = true;

// create the log directory if needed
makeDirectory( logDirectory );

var applogger = new (winston.Logger)({
	transports: [
		new (winston.transports.File)({ filename: logDirectory + '/application.log' })
	]
});

var errorLogger = new (winston.Logger)({
	transports: [
		new (winston.transports.File)({ filename: logDirectory + '/error.log' })
	]
});

var debuggerLogger = new (winston.Logger)({
	transports: [
		new (winston.transports.File)({ filename: logDirectory + '/verbose.log' })
	]
});

/* *************************** Public Methods ****************************** */
/**
 * I write log entries to the application.log file
 * @param {String} message - I am a message about what happened
 * @param {Object} data - I am a JS object of additional information to log
 */
function application( message, data ){

	data = data || {'nothing':'passed'};

	applogger.info( message, JSON.stringify( data ), data );
}
exports.application = application;

/**
 * I write log entries to the verbose.log file if verboseLogging is enabled.
 * @param {String} message - I am a message about what happened
 * @param {Object} data - I am a JS object of additional information to log
 */
function verbose( message, data ){

	if ( verboseLogging ){

		message = message || 'no message passed';
		data = data || {'nothing':'passed'};

		debuggerLogger.info( message, JSON.stringify( data ) );
	}
}
exports.verbose = verbose;

/**
 * I dump a object to the console
 * @param {Object} data - I am the object to dump
 * @param {Object} data - I am the depth to dump. I will default to 'all'
 */
function dump( data, depth ){

	data = data || {'nothing':'passed'};
	depth = depth || null;

	console.log(util.inspect(data, {colors: true, depth: depth }));
}
exports.dump = dump;

/**
 * I write log entries to the error.log file
 * @param {String} message - I am a message about what happened
 * @param {Object} data - I am a JS object of additional information to log
 */
function error( message, data ){

	data = data || {'nothing':'passed'};

	errorLogger.error( message, JSON.stringify( data ), data );
}
exports.error = error;

/**
 * I write to the console
 * @param {String} message - I am a message about what happened
 */
function log( message ){
	console.log( message );
}
exports.log = log;


/* *************************** Private Methods ***************************** */
/**
 *
 * @param {String} path - I am the system or realitive path of the directory
 *                        to create.
 * @return {Boolean} I return true if cool and false if not.
 */
function makeDirectory(path) {
	try {
		fs.mkdirSync( path );
	} catch(e) {
		if ( e.code !== 'EEXIST' ) {
			throw e;
		}
	}
}
