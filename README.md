
Description
===========
*Unitaskr* is a productivity tool that allows you to set tasks you want to perform, and add a timer. It comes with a built-in Todo-list, as well as features for note taking and task history.

It uses `Backbone.js`, `HTML5`, Node.js `Express`, `Browserify` and `Gulp`.

Unitasking (a.k.a Monotasking), means creating blocks of time to perform  one task at a time. Thus, it's the opposite of multi-tasking.

It's easy to get caught up doing one task so much that you lose track of time and never end up getting to all the tasks on your todo list. Unitaskr aims to solve this problem.

I'm a fan of the Pomodoro technique, so I made the timer default to 25 minutes. If you don't like the Pomodoro technique, that's fine too. Unitaskr was designed to allow for any timeboxing method you prefer. For example, sometimes I prefer to use the 50/10 rule. This is where you do something for 50 minutes straight and then take a 10 minute break.

Note that Unitaskr currently uses localStorage to save a copy of your todo list for offline viewing or to preserve it if you refresh the page. Other things besides the todo list may disappear from the page if you refresh.

Usage
=====
Requirements: `npm`.

Change directories to the top of the unitaskr project direcotry and run:

    $ npm install --production
    $ npm start

Now just go to http://localhost:3000 in your browser. 

Make sure to disable pop-up blocking, or add http://localhost:3000/ to your pop-up blocker's exceptions list, so you can receive the alerts when the timer finishes.

You only need to `npm install` once. In future uses just run `npm start`. You can also close the `npm start` command in you terminal with Ctrl-C and Unitaskr will continue to run because it will have been fully loaded onto the browser!

Contributing
============
Install the devDependencies (leave out the --production flag):

    $ npm install

Then install the browserify command to your machine:

    $ npm install browserify -g

Whenever you change a javascript file run:

    $ npm run build

Or better yet, automate the bundle updates by running `watchify`:

    $ gulp watch
