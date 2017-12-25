//require fields
const express       = require('express');
const app           = express();
const server        = require('http').createServer(app);
const io            = require('socket.io')(server);
var   serverPath    = [];
var   path          = [];


//initialize express static filesystem
app.use(express.static(__dirname + '/node_modules/'));
app.use(express.static(__dirname + '/front'));

//request handler
app.get('/', function(req, res, next)
  {
    console.log('И для любви это не место');
    res.sendFile(__dirname + '/front/htm/index.htm');
  } );

io.on('connection', function(socket){
    console.log('Прольются все слова как дождь');
    socket.emit('open', path);
    socket.on('commit', function(msg){
      path.push(msg);
      console.log(msg);
      socket.broadcast.emit('update', msg);
    });
  });


// DOWNSCHENEC
server.listen(6969, function(){
    console.log('Дорога - мой дом');
  });