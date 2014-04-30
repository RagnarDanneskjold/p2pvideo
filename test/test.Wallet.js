'use strict';

var chai = chai || require('chai');
var should = chai.should();
var p2pvideo = p2pvideo || require('../p2pvideo');
var Chat = require('../js/models/core/Chat');
var Storage= require('./mocks/FakeStorage');
var Network= require('./mocks/FakeNetwork');
var Blockchain= p2pvideo.Insight;

var addp2pvideoers = function (w) {
  for(var i=0; i<4; i++) {
    w.publicKeyRing.addp2pvideoer();
  }
};

describe('Chat model', function() {

  var config = {
    requiredp2pvideoers: 3,
    totalp2pvideoers: 5,
    spendUnconfirmed: 1,
    blockchain: {
      host: 'test.insight.is',
      port: 80
    },
    networkName: 'testnet',
  };

  it('should fail to create an instance', function () {
    (function(){new Chat(config)}).should.throw();
  });

  var createW = function () {
    var c = JSON.parse(JSON.stringify(config));

    c.privateKey = new p2pvideo.PrivateKey({ networkName: c.networkName });

    c.publicKeyRing = new p2pvideo.PublicKeyRing({
      networkName: c.networkName,
      requiredp2pvideoers: c.requiredp2pvideoers,
      totalp2pvideoers: c.totalp2pvideoers,
    });
    c.publicKeyRing.addp2pvideoer(c.privateKey.getExtendedPublicKeyString());

    c.txProposals = new p2pvideo.TxProposals({
      networkName: c.networkName,
    });
    c.storage     = new Storage(config.storage);
    c.network     = new Network(config.network);
    c.blockchain  = new Blockchain(config.blockchain);

    c.networkName = config.networkName;
    c.verbose     = config.verbose;

    return new Chat(c);
  }

  it('should create an instance', function () {
    var w = createW();
    should.exist(w);
    w.publicKeyRing.chatId.should.equal(w.id);
    w.txProposals.chatId.should.equal(w.id);
    w.requiredp2pvideoers.should.equal(3);
    should.exist(w.id);
    should.exist(w.publicKeyRing);
    should.exist(w.privateKey);
    should.exist(w.txProposals);
  });

  it('should provide some basic features', function () {
    var opts = {};
    var w = createW();
    addp2pvideoers(w);
    w.publicKeyRing.generateAddress(false);
    w.publicKeyRing.isComplete().should.equal(true);
  });

  var unspentTest = [
    {
    "address": "dummy",
    "scriptPubKey": "dummy",
    "txid": "2ac165fa7a3a2b535d106a0041c7568d03b531e58aeccdd3199d7289ab12cfc1",
    "vout": 1,
    "amount": 10,
    "confirmations":7
  }
  ];

  var createW2 = function (privateKeys) {
    var w = createW();
    should.exist(w);

    var pkr =  w.publicKeyRing;

    for(var i=0; i<4; i++) {
      if (privateKeys) {
        var k=privateKeys[i];
        pkr.addp2pvideoer(k?k.getExtendedPublicKeyString():null);
      }
      else 
        pkr.addp2pvideoer();
    }
    pkr.generateAddress(true);
    pkr.generateAddress(true);
    pkr.generateAddress(true);
    pkr.generateAddress(false);
    pkr.generateAddress(false);
    pkr.generateAddress(false);
    //3x3 indexes

    return w;
  };

  it('#create, 1 sign', function () {

    var w = createW2();

    unspentTest[0].address        = w.publicKeyRing.getAddress(1, true).toString();
    unspentTest[0].scriptPubKey   = w.publicKeyRing.getScriptPubKeyHex(1, true);

    w.createTxSync(
      '15q6HKjWHAksHcH91JW23BJEuzZgFwydBt', 
      '123456789', 
      unspentTest
    );

    var t = w.txProposals;
    var k = Object.keys(t.txps)[0];
    var tx = t.txps[k].builder.build();
    should.exist(tx);
    tx.isComplete().should.equal(false);
    Object.keys(t.txps[k].signedBy).length.should.equal(1);
    Object.keys(t.txps[k].seenBy).length.should.equal(1);
  });

  it('#addressIsOwn', function () {
    var w = createW2();
    var l = w.getAddressesStr();
    for (var i=0; i<l.length; i++)
      w.addressIsOwn(l[i]).should.equal(true);
    w.addressIsOwn('mmHqhvTVbxgJTnePa7cfweSRjBCy9bQQXJ').should.equal(false);
    w.addressIsOwn('mgtUfP9sTJ6vPLoBxZLPEccGpcjNVryaCX').should.equal(false);
  });

  it('#create. Signing with derivate keys', function () {

    var w = createW2();

    var ts = Date.now();
    for (var isChange=0; isChange<2; isChange++) {
      for (var index=0; index<3; index++) {
        unspentTest[0].address        = w.publicKeyRing.getAddress(index, isChange).toString();
        unspentTest[0].scriptPubKey   = w.publicKeyRing.getScriptPubKeyHex(index, isChange);
        w.createTxSync(
          '15q6HKjWHAksHcH91JW23BJEuzZgFwydBt', 
          '123456789', 
          unspentTest
        );
        var t = w.txProposals;
        var k = Object.keys(t.txps)[0];
        var tx = t.txps[k].builder.build();
        should.exist(tx);
        tx.isComplete().should.equal(false);
        tx.countInputMissingSignatures(0).should.equal(2);

        ( t.txps[k].signedBy[w.privateKey.getId()] - ts > 0).should.equal(true);
        ( t.txps[k].seenBy[w.privateKey.getId()] - ts > 0).should.equal(true);
      }
    }
  });

  it('#fromObj #toObj round trip', function () {

    var w = createW2();

    var o = w.toObj();
    o = JSON.parse(JSON.stringify(o));

    var w2 = Chat.fromObj(o,
       new Storage(config.storage),
       new Network(config.network),
       new Blockchain(config.blockchain));
    should.exist(w2);
    w2.publicKeyRing.requiredp2pvideoers.should.equal(w.publicKeyRing.requiredp2pvideoers);
    should.exist(w2.publicKeyRing.getp2pvideoerId);
    should.exist(w2.txProposals.toObj);
    should.exist(w2.privateKey.toObj);
  });

});
