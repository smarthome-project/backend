var express = require('express')
var router 	= express.Router()
var PythonShell = require('python-shell')
var SerialPort = require("serialport")

var port = null
var shiftregister_state = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]

router.initArduino = () => {
	SerialPort.list(function (err, ports) {
		if(!err) {
			ports.forEach((device) => {
				if(device.manufacturer && device.manufacturer.toLowerCase().indexOf("arduino") !== -1) {
					port = new SerialPort(device.comName, {
						parser: SerialPort.parsers.readline('\n')
					})
					port.on('data', function (data) {
						console.log('Data: ' + data)
					})
				}
			})
		} else {
			console.log("Cannot load SerialPort.")
		}
	})
}

router.deinitArduino = (callback) => {
	port.close(() => {
		callback(true)
	})
}


router.get('/ports', (req, res, next) => {
	SerialPort.list((err, ports) => {
		res.json(ports)
	})
})

router.get('/testinit/:devId', (req, res, next) => {
	
	let devId = req.params.devId
	let data = 'deviceInit(' + devId + ',true,2,3,4);'
	port.write(data, () => {
		port.drain(() => {
    		res.status(201).end()
    	})
	})
})

router.post('/init', (req, res, next) => {
	
	let id, pwm, pin1, pin2, pin3

	id =  req.body.id
	pwm =  req.body.pwm
	pin1 =  req.body.pin1
	pin2 =  req.body.pin2
	pin3 =  req.body.pin3

	let data = 'deviceInit(' + id + ',' + pwm + ',' + pin1 + ',' + pin2 + ',' + pin3+ ');'

	port.write(data, () => {
    	port.drain(() => {
    		res.status(201).end()
    	})
  	})
})

router.post('/:deviceId/lights', (req, res, next) => {

	let id, R, G, B, time

	id = req.params.deviceId
	R = req.body.R
	G = req.body.G
	B = req.body.B

	time = req.body.time

	let data = 'ledTime(' + id + ',' + R + ':' + G + ':' + B + ',' + time + ');'

	port.write(	data, function () {
    	port.drain( function() {
    		res.json(data).status(200).end()
    	})
  	})
})

router.post('/enable/:deviceId', (req, res, next) => {

	let id, enable

	id = req.params.deviceId
	enable = req.body.enable

	let data = 'enable(' + id + ',' + enable + ');'

	port.write(	data, function () {
    	port.drain( function() {
    		res.json(data).status(200).end()
    	})
  	})
})

router.get('/getStatus/:deviceId', (req, res, next) => {

	let id = req.params.deviceId
	let data = 'showDevice(' + id + ');'

	port.write(	data, function () {
    	port.drain( function() {
    		res.json(data).status(200).end()
    	})
  	})
})

router.post('/shiftregister/:deviceId', (req, res, next) => {

	let id = req.params.deviceId
	enable = req.body.enable

	if(id < 0 || id > 15) {
		res.status(404).end()
	} else {
		shiftregister_state[id] = (enable == 'true') ? 1 : 0

		let data, clock, latch
		data = 12
		clock = 16
		latch = 18

		let states = shiftregister_state.slice()
		let args = [data, clock, latch].concat(states.reverse())

		let options = {
			scriptPath: 'scripts',
			args: args
		}

		PythonShell.run('shiftregister.py', options, (err, results) => {
			if (err) {
				res.status(404).end()
				throw err
			}
			res.json(results)
		})
	}
	
})

router.post('/motor/:deviceId', (req, res, next) => {

	let id = req.params.deviceId
	direction = req.body.direction

	if(direction != 'l' && direction != 'r') {
		res.status(404).end()
	} else {
		let motor_l, motor_r
		motor_l = 23
		motor_r = 24

		let options = {
			scriptPath: 'scripts',
			args: [motor_l, motor_r, direction]
		}

		PythonShell.run('motors.py', options, (err, results) => {
			if (err) {
				res.status(404).end()
				throw err
			}
			res.json(results)
		})
	}
	
})

router.post('/pythonTest', (req, res, next) => {

	let options = {
	  scriptPath: '../scripts',
	  args: ['value1', 'value2', 'value3']
	}

	PythonShell.run('my_script.py', options, (err, results) => {
		if (err) throw err
		console.log('results: %j', results)
		res.json(results)
	})
})

module.exports = router



