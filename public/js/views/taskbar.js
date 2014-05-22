'use strict';

var $ = require('jquery');
var Backbone = require('backbone');
var CompletedTask = require('../models/completed-task');
var unitaskrTime = require('../utils/unitaskr-time');
var io = require('socket.io-client');

var socket = io.connect();
var total_secs = 0;
var ticks = 0;
var then; // used later with 'now' and 'delta' for rAF
var intervened = false; // For if we clicked cancel or stop

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
        this.tasks_ready = 0;
        this.pause = false;
        this.timeOnTask = 1;
        this.count_upward = false;
        this.$task = $('#task');
        this.$following_task = $('#following-task');
        this.$following_task_val = null;
        this.$task_bar = $('#task-bar');
        this.$time_bar = $('#time-bar');
        this.$update_time = $('#update-time');
        var that = this;

        socket.on('clocktick', function (data) {
            ticks = data.tick_count;

            // Use rAF, not setTimeout, to save on CPU/battery
            // when the browser tab isn't focused.
            if (ticks < total_secs) {
                requestAnimationFrame(function() { that.rAF_cb(that); });
            } 

            // Since rAF goes out of focus on tab switch (blur)
            // we still need to run the callback.
            if (ticks >= total_secs) {
                that.rAF_cb(that);
            }
        });
    },

    render: function() {
        return this;
    },

    startTimer: function(e) {
        e.preventDefault(); // prevents form submission
        var secs_in_hours = $('#hours').val() * 3600;
        var secs_in_minutes = $('#minutes').val() * 60;
        var secs = $('#seconds').val();
        total_secs = (+(secs_in_hours) + 
                +(secs_in_minutes) + +(secs));
        then = Date.now();
        this.$following_task_name = $('#following-task-name');
        this.$following_task_val = this.$task.val();

        if (this.count_upward) {
            ticks = -1;
            total_secs = 0;
        }

        if (!total_secs && !this.tasks_ready) {
            total_secs = 1;
        }

        if (this.$task.val() == '') {
            alert('Please enter a task.');
            this.$task.focus();
            return false;
        } else {
            this.tasks_ready++;
            this.$task.val(''); // Clear last inputted task
            $('#current-task, #current-notes-input, ' +
              '#following-notes-input').css('display', 'block');

            if (this.tasks_ready == 1) {
                $('#current-task-text').html(this.$following_task_val);
            }

            this.$current_task_text = $('#current-task-text').html();

            // Change the task input bar to accept following task(s)
            $('#task-desc').html('Following Task ');
            $('#task-input input[type=submit]').val('Start');
            $('#timer-input').css('display', 'block');
        }

        // Validate user input
        if (total_secs == 0 && this.tasks_ready && ticks != -1) {
            alert('Please enter a time.');
            $('#minutes').select();
            return false;
        }

        this.timeOnTask = unitaskrTime.secondsToTime(total_secs);

        // Set the text for what the following task will be. '\u2014' is 
        // unicode for &mdash;
        this.$following_task.html(this.$following_task_val + 
            ' \u2014 Length: ' + unitaskrTime.secondsToTime(total_secs));

        if (this.tasks_ready > 1) {
            this.showTaskInputs(false);
            this.showTaskNames(true);
            this.showTimeBar(true);

            // send the amount of seconds entered to the server
            socket.emit('clockstart', {
                'total_secs':total_secs, 
                'count_upward':this.count_upward, 
            });
        } 
    },

    rAF_cb: function(that) {
        var count = 0;
        var now;
        var delta;
        var interval = 1000; // 1 FPS
        that.$update_time = $('#update-time');

        if (ticks <= total_secs || that.count_upward) {
            var now = Date.now();
            delta = now - then;

            if (delta > interval && !that.pause) {
                then = now - (delta % interval);
                count = that.count_upward ? total_secs+ticks : total_secs-ticks;

                // Render the clock animation
                that.$update_time.html(unitaskrTime.secondsToTime(count));
            }

            that.checkTimer();
        } else {
            that.showTaskInputs(true);
            that.showTaskNames(false);
        }
    },

    checkTimer: function() {
        if (ticks >= total_secs && !this.count_upward) {

            if (this.tasks_ready && !intervened) {
                this.alarm();
            }

            // Apppend the current task to the Completed Tasks box:
            if (this.$current_task_text != '') {
                CompletedTask.set({
                    task: this.$current_task_text,
                    timeSpent: this.timeOnTask,
                    timeEnded: unitaskrTime.getTimeNow(),
                });
            }

            $('#current-task-text').html(this.$following_task_val);
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
        alert('Time to ' + this.$following_task_val);
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
        var id_name = $(e.target).data('target');
        var msg = $(e.target).data('msg');
        var cur = $('#' + id_name).html();
        var mdash_index;
        
        if (cur.indexOf('\u2014') != -1) { // Edit following task
            mdash_index = cur.indexOf('\u2014');
            cur = prompt(msg, cur.substring(0, mdash_index));
            if (cur != null && cur != '') {
                cur += ' \u2014 Length: ' + this.timeOnTask;
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
                this.$current_task_text = cur;
            } else if (id_name == 'following-task') {
                this.$following_task_val = cur.substring(0, mdash_index);
            }
        } else {
            alert('Please enter a task');
            edit_task(id_name, msg);
        }
    },

    countUpward: function(e) {
        e.preventDefault();
        this.count_upward = true;
        $('#timer-input').css('display', 'none');
    },

    stopCountdown: function(e) {
        e.preventDefault();
        intervened = true;
        this.count_upward = false;
        this.showTimeBar(false);
        // Recalulate how much time was spent on the task:
        this.timeOnTask = unitaskrTime.secondsToTime(ticks);
        socket.emit('clockstop');
        ticks = total_secs; // for checkTimer
        this.checkTimer();
        this.cleanUp();
    },

    pauseCountdown: function(e) {
        e.preventDefault();
        this.pause ^= true; // Toggle
        socket.emit('clockpause', {'pause':this.pause});
    },

    cancelCountdown: function(e) {
        e.preventDefault();
        intervened = true;
        this.showTimeBar(false);
        this.count_upward = false;
        socket.emit('clockstop');
        this.cleanUp();
    },

    showTaskInputs: function(toggle) {
        this.$task_bar.css('display', (toggle ? 'block' : 'none'));
        document.taskbar.task.focus();
    },

    showTaskNames: function(toggle) {
        this.$following_task_name.css('display', (toggle ? 'block' : 'none'));
    },

    showTimeBar: function(toggle) {
        this.$time_bar.css('display', (toggle ? 'block' : 'none'));
    },

});
