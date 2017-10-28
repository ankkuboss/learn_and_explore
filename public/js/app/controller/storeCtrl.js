'use strict';
var app = angular.module('learn_and_explore');

app.controller('StoreCtrl', ['$scope', '$location', '$rootScope', '$state','$stateParams','showServerError', 'commonService','$templateCache', '$cacheFactory',function($scope, $location, $rootScope, $state,$stateParams,showServerError,commonService, $templateCache, $cacheFactory){

	var vm = $scope;
	vm.stateParams = $stateParams;

	

	$scope.myInterval = 3000;
  

  vm.store_details= {};
  
  vm.store_details = function(){

  	console.log("storeDtl:",vm.stateParams);
  	commonService.commonApiCall({store_id:vm.stateParams.store_id},'store_offer/store_details').then(function(response){
			
			vm.store_details = response.data;			
			

			},function (error)
			{
				if(error.ResponseCode==501)
				{
					
					//$rootScope.alert_error = error.Error.lineup;
				}
				else
				{
					
					//$rootScope.alert_error = error.GlobalError;
					/*angular.forEach(error.Error, function(value, key) {
				  		angular.element('#login_'+key+'_error').text(value).show();
					});*/
				}
			}
		);
  }

   vm.get_store_list = function(){
  	commonService.commonApiCall({},'store_offer/get_store_list').then(function(response){
			

			
			vm.store_list = response.data;			
			

			},function (error)
			{
				if(error.ResponseCode==501)
				{
					
					//$rootScope.alert_error = error.Error.lineup;
				}
				else
				{
					
					//$rootScope.alert_error = error.GlobalError;
					/*angular.forEach(error.Error, function(value, key) {
				  		angular.element('#login_'+key+'_error').text(value).show();
					});*/
				}
			}
		);
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
