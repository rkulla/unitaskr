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
        },

    });
})(jQuery);
