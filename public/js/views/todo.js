'use strict';
// Also see js/views/todo-input.js

var $ = require('jquery'),
    Backbone = require('backbone'),
    _ = require('underscore'),
    $taskbarTask,
    $todoTaskTemplate,
    Todos = require('../collections/todos'),
    startTag = '<span draggable="true">',
    endTag = '</span>',
    dragSrcEl = null;

module.exports = Backbone.View.extend({

    tagName: 'li',

    events: {
        'click .deleteTodoTask': 'deleteTodoTask',
        'click input[type=checkbox]': 'toggleDone',
        'dragstart': 'handleDragStart',
        'dragenter': 'handleDragEnter',
        'dragleave': 'handleDragLeave',
        'dragover': 'handleDragOver',
        'dragend': 'handleDragEnd',
        'drop': 'handleDrop',
    },

    // toggle in localStorage
    toggleDone: function(e) {
        this.model.toggle(); 
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
        // checkbox buttons. Then append the task name to it
        this.$el.append(this.template);
        this.$el.append(startTag + modeltask + endTag);

        if (this.model.get('done')) {
            this.$el.find('input').prop('checked', true);
        }

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

    handleDragStart: function(e) {
        this.$el.css('opacity','0.4'); 
        dragSrcEl = this.$el;
        var taskname = dragSrcEl.html().slice(this.templateHTML.length).trim(),
            nospan = taskname.replace(startTag, '').replace(endTag, '');

        // Set the drop payload.
        // e is jQuery's event object so e.originalEvent what we want.
        e.originalEvent.dataTransfer.setData('text/plain', nospan);
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

    handleDrop: function(e) {
        e.stopPropagation();
        var old_src,
            old_task,
            target_html,
            new_task,
            new_content,
            new_src,
            src_was_checked,
            target_was_checked,
            pattern,
            found_new,
            found_old,
            new_timestamp,
            old_timestamp;

        // Swap the elements. Don't do anything if dropping the 
        // same column we're dragging.
        if (dragSrcEl != this.$el) {
            src_was_checked = dragSrcEl.find('input').prop('checked');
            target_was_checked = this.$el.find('input').prop('checked');

            // Swap just the <span> tags of the `li` elements
            target_html = this.$el.html();
            new_content = target_html.slice(this.templateHTML.length).trim();
            pattern = new RegExp(startTag+'(.*?)'+endTag);
            new_src = dragSrcEl.html().replace(pattern, new_content);
            dragSrcEl.html(new_src);
            old_src = e.originalEvent.dataTransfer.getData('text/plain');
            this.$el.html(target_html.replace(pattern, startTag+old_src+endTag));

            // Re-add any existing done check marks
            if (src_was_checked) {
                this.$el.find('input').prop('checked', true);
            }
            if (target_was_checked) {
                dragSrcEl.find('input').prop('checked', true);
            }

            // Extract task names from html
            new_task = target_html.match(pattern)[1];
            old_task = old_src.replace(pattern, '');

            // Swap timestamps to remember positions in localStorage
            found_new = Todos.findWhere({'task': new_task})
            found_old = Todos.findWhere({'task': old_task})
            new_timestamp = found_new.get('timestamp');
            old_timestamp = found_old.get('timestamp');
            found_new.save({timestamp:old_timestamp});
            found_old.save({timestamp:new_timestamp});

            // Resorting after dropping allows this.model to be correct
            // when you run .destroy, etc. And shows the swap immediately.
            Todos.sort(); 
        }

        this.$el.trigger('dragend'); // ensure handleDragEnd is called
    },

    handleDragEnd: function(e) {
        $('li').each(function(index) {
            $(this).css('opacity', '1.0');
            $(this).removeClass('over');
        });
    },
    
});
