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
            'click .nextTodoTask': 'setNextTodoTask',
        },

        initialize: function() {
           this.$task = $('#todo-task').val();
        },

        render: function() {
            $('#todo-task').val('');
            var $todoTaskTemplate = _.template($('#todoTaskTemplate').html());
            this.$el.append($todoTaskTemplate);
            this.$el.append(this.model.get('task'));
            return this;
        },

        deleteTodoTask: function(e) {
            e.preventDefault();
            this.remove(); // remove this `<li>` view
        },

        setNextTodoTask: function(e) {
            e.preventDefault();
            $('#taskbar #task').val(this.$task);
            $('#taskbar #task').focus();
        },

    });

})(jQuery);
