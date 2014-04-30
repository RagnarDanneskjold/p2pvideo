var EventEmitter = require('events').EventEmitter;


var generateID = function() {
  return Math.random().toString(36).replace(/[^a-z]+/g, '');
};

function Chat(opts) {
  this.opts = opts || {};
  this.id = this.opts.id || generateID();
  this.connected = false;
  this.registeredPeers = [];
};

Chat.prototype.__proto__ = EventEmitter.prototype;

Chat.prototype.connectTo = function(id) {
  var self = this;
  var c = this.peer.connect(id, {
    serialization: 'none',
    reliable: true,
  });
  self.setupConnection(c, false);
};

Chat.prototype.netStart = function() {
  this.peer = new Peer(this.id, this.opts);
  var self = this;
  var p = this.peer;

  p.on('open', function() {
    self.connected = true;
    self.id = p.id;
    self.emit('created');
    console.log('open');
  });
  p.on('error', function() {
    self.connected = false;
    console.log('error');
  });
  p.on('connection', function(conn) {
    self.setupConnection(conn, true);
  });
};

Chat.prototype.addPeer = function(c) {
  this.connections[c.peer] = c;
  this.registeredPeers.push(c.peer);
};

Chat.prototype.setupConnection = function(c, isInbound) {
  var self = this;
  c.on('open', function() {
    self.addPeer(c);
  });
  c.on('data', function(data) {
    self.onData(data, isInbound, c.peer);
  });
  c.on('error', function() {
    console.log('Error on connection with '+c.peer);
  });
  c.on('close', function() {
    console.log('Closed connection with '+c.peer);
  });
};

Chat.prototype.onData = function(data, inbound, id) {
  this.emit('data', JSON.parse(data));
};

Chat.prototype.toObj = function() {
  return {
    id: this.id,
    others: this.registeredPeers
  };
};

Chat.prototype.fromObj = function(obj) {
  return new Chat(obj);
};

Chat.prototype.disconnect = function() {
  // TODO
};

module.exports = Chat;
