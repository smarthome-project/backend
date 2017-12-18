module.exports = (sequelize, Sequelize) => {

	const DevicesTypes = sequelize.define('devices_types', {
		type: {
			type: Sequelize.STRING(60),
			allowNull: false,
			validate: {
				len: [3,60]
			}
		},
		default: {
			type: Sequelize.JSON,
			allowNull: false
		},
		pl_name: {
			type: Sequelize.STRING(30),
			allowNull: true
		}
	}, {
		timestamps: false
	})

  return DevicesTypes
}