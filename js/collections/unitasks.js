var app = app || {};

(function() {
	'use strict';

	var UnitaskList = Backbone.Collection.extend({

		model: app.Unitask,

	app.Unitasks = new UnitaskList();

}());
