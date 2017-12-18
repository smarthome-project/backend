module.exports = (sequelize, Sequelize) => {

	const Inputs = sequelize.define('inputs', {
		pin_settings_id: {
			type: Sequelize.INTEGER,
			unique: true,
			allowNull: false,

		},
		number: {
			type: Sequelize.INTEGER,
			unique: true,
			allowNull: false,
		},
		type: {
			type: Sequelize.STRING(60),
			allowNull: false,
			validate: {
				len: [3,60]
			}
		}
	}, {
		timestamps: false
	})

  return Inputs
}
