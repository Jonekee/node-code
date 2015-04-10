/**
 * @fileOverview 	I contain utility functions.
 * @author 			John Allen <johnfallen@gmail.com>
 * @version 		0.0.1
 * @module 			Utils
 */
'use strict';
/* *************************** Required Classes **************************** */
var fs = require('fs');

/* *************************** Constructor Code **************************** */
/* *************************** Public Methods ****************************** */


/**
 * I run a child process script.
 * @param {String} scriptPath - I am the path to the precess to run.
 * @param {String} callback - I am the callback function.
 */
function runScript(scriptPath, callback) {

	var childProcess = require('child_process');

	// keep track of whether callback has been invoked to prevent multiple invocations
	var invoked = false;

	var process = childProcess.fork(scriptPath);

	// listen for errors as they may prevent the exit event from firing
	process.on('error', function (err) {
		if (invoked) return;
		invoked = true;
		callback(err);
	});

	// execute the callback once the process has finished running
	process.on('exit', function (code) {
		if (invoked) return;
		invoked = true;
		var err = code === 0 ? null : new Error('exit code ' + code);
		callback(err);
	});
}
exports.runScript = runScript;


// NOTE: I just realized this is a dumb ass redundant thing to do. :/
/**
 * I return if a file exists or not.
 * @param {String} path - The path of the file to check.
 * @returns {boolean} - True if it exists, False if it dose not
 */
function fileExists( path ){

	var result = false;

	if (fs.existsSync( path )) {
		result = true;
	}

	return result;
}
exports.fileExists = fileExists;


/**
 * I read a JSON text file and return the data as a JSON object.
 * @param {string} path - I am the full system path to the JSON file.
 * @return {object}
 */
function readJSONFile( path ){

	var binaryData = fs.readFileSync( path );

	if(binaryData.length){
		return JSON.parse( binaryData.toString() );
	}else{
		return '';
	}
}
exports.readJSONFile = readJSONFile;


/**
 * I write a JSON file to disk
 * @param {String} path - I am the path to write to.
 * @param {Object} json - I am the JSON to write.
 * @returns {boolean}
 */
function writeJSONFile(path, json){

	var dataToWrite = JSON.stringify( json );

	if( dataToWrite.length && path.length ){
		fs.writeFile(path, dataToWrite, function(error) {
			if( error ) {
				console.log(error);
			}
		});
	}

	return true;
}
exports.writeJSONFile = writeJSONFile;


/**
 * I compare two simple JSON objects (no DOM, no functions)to see if they are
 * the same.
 * @param {Object} object1 - I am the first simple JSON object to compare.
 * @param {Object} object2 - I am the second simple JSON object to compare.
 * @returns {boolean}
 */
function simpleObjectCompare( object1, object2 ){

	var result = false;

	if ( JSON.stringify( object1 ) === JSON.stringify( object2 ) ){
		result = true;
	}

	return result;
}
exports.simpleObjectCompare = simpleObjectCompare;



/**
 * I change XML to JSON
 * @param {xml} xml - I am the XML to transform.
 * @returns {Object}
 */
function xmlToJson(xml) {

	// Create the return object
	var obj = {};

	if (xml.nodeType === 1) { // element
		// do attributes
		if (xml.attributes.length > 0) {
			obj['@attributes'] = {};
			for (var j = 0; j < xml.attributes.length; j++) {
				var attribute = xml.attributes.item(j);
				obj['@attributes'][attribute.nodeName] = attribute.nodeValue;
			}
		}
	} else if (xml.nodeType === 3) { // text
		obj = xml.nodeValue;
	}

	// do children
	if (xml.hasChildNodes()) {
		for(var i = 0; i < xml.childNodes.length; i++) {
			var item = xml.childNodes.item(i);
			var nodeName = item.nodeName;
			if (typeof(obj[nodeName]) === 'undefined') {
				obj[nodeName] = xmlToJson(item);
			} else {
				if (typeof(obj[nodeName].push) === 'undefined') {
					var old = obj[nodeName];
					obj[nodeName] = [];
					obj[nodeName].push(old);
				}
				obj[nodeName].push(xmlToJson(item));
			}
		}
	}
	return obj;
}
exports.xmlToJson = xmlToJson;
