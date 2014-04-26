var Backbone = require('backbone');
var jQuery = require('jquery');
Backbone.$ = jQuery;
var Todos = require('../collections/todos');
var AboutView = require('./about');
var TaskbarView = require('./taskbar');
var NotesView = require('./notes');
var TodoInputView = require('./todo-input');
var TodoView = require('./todo');
var CompletedTasksView = require('./completed-tasks');

(function($) {
    'use strict';

    module.exports = Backbone.View.extend({

        initialize: function() {
            // Listen for events to our Todos Collection
            this.listenTo(Todos, 'add', this.addTodoTask);

            // Self render this view
            this.render();
        },

        render: function() {
            new AboutView();
            new TaskbarView();
            new NotesView();
            new TodoInputView();
            new CompletedTasksView();
        },

        addTodoTask: function(todo) {
            var view = new TodoView({model: todo});
            $('#todo-list').append(view.render().el);
        },

    });

})(jQuery);
