'use strict';

var $ = require('jquery');
var Backbone = require('backbone');
var CompletedTask = require('../models/completed-task');
var unitaskrTime = require('../utils/unitaskr-time');

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
        this.hasInitialTask = 0;
        this.stop = false;
        this.pause = false;
        this.cancel = false;
        this.timeOnTask = 1;
        this.count_upward = false;

        this.$task = $('#task');
        this.$following_task = $('#following-task');
        this.$following_task_val = null;
    },

    render: function() {
        return this;
    },

    startTimer: function(e) {
        e.preventDefault();
        var seconds_in_hours = $('#hours').val() * 3600;
        var seconds_in_minutes = $('#minutes').val() * 60;
        var seconds = $('#seconds').val();
        var total_seconds = (+(seconds_in_hours) + +(seconds_in_minutes) + +(seconds));
        var i = 0;
        var count = 0;
        var that = this;
        var interval = 1000; // 1 FPS
        var then = Date.now();
        var delta;
        var now;
        var $following_task_name = $('#following-task-name');
        this.$following_task_val = this.$task.val();

        if (this.count_upward) {
            i = -1;
            total_seconds = 0;
        }

        if (!total_seconds && !this.hasInitialTask) {
            total_seconds = 1;
        }

        if (this.$task.val() == '') {
            alert('Please enter a task.');
            this.$task.focus();
            return false;
        } else {
            this.hasInitialTask++;
            this.$task.val(''); // Clear last inputted task
            $('#current-task').css('display', 'block');
            $('#current-notes-input').css('display', 'block');
            $('#following-notes-input').css('display', 'block');

            this.$current_task_text = $('#current-task-text').html();
            if (this.hasInitialTask == 1) {
                $('#current-task-text').html(this.$following_task_val);
            }

            // Change the task input bar to accept following task(s)
            $('#task-desc').html('Following Task ');
            $('#task-input input[type=submit]').val('Start');
            $('#timer-input').css('display', 'block');
        }

        // Validate user input
        if (total_seconds == 0 && this.hasInitialTask && i != -1) {
            alert('Please enter a time.');
            $('#minutes').select();
            return false;
        }

        this.timeOnTask = unitaskrTime.secondsToTime(total_seconds);

        // Set the text for what the following task will be. '\u2014' is 
        // unicode for &mdash;
        this.$following_task.html(this.$following_task_val + 
            ' \u2014 Length: ' + unitaskrTime.secondsToTime(total_seconds));

        if (this.hasInitialTask > 1) {
            setTimeout(timerLoop, 1000);
        } 

        function timerLoop() {
            var $update_time = $('#update-time');
            var $task_bar = $('#task-bar');
            var $time_bar = $('#time-bar');

            if (i < total_seconds || that.count_upward) {
                $task_bar.css('display', 'none');
                $following_task_name.css('display', 'block');
                $time_bar.css('display', 'block');

                // Use rAF, instead of setTimeout, to not waste CPU/battery-life 
                // when the browser tab isn't focused, etc.
                requestAnimationFrame(timerLoop);

                now = Date.now();
                delta = now - then;

                if (delta > interval && !that.pause) {
                    ++i;
                    then = now - (delta % interval);
                    count = that.count_upward ? total_seconds+i : total_seconds-i;
                    $update_time.html(unitaskrTime.secondsToTime(count));
                }

                // Cancel the timer/following task:
                if (that.cancel) {
                    $time_bar.css('display', 'none');
                    total_seconds = 0;
                    that.cancel = false;
                    that.count_upward = false;
                }

                // Stop the timer early:
                if (that.stop) {
                    that.count_upward = false;
                    $time_bar.css('display', 'none');
                    // Recalulate how much time was spent on the task:
                    that.timeOnTask = unitaskrTime.secondsToTime(i);
                    i = total_seconds;
                }

                that.checkTimer(i, total_seconds);
            } else {
                $task_bar.css('display', 'block');
                $following_task_name.css('display', 'none');
                document.taskbar.task.focus();
            }
        }
    },

    checkTimer: function(i, total_seconds) {
        if (i == total_seconds && !this.count_upward) {
            this.alarm();
        }
    },

    alarm: function() {
        // Alert the user they can start the following task now
        if (this.hasInitialTask && !this.stop) {
            if ($('#sound-check').is(':checked')) {
                document.getElementById('chime').play();
            }
            alert('Time to ' + this.$following_task_val);
        }

        this.stop = false; // reset

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
    },

    // Moves the following task's notes to the current task's notes
    updateNotes: function() {
        $('#current-textarea').val($('#following-textarea').val());
        $('#following-textarea').val('');
    },

    cleanUp: function() {
        $('#following-task').html('');
        // Make the countdown clock disappear:
        $('#time-bar').css('display', 'none');
        document.taskbar.task.focus();
    },

    editTask: function(e) {
        e.preventDefault();
        var id_name = $(e.target).data('target');
        var msg = $(e.target).data('msg');
        var current = $('#' + id_name).html();
        
        if (current.indexOf('\u2014') != -1) { // Edit following task
            var new_task = prompt(msg, current.substring(0, current.indexOf('\u2014')));
            if (new_task != null && new_task != '') {
                new_task += ' \u2014 Length: ' + this.timeOnTask;
            }
        } else {
            var new_task = prompt(msg, current); // Edit current task
        }
        
        if (new_task == null) {
            return false;
        }
            
        if (new_task != '') {
            $('#' + id_name).html(new_task);
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
        this.stop = true;
    },

    pauseCountdown: function(e) {
        e.preventDefault();
        this.pause ^= true; // Toggle
    },

    cancelCountdown: function(e) {
        e.preventDefault();
        this.cancel = true;
    },

});
