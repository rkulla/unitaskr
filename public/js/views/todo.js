var app = app || {};

(function($) {
    'use strict';

    app.TodoView = Backbone.View.extend({
        tagName: 'li',

        events: {
            'submit form': 'addToList',
        },

        model: new app.TodoList(),

        initialize: function() {
           this.listenTo(this.model, 'change', this.render);//
           //this.listenTo(this.model, 'destroy', this.remove);//
           this.model.set({fname:'henry'});
           this.model.mf();
           this.model.set({fname:'jack'});
           // this.model.destroy();//
        },

        render: function() {
            this.$el.html(this.model.get('fname') + '<br>');//
            return this;
        },

        makeHtmlId: function(s) {
            // Change whitespace to dashes and up to 30 chars max.
            return s.replace(/\s/g, '-').substring(0, 30);
        },

        addToList: function(e) {
            e.preventDefault();
        //     var ul = $('#todo-list');
        //     var task = $('#todo-task').val();
        //     var checkbox = $('<input>', {
        //         type: 'checkbox',
        //         title: 'Done',
        //     });

        //     var li = $('<li>', {
        //         id: this.makeHtmlId(task),
        //     }); 

        //     var next = $('<a>', {
        //         id: 'next-link',
        //         href: '#',
        //         title: 'Do this task next',
        //         text: ' Next ',
        //         click: function(e) { 
        // console.log(e.target);
        //             e.preventDefault();
        //             $('#taskbar #task').val(task);
        //             $('#taskbar #task').focus();
        //         },
        //     });

        //     var delete_item = $('<a>', {
        //         id: 'delete-link',
        //         href: '#',
        //         title: 'Delete task',
        //         text: ' Delete ',
        //         click: function(e) { 
        //             e.preventDefault();
        //             $('#' + this.makeHtmlId(task)).remove();
        //         }.bind(this),
        //     });

        //     li.append(delete_item);
        //     li.append(' - ');
        //     li.append(next);
        //     li.append(checkbox);
        //     li.append(' ' + task);
        //     ul.append(li);

        //     $('#todo-task').val('');
        },

    });

})(jQuery);
