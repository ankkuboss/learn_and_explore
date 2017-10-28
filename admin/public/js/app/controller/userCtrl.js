angular.module("learn_and_explore").controller('userCtrl', ['$scope', 'commonService', '$state','$stateParams', '$rootScope', function ($scope, commonService, $state,$stateParams, $rootScope) {


console.log($rootScope.is_logged_in);

if($rootScope.is_logged_in == "false")
	window.location = site_url;

 var vm = $scope;
 vm.user_list = [];
 vm.stateParams = $stateParams;
 vm.userList = function()
 {
 	vm.user = {};
 	commonService.commonApiCall(vm.user,'user/user_list').then(function(response){
			
 		console.log("user list:",response);

 		vm.user_list = response.data.users;
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

 vm.get_user_details = function get_user_details(){
 	vm.user_details = {};
 	commonService.commonApiCall(vm.stateParams,'user/get_user_details').then(function(response){
			
 		console.log("user list:",response);

 		vm.user_details = response.data.user_details;
			},function (error)
			{
				
			}
		);
 }

 vm.cashbackObj = {};
 vm.add_cashback = function add_cashback(){
 	console.log("cash:",vm.cashbackObj);
 	vm.cashbackObj.user_id = vm.stateParams.user_id;
 	commonService.commonApiCall(vm.cashbackObj,'user/add_cashback').then(function(response){
			
 		
 		vm.msg = response.data.message;
			},function (error)
			{
				console.log("error:",error);
			}
		);

 }

  vm.get_user_cashback_history = function get_user_cashback_history(){
 	vm.user_cashback_history = {};
 	commonService.commonApiCall(vm.stateParams,'user/get_user_cashback_history').then(function(response){
			
 		console.log("user list:",response);

 		vm.user_cashback_history = response.data.result;
			},function (error)
			{
				
			}
		);
 }

}]);