//
// test/unit/controllers/controllersSpec.js
//
describe("Unit: Testing Controllers", function() {

  beforeEach(angular.mock.module('p2pvideo'));

  it('should have a AddressesController controller', function() {
    expect(p2pvideoApp.AddressesController).not.to.equal(null);
  });

  it('should have a BackupController controller', function() {
    expect(p2pvideoApp.Backupcontroller).not.to.equal(null);
  });

  it('should have a HeaderController controller', function() {
    expect(p2pvideoApp.HeaderController).not.to.equal(null);
  });

  it('should have a SendController controller', function() {
    expect(p2pvideoApp.SendController).not.to.equal(null);
  });

  it('should have a SetupController controller', function() {
    expect(p2pvideoApp.SetupController).not.to.equal(null);
  });

  it('should have a SigninController controller', function() {
    expect(p2pvideoApp.SigninController).not.to.equal(null);
  });

  it('should have a TransactionsController controller', function() {
    expect(p2pvideoApp.TransactionsController).not.to.equal(null);
  });

});
