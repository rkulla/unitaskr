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
            var aboutButtonView = new app.AboutButtonView();
            aboutButtonView.render();

            var taskbarView = new app.TaskbarView();
            taskbarView.render();
        },

    });
})(jQuery);
