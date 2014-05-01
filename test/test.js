var should = require('should'); // still needed for gulp-mocha
var uTime = require('../public/js/utils/unitaskr-time');

describe('unitaskr-time', function(){
    describe('zeroPad(n, s)', function(){
        it('should zero pad', function(){
            uTime.zeroPad(5, 'h').should.equal('05<small>h</small>');
        })
    })
})
