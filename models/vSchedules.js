module.exports = (sequelize, Sequelize) => {

	const Schedules = sequelize.define('v_schedules', {
		room_id: {
			type: Sequelize.INTEGER
		},
		device_id: {
			type: Sequelize.INTEGER,
			allowNull: false
		},
		cron: {
			type: Sequelize.STRING(60),
			allowNull: false,
			validate: {
				len: [3,60]
			}
		},
		state: {
			type: Sequelize.JSON,
			allowNull: false
		},
		transiton_time: {
			type: Sequelize.INTEGER
		},
		active: {
			type: Sequelize.BOOLEAN,
			defaultValue: true 
		},
		name: {
			type: Sequelize.STRING(60),
		},
		room_name: {
			type: Sequelize.STRING(40),
		},
	}, {
	})

  return Schedules
}