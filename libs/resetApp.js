const db 	   = require('./db')
const conf     = require('../config.js')
const Promise  = require('bluebird')
const useDb = 'use ' + conf.db_conn.database + ';'

const reset = function() {
	return new Promise( (resolve, reject) => {
		let data
		tranQueryies = `TRUNCATE devices; TRUNCATE rooms; TRUNCATE schedules; TRUNCATE users;`
		db.connection.query(tranQueryies)
			.on('result', (row) => {
				data = row
			})
			.on('end',() => {
				console.log("end ", data)
				resolve(data)
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
	reset: reset,
}
