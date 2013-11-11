'use strict';

var app = angular.module('meditorDemo', [
	'ngRoute',
	'angular-meditor'
]).config(function($routeProvider) {

	$routeProvider
	.when('/', {
		controller: 'MainCtrl'
	}).otherwise({
		redirectTo: '/'
	});

});

app.run(function($rootScope, $route) {

});

$(document).foundation();
