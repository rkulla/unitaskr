'use strict';
// Also see js/views/todo-input.js

var $ = require('jquery'),
    Backbone = require('backbone'),
    _ = require('underscore'),
    $taskbarTask,
    $todoTaskTemplate,
    Todos = require('../collections/todos'),
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
        $todoTaskTemplate = $('#todoTaskTemplate');
        this.templateHTML = $todoTaskTemplate.html();
        this.template = _.template(this.templateHTML);
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
        var old_el,
            new_el,
            old_task,
            new_task,
            found_new,
            found_old,
            new_timestamp,
            old_timestamp;

        // Swap the elements. Don't do anything if dropping the 
        // same column we're dragging.
        if (dragSrcEl != this.$el) {
            // Swap the `li` elements in the view
            new_el = this.$el.html();
            dragSrcEl.html(new_el);
            old_el = e.originalEvent.dataTransfer.getData('text/plain');
            this.$el.html(old_el);

            // Extract task names from html
            new_task = new_el.slice(this.templateHTML.length).trim();
            old_task = old_el.slice(this.templateHTML.length).trim();

            found_new = Todos.findWhere({'task': new_task})
            found_old = Todos.findWhere({'task': old_task})

            // Swap timestamps to remember positions in localStorage
            new_timestamp = found_new.get('timestamp');
            old_timestamp = found_old.get('timestamp');
            found_new.save({timestamp:old_timestamp, dontSync:true});
            found_old.save({timestamp:new_timestamp, dontSync:true});
        }
    },

});
