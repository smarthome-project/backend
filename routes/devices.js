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
	Devices.findAll({
		attributes: {
			exclude: ['password']
		}
	})
		.then(devices => {
			res.status(200).json(devices)
		})
		.catch(e => {
			res.status(500).json(e)
		})
})


router.get('/:id', (req, res, next) => {
	const id = req.params.id
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
			delete device.dataValues.pass
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
	Devices.findById(id)
		.then(device => {
			if (!device)
				throw new Error("NO_INSTANCE")

			return sequ.sequelize.transaction( (t) => {
				return Schedules.destroy({
					where: { device_id: id }
				}, {transaction: t})
					.then( (aff) => {
						return device.destroy({},{transaction: t})
					})
			})
		})
		.then( (aff) => {
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

module.exports = router



