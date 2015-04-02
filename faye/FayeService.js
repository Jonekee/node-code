/** 
 * @fileOverview 	I provide all things needed to interact with the Faye server.
 *                  I am also the Faye Server itself.
 * @author 			John Allen <johnfallen@gmail.com>
 * @version 		0.0.1
 * @module 			FayeService
 */
'use strict';
/* *************************** Required Classes **************************** */
var http = require('http');
var https = require('https');
var fs = require('fs');
var faye = require('faye');

/* *************************** Constructor Code **************************** */
var fayeConfigObject = {};
fayeConfigObject.fayePort = 8000;
fayeConfigObject.url = 'http://127.0.0.1:' + fayeConfigObject.fayePort + '/faye';
fayeConfigObject.publishPassword = 'make a really long obfuscated string';
fayeConfigObject.someChannel = 'channel1';
fayeConfigObject.anotherChannel = 'channel2';

var config = {};
config.fay = fayeConfigObject;
config.isSSL = false;


/* ++++++++++++++++ set up the SERVER ++++++++++++++++ */
var bayeux = new faye.NodeAdapter({mount: '/faye', timeout: 45});
var secret = config.faye.publishPassword;

if ( config.isSSL ){

	var options = {
		key: fs.readFileSync('put path to key file here'),
		cert: fs.readFileSync('put path to crt file here')
	};

	// Handle non-Bayeux requests
	var server = https.createServer(options, function(request, response) {
		response.writeHead(200, {'Content-Type': 'text/plain'});
		response.end('Hello, non-Bayeux request');

		console.log('FAYE HTTP server created in SSL Mode.');
		console.log('FAYE HTTP server created in SSL MODE.');

	}).listen( 8000 );

} else {

	// Handle non-Bayeux requests
	var server = http.createServer(function(request, response) {

		response.writeHead(200, {'Content-Type': 'text/plain'});
		response.end('Hello, non-Bayeux request');

		console.log('FAYE HTTP server created.');
		console.log('FAYE HTTP server created.');
	});
}

bayeux.attach( server );
server.listen( config.faye.fayePort );
console.log('FAYE BAYEUX Server was attached and port configured.');


// I am an extension that checks if a publisher is sending a password and that
// the password is correct. If it's not I add the .error key to the message
// object which effectively kills it.
bayeux.addExtension({
	incoming: function(message, callback) {

		if (!message.channel.match(/^\/meta\//)) {

			var password = message.ext && message.ext.password;

			if (password !== secret){
				message.error = '403::Password required';
			}
		}
		callback(message);
	},

	outgoing: function(message, callback) {

		// kill the password, dont want to send that out.
		if ( message.ext ) {
			delete message.ext.password;
		}

		callback( message );
	}
});

/* when verbose logging is enabled, log what Faye is sending  */
bayeux.on('publish', function(clientId, channel, data) {

	console.log( 'FAYE pushed on channel: ' + channel, data );

});


/* ++++++++++++++++ set up the CLIENT ++++++++++++++++ */
var fayeClient = new faye.Client(config.faye.url);

// we need to send the password to the server so lets add an extension to do
// this.
fayeClient.addExtension({
	outgoing: function( message, callback ) {

		message.ext = message.ext || {};
		message.ext.password = config.faye.publishPassword;

		callback( message );
	}
});

/* *************************** Public Methods ****************************** */

/**
 * I broadcast Faye Messages.
 * @param {Object} fayeData - I am the JSON to broadcast.
 * @param {Object} type - I am the type / channel to broadcast on.
 * @return {Object} I return an object of data about the broadcast.
 */
function broadCastFayeData( fayeData, type ){

	var result = {
		broadcast : false,
		channel : '',
		argumentType : type
	};

	var dataToSendDownTheWire = JSON.stringify( fayeData );
	var fayeChannel = '';

	switch( type ) {
		case 'channel1':
			fayeChannel = config.faye.someChannel;
			break;

		case 'channel2':
			fayeChannel = config.faye.anotherChannel;
			break;
	}

	if ( fayeChannel.length ){

		fayeClient.publish( '/' + fayeChannel, { text:dataToSendDownTheWire } );

		result.broadcast = true;
		result.channel = fayeChannel;
	}

	return result;
}
exports.broadCastFayeData = broadCastFayeData;

/* *************************** Private Methods ***************************** */
