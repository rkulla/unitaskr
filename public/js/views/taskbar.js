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
        },

        render: function() {
            return this;
        },

        editTask: function(e) {
            e.preventDefault();
            var id_name = $(e.target).data('target');
            var msg = $(e.target).data('msg');
            var current = document.getElementById(id_name).innerHTML;
            
            if (current.indexOf('\u2014') != -1) { // Edit next task
                var new_task = prompt(msg, current.substring(0, current.indexOf('\u2014')));
                if (new_task != null && new_task != '') {
                    new_task += ' \u2014 Counting down from: ' + unitaskrObj.timeOnTask;
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
            unitaskrObj.stop = 1;
        },

        cancelCountdown: function(e) {
            e.preventDefault();
            unitaskrObj.cancel = 1;
        },

    });

})(jQuery);
