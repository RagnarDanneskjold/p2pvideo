'use strict';

angular.module('p2pvideo.header').controller('HeaderController',
  function($scope, $rootScope, $location, ChatFactory, controllerUtils) {
    $scope.signout = function() {
      var c = $rootScope.chat;
      if (c) {
        c.disconnect();
        controllerUtils.logout();
      }
      $rootScope.flashMessage = {};
    };

    $scope.clearFlashMessage = function() {
      $rootScope.flashMessage = {};
    };

    $rootScope.isCollapsed = true;
  });
