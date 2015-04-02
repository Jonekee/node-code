/**
 * @fileOverview 	I am the application wide Error Handler.
 * @author 			John Allen <johnfallen@gmail.com>
 * @version 		1.0.0
 * @module 			ErrorHandler.js
 */
'use strict';

/* *************************** Required Classes **************************** */
var meanio = require('meanio');
var email = require('./Email.js');
var log = require('./Logger.js');

/* *************************** Constructor Code **************************** */
var config = {}; // this should be your applications configuration object

/* *************************** Public Methods ****************************** */

/**
 * I handle error's for the application.
 * @param {String} message - the error message to log
 * @param {Object} data - any data we want to log
 */
function handleError( message, data ){

	// return something...
	var result = false;

	// log stuff to the console for dev development
	if ( process.env.NODE_ENV !== 'staging' || process.env.NODE_ENV !== 'production'){
		log.dump(message);
		log.dump(data);
	}

	var extraData = JSON.stringify( data );
	var configData = JSON.stringify( config );

	log.error(message, extraData);

	// send an email for production and staging
	if ( process.env.NODE_ENV === 'staging' || process.env.NODE_ENV === 'production') {

		email.send('ERROR!: ' + message,
				'An ERROR Happened! Additional Information: \r\n\r\n' + extraData + '\r\n\r\n****CONFIG******: \r\n\r\n' + configData);
	}
	result = true;

	return result;
}
exports.handleError = handleError;
