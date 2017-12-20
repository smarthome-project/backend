module.exports = (sequelize, Sequelize, CronJob) => {

	const Schedules = sequelize.define('schedules', {
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
		}
	}, {
		validate: {
			checkCrone() {
				if (this.cron) {
					let job = undefined
					try {
						job = new CronJob(this.cron, function() {
							console.log('cron pattern test')
						})
						job.stop()
						jobs = undefined
					} catch(ex) {
						throw new Error('Bad cron pattern')
						console.log("cron pattern not valid")
					}
				} else {
					throw new Error('Bad cron pattern')
				}
			}
		}
	})

  return Schedules
}