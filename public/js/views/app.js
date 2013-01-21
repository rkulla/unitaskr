var app = app || {};

(function($) {
    'use strict';

    app.AppView = Backbone.View.extend({

        el: 'body',

        events: {
        },

        initialize: function() {
            this.listenTo(app.Todos, 'add', this.addItem);
app.Todos.add({task: 'item1'});//
app.Todos.add({task: 'item2'});//
            this.render();
        },

        render: function() {
            new app.AboutView();
            new app.TaskbarView();
            new app.NotesView();
        },

        addItem: function(todo) {
            console.log('called addItem');
            var view = new app.TodoView({model: todo});
            $('#todo-list').append(view.render().el);
        },

    });
})(jQuery);
