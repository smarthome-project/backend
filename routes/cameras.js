const express      = require('express')
const router 	   = express.Router()
const _ 		   = require('lodash')

const sequ = require('../libs/sequelizeDB.js')
const Cameras = require('../models/cameras.js')(sequ.sequelize ,sequ.Sequelize)

/*===========================
=            GETs           =
===========================*/

router.get('/', (req, res, next) => {
	Cameras.findAll()
		.then(cameras => {
			res.status(200).json(cameras)
		})
		.catch(e => {
			res.status(500).json(e)
		})
})


router.get('/:id', (req, res, next) => {
	const id = req.params.id
	Cameras.findById(id)
		.then(camera => {
			if (camera) {
				res.status(200).json(camera)
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
	Cameras.create(data)
		.then(camera => {
			req.app.get('socketio').to('user').emit('cameras:post', camera)
			res.status(201).json(camera)
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
	Cameras.findById(id)
		.then(camera => {
			if (camera) {
				camera.update(data)
				.then((s) => {
					req.app.get('socketio').to('user').emit('cameras:put', camera)
					res.status(200).json(camera)
				})
				.catch(e => {
					console.log(e)
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
	Cameras.findById(id)
		.then(camera => {
			if (!camera)
				throw new Error("NO_INSTANCE")
			return camera.destroy()
		})
		.then( (aff) => {
			req.app.get('socketio').to('user').emit('cameras:delete', id)
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