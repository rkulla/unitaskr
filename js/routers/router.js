var app = app || {};

(function() {
	'use strict';

	var Workspace = Backbone.Router.extend({
		routes:{
			'*filter': 'setFilter'
		},

		setFilter: function(param) {
			app.UnitaskFilter = param.trim() || '';

			// app.Unitask.trigger('filter');
		}
	});

	app.UnitaskRouter = new Workspace();
	Backbone.history.start();

}());
