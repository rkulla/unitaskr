/*
 * Description: Unitaskr functions 
 * Author: Ryan Kulla (rkulla AT gmail)
 */


// Create a global namespace
var unitaskrObj = {};
unitaskrObj.hasInitialTask = 0;


function startTimer() {

    // Calculate total seconds:
    var seconds_in_hours = document.getElementById('hours').value * 3600;
    var seconds_in_minutes = document.getElementById('minutes').value * 60;
    var seconds = document.getElementById('seconds').value;
    var total_seconds = (+seconds_in_hours + +seconds_in_minutes + +seconds);
    if (!total_seconds && !unitaskrObj.hasInitialTask) {
        total_seconds = 1;
    }

    var task = document.getElementById('task');
    var next_task_val = task.value;
    var next_task = document.getElementById('next-task');

    if (task.value == '') {
        alert('Please enter a task.');
        document.taskbar.task.focus();
        return false;
    }

    // Validate user input
    if (total_seconds == 0 && unitaskrObj.hasInitialTask) {
        alert('Please enter a time.');
        document.taskbar.hours.select();
        return false;
    }

    // Clear last inputted task value
    task.value = '';

    unitaskrObj.timeOnTask = secondsToTime(total_seconds);

    // Set the text for what the next task will be. '\u2014' is 
    // unicode for &mdash;
    next_task.innerHTML = next_task_val + ' \u2014 Counting down from: ' + 
        secondsToTime(total_seconds);

    if (unitaskrObj.hasInitialTask) {
        setTimeout(timerLoop, 1000);
    } else { 
        alarm();
        document.getElementById('current-task').style.display = 'block';
        document.getElementById('current-notes-input').style.display = 'block';
        document.getElementById('next-notes-input').style.display = 'block';
    }

    var i = 0;
    function timerLoop() {
        if (i < total_seconds) {
            ++i;
            document.getElementById('task-bar').style.display = 'none';
            document.getElementById('usage-timer').style.display = 'none';
            document.getElementById('next-task-name').style.display = 'block';
            document.getElementById('time-bar').style.display = 'block';
            var update_time = document.getElementById('update-time');
            update_time.innerHTML = secondsToTime(total_seconds - i);
            setTimeout(timerLoop, 1000);
            // Cancel the timer/next task:
            if (unitaskrObj.cancel) {
                document.getElementById('time-bar').style.display = 'none';
                total_seconds = 0;
                unitaskrObj.cancel = 0;
            }
            // Stop the timer early:
            if (unitaskrObj.stop) {
                document.getElementById('time-bar').style.display = 'none';
                // Recalulate how much time was spent on the task:
                unitaskrObj.timeOnTask = secondsToTime(i);
                i = total_seconds;
            }
            checkTimer(i, total_seconds);
        } else {
            document.getElementById('task-bar').style.display = 'block';
            document.getElementById('usage-timer').style.display = 'none';
            document.getElementById('next-task-name').style.display = 'none';
            document.taskbar.task.focus();
        }
    }
}


function checkTimer(i, total_seconds) {
    if (i == total_seconds) {
        alarm();
    }
}

function alarm() {
    var next_task = document.getElementById('next-task');
    var current_task_text = document.getElementById('current-task-text');
    var completed_tasks = document.getElementById('completed-tasks');
    var question_mark = document.getElementById('question-mark');

    next_task_val = next_task.innerHTML.substring(0, 
        next_task.innerHTML.indexOf('\u2014'));

    // Alert the user that the task is ready to begin
    if (unitaskrObj.hasInitialTask && !unitaskrObj.stop) {
        // Popup an alert window
        window.open('../templates/unitaskr-alert.html?next-task=' + next_task_val);
    }

    unitaskrObj.stop = 0; // reset

    // Set hasInitialTask to true
    unitaskrObj.hasInitialTask = 1;

    // Delete '?' for 'completed_tasks' when it receives an actual value.
    if (current_task_text.innerHTML != '?' && next_task.innerHTML != '?' &&
            question_mark.innerHTML == '?') {
        question_mark.innerHTML = '';
    }

    // Apppend the current task to the Completed Tasks box:
    if (current_task_text.innerHTML != '?') {
        var s = current_task_text.innerHTML + ' \u2014 Time on task: ' + 
                unitaskrObj.timeOnTask;
        var ul = document.getElementById('completed-tasks');
        var li = document.createElement('li'); 
        li.appendChild(document.createTextNode(s + ' Ended: ' + 
                       getTimeNow()));
        ul.appendChild(li);
    }

    // Make the current task the value of Next Task
    current_task_text.innerHTML = next_task.innerHTML.substring(0, 
        next_task.innerHTML.indexOf('\u2014'));

    updateNotes();

    // Change the task input bar to accept next task(s)
    if (unitaskrObj.hasInitialTask) {
        document.getElementById('task-desc').innerHTML = 'Next Task ';
        document.getElementById('usage-no-timer').style.display = 'none';
        document.getElementById('usage-timer').style.display = 'block';
        document.getElementById('timer-input').style.display = 'block';
    }

    cleanUp();
}


