module.exports = (sequelize, Sequelize) => {

	const PinSettings = sequelize.define('pin_settings', {
		type: {
			type: Sequelize.STRING(60)
		},
		pin_plus: {
			type: Sequelize.INTEGER
		},
		pin_minus: {
			type: Sequelize.INTEGER
		},
		pin_data_one: {
			type: Sequelize.INTEGER
		},
		pin_data_two: {
			type: Sequelize.INTEGER
		}
	}, {
		timestamps: false
	})

  return PinSettings
}