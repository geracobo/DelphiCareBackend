var canvas = document.getElementById('Canvas');
var ctx = canvas.getContext('2d');

function updateCanvas(y)
{
	// shift everything to the left:
	var imageData = ctx.getImageData(1, 0, ctx.canvas.width-1, ctx.canvas.height);
	ctx.putImageData(imageData, 0, 0);
	// now clear the right-most pixels:
	ctx.clearRect(ctx.canvas.width-1, 0, 1, ctx.canvas.height);

	ctx.fillStyle = "rgb(0, 0, 200)";
	ctx.fillRect (ctx.canvas.width-1, y, 1, 1);
}

SERVER_ADDRESS = '162.243.55.207'
//SERVER_ADDRESS = 'localhost'
SERVER_PORT = 8088
var socket = io.connect('http://'+SERVER_ADDRESS+':'+SERVER_PORT);
socket.on('data', function (data) {
	datas = data.data.split('\n')
	for(var i=0; i<datas.length; i++)
	{
		if(datas[i] == '')
			continue
		updateCanvas(datas[i])
	}
})