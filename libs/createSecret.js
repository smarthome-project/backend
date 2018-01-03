const db 	   = require('./db')
const fs       = require('fs')
const conf     = require('../config.js')
const Promise  = require('bluebird')
const crypto   = require('crypto')
const os       = require('os')
const useDb = 'use ' + conf.db_conn.database + ';'



const checkMac = function () {
	let mackNr = new Date().getTime() // get some random data in case no internet found
	const interfaces = os.networkInterfaces() //+ new Date.now()
	for (var key in interfaces ) {
		for (var nextKey in key) {
			if (interfaces && interfaces[key] && interfaces[key][nextKey] && interfaces[key][nextKey].mac != '00:00:00:00:00:00') {
				mackNr = interfaces[key][nextKey].mac
				break
			}
		}
	}
	
	return mackNr
}

const createSecret = function() {
	return new Promise( (resolve, reject) => {
		const hash = crypto.createHash('sha256')
		hash.update(checkMac() +  crypto.randomBytes(256) )
		const hex = hash.digest('hex')
		
		const query = `INSERT INTO secret (id, secretPart) VALUES(1, '${hex}') ON DUPLICATE KEY UPDATE secretPart = '${hex}'`
		db.connection.query(query)
			.on('result', (row) => {
			})
			.on('end',() => {
				resolve(hex)
			})
			.on('error', (err) => {
		        response = {
					error: true,
					msg: "DB_fail",
					desc: err,
		        }
		        reject(response)
			})
	})
}

const checkSecret = function() {
	return new Promise( (resolve, reject) => {
		const query = `SELECT secretPart FROM secret WHERE id = 1`

		let secret
		db.connection.query(query)
			.on('result', (row) => {
				secret = row
			})
			.on('end',() => {
				if(secret)
					resolve(secret.secretPart)
				else
					resolve(false)
			})
			.on('error', (err) => {
		        response = {
					error: true,
					msg: "DB_fail",
					desc: err,
		        }
		        reject(response)
			})
	})	
}



module.exports = {
	createSecret: createSecret,
	checkSecret: checkSecret
}
