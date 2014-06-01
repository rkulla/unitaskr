'use strict';

var $ = require('jquery');
var Backbone = require('backbone');
Backbone.$ = $; // needed

module.exports = Backbone.Model.extend({
    defaults: function() {
        return {
            done: false
        };
    },

    toggle: function() {
        this.save({done: !this.get('done'), dontSync: true});
    }
}); 
