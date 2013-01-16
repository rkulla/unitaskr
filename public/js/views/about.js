var app = app || {};

$(function($) {
    'use strict';

    app.AboutView = Backbone.View.extend({

        el: '#about',

        events: {
            'click #hide-about': 'hideAbout',
        },

        initialize: function() {
        },

        render: function() {
            var aboutMsg = $("#about-msg-template").html();
            var aboutMsgTemplate = _.template(aboutMsg, {})
            this.showAbout();
            this.$el.html(aboutMsgTemplate); 
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

});
