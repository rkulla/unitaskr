'use strict';
// This AppView is the top-level UI component

var Backbone = require('backbone');
var $ = require('jquery');
var Todos = require('../collections/todos');
var AboutView = require('./about');
var TaskbarView = require('./taskbar');
var NotesView = require('./notes');
var TodoInputView = require('./todo-input');
var TodoView = require('./todo');
var CompletedTasksView = require('./completed-tasks');

module.exports = Backbone.View.extend({

    initialize: function() {
        // Listen for events to our Todos Collection
        // which also gets handled in the todo-input View
        // 'add' is when a model gets added to a collection
        this.listenTo(Todos, 'add', this.addTodoTask);
        this.listenTo(Todos, 'sync', this.addTodoTasks);

        // Initialize all the views
        this.render();

        // Load any preexisting todos that might be in localStorage.
        // Runs 'add' event, which calls this.addToDoTask for each task
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
        // save() triggers a 'sync' event, which calls 
        // `addTodoTasks` to do the DOM appending.
        todo.save({task:todo.get('task')}); 
    },

    addTodoTasks: function(items) {
       $('#todo-list').empty();

       Todos.each(function(item) {
           // Do the final append of the todo `li`
           var view = new TodoView({model: item});
           $('#todo-list').append(view.render().el);
       });
    },

});
