var app = app || {};

(function($) {
    'use strict';

    app.TaskbarView = Backbone.View.extend({
        el: '#taskbar-container',

        events: {
           'click #current-task a': 'editTask',
           'click #next-task-name a': 'editTask',
           'click #stop-countdown': 'stopCountdown',
           'click #cancel-countdown': 'cancelCountdown',
           'submit form#taskbar': 'startTimer',
        },

        initialize: function() {
            app.hasInitialTask = false;
            app.stop = false;
            app.cancel = false;
            app.timeOnTask = 0;

            this.$next_task = $('#next-task');
            this.$next_task_val = null;
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
            var $task = $('#task');
            var $next_task_name = $('#next-task-name');
            this.$next_task_val = $task.val();

            if (!total_seconds && !app.hasInitialTask) {
                total_seconds = 1;
            }

            if ($task.val() == '') {
                alert('Please enter a task.');
                $task.focus();
                return false;
            }

            // Validate user input
            if (total_seconds == 0 && app.hasInitialTask) {
                alert('Please enter a time.');
                $('#minutes').select();
                return false;
            }

            // Clear last inputted task value
            $task.val('');

            app.timeOnTask = this.secondsToTime(total_seconds);

            // Set the text for what the next task will be. '\u2014' is 
            // unicode for &mdash;
            this.$next_task.html(this.$next_task_val + ' \u2014 Counting down from: ' + 
                this.secondsToTime(total_seconds));

            if (app.hasInitialTask) {
                setTimeout(timerLoop, 1000);
            } else { 
                this.alarm();
                $('#current-task').css('display', 'block');
                $('#current-notes-input').css('display', 'block');
                $('#next-notes-input').css('display', 'block');
            }

            var i = 0;
            var that = this;
            function timerLoop() {
                var $update_time = $('#update-time');
                var $task_bar = $('#task-bar');
                var $time_bar = $('#time-bar');

                if (i < total_seconds) {
                    ++i;
                    $task_bar.css('display', 'none');
                    $('#usage-timer').css('display', 'none');
                    $next_task_name.css('display', 'block');
                    $time_bar.css('display', 'block');
                    $update_time.html(that.secondsToTime(total_seconds - i));
                    setTimeout(timerLoop, 1000);

                    // Cancel the timer/next task:
                    if (app.cancel) {
                        $time_bar.css('display', 'none');
                        total_seconds = 0;
                        app.cancel = false;
                    }

                    // Stop the timer early:
                    if (app.stop) {
                        $time_bar.css('display', 'none');
                        // Recalulate how much time was spent on the task:
                        app.timeOnTask = that.secondsToTime(i);
                        i = total_seconds;
                    }

                    that.checkTimer(i, total_seconds);
                } else {
                    $task_bar.css('display', 'block');
                    $('#usage-timer').css('display', 'none');
                    $next_task_name.css('display', 'none');
                    $task.focus();
                }
            }
        },

        checkTimer: function(i, total_seconds) {
            if (i == total_seconds) {
                this.alarm();
            }
        },

        alarm: function() {
            var $current_task_text = $('#current-task-text').html();
            var $completed_tasks = $('#completed-tasks');
            this.$next_task_val = this.$next_task_val;

            // Alert the user they can start the next task now
            if (app.hasInitialTask && !app.stop) {
                alert('Time to ' + this.$next_task_val);
                if ($('#sound-check').is(':checked')) {
                    document.getElementById('chime').play();
                }
            }

            app.stop = false; // reset
            app.hasInitialTask = true;

            // Apppend the current task to the Completed Tasks box:
            if ($current_task_text != '') {
                var $li = $('<li>');
                $li.append($current_task_text + ' \u2014 Time on task: ' +
                        app.timeOnTask + ' Ended: ' + this.getTimeNow());
                $completed_tasks.append($li);
            }

            $('#current-task-text').html(this.$next_task_val);

            this.updateNotes();

            // Change the task input bar to accept next task(s)
            if (app.hasInitialTask) {
                $('#task-desc').html('Next Task ');
                $('#usage-no-timer').css('display', 'none');
                $('#usage-timer').css('display', 'block');
                $('#timer-input').css('display', 'block');
            }

            this.cleanUp();
        },


        // Moves the next task's notes to the current task's notes
        updateNotes: function() {
            document.getElementById('current-textarea').value = 
                document.getElementById('next-textarea').value;

            document.getElementById('next-textarea').value = '';
        },

        cleanUp: function() {
            document.getElementById('next-task').innerHTML = '?';
            // Make the countdown clock disappear:
            document.getElementById('time-bar').style.display = 'none';
            document.taskbar.task.focus();
        },

        secondsToTime: function(total_seconds) {
            var hours = Math.floor(total_seconds / 3600);
            var minutes = Math.floor((total_seconds % 3600) / 60);
            var seconds = Math.round((((total_seconds % 3600) / 60) - minutes) * 60);

            // Format the text and include proper pluralization
            var hours_text = (hours == 1 ? ' hour, ' : ' hours, ');
            var minutes_text = (minutes == 1 ? ' minute and ' : ' minutes and ');
            var seconds_text = (seconds == 1 ? ' second.' : ' seconds.');

            return hours + hours_text + minutes + minutes_text + seconds + seconds_text;
        },

        getTimeNow: function() {
            // Figure out what the time/date is right now
            // Uses the format: month/day/year hour:minute:second AM/PM
            var currentTime = new Date();
            var month = currentTime.getMonth() + 1;
            var day = currentTime.getDate();
            var year = currentTime.getFullYear();
            var hour = currentTime.getHours();
            var minute = currentTime.getMinutes();

            if (minute < 10) {
                minute = '0' + minute;
            }
            var second = currentTime.getSeconds();
            if (second < 10) {
                second = '0' + second;
            }
            var ampm = hour > 11 ? 'PM' : 'AM';

            // Convert from 24 hour time to 12 hour time:
            hour = hour % 12 || 12;

            return month + '/' + day + '/' + year + ' ' + hour + ':' + 
                        minute + ':' + second + ' ' + ampm;
        },

        editTask: function(e) {
            e.preventDefault();
            var id_name = $(e.target).data('target');
            var msg = $(e.target).data('msg');
            var current = document.getElementById(id_name).innerHTML;
            
            if (current.indexOf('\u2014') != -1) { // Edit next task
                var new_task = prompt(msg, current.substring(0, current.indexOf('\u2014')));
                if (new_task != null && new_task != '') {
                    new_task += ' \u2014 Counting down from: ' + app.timeOnTask;
                }
            } else {
                var new_task = prompt(msg, current); // Edit current task
            }
            
            if (new_task == null) {
                return false;
            }
                
            if (new_task != '') {
                document.getElementById(id_name).innerHTML = new_task;
            } else {
                alert('Please enter a task');
                edit_task(id_name, msg);
            }
        },

        stopCountdown: function(e) {
            e.preventDefault();
            app.stop = true;
        },

        cancelCountdown: function(e) {
            e.preventDefault();
            app.cancel = true;
        },

    });

})(jQuery);
