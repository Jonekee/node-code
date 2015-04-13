/**
 * @fileOverview  	I am the Child Script to run.
 * @author 			John Allen <johnfallen@gmail.com>
 * @version 		1.0.0
 * @module 			Child Script.js
 */

/* *************************** Required Classes **************************** */

/* *************************** Constructor Code **************************** */

// run this method, it's supposed to do nothing but be chill and exit a node
// process
runTillExit();

/* *************************** Public Methods ****************************** */
/* *************************** Private Methods ***************************** */

/**
 * I log a statment and exit the myself as a node process.
 */
function runTillExit(){

	console.log('running!');

	setTimeout(
		function(){
			// let them know
			console.log('about to exit');
			// exit this child node process
			process.exit(0);
		},
		4000
	);
}
