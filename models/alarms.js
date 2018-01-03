module.exports = (sequelize, Sequelize) => {

	const Alarms = sequelize.define('alarms', {
		secured: {
			type: Sequelize.BOOLEAN,
			defaultValue: false 
		},
		alarm: {
			type: Sequelize.BOOLEAN,
			defaultValue: false 
		}
	}, {
		timestamps: false
	})

  return Alarms
}