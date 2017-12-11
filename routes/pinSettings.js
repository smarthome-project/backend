const express      = require('express')
const router 	   = express.Router()
const _ 		   = require('lodash')

const sequ = require('../libs/sequelizeDB.js')
const PinSettings = require('../models/pinSettings.js')(sequ.sequelize ,sequ.Sequelize)

/*===========================
=            GETs           =
===========================*/

router.get('/', (req, res, next) => {
	PinSettings.findAll()
		.then(pinSettings => {
			res.status(200).json(pinSettings)
		})
		.catch(e => {
			res.status(500).json(e)
		})
})

router.get('/:id', (req, res, next) => {
	const id = req.params.id
	PinSettings.findById(id)
		.then(pinSetting => {
			if (pinSetting) {
				res.status(200).json(pinSetting)
			} else {
				res.status(400).end()
			}
		})
		.catch(e => {
			res.status(500).json(e)
		})
})

module.exports = router



