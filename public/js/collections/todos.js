var Backbone = require('backbone');
Backbone.LocalStorage = require('backbone.localstorage');
var Todo = require('../models/todo');

(function() {
    'use strict';

    var TodoList = Backbone.Collection.extend({

        localStorage: new Backbone.LocalStorage('TodoListCollection'), 

        model: Todo,

    });

    module.exports = new TodoList();

}());
