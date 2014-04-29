'use strict';

var $ = require('jquery');
var Backbone = require('backbone')
var Todos = require('../collections/todos');

// This view gets todo input from the todo form
module.exports = Backbone.View.extend({

    el: '#todo',

    events: {
        'submit form': 'setTodoTask',
    },

    setTodoTask: function(e) {
        e.preventDefault();

        // Trigger the 'add' event in AppView
        // which calls the TodoView
        Todos.add({task: $('#todo-task').val()});
    },

});
