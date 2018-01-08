const express      = require('express')
const router 	   = express.Router()
const _ 		   = require('lodash')

const sequ   = require('../libs/sequelizeDB.js')
const Alarms = require('../models/alarms.js')(sequ.sequelize ,sequ.Sequelize)
const Users  = require('../models/users.js')(sequ.sequelize ,sequ.Sequelize)

/*===========================
=            GETs           =
===========================*/

router.get('/', (req, res, next) => {
	Alarms.findAll()
		.then(alarm => {
			res.status(200).json(alarm)
		})
		.catch(e => {
			res.status(500).json(e)
		})
})

router.get('/:state', (req, res, next) => {
	const id = req.params.id
	Alarms.findById(id)
		.then(alarm => {
			if (alarm) {
				res.status(200).json(alarm)
			} else {
				res.status(400).end()
			}
		})
		.catch(e => {
			res.status(500).json(e)
		})
})

router.put('/:id', (req, res, next) => {
	const id = req.params.id
	let data = req.body
	delete data.alarm
	Alarms.findById(id)
		.then(alarm => {
			if (alarm) {
				if (data.secured == false) {
					if (req.decoded.pin == req.body.pin) {
						alarm.update(data)
						.then((s) => {
							if(data && "secured" in data && alarm)
								req.app.get('socketio').to('controler').emit("setSecured", alarm.secured)
							res.status(200).json(alarm)
						})
						.catch(e => {
							res.status(400).json(e.errors)
						})
					} else {
						res.status(401).end()
					}
				} else {
					alarm.update(data)
					.then((s) => {
						if(data && "secured" in data && alarm)
							req.app.get('socketio').to('controler').emit("setSecured", alarm.secured)
						res.status(200).json(alarm)
					})
					.catch(e => {
						res.status(400).json(e.errors)
					})
				}
			} else {
				res.status(400).end()
			}
		})
		.catch(e => {
			console.log(e)
			res.status(500).json(e)
		})
})

module.exports = router
