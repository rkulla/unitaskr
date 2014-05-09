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
        var total_seconds = (+(seconds_in_hours) + 
                +(seconds_in_minutes) + +(seconds));
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
            $('#current-task, #current-notes-input, ' +
              '#following-notes-input').css('display', 'block');
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
        if (this.hasInitialTask && !this.stop) {
            if ($('#sound-check').is(':checked')) {
                document.getElementById('chime').play();
            }
            alert('Time to ' + this.$following_task_val);
        }
    },

    // Moves the following task's notes to the current task's notes
    updateNotes: function() {
        var $following_textarea = $('#following-textarea');
        $('#current-textarea').val($following_textarea.val());
        $following_textarea.val('');
    },

    cleanUp: function() {
        this.stop = false; // reset
        $('#following-task').html('');
        // Make the countdown clock disappear:
        $('#time-bar').css('display', 'none');
        document.taskbar.task.focus();
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
