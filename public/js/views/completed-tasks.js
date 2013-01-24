var app = app || {};

(function($) {
    'use strict';

    app.CompletedTasksView = Backbone.View.extend({

        el: '#completed-tasks',

        model: app.CompletedTask,

        initialize: function() {
            this.listenTo(this.model, 'change', this.render);
        },

        render: function() {
            var template = _.template($('#completedTaskTemplate').html(), this.model.toJSON());
            this.$el.append(template);
            return this;
        },
    });

})(jQuery);

