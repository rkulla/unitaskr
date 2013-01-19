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

        makeHtmlId: function(s) {
            // Change whitespace to dashes and up to 30 chars max.
            return s.replace(/\s/g, '-').substring(0, 30);
        },

        addToList: function(e) {
            e.preventDefault();
            var ul = document.getElementById('todo-list');
            var li = document.createElement('li'); 
            var task = document.getElementById('todo-task').value;
            var cb = document.createElement('input')

            li.id = this.makeHtmlId(task);

            var next = $('<a>', {
                id: 'next-link',
                href: '#',
                title: 'Do this task next',
                text: ' Next ',
                click: function(e) { 
                    e.preventDefault();
                    $('#taskbar #task').val(task);
                    $('#taskbar #task').focus();
                },
            });

            var delete_item = $('<a>', {
                id: 'delete-link',
                href: '#',
                title: 'Delete task',
                text: ' Delete ',
                click: function(e) { 
                    e.preventDefault();
                    var li_task = document.getElementById(this.makeHtmlId(task));
                    ul.removeChild(li_task);
                }.bind(this),
            });

            cb.type = 'checkbox';
            cb.title = "Done";

            $(li).append(delete_item);
            li.appendChild(document.createTextNode(' - '));
            $(li).append(next);
            li.appendChild(cb);
            li.appendChild(document.createTextNode(' ' + task));
            ul.appendChild(li);

            document.getElementById('todo-task').value = '';
        },


    });

})(jQuery);
