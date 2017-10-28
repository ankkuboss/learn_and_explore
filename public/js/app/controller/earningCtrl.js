angular.module("learn_and_explore").controller('earningCtrl', ['$scope', 'commonService', '$state', '$rootScope', function ($scope, commonService, $state, $rootScope) {


console.log($rootScope.is_logged_in);

if($rootScope.is_logged_in == "false")
	window.location = site_url;

var vm = $scope;
vm.get_my_earnings = get_my_earnings;
vm.make_withdrawal =  make_withdrawal;

function get_my_earnings()
 {
 	vm.my_earnings = {};
 	vm.my_withdrawal_list = {};
 	commonService.commonApiCall({},'user/my_profile/get_my_earnings').then(function(response){
			
 		console.log("user earning:",response);

 		vm.my_earnings = response.data.earning;
 		vm.my_withdrawal_list = response.data.withdrawal_list;
			},
			function (error)
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

  vm.withdrawalObj = {};
 function make_withdrawal()
 {
 	console.log("cash:",vm.withdrawalObj);
 	commonService.commonApiCall(vm.withdrawalObj,'user/my_profile/make_withdrawal').then(function(response){
			
 		
 		vm.msg = response.data.message;

			},function (error)
			{
				console.log("error:",error);
			}
		);

 }


}]);