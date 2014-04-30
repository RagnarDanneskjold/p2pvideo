//
// test/unit/services/servicesSpec.js
//
describe("Unit: Testing Services", function() {

  beforeEach(angular.mock.module('p2pvideo.socket'));

  it('should contain a Socket service', inject(function(Socket) {
    expect(Socket).not.to.equal(null);
  }));


  beforeEach(angular.mock.module('p2pvideo.ChatFactory'));

  it('should contain a ChatFactory service', inject(function(ChatFactory) {
    expect(ChatFactory).not.to.equal(null);
  }));


  beforeEach(angular.mock.module('p2pvideo.controllerUtils'));

  it('should contain a controllerUtils service', inject(function(controllerUtils) {
    expect(controllerUtils).not.to.equal(null);
  }));

});
