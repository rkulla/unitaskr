var app = app || {};

(function($) {
    'use strict';

    app.TodoView = Backbone.View.extend({
        el: '#todo',

        events: {
            'submit form': 'addToList',
        },

        render: function() {
            return this;
        },

        addToList: function(e) {
            e.preventDefault();
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

    });

})(jQuery);
