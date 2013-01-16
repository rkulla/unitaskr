var app = app || {};

$(function($) {
    'use strict';

    app.AppView = Backbone.View.extend({

        el: 'body',

        events: {
            'click #about-button': 'showAbout',
        },

        initialize: function() {
            this.render();
        },

        render: function() {
            var aboutButton = '<button id="about-button">About &rsaquo;</button>';
            $('#about-container').append(aboutButton);
        },

        showAbout: function() {
            var view = new app.AboutView();
            view.render();
        },

    });
});
