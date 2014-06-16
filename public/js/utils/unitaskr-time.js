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

    secondsToTime: function(secs) {
        var times = {
              hours: this.zeroPad(Math.floor(secs/3600)),
              mins: this.zeroPad(Math.floor((secs % 3600)/60)),
        };
        times.secs = this.zeroPad(Math.round((((secs % 3600)/60) - 
                        times.mins)*60))
        return times;
    },

    secondsToTimeTemplate: function(secs) {
        var times = this.secondsToTime(secs);
        return _.template('{{hours}}{{h}} {{mins}}{{m}} {{secs}}{{s}}', {
            hours: times.hours, h: this.small('h'),
            mins: times.mins, m: this.small('m'),
            secs: times.secs, s: this.small('s')
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
