var app = app || {};

(function($) {
    'use strict';

    app.Todo = Backbone.Model.extend({

        defaults: {
            deleteText: '<a href="#" id="delete-link" class="deleteTodoItem"> Delete </a>' ,
            nextText: ' Next ',
        },

        initialize: function() {
            console.log('called model.initiaze');
        },

    });

}(jQuery));
