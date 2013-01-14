var app = app || {};

(function() {
	'use strict';

	var Router = Backbone.Router.extend({
		routes:{
            '': 'home',
		},
	});

	app.router = new Router();
    app.router.on('route:home', function() {
        console.log('Loaded home page');
    });

	Backbone.history.start();

}());
