'use strict';

var Chat = p2pvideo.Chat;
function ChatFactory() {
  this.chats = this.readChats();
};

ChatFactory.prototype.readChats = function() {
  var chatIds = this.read('chats') || [];
  var ret = [];
  for (var i=0; i<chatIds.length; i++) {
    var id = chatIds[i];
    var chat = this.read('chat::'+id);
    ret.push(chat);
  };
  return ret;
};

ChatFactory.prototype.storeChats = function() {
  var ids = [];
  for (var i in this.chats) {
    var chat = this.chats[i];
    ids.push(chat.id);
    this.write('chat::'+chat.id, chat);
  }
  this.write('chats', ids);
};

ChatFactory.prototype.getChats = function() {
  return this.chats;  
};

ChatFactory.prototype.create = function(config) {
  var ret = new Chat(config);
  this.chats[ret.id] = ret;
  this.storeChats();
  return ret;
};

ChatFactory.prototype.read = function(id) {
  return JSON.parse(localStorage.getItem(id));
};

ChatFactory.prototype.write = function(id, v) {
  localStorage.setItem(id, JSON.stringify(v));
};

angular.module('p2pvideo.ChatFactory').value('ChatFactory', new ChatFactory());
