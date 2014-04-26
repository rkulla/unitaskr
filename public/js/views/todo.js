var jQuery = require('jquery');
var Backbone = require('backbone');
var _ = require('underscore');
Backbone.$ = jQuery;

(function($) {
    'use strict';

    module.exports = Backbone.View.extend({
        tagName: 'li',

        events: {
            'click .deleteTodoTask': 'deleteTodoTask',
            'click .nextTodoTask': 'setNextTodoTask',
        },

        initialize: function() {
           this.$task = $('#todo-task').val();
        },

        render: function() {
            $('#todo-task').val('');
            var $todoTaskTemplate = _.template($('#todoTaskTemplate').html());
            this.$el.append($todoTaskTemplate);
            this.$el.append(this.model.get('task'));
            return this;
        },

        deleteTodoTask: function(e) {
            e.preventDefault();
            this.remove(); // remove this `<li>` view
        },

        setNextTodoTask: function(e) {
            e.preventDefault();
            $('#taskbar #task').val(this.$task);
            $('#taskbar #task').focus();
        },

    });

})(jQuery);
