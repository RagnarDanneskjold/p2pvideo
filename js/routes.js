'use strict';

//Setting up route
angular
  .module('p2pvideo')
  .config(function($routeProvider) {

    $routeProvider
      .when('/', {
        templateUrl: 'signin.html',
        validate: false
      })
      .when('/signin', {
        templateUrl: 'signin.html',
        validate: false
      })
      .when('/chat', {
        templateUrl: 'chat.html',
        validate: true
      })
      .when('/join/:id', {
        templateUrl: 'join.html',
        validate: true
      })
      .otherwise({
        templateUrl: '404.html'
      });
  });

//Setting HTML5 Location Mode
angular
  .module('p2pvideo')
  .config(function($locationProvider) {
    $locationProvider
      .html5Mode(false);
      //.hashPrefix('!');
  })
  .run(function($rootScope, $location) {
    $rootScope.$on('$routeChangeStart', function(event, next, current) {
      if ((!$rootScope.chat || !$rootScope.chat.id) && next.validate) {
        $location.path('signin');
      }
    });
  });
