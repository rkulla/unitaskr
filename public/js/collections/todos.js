var Backbone = require('backbone');
var Todo = require('../models/todo');

(function() {
    'use strict';

    var TodoList = Backbone.Collection.extend({

        model: Todo,

    });

    module.exports = new TodoList();

}());
