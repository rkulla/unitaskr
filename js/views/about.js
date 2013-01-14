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

        // I don't use a templating language because unitaskr needs to run in
        // offline mode with no web-server and the html5 file sandbox api is currently
        // not cutting it for my needs.
        render: function() {
            var aboutMsg = "<p>Unitasking (monotasking), means focusing on one job, "
            + "project, or goal at a time, completing that task, and moving "
            + "on to the next one. Thus, it's the opposite of multi-tasking.</p>"
            + "<p><strong><em>Unitaskr</em></strong> is a simple productivity tool "
            + "that allows you to set tasks you want to perform, just for today, "
            + "and a time when you want to start performing them, then it alerts "
            + "you when it's time to move to the next task.</p>"
            + "<p>It's very easy to get caught up in one task so much that you lose "
            + "track of time and never end up getting to all the tasks on your todo "
            + "list. Unitaskr aims to solve this problem.</p>"
            + "<p>The interface is designed to allow you to quickly enter new tasks, "
            + "and optional notes about them.</p>"
            + "<p>Manually starting the timer between each task allows you to take "
            + "as long of a break between tasks as you want.</p>"
            + "<p>You'll need to enable popups for unitaskr to be able to alert you. "
            + "Unitaskr doesn't use cookies, so if you refresh the page you will "
            + "restart the program.</p>"
            + "<p>Tip: Time management studies show that it's best to take care of as "
            + "many small, quick-to-do, tasks as possible right away--such as writing "
            + "quick emails and starting the dishwasher--that way, you can completely "
            + "forget about these things, rather think constantly thinking about them "
            + "the rest of the day, thus decreasing stress and improving concentration."
            + "</p>";

            var hideButton = "<button id='hide-about'>&lsaquo; Hide About</button><hr>";
            this.showAbout();
            this.$el.html(aboutMsg); 
            this.$el.append(hideButton); 
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
