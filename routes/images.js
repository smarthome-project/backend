const express      = require('express')
const router 	   = express.Router()
const _ 		   = require('lodash')

const sequ = require('../libs/sequelizeDB.js')
const Images = require('../models/images.js')(sequ.sequelize ,sequ.Sequelize)

/*===========================
=            GETs           =
===========================*/

router.get('/', (req, res, next) => {
	Images.findAll()
		.then(images => {
			res.status(200).json(images)
		})
		.catch(e => {
			res.status(500).json(e)
		})
})


router.get('/:id', (req, res, next) => {
	const id = req.params.id
	Images.findById(id)
		.then(image => {
			if (image) {
				res.status(200).json(image)
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
	Images.create(data)
		.then(image => {
			res.status(201).json(image)
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
	Images.findById(id)
		.then(image => {
			if (image) {
				image.update(data)
				.then((s) => {
					console.log(s)
					res.status(200).json(image)
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
	Images.findById(id)
		.then(image => {
			if (image) {
				return image.destroy()
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

/*{transaction: t}*/