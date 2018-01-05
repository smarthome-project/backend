module.exports = (sequelize, Sequelize) => {

	const DevicesAcceptedStatesKeys = {
		"POWER" :['active'],
		"LEDRGB": ['rgb'],
		"LEDCW": ['cw']
	}

	function activeCheck(value) {
		return value === false || value === true
	}

	function checkRGB(value) {
		return /^#[0-9A-F]{6}$/i.test(value)
	}

	function checkCW(value) {
		return /^#[0-9A-F]{4}00$/i.test(value)
	}

	const stateKeyValidator = {
		'active': activeCheck,
		'rgb': checkRGB,
		'cw': checkCW
	}

	const Devices = sequelize.define('devices', {
		type: {
			type: Sequelize.STRING(60),
			allowNull: false,
			validate: {
				len: [3,60],
				isIn: [["POWER","LEDRGB", "LEDCW"]]
			}
		},
		input_id: {
			type: Sequelize.INTEGER,
			allowNull: false,
			unique: true,
		},
		room_id: {
			type: Sequelize.INTEGER
		},
		state: {
			type: Sequelize.JSON
		},
		name: {
			type: Sequelize.STRING(60),
			allowNull: false,
		},
		img: {
			type: Sequelize.STRING(60)
		}
	}, {
		timestamps: false,
		validate: {
			checkDeviceState() {
				if (this.state === Object(this.state) && Object.prototype.toString.call(this.state) !== '[object Array]') {
					const keys = Object.keys(this.state)
					if ((DevicesAcceptedStatesKeys[this.type]).length == keys.length ){
						keys.forEach( (key) => {
							let func = stateKeyValidator[key]
							if (!findKeyinArray(key, (DevicesAcceptedStatesKeys[this.type]))) {
								throw new Error(`key ${key} is not accepted for type ${this.type}`)
							} else if (!func || !func(this.state[key])){
								throw new Error(`value ${this.state[key]} for state key ${key} is not accepted`)
							}
						})
					} else {
						throw new Error('Bad number of keys in state')
					}
				} else {
					throw new Error('Bad device state, Expected an object')
				}
			}
		}
	})

	const findKeyinArray = function(key,array){
		for (var i = 0; i < array.length; i++) {
			if (array[i] == key)
				return true
		}
			return false
	}


  return Devices
}