var app = app || {};

(function($) {
    'use strict';

    // This view gets todo input from the todo form
    app.TodoInputView = Backbone.View.extend({
        el: '#todo',

        events: {
            'submit form': 'setTodoTask',
        },

        setTodoTask: function(e) {
            e.preventDefault();

            // Trigger the 'add' event in AppView
            // which calls the TodoView
            app.Todos.add({task: $('#todo-task').val()});
        },

    });

    app.TodoView = Backbone.View.extend({
        tagName: 'li',

        events: {
            'click .deleteTodoTask': 'deleteTodoTask',
        },

        initialize: function() {
           // this.listenTo(this.model, 'change', this.render);
           // this.listenTo(this.model, 'destroy', this.remove);
        },

        render: function() {
            this.$el.append(this.model.get('deleteText') + ' - ');
            this.$el.append(this.model.get('nextText') + ' - ');
            this.$el.append(this.model.get('task'));
            return this;
        },

        makeHtmlId: function(s) {
            // Change whitespace to dashes and up to 30 chars max.
            return s.replace(/\s/g, '-').substring(0, 30);
        },


        deleteTodoTask: function(e) {
            e.preventDefault();
            this.remove(); // remove this view
        },

        //addToList: function(e) {
         //   e.preventDefault();
        //     var ul = $('#todo-list');
        //     var task = $('#todo-task').val();
        //     var checkbox = $('<input>', {
        //         type: 'checkbox',
        //         title: 'Done',
        //     });

        //     var li = $('<li>', {
        //         id: this.makeHtmlId(task),
        //     }); 

        //     var next = $('<a>', {
        //         id: 'next-link',
        //         href: '#',
        //         title: 'Do this task next',
        //         text: ' Next ',
        //         click: function(e) { 
        // console.log(e.target);
        //             e.preventDefault();
        //             $('#taskbar #task').val(task);
        //             $('#taskbar #task').focus();
        //         },
        //     });

        //     var delete_item = $('<a>', {
        //         id: 'delete-link',
        //         href: '#',
        //         title: 'Delete task',
        //         text: ' Delete ',
        //         click: function(e) { 
        //             e.preventDefault();
        //             $('#' + this.makeHtmlId(task)).remove();
        //         }.bind(this),
        //     });

        //     li.append(delete_item);
        //     li.append(' - ');
        //     li.append(next);
        //     li.append(checkbox);
        //     li.append(' ' + task);
        //     ul.append(li);

        //     $('#todo-task').val('');
        //},

    });

})(jQuery);
