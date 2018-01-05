const db 	= require('./db')
var fs      = require('fs')
var conf    = require('../config.js')
var Promise		= require('bluebird')

var useDb = 'use ' + conf.db_conn.database + ';'
var sqlFilesDircetory = __dirname + '/sqlScripts/'

let version = 0

var updateDB = function(rdy) {
	checkDbVersion()
		.then( resp => {			
			if(resp == version) {
				return
			} else {
				version = resp
				if(resp == '0.1') {
					updateToVersion('version_0.2.sql', (err, resp) => {
						if(!err) updateDB(rdy)
					})
				}  else if(resp == '0.2') {
					updateToVersion('version_0.3.sql', (err, resp) => {
						if(!err) updateDB(rdy)
					})
				}  else if(resp == '0.3') {
					updateToVersion('version_0.4.sql', (err, resp) => {
						if(!err) updateDB(rdy)
					})
				}  else if(resp == '0.4') {
					updateToVersion('version_0.5.sql', (err, resp) => {
						if(!err) updateDB(rdy)
					})
				}  else if(resp == '0.5') {
					updateToVersion('version_0.6.sql', (err, resp) => {
						if(!err) updateDB(rdy)
					})
				}  else if(resp == '0.6') {
					updateToVersion('version_0.7.sql', (err, resp) => {
						if(!err) updateDB(rdy)
					})
				}  else if(resp == '0.7') {
					updateToVersion('version_0.8.sql', (err, resp) => {
						if(!err) updateDB(rdy)
					})
				} else if(resp == '0.8') {
					updateToVersion('version_0.9.sql', (err, resp) => {
						if(!err) updateDB(rdy)
					})
				} else {
					console.log("DB version = " + resp)
					rdy()
				}
			}	
		})
		.catch( e => {
			updateToVersion('version_0.1.sql', (err, resp) => {
				if(!err) updateDB()
			})
		})
}

var checkDbVersion = function() {
	return new Promise( (resolve, reject) => {
		let v = 0
		db.connection.query("select version from info")
			.on('result', (row) => {
				v = row.version
			})
			.on('end',() => {
				resolve(v)
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

var execFile = function(filename) {
	return new Promise( (resolve, reject) => {
		let scriptStatus = []
		fs.readFile(filename, 'utf8', function (err, data) {
			if (err) reject(err)
			db.connection.query(data)
				.on('result', (row) => {
					scriptStatus.push(row)
				})
				.on('end',() => {
					resolve(scriptStatus)
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
	})
}

var updateToVersion = function (filename, callback) {
	let sqlFilePath = sqlFilesDircetory + filename
	execFile(sqlFilePath)
	.then( resp => {
		console.log("run ",filename)
		callback(null, resp)
		return true
	})
	.catch( e => {
		console.log(e)
		callback(e, null)
		return false
	})
} 



module.exports = {
	updateDB: updateDB
}