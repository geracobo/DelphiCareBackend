var express = require('express')
var net = require('net')
var fs = require('fs')

var io = require('socket.io').listen(8070)

var app = express()


app.get('/', function(req, res) {
	var body = fs.readFileSync('./browser.html')

	res.setHeader('Content-Type', 'text/html')
	res.setHeader('Content-Length', body.length)
	res.end(body)
})
app.get('/browser.js', function(req, res){
	var body = fs.readFileSync('./browser.js')

	res.setHeader('Content-Type', 'text/javascript')
	res.setHeader('Content-Length', body.length)
	res.end(body)
})
app.get('/socket.io.js', function(req, res){
	var body = fs.readFileSync('./socket.io.js')

	res.setHeader('Content-Type', 'text/javascript')
	res.setHeader('Content-Length', body.length)
	res.end(body)
})


client_socket = null
io.sockets.on('connection', function (socket) {
	client_socket = socket
})

var daq_server = net.createServer(function(socket) {
	socket.on('data', function(data) {
		console.log(data.toString())

		if(client_socket != null)
			client_socket.emit('data', {'data': data.toString()})

	})



	socket.pipe(socket)
})


app.listen(8080)
daq_server.listen(8090)