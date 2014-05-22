
/**
 * Module dependencies.
 */
var express = require('express')
  , app = express()
  , routes = require('./routes')
  , http = require('http').createServer(app)
  , io = require('socket.io').listen(http)
  , path = require('path');

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(require('stylus').middleware(__dirname + '/public'));
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

app.get('/', routes.index);

http.listen(app.get('port'), function(){
    console.log('Express server listening on port ' + app.get('port'));
});

// Socket.io Handler
io.sockets.on('connection', function (socket) {
   var tick_count = 0;
   var total_secs = 0;
   var timer;
   var count_upward = false;

   socket.on('clockstart', function (data) {
       total_secs = data.total_secs;
       count_upward = data.count_upward;
       timer = setInterval(ticker, 1000);
   });

   var ticker = function() {
       if (tick_count <= total_secs || count_upward) {
           socket.emit('clocktick', {'tick_count':tick_count++});
       } else { // timer done
           console.log("its me of course", tick_count);
           cancelTimer();
       }
   }

   socket.on('clockpause', function (data) {
       if (data.pause) {
           clearInterval(timer);
       } else { // resume
           timer = setInterval(ticker, 1000);
       }
   });

   socket.on('clockstop', function (data) {
       cancelTimer();
   });

   function cancelTimer() {
       console.log('Cancelling current timer.');
       clearInterval(timer);
       tick_count = 0;
   }

});
