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
            var modeltask = this.model.get('task');
            this.$el.append(modeltask);
            this.model.save(modeltask); // save a copy to localStorage
            return this;
        },

        deleteTodoTask: function(e) {
            e.preventDefault();
            this.remove(); // remove this `<li>` view
            this.model.destroy(); // delete from localStorage too
        },

        setNextTodoTask: function(e) {
            e.preventDefault();
            var modeltask = this.model.get('task');
            $('#taskbar #task').val(modeltask);
            $('#taskbar #task').focus();
        },

    });

})(jQuery);
