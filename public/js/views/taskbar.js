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
            var last_task_val = $task.val();
            var $next_task = $('#next-task');
            var $next_task_name = $('#next-task-name');

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
            $next_task.html(last_task_val + ' \u2014 Counting down from: ' + 
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
            var next_task = document.getElementById('next-task');
            var current_task_text = document.getElementById('current-task-text');
            var completed_tasks = document.getElementById('completed-tasks');
            var question_mark = document.getElementById('question-mark');
            var next_task_val = next_task.innerHTML.substring(0, 
                next_task.innerHTML.indexOf('\u2014'));

            // Alert the user that the task is ready to begin
            if (app.hasInitialTask && !app.stop) {
                document.getElementById('chime').play();
            }

            app.stop = false; // reset

            // Set hasInitialTask to true
            app.hasInitialTask = true;

            // Delete '?' for 'completed_tasks' when it receives an actual value.
            if (current_task_text.innerHTML != '?' && next_task.innerHTML != '?' &&
                    question_mark.innerHTML == '?') {
                question_mark.innerHTML = '';
            }

            // Apppend the current task to the Completed Tasks box:
            if (current_task_text.innerHTML != '?') {
                var s = current_task_text.innerHTML + ' \u2014 Time on task: ' + 
                        app.timeOnTask;
                var ul = document.getElementById('completed-tasks');
                var li = document.createElement('li'); 
                li.appendChild(document.createTextNode(s + ' Ended: ' + this.getTimeNow()));
                ul.appendChild(li);
            }

            // Make the current task the value of Next Task
            current_task_text.innerHTML = next_task.innerHTML.substring(0, 
                next_task.innerHTML.indexOf('\u2014'));

            this.updateNotes();

            // Change the task input bar to accept next task(s)
            if (app.hasInitialTask) {
                document.getElementById('task-desc').innerHTML = 'Next Task ';
                document.getElementById('usage-no-timer').style.display = 'none';
                document.getElementById('usage-timer').style.display = 'block';
                document.getElementById('timer-input').style.display = 'block';
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
