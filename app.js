var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = process.env.PORT || 3000;

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

app.get('/cur', function(req, res){
  res.sendFile(__dirname + '/cur.cur');
});

app.get('/qwe', function(req, res){
  res.sendFile(__dirname + '/spr.png');
});

var players = {};
function onConnection(socket){
  
  socket.emit('connecting', socket.id);
  
  socket.emit('show players', players);
  
  socket.on('connected', function(userID, X, Y, color, radius) {
	//console.log("get: ", userID, "  ", socket.id);
	players[userID] = {
		x: X,
		y: Y,
		clr: color,
		r: radius
	};
	console.log("add: ", socket.id, "\nnow: ", players.length, "\n");
	socket.broadcast.emit('imready', socket.id, players[userID].x, players[userID].y, players[userID].clr, players[userID].r);
  });
  
  socket.on('disconnect', function(){
	socket.broadcast.emit('dis', socket.id);
	delete players[socket.id];
	console.log("delete: ", socket.id, "\nnow: ", players.length, "\n");
  });
  
	socket.on('player moved', function(x, y){
		socket.emit('imoved', x, y);
		socket.broadcast.emit('player moved', socket.id, x, y);
		players[socket.id].x = x;
		players[socket.id].y = y;
  });	
  
};

io.on('connection', onConnection); 

http.listen(port, function(){
  console.log('listening on *:' + port);
});