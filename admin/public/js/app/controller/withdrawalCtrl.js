angular.module("learn_and_explore").controller('withdrawalCtrl', ['$scope', 'commonService', '$state', '$rootScope', function ($scope, commonService, $state, $rootScope) {


console.log($rootScope.is_logged_in);

if($rootScope.is_logged_in == "false")
	window.location = site_url;

 var vm = $scope;
 vm.withdrawal_list = [];

vm.get_withdrawal_list =get_withdrawal_list;


 function get_withdrawal_list()
 {
 	vm.req = {};
 	commonService.commonApiCall(vm.req,'user/get_withdrawal_list').then(function(response){
			
 		vm.withdrawal_list = response.data.withdrawal_list;
			},function (error)
			{
				
			}
		);

 }

}]);