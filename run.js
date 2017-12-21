const config = require('./config')
const checkDB 	= require('./libs/updateDB.js')
const reset 	= require('./libs/resetApp.js')
const secret    = require('./libs/createSecret.js')

const Run = function () {
	checkDB.updateDB( () => {
		secret.checkSecret()
		.then( (secretPart) => {
			if (secretPart) {
				module.dbSecret = secretPart
				require("./server.js")
			} else {
				console.log("no dbSecret, creating new secret")
				secret.createSecret()
				.then( (newSecretPart) => {
					module.dbSecret = newSecretPart
					require("./server.js")
				})
				.catch( (e) => {
					throw new Error(e)
				})
			}
		})
	})
}


if (process.argv[2] == '-reset') {
	reset.reset()
	.then( () => {
		Run()
	})
} else {
	Run()
}

