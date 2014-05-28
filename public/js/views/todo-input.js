'use strict';

var $ = require('jquery');
var Backbone = require('backbone')
var Todos = require('../collections/todos');

// This view gets todo input from the todo form
module.exports = Backbone.View.extend({

    el: '#todo', // section containing the todo form

    events: {
        'submit form': 'setTodoTask',
    },

    setTodoTask: function(e) {
        e.preventDefault();

        // Triggers 'add' event in AppView
        // Note: this only happens for NEW items, not existing.
        Todos.add({task:$('#todo-task').val(), timestamp:new Date().getTime()});
    },

});
