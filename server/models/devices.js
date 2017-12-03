module.exports = (sequelize, Sequelize) => {

	const Devices = sequelize.define('devices', {
		type: {
			type: Sequelize.STRING(60),
			allowNull: false,
			validate: {
				len: [3,60]
			}
		},
		input_id: {
			type: Sequelize.INTEGER,
			allowNull: false,
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
			type: Sequelize.STRING(60),
		}
	}, {
		timestamps: false
	})

  return Devices
}