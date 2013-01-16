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
            var aboutButton = $("#about-button-template").html();
            var aboutButtonTemplate = _.template(aboutButton, {})
            $('#about-container').append(aboutButtonTemplate);
        },

        showAbout: function() {
            var view = new app.AboutView();
            view.render();
        },

    });
});
