var _ = require('underscore');

// Use mustache style templating instead of ERB
_.templateSettings = {
      interpolate: /\{\{(.+?)\}\}/g
};

module.exports = {

    // Return `n` with a 0 prefix. Ex. 5 becomes '05'
    zeroPad: function(n) {
        return ('00' + n.toString()).slice(-2);
    },

    // returns a <small> string `s`
    // Ex. s='h' returns: '<small>h</small>'.
    small: function(s) {

        var smallTemplate = document.querySelector('#smallTemplate'),
            templateHTML = smallTemplate.innerHTML,
            compiledTemplate = _.template(templateHTML, {
                smallString: s
            });

        return compiledTemplate;
    },

    secondsToTime: function(total_secs) {
        var hours = Math.floor(total_secs / 3600),
            mins = Math.floor((total_secs % 3600) / 60),
            secs = Math.round((((total_secs % 3600) / 60) - mins) * 60);

        return _.template('{{hours}}{{h}} {{mins}}{{m}} {{secs}}{{s}}', {
            hours: this.zeroPad(hours),
            h: this.small('h'),
            mins: this.zeroPad(mins),
            m: this.small('m'),
            secs: this.zeroPad(secs),
            s: this.small('s')
        });
    },

    getTimeNow: function() {
        // Figure out what the time/date is right now
        // Uses the format: month/day/year hour:minute:second AM/PM
        var currentTime = new Date(),
            month = currentTime.getMonth() + 1,
            day = currentTime.getDate(),
            year = currentTime.getFullYear(),
            hour = currentTime.getHours(),
            minute = currentTime.getMinutes(),
            second = currentTime.getSeconds(),
            ampm = hour > 11 ? 'PM' : 'AM';

        if (minute < 10) {
            minute = '0' + minute;
        }

        if (second < 10) {
            second = '0' + second;
        }

        // Convert from 24 hour time to 12 hour time:
        hour = hour % 12 || 12;

        return month + '/' + day + '/' + year + ' ' + hour + ':' + 
                    minute + ':' + second + ' ' + ampm;
    }

}
