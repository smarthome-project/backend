class Scheduler {

	constructor(CronJob, socket, sequ) {
		this.CronJob = CronJob
		this.socket = socket
		this.sequ = sequ
		this.jobs = []
	}

	getJobsFromDb() {
		this.sequ.sequelize.query(
		`SELECT s.*, pin.id as inputId FROM schedules s
			LEFT JOIN devices d ON(s.device_id = d.id)
			LEFT JOIN inputs i ON (d.input_id = i.id)
			LEFT JOIN pin_settings pin on(i.pin_settings_id = pin.id)
			WHERE s.active = true AND d.state <> s.state;`,
	    { type: this.sequ.sequelize.QueryTypes.SELECT})
		.then(schedules => {
			schedules.forEach( (cron) => {
				this.addJob(cron.id, cron.cron,cron.inputId , cron.state, cron.transiton_time)
			})
		})
		.catch(e => {
			throw new Error(`error while obtaining schedules form DB`)
		})
	}

	addJob(id, pattern,inputId, state, transitTime = null) {
		try {
			var job = new this.CronJob({
				cronTime: pattern,
				onTick: () => {
					console.log(` ${id}_${pattern} _tick  ${new Date()}`)
					this.socket.to('controler').emit('changeState',{id:inputId, state:state, transitTime: transitTime})
				},
				start: true
			})
		} catch(ex) {
			console.log(ex)
			console.log("cron pattern not valid");
		}

		this.jobs[id] = job

	}

	removeJob(id) {

	}

}

module.exports = Scheduler