'use strict';

angular.module('p2pvideo.controllerUtils')
  .factory('controllerUtils', function($rootScope, $sce, $location, video) {
    var root = {};
    $rootScope.videoSrc = {};
    $rootScope.getVideoURL = function(p2pvideoer) {
      var encoded = $rootScope.videoSrc[p2pvideoer];
      if (!encoded) return;
      var url = decodeURI(encoded);
      var trusted = $sce.trustAsResourceUrl(url);
      return trusted;
    };

    $rootScope.getChatDisplay = function() {
      var c = $rootScope.chat;
      return c && (c.name || c.id);
    };

    root.logout = function() {
      $rootScope.chat = null;
      delete $rootScope['chat'];
      video.close();
      $rootScope.videoSrc = {};
      $location.path('signin');
    };

    root.onError = function(scope) {
      if (scope) scope.loading = false;
      $rootScope.flashMessage = {
        type: 'error',
        message: 'Could not connect to peer: ' +
          scope
      };
      root.logout();
    }

    root.onErrorDigest = function(scope) {
      root.onError(scope);
      $rootScope.$digest();
    }

    root.startNetwork = function(c) {
      var handlePeerVideo = function(err, peerID, url) {
        if (err) {
          delete $rootScope.videoSrc[peerID];
          return;
        }
        $rootScope.videoSrc[peerID] = encodeURI(url);
        $rootScope.$apply();
      };
      c.on('created', function(myPeerID) {
        video.setOwnPeer(myPeerID, w, handlePeerVideo);
        $location.path('addresses');
        $rootScope.chat = c;
        root.updateBalance();
      });
      c.on('peer', function(peerID) {
        video.callPeer(peerID, handlePeerVideo);
      });
      c.on('close', root.onErrorDigest);
      c.netStart();
    };

    return root;
  });
