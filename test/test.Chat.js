'use strict';

var chai = chai || require('chai');
var should = chai.should();
var Chat = p2pvideo.Chat;

describe('Chat', function() {
  it('should create an instance', function () {
    var c = new Chat();
    should.exist(c);
  });

});
