var jQuery = require('jquery');
var Backbone = require('backbone');
Backbone.$ = jQuery;
var _ = require('underscore');
var CompletedTask = require('../models/completed-task');

var app = app || {};

(function($) {
    'use strict';

    module.exports = Backbone.View.extend({

        el: '#completed-tasks',

        model: CompletedTask,

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

