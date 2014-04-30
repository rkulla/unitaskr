var should = require('should')
var uTime = require('../public/js/utils/unitaskr-time');

describe('unitaskr-time', function(){
    describe('zeroPad(n, s)', function(){
        it('should zero pad', function(){
            should.equal('05<small>h</small>', uTime.zeroPad(5, 'h'));
        })
    })
})
