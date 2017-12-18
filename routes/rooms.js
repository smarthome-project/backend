const express      = require('express')
const router 	   = express.Router()
const _ 		   = require('lodash')

const sequ = require('../libs/sequelizeDB.js')
const Rooms = require('../models/rooms.js')(sequ.sequelize ,sequ.Sequelize)
const Devices = require('../models/devices.js')(sequ.sequelize ,sequ.Sequelize)
const Schedules = require('../models/schedules.js')(sequ.sequelize ,sequ.Sequelize)

/*===========================
=            GETs           =
===========================*/

router.get('/', (req, res, next) => {
	Rooms.findAll({
		attributes: {
			exclude: ['password']
		}
	})
		.then(rooms => {
			res.status(200).json(rooms)
		})
		.catch(e => {
			res.status(500).json(e)
		})
})


router.get('/:id', (req, res, next) => {
	const id = req.params.id
	Rooms.findById(id)
		.then(room => {
			if (room) {
				res.status(200).json(room)
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
	Rooms.create(data)
		.then(room => {
			delete room.dataValues.pass
			res.status(201).json(room)
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
	Rooms.findById(id)
		.then(room => {
			if (room) {
				room.update(data)
				.then((s) => {
					console.log(s)
					res.status(200).json(room)
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

 //TO DO DELETE ALL DEVICES AND CRONES FROM THAT ROOM 

router.delete('/:id', (req, res, next) => {
	const id  = req.params.id
	Rooms.findById(id)
		.then(room => {
			if (!room) 
				throw new Error("NO_INSTANCE")

			return sequ.sequelize.transaction( (t) => {
				return Schedules.destroy({
					where: { room_id: id }
				}, {transaction: t})
					.then( (aff) => {
						return Devices.destroy({
							where: { room_id: id }
						}, {transaction: t})
					})
					.then( (aff) => {
						return room.destroy({},{transaction: t})
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

/*{transaction: t}*/