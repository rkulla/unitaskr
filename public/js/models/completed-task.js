var jQuery = require('jquery');
var Backbone = require('backbone');
Backbone.$ = jQuery;

(function($) {
    'use strict';

    var CompletedTaskModel = Backbone.Model.extend({
        // This model is empty but that's fine because
        // we'll still use it for managing events and
        // keeping things separated into views
    });

    // Create instance of model in global app object
    module.exports = new CompletedTaskModel();

}(jQuery));
