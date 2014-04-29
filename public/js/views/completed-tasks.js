'use strict';

var $ = require('jquery');
var Backbone = require('backbone');
var _ = require('underscore');
var CompletedTask = require('../models/completed-task');

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