// Moves the next task's notes to the current task's notes
function updateNotes() {
    document.getElementById('current-textarea').value = 
             document.getElementById('next-textarea').value;
    document.getElementById('next-textarea').value = '';
}


function cleanUp() {
    document.getElementById('next-task').innerHTML = '?';
    // Make the countdown clock disappear:
    document.getElementById('time-bar').style.display = 'none';
    document.taskbar.task.focus();
}


function secondsToTime(total_seconds) {
    var hours = Math.floor(total_seconds / 3600);
    var minutes = Math.floor((total_seconds % 3600) / 60);
    var seconds = Math.round((((total_seconds % 3600) / 60) - minutes) * 60);

    // Format the text and include proper pluralization
    var hours_text = (hours == 1 ? ' hour, ' : ' hours, ');
    var minutes_text = (minutes == 1 ? ' minute and ' : ' minutes and ');
    var seconds_text = (seconds == 1 ? ' second.' : ' seconds.');

    return hours + hours_text + minutes + minutes_text + seconds +
           seconds_text;
}


function getTimeNow() {

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
}

// Alert the user, on the popup page, that it's time to do a task.
// Note: This function is called from the window.open()'d window.
function task_alert() {
    // Get the task value from the query string
    var url = decodeURI(location.href);
    var task = url.substring(url.indexOf("=") + 1);
    
    if (window.opener.document.getElementById('sound-check').checked) {
        // Insert sound playing HTML via the DOM
        document.getElementById('play-sound').innerHTML = 
          '<embed src="alert-music.mid">' +
          '<noembed><bgsound src="../music/alert-music.mid"></noembed>';
    }

    document.getElementById('task-alert-heading').innerHTML = "Time to " + 
                                                              task;

    alert(task);
}


function clear_current_notes() {
    document.getElementById('current-textarea').value='';
}


function clear_next_notes() {
    document.getElementById('next-textarea').value='';
}


function make_html_id(s) {
    // Change whitespace to dashes and up to 30 chars max.
    return s.replace(/\s/g, '-').substring(0, 30);
}


function todo_add() {
    var ul = document.getElementById('todo-list');
    var li = document.createElement('li'); 
    var task = document.getElementById('todo-task').value;
    var next = document.createElement('a');
    var cb = document.createElement('input');
    var delete_item = document.createElement('a');

    li.id = make_html_id(task);

    next.href = '#';
    next.id = 'next-link';
    next.title = 'Do this task next';
    next.appendChild(document.createTextNode(' Next '));
    next.onclick = function () { 
        document.getElementById('task').value = task; 
        document.taskbar.task.focus();
        return false; // Don't append the '#' to the address bar
    };

    
    delete_item.href = '#';
    delete_item.id = 'delete-link';
    delete_item.title = 'Delete task';
    delete_item.appendChild(document.createTextNode(' Delete '));
    delete_item.onclick = function () { 
        var li_task = document.getElementById(make_html_id(task));
        ul.removeChild(li_task);
        return false;
    };
    
    cb.type = 'checkbox';
    cb.title = "Done";

    li.appendChild(delete_item);
    li.appendChild(document.createTextNode(' - '));
    li.appendChild(next);
    li.appendChild(cb);
    li.appendChild(document.createTextNode(' ' + task));
    ul.appendChild(li);
    

    document.getElementById('todo-task').value = '';
}
