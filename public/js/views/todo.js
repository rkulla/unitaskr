'use strict';
// Also see js/views/todo-input.js

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
        this.template = _.template($('#todoTaskTemplate').html());
        $taskbarTask = $('#taskbar #task');
    },

    render: function() {
        $('#todo-task').val('');
        // By the time this.model.get() is called here, the value it 
        // contains should already exist, if it was passed to the add() 
        // method in the todo-input.js view
        var modeltask = this.model.get('task');

        // Append to the <li> the template that contains the delete, 
        // do next & checkbox buttons. Then append the task name to it
        this.$el.append(this.template);
        this.$el.append(modeltask);

        return this; // return to be called externally/chained
    },

    deleteTodoTask: function(e) {
        e.preventDefault();
        this.remove(); // remove this `<li>` view

        // Delete from localStorage too
        //
        // Passing {wait:true} is important because the
        // the sync event gets called and we want to make
        // sure the model is destroyed first.
        this.model.destroy({wait:true}); 
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
        });
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
