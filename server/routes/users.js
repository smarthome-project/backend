const express      = require('express')
const router 	   = express.Router()
const _ 		   = require('lodash')

const sequ = require('../libs/sequelizeDB.js')
const Users = require('../models/users.js')(sequ.sequelize ,sequ.Sequelize)

/*===========================
=            GETs           =
===========================*/

router.get('/', (req, res, next) => {
	Users.findAll({
		attributes: {
			exclude: ['password']
		}
	})
		.then(users => {
			res.status(200).json(users)
		})
		.catch(e => {
			res.status(500).json(e)
		})
})


router.get('/:id', (req, res, next) => {
	const id = req.params.id
	Users.findById(id)
		.then(user => {
			if (user) {
				res.status(200).json(user)
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
	Users.create(data)
		.then(user => {
			delete user.dataValues.pass
			res.status(201).json(user)
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
	Users.findById(id)
		.then(user => {
			if (user) {
				user.update(data)
				.then((s) => {
					console.log(s)
					res.status(200).json(user)
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




module.exports = router



