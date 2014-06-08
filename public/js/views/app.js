'use strict';
// This AppView is the top-level UI component

var Backbone = require('backbone'),
    $ = require('jquery'),
    Todos = require('../collections/todos'),
    AboutView = require('./about'),
    TaskbarView = require('./taskbar'),
    NotesView = require('./notes'),
    TodoInputView = require('./todo-input'),
    TodoView = require('./todo'),
    CompletedTasksView = require('./completed-tasks');

module.exports = Backbone.View.extend({

    initialize: function() {
        // Listen for events to our Todos Collection
        // which also gets handled in the todo-input View
        // 'add' is when a model gets added to a collection
        this.listenTo(Todos, 'add', this.addTodoTask);
        this.listenTo(Todos, 'sort', this.addTodoTasks);

        // Initialize all the views
        this.render();

        // Load preexisting todos that may be in localStorage.
        // Runs `add` event, which calls addToDoTask for each task.
        // The Todos collection is empty until we run this.
        Todos.fetch();
    },

    render: function() {
        new AboutView();
        new TaskbarView();
        new NotesView();
        new TodoInputView();
        new CompletedTasksView();
    },

    // When new tasks are input individually, save 
    // them to localStorage.
    addTodoTask: function(todo) {
        // save() triggers a `sync` and a `sort` event.
        // Our sort event handler calls `addTodoTasks` 
        // to do the DOM appending.
        todo.save({task:todo.get('task')}); 
    },

    addTodoTasks: function(items) {
        var view,
            $todoList = $('#todo-list');

        $todoList.empty();

        Todos.each(function(item) {
            // Do the final append of the todo `li`
            view = new TodoView({model: item});
            $todoList.append(view.render().el);
        });
    },

});
