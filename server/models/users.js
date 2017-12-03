module.exports = (sequelize, Sequelize) => {

	const User = sequelize.define('users', {
		login: {
			type: Sequelize.STRING,
			unique: true,
			allowNull: false,
			validate: {
				len: [3,30]
			}
		},
		pass: {
			type: Sequelize.STRING(128),
			allowNull: false,
			validate: {
				len: [3,128]
			}
		},
		imie: {
			type: Sequelize.STRING(30)
		},
		nazwisko: {
			type: Sequelize.STRING(30)
		}
	}, {
		timestamps: false
	})

  return User
}
