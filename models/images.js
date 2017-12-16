module.exports = (sequelize, Sequelize) => {

	const Images = sequelize.define('images', {
		name: {
			type: Sequelize.STRING,
			unique: true,
			allowNull: false,
		},
		path: {
			type: Sequelize.STRING(100)
			unique: true,
			allowNull: false,
		},
		type: {
			type:Sequelize.STRING(100)
		}
	}, {
		timestamps: false
	})

  return Images
}