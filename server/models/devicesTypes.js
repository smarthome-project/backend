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
		}
	}, {
		timestamps: false
	})

  return DevicesTypes
}