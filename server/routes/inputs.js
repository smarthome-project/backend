const express      = require('express')
const router 	   = express.Router()
const _ 		   = require('lodash')

const sequ = require('../libs/sequelizeDB.js')
const Inputs = require('../models/inputs.js')(sequ.sequelize ,sequ.Sequelize)
/*===========================
=            GETs           =
===========================*/

router.get('/', (req, res, next) => {
	Inputs.findAll()
		.then(inputs => {
			res.status(200).json(inputs)
		})
		.catch(e => {
			res.status(500).json(e)
		})
})

router.get('/:id', (req, res, next) => {
	const id = req.params.id
	Inputs.findById(id)
		.then(input => {
			if (input) {
				res.status(200).json(input)
			} else {
				res.status(400).end()
			}
		})
		.catch(e => {
			res.status(500).json(e)
		})
})


module.exports = router




