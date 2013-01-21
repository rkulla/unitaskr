var app = app || {};

(function($) {
    'use strict';

    app.Todo = Backbone.Model.extend({

        defaults: {
            deleteText: '<a href="#" id="delete-link" class="deleteTodoTask"> Delete </a>',
            nextText: ' Next ',
        },

    });

}(jQuery));
