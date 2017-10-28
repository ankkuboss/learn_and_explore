'use strict';
var app = angular.module('learn_and_explore');

app.controller('CommonCtrl', ['$scope', '$location', '$rootScope', '$state','showServerError', 'commonService','$templateCache', '$cacheFactory',function($scope, $location, $rootScope, $state,showServerError,commonService, $templateCache, $cacheFactory){
	if(sessionStorage.getItem('is_logged_in')===null || sessionStorage.getItem('is_logged_in')===undefined)
	{
		$rootScope.is_logged_in = false;
	}
	else
	{
		$rootScope.is_logged_in = sessionStorage.getItem('is_logged_in');
	}

	$scope.logout= function(){
		sessionStorage.setItem('is_logged_in',false);
			$rootScope.userLogin = false;
			$rootScope.is_logged_in = false;
			$rootScope.userName = "";			
			localStorage.clear();
			
			//$state.go(next_url);
			window.location = site_url;

	}

}]);
