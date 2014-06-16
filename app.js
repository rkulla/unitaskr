
/**
 * Module dependencies.
 */
var express = require('express')
  , app = express()
  , routes = require('./routes')
  , http = require('http').createServer(app)
  , io = require('socket.io').listen(http)
  , fs = require('fs')
  , unitaskrTime = require('./public/js/utils/unitaskr-time')
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


// Disable DEBUG output in console for websockets
io.set('log level', 1);

// Socket.io Handler
io.sockets.on('connection', function (socket) {
   var tick_count = 0,
       total_secs = 0,
       timer,
       count_upward = false,
       interval,
       ticker;

   socket.on('clockstart', function (data) {
       total_secs = data.total_secs;
       count_upward = data.count_upward;
       interval = data.interval;
       timer = setInterval(ticker, interval);
   });

   ticker = function() {
       if (tick_count <= total_secs || count_upward) {
           socket.emit('clocktick', {'tick_count':tick_count++});
       } else { // timer done
           cancelTimer();
       }
   }

   socket.on('clockpause', function (data) {
       if (data.pause) {
           clearInterval(timer);
       } else { // resume
           timer = setInterval(ticker, interval);
       }
   });

   socket.on('clockstop', function (data) {
       cancelTimer();
   });

   function cancelTimer() {
       clearInterval(timer);
   }

   // Log finished tasks
   socket.on('log_completed', function (data) {
       data.timeSpent = unitaskrTime.secondsToTime(tick_count-1);

       var hours = data.timeSpent.hours,
           mins = data.timeSpent.mins,
           secs = data.timeSpent.secs,
           timeSpent = hours + 'h ' + mins + 'm ' + secs + 's';

       fs.appendFile('completed-tasks.log', data.task + 
           ' - Time spent: ' + timeSpent + ' - Ended: ' + 
           data.timeEnded + '\n');

       // reset tick_count here, not in cancelTimer, since we need it
       tick_count = 0;
   });

});
