'use strict';

var $ = require('jquery'),
    Backbone = require('backbone'),
    _ = require('underscore'),
    $taskbarTask,
    dragSrcEl = null;

module.exports = Backbone.View.extend({

    tagName: 'li',

    attributes: function () {
        return { 'draggable' : 'true' }
    },

    events: {
        'click .deleteTodoTask': 'deleteTodoTask',
        'click .nextTodoTask': 'setNextTodoTask',
        'dragstart': 'handleDragStart',
        'dragenter': 'handleDragEnter',
        'dragleave': 'handleDragLeave',
        'dragover': 'handleDragOver',
        'dragend': 'handleDragEnd',
        'drop': 'handleDrop',
    },

    initialize: function() {
        $taskbarTask = $('#taskbar #task');
    },

    render: function() {
        $('#todo-task').val('');
        var $todoTaskTemplate = _.template($('#todoTaskTemplate').html()),
            modeltask = this.model.get('task');

        this.$el.append($todoTaskTemplate);
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
        $taskbarTask.val(modeltask);
        $taskbarTask.focus();
    },

    handleDragStart: function(e) {
        this.$el.css('opacity','0.4'); 
        dragSrcEl = this.$el;
        // e is jQuery's event object, e.originalEvent is the one we want
        e.originalEvent.dataTransfer.effectAllowed = 'move'; 
        // Set the drop payload
        e.originalEvent.dataTransfer.setData('text/plain', this.$el.html());
    },

    handleDragEnter: function(e) {
        this.$el.addClass('over');
    },

    handleDragLeave: function(e) {
        this.$el.removeClass('over');
    },

    handleDragOver: function(e) {
        e.preventDefault(); // Important: Allows us to drop.
        e.originalEvent.dataTransfer.dropEffect = 'move';
    },

    handleDragEnd: function(e) {
        this.$el.css('opacity', '1.0');

        $('li.over').each(function(index) {
            $(this).removeClass('over');
        })
    },
    
    handleDrop: function(e) {
        e.stopPropagation();

        // Don't do anything if dropping the same column we're dragging
        if (dragSrcEl != this.$el) {
            // swap the elements
            dragSrcEl.html(this.$el.html());
            this.$el.html(e.originalEvent.dataTransfer.getData('text/plain'));
        }
    },
    
});
