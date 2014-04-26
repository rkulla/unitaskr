// Main entry point. This is the file to call with browserify:
// $ browserify public/js/app.js -o public/js/bundle.js
var $ = require('jquery');
AppView = require('./views/app');

$(function() {
    new AppView();
});
