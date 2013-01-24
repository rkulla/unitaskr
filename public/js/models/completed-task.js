var app = app || {};

(function($) {
    'use strict';

    app.CompletedTaskModel = Backbone.Model.extend({
        // This model is empty but that's fine because
        // we'll still use it for managing events and
        // keeping things separated into views
    });

    // Create instance of model in global app object
    app.CompletedTask = new app.CompletedTaskModel();

}(jQuery));
