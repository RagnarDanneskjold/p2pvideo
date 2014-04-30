'use strict';

angular.module('p2pvideo.signin').controller('SigninController',
  function($scope, $rootScope, $location, ChatFactory, controllerUtils) {
    $scope.loading = false;
    $scope.chats = ChatFactory.getChats();
    $scope.selectedChatId = $scope.chats.length ? $scope.chats[0].id : null;

    $scope.create = function() {
      $scope.loading = true;
      var c = ChatFactory.create();
      $rootScope.chat = c;
      $location.path('chat');
    };

    $scope.open = function(chatId, opts) {
      $scope.loading = true;
      var w = ChatFactory.open(chatId, opts);
      controllerUtils.startNetwork(w);
    };

    $scope.join = function(secret) {
      if (!secret || secret.length !==66 || !secret.match(/^[0-9a-f]*$/) ) {
        $rootScope.flashMessage = { message: 'Bad secret secret string', type: 'error'};
        return;
      }
      $scope.loading = true;

      ChatFactory.network.on('joinError', function() {
        controllerUtils.onErrorDigest($scope); 
      });

      ChatFactory.joinCreateSession(secret, function(w) {
        if (w) {
          controllerUtils.startNetwork(w);
        }
        else {
          $scope.loading = false;
          controllerUtils.onErrorDigest();
        }
      });
    };
  });
