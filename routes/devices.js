const express      = require('express')
const router 	   = express.Router()
const _ 		   = require('lodash')

const sequ = require('../libs/sequelizeDB.js')
const Devices = require('../models/devices.js')(sequ.sequelize ,sequ.Sequelize)
const Schedules = require('../models/schedules.js')(sequ.sequelize ,sequ.Sequelize)

/*===========================
=            GETs           =
===========================*/

router.get('/', (req, res, next) => {
	Devices.findAll()
		.then(devices => {
			res.status(200).json(devices)
		})
		.catch(e => {
			res.status(500).json(e)
		})
})


router.get('/:id', (req, res, next) => {
	const id = req.params.id
	console.log("emiting")
	req.app.get('socketio').to('controler').emit("getDeviceStatus", id)
	Devices.findById(id)
		.then(device => {
			if (device) {
				res.status(200).json(device)
			} else {
				res.status(400).end()
			}
		})
		.catch(e => {
			res.status(500).json(e)
		})
})

 /*=============================
 =            POSTs            =
 =============================*/

router.post('/', (req, res, next) => {
	let data = req.body
	console.log(data)
	Devices.create(data)
		.then(device => {
			initDevice(device.input_id, req.app.get('socketio'))
			req.app.get('socketio').to('user').emit('newDevice'. device)
			res.status(201).json(device)
		})
		.catch(e => {
			console.log(e)
			res.status(400).json(e.errors)
		})
})

 /*============================
 =            PUTs            =
 ============================*/


router.put('/:id', (req, res, next) => {
	const id = req.params.id
	let data = req.body
	Devices.findById(id)
		.then(device => {
			if (device) {
				device.update(data)
				.then((s) => {
					console.log(s)
					if(req.body.time)
						device.state.time = req.body.time
					req.app.get('socketio').to('controler').emit('changeState',{id:device.input_id, state:device.state})
					req.app.get('socketio').to('user').emit('changeState'. {id:device.id, state: devices.state})
					res.status(200).json(device)
				})
				.catch(e => {
					res.status(400).json(e.errors)
				})
			} else {
				res.status(400).end()
			}
		})
		.catch(e => {
			console.log(e)
			res.status(500).json(e)
		})
})

 /*============================
 =            DELETEs         =
 ============================*/

router.delete('/:id', (req, res, next) => {
	const id  = req.params.id
	let input_id = null
	Devices.findById(id)
		.then(device => {
			if (!device)
				throw new Error("NO_INSTANCE")

			return sequ.sequelize.transaction( (t) => {
				return Schedules.destroy({
					where: { device_id: id }
				}, {transaction: t})
					.then( (aff) => {
						input_id = device.input_id
						return device.destroy({},{transaction: t})
					})
			})
		})
		.then( (aff) => {
			req.app.get('socketio').to('controler').emit('removeDevice', input_id)
			req.app.get('socketio').to('user').emit('removeDevice'. id)
			res.status(204).end()
		})
		.catch(e => {
			if (e.message == 'NO_INSTANCE')
				res.status(400).end()
			else {
				console.log(e)
				res.status(500).json(e)
			}
		})
})

function initDevice(input_id, io) {
	sequ.sequelize.query(
	`SELECT d.state, d.type, i.*, pin.pin1, pin.pin2, pin.pin3, pin.pwm, pin.shift_id FROM \`devices\` d 
		LEFT JOIN \`inputs\` i ON(d.input_id = i.number)
    	LEFT JOIN \`pin_settings\` pin ON(i.pin_settings_id = pin.id)
    	WHERE d.input_id = ${input_id};`,
    { type: sequ.sequelize.QueryTypes.SELECT})
	.then(device => {
		console.log(device)
		io.to('controler').emit("initDevice", device)
	})
}

module.exports = router