/**
 * @fileOverview  	I am the Cron script.
 * @author 			John Allen <johnfallen@gmail.com>
 * @version 		1.0.0
 * @module 			CronScript.js
 */

/* *************************** Required Classes **************************** */
var CronJob = require('cron').CronJob;
var childProcess = require('child_process');

/* *************************** Constructor Code **************************** */

// lets log to know we launched the application.
console.log('Application Launched');

// create a job that runs every min and calles a child script
var CronJob = require('cron').CronJob;
var job = new CronJob({
	cronTime: '*/1 * * * *',
	onTick: function() {
		
		// run a script and invoke a callback when complete, e.g.
		runScript('./ChildScript.js', function (err) {

			if (err) {
				throw err
			};

			// log for fun and proof
			console.log('finished running ChildScript.js');
		});
	},
	start: false,
	timeZone: "America/New_York"
});
job.start();

/* *************************** Public Methods ****************************** */



/* *************************** Private Methods ***************************** */
/**
 * I run a child process script.
 * @param {String} scriptPath - I am the path to the precess to run.
 * @param {String} callback - I am the callback function.
 */
function runScript(scriptPath, callback) {

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
