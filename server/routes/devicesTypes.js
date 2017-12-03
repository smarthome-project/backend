const express      = require('express')
const router 	   = express.Router()
const _ 		   = require('lodash')

const sequ = require('../libs/sequelizeDB.js')
const DevicesTypes = require('../models/devicesTypes.js')(sequ.sequelize ,sequ.Sequelize)
/*===========================
=            GETs           =
===========================*/

router.get('/', (req, res, next) => {
	DevicesTypes.findAll()
		.then(devicestypes => {
			res.status(200).json(devicestypes)
		})
		.catch(e => {
			res.status(500).json(e)
		})
})

router.get('/:id', (req, res, next) => {
	const id = req.params.id
	DevicesTypes.findById(id)
		.then(devicetype => {
			if (devicetype) {
				res.status(200).json(devicetype)
			} else {
				res.status(400).end()
			}
		})
		.catch(e => {
			res.status(500).json(e)
		})
})


module.exports = router




