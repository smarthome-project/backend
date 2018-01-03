module.exports = (sequelize, Sequelize) => {

	const Rooms = sequelize.define('cameras', {
		name: {
			type: Sequelize.STRING,
			unique: true,
			allowNull: false,
			validate: {
				len: [1,68]
			}
		},

		room_id: {
			type: Sequelize.INTEGER
		},

		ip: {
			type: Sequelize.STRING(45),
			allowNull: false,
		},

		login: {
			type: Sequelize.STRING(64)
		},

		pass: {
			type: Sequelize.STRING(128)
		},
	}, {
		timestamps: false
	})

  return Rooms
}