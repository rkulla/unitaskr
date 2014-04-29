'use strict';

var Backbone = require('backbone');

var CompletedTaskModel = Backbone.Model.extend({
    // This model is empty but that's fine because
    // we'll still use it for managing events and
    // keeping things separated into views
});

// Create instance of model in global app object
module.exports = new CompletedTaskModel();
