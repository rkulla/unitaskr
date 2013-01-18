var app = app || {};

(function($) {
    'use strict';

    app.AboutView = Backbone.View.extend({
        el: '#about-container',

        events: {
            'click #about-button': 'showAbout',
            'click #hide-about': 'hideAbout',
        },

        render: function() {
            return this;
        },

        showAbout: function() {
            $('#about').css('display', 'block');
            $('#about-button').css('display', 'none');
        },

        hideAbout: function() {
            $('#about').empty();
            $('#about-button').css('display', 'block');
        },

    });

})(jQuery);
