var app = app || {};

(function($) {
    'use strict';

    app.AppView = Backbone.View.extend({

        el: 'body',

        initialize: function() {
            this.listenTo(app.Todos, 'add', this.addTodoTask);
            this.render();
        },

        render: function() {
            new app.AboutView();
            new app.TaskbarView();
            new app.NotesView();
            new app.TodoInputView();
        },

        addTodoTask: function(todo) {
            var view = new app.TodoView({model: todo});
            $('#todo-list').append(view.render().el);
        },

    });
})(jQuery);
