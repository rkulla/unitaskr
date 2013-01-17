var app = app || {};

(function($) {
    'use strict';

    app.AboutButtonView = Backbone.View.extend({
        el: '#about-container',

        events: {
            'click #about-button': 'showAbout',
        },

        render: function() {
            var aboutButton = $("#about-button-template").html();
            var aboutButtonTemplate = _.template(aboutButton, {})
            this.$el.append(aboutButtonTemplate); 
            return this;
        },

        showAbout: function() {
            var view = new app.AboutView();
            view.render();
        },
    });

    app.AboutView = Backbone.View.extend({
        el: '#about',

        events: {
            'click #hide-about': 'hideAbout',
        },

        render: function() {
            var aboutMsg = $("#about-msg-template").html();
            var aboutMsgTemplate = _.template(aboutMsg, {})
            this.showAbout();
            this.$el.html(aboutMsgTemplate); 
            return this;
        },

        showAbout: function() {
            $(this.$el).css('display', 'block');
            $('#about-button').css('display', 'none');
        },

        hideAbout: function() {
            $(this.$el).empty();
            $('#about-button').css('display', 'block');
        },

    });

})(jQuery);
