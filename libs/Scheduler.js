class Scheduler {

	constructor(CronJob, socket, sequ, Devices) {
		this.CronJob = CronJob
		this.socket = socket
		this.sequ = sequ
		this.Devices = Devices
		this.jobs = []
	}

	getJobsFromDb() {
		this.sequ.sequelize.query(
		`SELECT s.*, pin.id as inputId, d.id as deviceId FROM schedules s
			LEFT JOIN devices d ON(s.device_id = d.id)
			LEFT JOIN inputs i ON (d.input_id = i.number)
			LEFT JOIN pin_settings pin on(i.pin_settings_id = pin.id)
			WHERE s.active = true;`,
	    { type: this.sequ.sequelize.QueryTypes.SELECT})
		.then(schedules => {
			schedules.forEach( (cron) => {
				this.addJob(cron.id, cron.deviceId, cron.cron,cron.inputId , cron.state, cron.transiton_time)
			})
		})
		.catch(e => {
			throw new Error(`error while obtaining schedules form DB`)
		})
	}

	updateDeviceState(id, state, inputId,transitTime = null) {
		this.Devices.findById(id)
			.then(device => {
				if (device) {
					device.update({state:state})
					.then((s) => {
						this.socket.to('controler').emit('changeState',{id:inputId, state:state, time: transitTime})
					})
					.catch(e => {
						console.log(e)
					})
				}
			})
			.catch(e => {
				console.log(e)
			})
	}

	addJob(id, deviceId, pattern, inputId, state, transitTime = null) {
		try {
			var job = new this.CronJob({
				cronTime: pattern,
				onTick: () => {
					console.log(` ${id}_${pattern} _tick  ${new Date()}`)
					this.updateDeviceState(id, state, inputId, transitTime)
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
		let job = this.jobs[id]
		if (job) {
			job.stop()
			this.jobs[id] = undefined
		} else {
			console.log("no Job to remove")
		}
	}

}

module.exports = Scheduler