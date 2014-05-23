'use strict';

var $ = require('jquery'),
    Backbone = require('backbone'),
    CompletedTask = require('../models/completed-task'),
    UnitaskrTime = require('../utils/unitaskr-time'),
    io = require('socket.io-client'),
    socket = io.connect(),
    interval = 1000, // 1 FPS
    totalSecs = 0,
    ticks = 0,
    then, // used later with 'now' and 'delta' for rAF
    intervened = false, // For if we clicked cancel or stop
    tasksReady = 0,
    pause = false,
    timeOnTask = 1,
    countUpward = false,
    $task,
    $followingTask,
    $followingTaskVal = null,
    $followingTaskName,
    $taskBar,
    $timeBar = $('#time-bar'),
    $updateTime,
    $currentTaskText;


module.exports = Backbone.View.extend({

    el: '#taskbar-container',

    events: {
        'click #current-task a': 'editTask',
        'click #following-task-name a': 'editTask',
        'click #stop-countdown': 'stopCountdown',
        'click #pause-countdown': 'pauseCountdown',
        'click #cancel-countdown': 'cancelCountdown',
        'click #count-upward': 'countUpward',
        'submit form#taskbar': 'startTimer',
    },

    initialize: function() {
        var that = this;
        $task = $('#task');
        $followingTask = $('#following-task');
        $taskBar = $('#task-bar');
        $timeBar = $('#time-bar');
        $updateTime = $('#update-time');

        // We listen on initialization to only create one listener
        socket.on('clocktick', function (data) {
            ticks = data.tick_count;

            // Use rAF, not setTimeout, to save on CPU/battery
            // when the browser tab isn't focused.
            if (ticks < totalSecs) {
                requestAnimationFrame(function() { that.rAF_cb(that); });
            } 

            // Since rAF goes out of focus on tab switch (blur)
            // we still need to run the callback.
            if (ticks >= totalSecs) {
                that.rAF_cb(that);
            }
        });
    },

    render: function() {
        return this;
    },

    startTimer: function(e) {
        e.preventDefault(); // prevents form submission
        var secs_in_hours = $('#hours').val() * 3600,
            secs_in_minutes = $('#minutes').val() * 60,
            secs = $('#seconds').val();
        totalSecs = (+(secs_in_hours) + 
                +(secs_in_minutes) + +(secs));
        then = Date.now();
        $followingTaskName = $('#following-task-name');
        $followingTaskVal = $task.val();

        if (countUpward) {
            ticks = -1;
            totalSecs = 0;
        }

        if (!totalSecs && !tasksReady) {
            totalSecs = 1;
        }

        if ($task.val() == '') {
            alert('Please enter a task.');
            $task.focus();
            return false;
        } else {
            tasksReady++;
            $task.val(''); // Clear last inputted task
            $('#current-task, #current-notes-input, ' +
              '#following-notes-input').css('display', 'block');

            if (tasksReady == 1) {
                $('#current-task-text').html($followingTaskVal);
            }

            $currentTaskText = $('#current-task-text').html();

            // Change the task input bar to accept following task(s)
            $('#task-desc').html('Following Task ');
            $('#task-input input[type=submit]').val('Start');
            $('#timer-input').css('display', 'block');
        }

        // Validate user input
        if (totalSecs == 0 && tasksReady && ticks != -1) {
            alert('Please enter a time.');
            $('#minutes').select();
            return false;
        }

        timeOnTask = UnitaskrTime.secondsToTime(totalSecs);

        // Set the text for what the following task will be. '\u2014' is 
        // unicode for &mdash;
        $followingTask.html($followingTaskVal + 
            ' \u2014 Length: ' + UnitaskrTime.secondsToTime(totalSecs));

        if (tasksReady > 1) {
            this.showTaskInputs(false);
            this.showTaskNames(true);
            this.showTimeBar(true);

            // send the amount of seconds entered to the server, etc.
            socket.emit('clockstart', {
                'total_secs':totalSecs, 
                'count_upward':countUpward, 
                'interval':interval,
            });
        } 
    },

    rAF_cb: function(that) {
        var count = 0,
            now,
            delta;
        $updateTime = $('#update-time');

        if (ticks <= totalSecs || countUpward) {
            now = Date.now();
            delta = now - then;

            if (delta > interval && !pause) {
                then = now - (delta % interval);
                count = countUpward ? totalSecs+ticks : totalSecs-ticks;

                // Render the clock animation
                $updateTime.html(UnitaskrTime.secondsToTime(count));
            }

            that.checkTimer();
        } else {
            that.showTaskInputs(true);
            that.showTaskNames(false);
        }
    },

    checkTimer: function() {
        if (ticks >= totalSecs && !countUpward) {

            if (tasksReady && !intervened) {
                this.alarm();
            }

            // Apppend the current task to the Completed Tasks box:
            if ($currentTaskText != '') {
                CompletedTask.set({
                    task: $currentTaskText,
                    timeSpent: timeOnTask,
                    timeEnded: UnitaskrTime.getTimeNow(),
                });
            }

            $('#current-task-text').html($followingTaskVal);
            this.updateNotes();
            this.cleanUp();
        }
    },

    alarm: function() {
        // Alert the user they can start the following task now

        if ($('#sound-check').is(':checked')) {
            document.getElementById('chime').play();
        }

        // TODO: make this configurable so they only get a sound
        alert('Time to ' + $followingTaskVal);
    },

    // Moves the following task's notes to the current task's notes
    updateNotes: function() {
        var $following_textarea = $('#following-textarea');
        $('#current-textarea').val($following_textarea.val());
        $following_textarea.val('');
    },

    cleanUp: function() {
        ticks = 0;
        intervened = false;
        $('#following-task').html('');
        this.showTimeBar(false);
        this.showTaskInputs(true);
        this.showTaskNames(false);
    },

    editTask: function(e) {
        e.preventDefault();
        var id_name = $(e.target).data('target'),
            msg = $(e.target).data('msg'),
            cur = $('#' + id_name).html(),
            mdash_index;
        
        if (cur.indexOf('\u2014') != -1) { // Edit following task
            mdash_index = cur.indexOf('\u2014');
            cur = prompt(msg, cur.substring(0, mdash_index));
            if (cur != null && cur != '') {
                cur += ' \u2014 Length: ' + timeOnTask;
            }
        } else {
            cur = prompt(msg, cur); // Edit current task
        }
        
        if (cur == null) {
            return false;
        }
            
        if (cur != '') {
            $('#' + id_name).html(cur);
            if (id_name == 'current-task-text') {
                $currentTaskText = cur;
            } else if (id_name == 'following-task') {
                $followingTaskVal = cur.substring(0, mdash_index);
            }
        } else {
            alert('Please enter a task');
            edit_task(id_name, msg);
        }
    },

    countUpward: function(e) {
        e.preventDefault();
        countUpward = true;
        $('#timer-input').css('display', 'none');
    },

    stopCountdown: function(e) {
        e.preventDefault();
        intervened = true;
        countUpward = false;
        this.showTimeBar(false);
        // Recalulate how much time was spent on the task:
        timeOnTask = UnitaskrTime.secondsToTime(ticks);
        socket.emit('clockstop');
        ticks = totalSecs; // for checkTimer
        this.checkTimer();
        this.cleanUp();
    },

    pauseCountdown: function(e) {
        e.preventDefault();
        pause ^= true; // Toggle
        socket.emit('clockpause', {'pause':pause});
    },

    cancelCountdown: function(e) {
        e.preventDefault();
        intervened = true;
        this.showTimeBar(false);
        countUpward = false;
        socket.emit('clockstop');
        this.cleanUp();
    },

    showTaskInputs: function(toggle) {
        $taskBar.css('display', (toggle ? 'block' : 'none'));
        document.taskbar.task.focus();
    },

    showTaskNames: function(toggle) {
        $followingTaskName.css('display', (toggle ? 'block' : 'none'));
    },

    showTimeBar: function(toggle) {
        $timeBar.css('display', (toggle ? 'block' : 'none'));
    },

});
