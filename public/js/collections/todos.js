'use strict';

var Backbone = require('backbone'),
    Todo = require('../models/todo'),
    TodoList;

Backbone.LocalStorage = require('backbone.localstorage');

TodoList = Backbone.Collection.extend({

    model: Todo,

    localStorage: new Backbone.LocalStorage('TodoListCollection'),

    // Since localStorage values are stored as a hash table, which
    // is effectively unordered, we'll sort by added timestamp.
    comparator: 'timestamp',

});

module.exports = new TodoList;
