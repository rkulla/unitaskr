
module.exports = {

    zeroPad: function(n, s) {
        // Return `n` with a 0 prefix. Ex. 5 becomes "05". 
        // And appends a <small> string `s`
        // e.g., n=5, s='h' returns: '05<small>h</small>'.
        return ('00' + n.toString()).slice(-2) + '<small>'+s+'</small>';
    },

    secondsToTime: function(total_secs) {
        var hours = Math.floor(total_secs / 3600);
        var mins = Math.floor((total_secs % 3600) / 60);
        var secs = Math.round((((total_secs % 3600) / 60) - mins) * 60);

        return this.zeroPad(hours, 'h') + ' ' + this.zeroPad(mins, 'm') + 
            ' ' + this.zeroPad(secs, 's');
    },

    getTimeNow: function() {
        // Figure out what the time/date is right now
        // Uses the format: month/day/year hour:minute:second AM/PM
        var currentTime = new Date();
        var month = currentTime.getMonth() + 1;
        var day = currentTime.getDate();
        var year = currentTime.getFullYear();
        var hour = currentTime.getHours();
        var minute = currentTime.getMinutes();
        var second = currentTime.getSeconds();
        var ampm = hour > 11 ? 'PM' : 'AM';

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
