'use strict';

var $ = require('jquery'),
    Backbone = require('backbone'),
    _ = require('underscore'),
    io = require('socket.io-client'),
    socket = io.connect(),
    CompletedTask = require('../models/completed-task');


module.exports = Backbone.View.extend({

    el: '#completed-tasks',

    model: CompletedTask,

    initialize: function() {
        this.listenTo(this.model, 'change', this.render);
    },

    render: function() {
        var model_json = this.model.toJSON();
        var template = _.template($('#completedTaskTemplate').html(), model_json);
        this.$el.append(template);
        socket.emit('log_completed', model_json); 

        return this;
    },

});
