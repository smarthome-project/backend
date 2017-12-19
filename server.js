const express 	   = require('express')
const path 		   = require('path')
const bodyParser   = require('body-parser')
const morgan       = require('morgan')
const jwt		   = require('jsonwebtoken')
const _ 		   = require('lodash')
const CronJob      = require('cron').CronJob

const config = require('./config')
const checkDB 	= require('./libs/updateDB.js')


const tokensRouter = require('./routes/tokens')
const devicesRouter = require('./routes/devices')
const devicesTypesRouter = require('./routes/devicesTypes')
const usersRouter = require('./routes/users')
const roomsRouter = require('./routes/rooms')
const inputsRouter = require('./routes/inputs')
const imagesRouter = require('./routes/images')
const pinSettingsRouter = require('./routes/pinSettings')
const schedulesRouter = require('./routes/schedules')


const sequ = require('./libs/sequelizeDB.js')
const Scheduler = require('./libs/Scheduler.js')

const Devices = require('./models/devices.js')(sequ.sequelize ,sequ.Sequelize)


//var route = require('./routes/route')
var app = express()

var server  = require('http').createServer(app);
var io      = require('socket.io').listen(server);
let alarmStatus = false

app.set('superSecret', config.secret)

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))

app.use(morgan('dev'))

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
app.use("/api/users", usersRouter)
app.use("/api/rooms", roomsRouter)
app.use("/api/pinSettings", pinSettingsRouter)
app.use("/api/devices", devicesRouter)
app.use("/api/devicesTypes", devicesTypesRouter)
app.use("/api/inputs", inputsRouter)
app.use("/api/images", imagesRouter)
app.use("/api/schedules", schedulesRouter)

/*=======================================
=            Code For alarm (mock)            =
=======================================*/

app.get("/api/alarm", (req, res) => {
	res.status(200).json({alarmStatus: alarmStatus})
})

app.get("/api/alarm/:state", (req, res) => {
	alarmStatus = (req.params.state == "true") ? true : false
	res.status(200).json({alarmStatus: alarmStatus})
})
/*=====  End of Code For alarm (mock)  ======*/

app.set('socketio', io)

let scheduler = new Scheduler(CronJob, io, sequ, Devices)

app.set('scheduler', scheduler)

io.on('connection',function(socket) {
	console.log("connection")
	console.log(socket.handshake.query.Type)

	if (socket.handshake.query.Type && socket.handshake.query.Type == 'controler') {
		socket.join('controler')
	} else {
		socket.join('user')
	}

	socket.on('noPort', (data) => {
		console.log(data)
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
	checkDB.updateDB( () => {
		scheduler.getJobsFromDb()	
	})
})




