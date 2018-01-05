const dbSecret = module.parent.dbSecret

if (!dbSecret) {
	throw new Error("NO dbSecret FOUND!, please reset device")
	process.exit(1)
}

const express 	   = require('express')
const path 		   = require('path')
const bodyParser   = require('body-parser')
const morgan       = require('morgan')
const jwt		   = require('jsonwebtoken')
const _ 		   = require('lodash')
const CronJob      = require('cron').CronJob

const config = require('./config')
const checkDB 	= require('./libs/updateDB.js')

const cors = require('cors')

const tokensRouter = require('./routes/tokens')
const devicesRouter = require('./routes/devices')
const devicesTypesRouter = require('./routes/devicesTypes')
const usersRouter = require('./routes/users')
const roomsRouter = require('./routes/rooms')
const inputsRouter = require('./routes/inputs')
const imagesRouter = require('./routes/images')
const pinSettingsRouter = require('./routes/pinSettings')
const schedulesRouter = require('./routes/schedules')
const camerasRouter = require('./routes/cameras')
const alarmsRouter = require('./routes/alarms')

const sequ = require('./libs/sequelizeDB.js')
const Scheduler = require('./libs/Scheduler.js')

const Devices = require('./models/devices.js')(sequ.sequelize ,sequ.Sequelize)
const Alarms = require('./models/alarms.js')(sequ.sequelize ,sequ.Sequelize)

//var route = require('./routes/route')

var app = express()

var server  = require('http').createServer(app);
var io      = require('socket.io').listen(server);
let alarmStatus = false

const superSecret = config.secret + dbSecret

app.set('superSecret', superSecret)

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))

app.use(morgan('dev'))

app.use(cors())

app.use(function(req, res, next) {
	res.header("Access-Control-Allow-Origin", "*")
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, x-access-token")
	if ('OPTIONS' == req.method) {
		res.sendStatus(200)
	} else {
		next()
	}
})

app.use("/api/tokens", tokensRouter)
app.use("/api/cameras", camerasRouter)
app.use("/api/users", usersRouter)
app.use("/api/rooms", roomsRouter)
app.use("/api/pinSettings", pinSettingsRouter)
app.use("/api/devices", devicesRouter)
app.use("/api/devicesTypes", devicesTypesRouter)
app.use("/api/inputs", inputsRouter)
app.use("/api/images", imagesRouter)
app.use("/api/schedules", schedulesRouter)
app.use("/api/alarms", alarmsRouter)

/*=======================================
=            Code For alarm (mock)            =
=======================================*/


/*=====  End of Code For alarm (mock)  ======*/

app.set('socketio', io)

let scheduler = new Scheduler(CronJob, io, sequ, Devices)

app.set('scheduler', scheduler)

io.on('connection',function(socket) {
	console.log("connection")

	if (socket.handshake.query.Type && socket.handshake.query.Type == 'controler') {
		socket.join('controler')
	} else {
		socket.join('user')
	}

	socket.on('noPort', (data) => {
		console.log(data)
	})

	socket.on('getSecured', ()=> {
		Alarms.findById(1)
			.then(alarm => {
				if (alarm)
					io.emit("setSecured",alarm.secured)
			})
			.catch(e => {
				res.status(500).json(e)
			})
	})

	socket.on('alarm', () => {
		io.to('user').emit("alarm")
		sequ.sequelize.query(
		`UPDATE \`alarms\` SET \`alarm\`='1' WHERE \`id\`='1';`,
	    { type: sequ.sequelize.QueryTypes.UPDATE})
		.then(aff => {})
	})

	socket.on('getDevices', () => {
		sequ.sequelize.query(
		`SELECT d.state, d.type, i.*, pin.pin1, pin.pin2, pin.pin3, pin.pwm, pin.shift_id FROM \`devices\` d 
			LEFT JOIN \`inputs\` i ON(d.input_id = i.number)
	    	LEFT JOIN \`pin_settings\` pin ON(i.pin_settings_id = pin.id);`,
	    { type: sequ.sequelize.QueryTypes.SELECT})
		.then(devices => {
			let devicesByInputID = {}
			devices.forEach( (device) => {
				nr = device.pin_settings_id
				devicesByInputID[nr] = device
			})
			io.to('controler').emit("allDevicesData", devicesByInputID)
		})
	})

	socket.on('getRegister', () => {
		sequ.sequelize.query(
		`SELECT d.state, d.type, i.*, pin.pin1, pin.pin2, pin.pin3, pin.pwm, pin.shift_id FROM \`devices\` d 
			LEFT JOIN \`inputs\` i ON(d.input_id = i.number)
	    	LEFT JOIN \`pin_settings\` pin ON(i.pin_settings_id = pin.id)
	    	WHERE d.type = 'POWER';`,
	    { type: sequ.sequelize.QueryTypes.SELECT})
		.then(devices => {
			let registerState = [0,0,0,0,0,0,0,0]
			devices.forEach( (device) => {
				if(device.state && device.state.active == true)
					registerState[device.shift_id] = 1
			})
			io.to('controler').emit("initRegister", registerState.toString())
		})
	})
})

app.use(function(req, res, next) {
	var token = req.body.token || req.query.token || req.headers['x-access-token']
	if (token) {
		jwt.verify(token, app.get('superSecret'), function(err, decoded) {      
			if (err) {
				return res.json({ success: false, message: 'Failed to authenticate token.' })    
			} else {
				req.decoded = decoded    
				next()
			}
		})
	} else {
		return res.status(403).send({ 
			success: false, 
			message: 'No token provided.' 
		})
	}
})

app.get('*', function(req, res) {
	res.send('server')
})

server.listen(config.port, function() {
	console.log('Server started on ',config.port)
	scheduler.getJobsFromDb()	
})




