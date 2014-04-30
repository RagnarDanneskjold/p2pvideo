'use strict';

var chai           = chai || require('chai');
var should         = chai.should();
var bitcore        = bitcore || require('bitcore');
var Address        = bitcore.Address;
var buffertools    = bitcore.buffertools;
var p2pvideo          = p2pvideo || require('../p2pvideo');
var PublicKeyRing  = p2pvideo.PublicKeyRing;

var aMasterPubKey = 'tprv8ZgxMBicQKsPdSVTiWXEqCCzqRaRr9EAQdn5UVMpT9UHX67Dh1FmzEMbavPumpAicsUm2XvC6NTdcWB89yN5DUWx5HQ7z3KByUg7Ht74VRZ';


var config = {
  networkName:'livenet',
};

var createW = function (networkName) {
  var config = {
    networkName: networkName || 'livenet',
  };

  var w = new PublicKeyRing(config);
  should.exist(w);

  var p2pvideoers = [];
  for(var i=0; i<5; i++) {
    w.isComplete().should.equal(false);
    var newEpk = w.addp2pvideoer();
    p2pvideoers.push(newEpk);
  }
  w.chatId = '1234567';
  
  return {w:w, p2pvideoers: p2pvideoers};
};

describe('PublicKeyRing model', function() {

  it('should create an instance (livenet)', function () {
    var w = new PublicKeyRing({
      networkName: config.networkName
    });
    should.exist(w);
    w.network.name.should.equal('livenet');
  });
  it('should create an instance (testnet)', function () {
    var w2 = new PublicKeyRing();
    should.exist(w2);
    w2.network.name.should.equal('testnet');
  });

  it('should fail to generate shared pub keys wo extended key', function () {
    var w2 = new PublicKeyRing(config);
    should.exist(w2);

    w2.registeredp2pvideoers().should.equal(0); 
    w2.isComplete().should.equal(false);

    (function() {w2.getAddress(0, false);}).should.throw();
  });

  it('should add and check when adding shared pub keys', function () {
    var k = createW();
    var w = k.w;
    var p2pvideoers = k.p2pvideoers;

    w.isComplete().should.equal(true);
    w.addp2pvideoer.should.throw();
    for(var i =0; i<5; i++) {
      (function() {w.addp2pvideoer(p2pvideoers[i])}).should.throw();
    }
  });

  it('show be able to tostore and read', function () {
    var k = createW();
    var w = k.w;
    var p2pvideoers = k.p2pvideoers;
    var changeN = 2;
    var addressN = 2;
    var start = new Date().getTime();
    for(var i=0; i<changeN; i++) {
      w.generateAddress(true);
    }
    for(var i=0; i<addressN; i++) {
      w.generateAddress(false);
    }

    var data = w.toObj();
    should.exist(data);

    var w2 = PublicKeyRing.fromObj(data);
    w2.chatId.should.equal(w.chatId);
    w2.isComplete().should.equal(true);
    w2.addp2pvideoer.should.throw();
    for(var i =0; i<5; i++) {
      (function() {w.addp2pvideoer(p2pvideoers[i])}).should.throw();
    }

    w2.changeAddressIndex.should.equal(changeN);   
    w2.addressIndex.should.equal(addressN); 
  });


  it('should generate some p2sh addresses', function () {
    var k = createW();
    var w = k.w;

    for(var isChange=0; isChange<2; isChange++) {
      for(var i=0; i<2; i++) {
        var a = w.generateAddress(isChange);
        a.isValid().should.equal(true);
        a.isScript().should.equal(true);
        a.network().name.should.equal('livenet');
        if (i>1) {
          w.getAddress(i-1,isChange).toString().should
            .not.equal(w.getAddress(i-2,isChange).toString());
        }
      }
    }
  });

  it('should return PublicKeyRing addresses', function () {
    var k = createW();
    var w = k.w;


    var a = w.getAddresses();
    a.length.should.equal(0);

    for(var isChange=0; isChange<2; isChange++) 
      for(var i=0; i<2; i++) 
         w.generateAddress(isChange);
 
    var as = w.getAddresses();
    as.length.should.equal(4);
    for(var j in as) {
      var a = as[j];
      a.isValid().should.equal(true);
    }
  });

  it('should count generation indexes', function () {
    var k = createW();
    var w = k.w;

    for(var i=0; i<3; i++)
      w.generateAddress(true);
    for(var i=0; i<2; i++)
      w.generateAddress(false);

    w.changeAddressIndex.should.equal(3);   
    w.addressIndex.should.equal(2); 
  });

  it('#merge index tests', function () {
    var k = createW();
    var w = k.w;

    for(var i=0; i<2; i++)
      w.generateAddress(true);
    for(var i=0; i<3; i++)
      w.generateAddress(false);

    var w2 = new PublicKeyRing({
      networkName: 'livenet',
      chatId: w.chatId,
    });
    w2.merge(w).should.equal(true);
    w2.requiredp2pvideoers.should.equal(3);   
    w2.totalp2pvideoers.should.equal(5);   
    w2.changeAddressIndex.should.equal(2);   
    w2.addressIndex.should.equal(3); 

    //
    w2.merge(w).should.equal(false);
  });


  it('#merge check tests', function () {
    var config = {
      networkName: 'livenet',
    };

    var w = new PublicKeyRing(config);
    w.chatId = 'lwjd5qra8257b9';
    var w2 = new PublicKeyRing({
      networkName: 'testnet',    //wrong
      chatId: w.chatId,
    });
    (function() { w2.merge(w);}).should.throw();

    var w3 = new PublicKeyRing({
      networkName: 'livenet',
      chatId: w.chatId,
      requiredp2pvideoers: 2,      // wrong
    });
    (function() { w3.merge(w);}).should.throw();

    var w4 = new PublicKeyRing({
      networkName: 'livenet',
      chatId: w.chatId,
      totalp2pvideoers: 3,      // wrong
    });
    (function() { w4.merge(w);}).should.throw();


    var w6 = new PublicKeyRing({
      networkName: 'livenet',
    });
    (function() { w6.merge(w);}).should.throw();
    w.networkName= 'livenet';
    (function() { w6.merge(w);}).should.throw();


    var w0 = new PublicKeyRing({
      networkName: 'livenet',
    });
    w0.addp2pvideoer();
    w0.addp2pvideoer();
    w0.addp2pvideoer();
    w0.addp2pvideoer();
    w0.addp2pvideoer();
    (function() { w0.merge(w);}).should.throw();
    w.merge(w0,true).should.equal(true);
    w.isComplete().should.equal(true);

    var wx = new PublicKeyRing({
      networkName: 'livenet',
    });
    wx.addp2pvideoer();
    (function() { w.merge(wx);}).should.throw();


  });


  it('#merge pubkey tests', function () {
    var w = new PublicKeyRing(config);
    should.exist(w);
    var p2pvideoers = [];
    for(var i=0; i<2; i++) {
      w.isComplete().should.equal(false);
      w.addp2pvideoer();
    }

    var w2 = new PublicKeyRing({
      networkName: 'livenet',
      id: w.id,
    });
    should.exist(w);
    var p2pvideoers = [];
    for(var i=0; i<3; i++) {
      w2.isComplete().should.equal(false);
      w2.addp2pvideoer();
    }
    w2.merge(w).should.equal(true);
    w2.isComplete().should.equal(true);
    w2.merge(w).should.equal(false);

    w.isComplete().should.equal(false);
    w.merge(w2).should.equal(true);
    w.isComplete().should.equal(true);
    w.merge(w2).should.equal(false);
  });

  it('#merge pubkey tests (case 2)', function () {
    var w = new PublicKeyRing(config);
    should.exist(w);

    for(var i=0; i<5; i++) {
      w.isComplete().should.equal(false);
      var w2 = new PublicKeyRing({
        networkName: 'livenet',
        id: w.id,
      });
      w2.addp2pvideoer();
      w.merge(w2).should.equal(true);
    }
    w.isComplete().should.equal(true);
  });


  it('#getRedeemScriptMap check tests', function () {
    var k = createW();
    var w = k.w;

    for(var i=0; i<2; i++)
      w.generateAddress(true);
    for(var i=0; i<2; i++)
      w.generateAddress(false);

    var m = w.getRedeemScriptMap();
    Object.keys(m).length.should.equal(4);
    Object.keys(m).forEach(function (k) {
      should.exist(m[k]);
    });
  });

});


