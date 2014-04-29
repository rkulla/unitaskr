'use strict';

var $ = require('jquery');
var Backbone = require('Backbone');

module.exports = Backbone.View.extend({

    el: '#notes',

    events: {
        'click #current-notes': 'clearCurrentNotes',
        'click #next-notes': 'clearNextNotes',
    },

    render: function() {
        return this;
    },

    clearCurrentNotes: function(e) {
        e.preventDefault();
        $('#current-textarea').val('');
    },

    clearNextNotes: function(e) {
        e.preventDefault();
        $('#next-textarea').val('');
    },

});
