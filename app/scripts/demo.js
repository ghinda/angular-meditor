/* angular-meditor demo
 */

var app = angular.module('meditorDemo', [
  'angular-meditor'
]);

app.controller('MainCtrl', function($scope, $rootScope) {
  'use strict';

  var model = $scope.model = {};
  model.text = 'angular-meditor using ng-model.';

  return $rootScope.$on('$routeChangeSuccess', function() {
  });
  
});
