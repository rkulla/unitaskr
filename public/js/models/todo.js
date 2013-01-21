var app = app || {};

(function($) {
    'use strict';

    app.TodoList = Backbone.Model.extend({

        defaults: {
            fname: 'ryan',
        },

        initialize: function() {
            console.log('called model.initiaze');
        },

        mf: function() {
            console.log('called model.mf');
        },
    });

}(jQuery));
