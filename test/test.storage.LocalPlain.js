'use strict';

if (typeof process === 'undefined' || !process.version)  {
  // browser
  var chai     = chai || require('chai');
  var should   = chai.should();
  var p2pvideo    = p2pvideo || require('../p2pvideo');
  var LocalPlain    = p2pvideo.StorageLocalPlain;

  describe('Storage/LocalPlain model', function() {

    it('should create an instance', function () {
      var s = new LocalPlain();
      should.exist(s);
    });

    describe('#setFromObj', function() {
      it('should set keys from an object', function() {
        localStorage.clear();
        var obj = {test:'testval'};
        var storage = new LocalPlain();
        storage.setFromObj('chatId', obj);
        storage.get('chatId', 'test').should.equal('testval');
      });
    });
  });
}
