const express = require('express')
const router 	= express.Router()
const jwt		= require('jsonwebtoken')

const secret 	= require('./../config').secret
const group_names = ['root','admin','security','renter','observer']

const sequ = require('../libs/sequelizeDB.js')
const Users = require('../models/users.js')(sequ.sequelize ,sequ.Sequelize)

const expiresIn = (60 * 60 * 16)

/*===========================
=            GETs           =
===========================*/

router.get('/checkToken', (req, res, next) => {
	let token = req.headers['x-access-token']
	if (token){
		jwt.verify(token, secret, (err, decoded) => {
			if (err){
				res.status(401).end()
			} else {
				res.status(200).json(decoded).end()
			}
		})
	} else {
		res.status(401).end()
	}
})

router.get('/available', (req, res, next) => {
	Users.findOne({
		attributes: [[sequ.sequelize.fn('COUNT', sequ.sequelize.col('id')), 'ids']]
	})
	.then(user => {
		if (user.get('ids') > 0) 
			res.status(200).json({setUp: false})
		else
			res.status(200).json({setUp: true})
	})
})

 /*=============================
 =            POSTs            =
 =============================*/

router.post('/', (req, res, next) => {
	let login = req.body.login
	let pass = req.body.pass
	Users.findOne({ where: {login: login} })
		.then(user => {		
			if (user && login == user.login && pass == user.pass) {
				let token = jwt.sign(user.toJSON(), secret, { expiresIn : expiresIn })
				res.status(201).json({token: token})
			} else {
				res.status(401).json({token: null})
			}
		})
		.catch(e => {
			console.log("error", e)
			res.status(500).json(e)
		})
})

 /*============================
 =            PUTs            =
 ============================*/



module.exports = router



