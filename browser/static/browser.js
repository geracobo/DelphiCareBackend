





$(document).ready(function() {
	//$("#GeneralBox").draggable()
	//$("#SpO2Box").draggable()
	//$("#EKGBox").draggable()

	$("#GeneralBox").css("position", "static")
	impress().init()
})




var ekgcanvas = document.getElementById('EKGCanvas')
var spo2canvas = document.getElementById('SpO2Canvas')
var ekgctx = ekgcanvas.getContext('2d')
var spo2ctx = spo2canvas.getContext('2d')

ekgctx.strokeStyle = '#043BBC';
spo2ctx.strokeStyle = '#1C00D6';

var ekglasty = 0
var spo2lasty = 0


function updateEKGCanvas(y)
{
	var shift = 3
	// shift everything to the left:
	var imageData = ekgctx.getImageData(shift, 0, ekgcanvas.width-1, ekgcanvas.height);
	ekgctx.putImageData(imageData, 0, 0);
	// now clear the right-most pixels:
	ekgctx.clearRect(ekgcanvas.width-shift, 0, shift, ekgcanvas.height);

	ekgctx.beginPath()
	ekgctx.moveTo(ekgcanvas.width-shift, ekgcanvas.height-ekglasty)
	ekgctx.lineTo(ekgcanvas.width-1, ekgcanvas.height-y)
	ekgctx.stroke()
	ekglasty = y
}
function updateSpO2Canvas(y)
{
	y = y
	var shift = 3
	// shift everything to the left:
	var imageData = spo2ctx.getImageData(shift, 0, spo2canvas.width-1, spo2canvas.height);
	spo2ctx.putImageData(imageData, 0, 0);
	// now clear the right-most pixels:
	spo2ctx.clearRect(spo2canvas.width-shift, 0, shift, spo2canvas.height);

	spo2ctx.beginPath()
	spo2ctx.moveTo(spo2canvas.width-shift, spo2canvas.height-spo2lasty)
	spo2ctx.lineTo(spo2canvas.width-1, spo2canvas.height-y)
	spo2ctx.stroke()
	spo2lasty = y
}


SERVER_ADDRESS = '162.243.55.207'
//SERVER_ADDRESS = 'localhost'
SERVER_PORT = 8088
var socket = io.connect('http://'+SERVER_ADDRESS+':'+SERVER_PORT);
socket.on('data', function (data) {
	datas = data["data"].split('|')
	for(var i=0; i<datas.length; i++)
	{
		if(datas[i] == '')
			continue

		obj = JSON.parse(datas[i])
		if(obj['ekg'] != undefined)
		{
			updateEKGCanvas(parseInt(obj['ekg']))
		}
		if(obj['spo2'] != undefined)
		{
			var ox = parseFloat(obj['spo2'])/100
			//ox = 3.4-ox
			ox = 108.611 - 20.1389*ox - 3.47222*(ox^2)


			if(ox < 100)
				document.getElementById('SpO2').innerHTML = ox
			else
				document.getElementById('SpO2').innerHTML = ox


			updateSpO2Canvas(parseInt(obj['spo2']))
		}
		if(obj['temp'] != undefined)
		{
			document.getElementById('Temp').innerHTML = parseFloat(obj['temp'])
		}

		if(obj['alarm'] != undefined)
		{
			alarm = obj['alarm']
			if(alarm == "on")
			{
				impress().goto(2)
				$("#GeneralBox").addClass('alarm')
			}
			else if (alarm == "off")
			{
				$("#GeneralBox").removeClass('alarm')
			}
		}
	}
})