'use strict';

var p2pvideoApp = window.p2pvideoApp = angular.module('p2pvideo',[
  'ngRoute',
  'mm.foundation',
  'p2pvideo.header',
  'p2pvideo.footer',
  'p2pvideo.ChatFactory',
  'p2pvideo.signin',
  'p2pvideo.controllerUtils',
  'p2pvideo.directives',
  'p2pvideo.video',
]);

angular.module('p2pvideo.header', []);
angular.module('p2pvideo.footer', []);
angular.module('p2pvideo.ChatFactory', []);
angular.module('p2pvideo.controllerUtils', []);
angular.module('p2pvideo.signin', []);
angular.module('p2pvideo.socket', []);
angular.module('p2pvideo.directives', []);
angular.module('p2pvideo.video', []);

