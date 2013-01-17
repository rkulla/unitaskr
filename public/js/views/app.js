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
            var view = new app.AboutButtonView();
            view.render();
        },

    });
})(jQuery);
