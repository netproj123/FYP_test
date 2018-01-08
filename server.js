var https = require('https');
var express = require('express');
app = express();
var socket_io = require('socket.io')(https);
var fs = require('fs');

var options = {
	key: fs.readFileSync('./webrtc.key'),
	cert: fs.readFileSync('./webrtc.crt')
}

var server = https.Server(options, app).listen(8000, function(){
	console.log('Server running...Port:8000');
});

var io = socket_io.listen(server);


app.use(express.static(__dirname + '/public'));

app.get('/', function(request, response){
	response.render('index.ejs');
});

users = [];
io.on('connection', function(socket){
	console.log('Connection Established!');
	var registeredUser;
	
	socket.on('setUsername', function(data){   //登記new user(registeredUser 
		if(users.indexOf(data) > -1) {
			socket.emit('userExists', data + ' username is taken. Try another!');
		}
		else{
			users.push(data);
			registeredUser = data;
			socket.emit('userSet', {username: data});
		}
	});

	socket.on('msg', function(data){			//send massage
		socket.broadcast.emit('newmsg', data);
	});
	
	socket.on('signal',function(data){			//send signal
		socket.broadcast.emit('signalMsg', {
				type: data.type,
				message: data.message
		});
	});
	
	socket.on('disconnect', function(data){		
		var index = users.indexOf(registeredUser);
		if(index > -1) {
			users.splice(index, 1);
			console.log(registeredUser + " disconnected.");
			
		}
	});
	
});



	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
