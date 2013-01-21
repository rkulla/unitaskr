var app = app || {};

(function() {
    'use strict';

    var TodoList = Backbone.Collection.extend({

        model: app.Todo,
    });

    app.Todos = new TodoList();

}());
