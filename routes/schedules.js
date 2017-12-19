const express      = require('express')
const router 	   = express.Router()
const _ 		   = require('lodash')

const sequ = require('../libs/sequelizeDB.js')
const Schedules = require('../models/schedules.js')(sequ.sequelize ,sequ.Sequelize)

/*===========================
=            GETs           =
===========================*/

router.get('/', (req, res, next) => {
	Schedules.findAll()
		.then(schedules => {
			res.status(200).json(schedules)
		})
		.catch(e => {
			res.status(500).json(e)
		})
})


router.get('/:id', (req, res, next) => {
	const id = req.params.id
	Schedules.findById(id)
		.then(schedule => {
			if (schedule) {
				//req.app.get('socketio').to('controler').emit('changeState',{id:device.input_id, state:device.state})
				res.status(200).json(schedule)
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
	Schedules.create(data)
		.then(schedule => {
			addSchedule(schedule.id, req.app.get('scheduler'))
			res.status(201).json(schedule)
			req.app.get('scheduler').addJob(cron.id, cron.cron,cron.inputId , cron.state, cron.transiton_time)
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
	Schedules.findById(id)
		.then(schedule => {
			if (schedule) {
				schedule.update(data)
				.then((s) => {
					removeSchedule(id, req.app.get('scheduler'))
					addSchedule(id, req.app.get('scheduler'))
					res.status(200).json(schedule)
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
	Schedules.findById(id)
		.then(schedule => {
			if (schedule) {
				return schedule.destroy()
			} else {
				throw new Error("NO_INSTANCE")
			}
		})
		.then( () => {
			console.log("before call id_ ", id)
			removeSchedule(id, req.app.get('scheduler'))
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


function addSchedule(id, Schedules) {
	sequ.sequelize.query(
	`SELECT s.*, pin.id as inputId, d.id as deviceId FROM schedules s
		LEFT JOIN devices d ON(s.device_id = d.id)
		LEFT JOIN inputs i ON (d.input_id = i.number)
		LEFT JOIN pin_settings pin on(i.pin_settings_id = pin.id)
		WHERE s.active = true AND s.id = ${id};`,
    { type: sequ.sequelize.QueryTypes.SELECT})
	.then(schedule => {
		cron = schedule[0]
		if(cron)
			Schedules.addJob(cron.id, cron.deviceId, cron.cron,cron.inputId , cron.state, cron.transiton_time)
	})
	.catch(e => {
		console.log(e)
		throw new Error(`error while obtaining schedules form DB`)
	})

}

function removeSchedule(id, Schedules) {
	Schedules.removeJob(id)
}


module.exports = router