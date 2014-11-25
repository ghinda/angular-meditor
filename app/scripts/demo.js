/* angular-meditor demo
 */

var app = angular.module('meditorDemo', [
  'ngRoute',
  'angular-meditor'
]).config(function($routeProvider) {
  'use strict';

  $routeProvider
  .when('/', {
    controller: 'MainCtrl'
  }).otherwise({
    redirectTo: '/'
  });

});

app.controller('MainCtrl', function($scope, $rootScope) {
  'use strict';

  var model = $scope.model = {};
  model.text = 'anguar-meditor using ng-model.';

  return $rootScope.$on('$routeChangeSuccess', function() {
  });
});
