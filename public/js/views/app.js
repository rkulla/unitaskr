var app = app || {};

(function($) {
    'use strict';

    app.AppView = Backbone.View.extend({

        initialize: function() {
            // Listen for events to our app.Todos Collection
            this.listenTo(app.Todos, 'add', this.addTodoTask);

            // Self render this view
            this.render();
        },

        render: function() {
            new app.AboutView();
            new app.TaskbarView();
            new app.NotesView();
            new app.TodoInputView();
            new app.CompletedTasksView();
        },

        addTodoTask: function(todo) {
            var view = new app.TodoView({model: todo});
            $('#todo-list').append(view.render().el);
        },

    });

})(jQuery);
