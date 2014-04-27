
Description
===========
*Unitaskr* is a productivity tool (uses `Backbone.js`, `Node Express`, `Browserify` and `HTML5`) that allows you to set tasks you want to perform, and add a timer. It comes with a built-in Todo-list, as well as features for note taking and task history.

Unitasking (a.k.a Monotasking), means creating blocks of time to perform  one task at a time. Thus, it's the opposite of multi-tasking.

It's easy to get caught up doing one task so much that you lose track of time and never end up getting to all the tasks on your todo list. Unitaskr aims to solve this problem.

I'm a fan of the Pomodoro technique, so I made the timer default to 25 minutes. If you don't like the Pomodoro technique, that's fine too. Unitaskr was designed to allow for any timeboxing method you prefer. For example, sometimes I prefer to use the 50/10 rule. This is where you do something for 50 minutes straight and then take a 10 minute break.

Note that Unitaskr currently doesn't save anything, so if you refresh the page you will restart the program.

Usage
=====
Make sure to disable pop-up blocking, or add http://localhost:3000/ to your pop-up blocker's exceptions list.

Change directories to the top of the unitaskr project direcotry and run:

    $ npm install
    $ npm start

Now just go to http://localhost:3000 in your browser. 

You only need to `npm install` once. In future uses just run `npm start`.

For Developers
==============
Do the usage steps and then install the browserify command on your machine:

    $ npm install browserify -g

and whenever you change a javascript file run:

    $ npm run build
