var router = require('express').Router();

var Gpio = require('onoff').Gpio; //include onoff to interact with the GPIO

router.get('/api/clean', function(req, res, nex) {
	var LED = new Gpio(26, 'out'); //use GPIO pin 4, and specify that it is output
	function startClean() { //function to start blinking
	  // initiate
	  //document.getElementById('cleaning').disabled = true;
	  console.log('start cleaning');
	  LED.writeSync(1); //set pin state to 1 (turn LED on)
	  setTimeout(endClean, 3000); //stop blinking after 5 seconds 
	}

	function endClean() { //function to stop blinking
	  LED.writeSync(0); // Turn LED off
	  LED.unexport(); // Unexport GPIO to free resources
	  console.log('done cleaning');
	  // document.getElementById('cleaning').disabled = false;
	}

	startClean();
})

module.exports = router;
