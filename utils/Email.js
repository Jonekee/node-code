/**
 * @fileOverview 	I handle emailing for the application.
 * @author 			John Allen <johnfallen@gmail.com>
 * @version 		1.0.0
 * @module 			Email.js
 */
'use strict';
/* *************************** Required Classes **************************** */
var email = require('emailjs');

/* *************************** Constructor Code **************************** */
var config.email = {};
config.email.userAccount = 'put gmail address here';
config.email.userPassword = 'put gmail password here';
config.email.smpt = 'smtp.gmail.com';
config.email.sendList = 'put email address 1 here, put email address 2 here,';
config.email.ccList = '';

// set up the server
var server = email.server.connect({
	user: config.email.userAccount,
	password: config.email.userPassword,
	host: config.email.smpt,
	ssl: true
});

/* *************************** Public Methods ****************************** */

/**
 * I send emails.
 * @param {String} subject - I am the subject of the email.
 * @param {Object} data - I message body of the email.
 */
function send( subject, body ){

	server.send({
		text: body,
		from: config.email.userAccount,
		to: config.email.sendList,
		cc: config.email.ccList,
		subject: subject
	}, function( err, message ) {

		if( err ){
			console.log(message);
		}
	});
}
exports.send = send;
