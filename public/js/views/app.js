var app = app || {};

(function($) {
    'use strict';

    app.AppView = Backbone.View.extend({

        el: 'body',

        events: {
        },

        initialize: function() {
            this.render();
        },

        render: function() {
            new app.AboutView();
            new app.TaskbarView();
            new app.NotesView();
            // new app.TodoView({model: new app.TodoList()});
            new app.TodoView();
        },

    });
})(jQuery);
