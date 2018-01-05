module.exports = (sequelize, Sequelize) => {

	const Rooms = sequelize.define('rooms', {
		name: {
			type: Sequelize.STRING,
			unique: true,
			allowNull: false,
			validate: {
				len: [1,40]
			}
		},
		image_path: {
			type: Sequelize.STRING(100),
			allowNull: false,
			validate: {
				len: [3,100]
			}
		}
	}, {
		timestamps: false
	})

  return Rooms
}