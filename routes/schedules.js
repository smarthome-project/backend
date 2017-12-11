const express      = require('express')
const router 	   = express.Router()
const _ 		   = require('lodash')

const sequ = require('../libs/sequelizeDB.js')
const Schedules = require('../models/schedules.js')(sequ.sequelize ,sequ.Sequelize)

/*===========================
=            GETs           =
===========================*/

router.get('/', (req, res, next) => {
	Schedules.findAll({
		attributes: {
			exclude: ['password']
		}
	})
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
	console.log(data)
	Schedules.create(data)
		.then(schedule => {
			delete schedule.dataValues.pass
			res.status(201).json(schedule)
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
					console.log(s)
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