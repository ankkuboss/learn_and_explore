angular.module("learn_and_explore").controller('storeOfferCtrl', ['$scope', 'commonService', '$state', '$rootScope', function ($scope, commonService, $state, $rootScope) {


console.log($rootScope.is_logged_in);

if($rootScope.is_logged_in == "false")
	window.location = site_url;

 var vm = $scope;
 vm.offer_list = [];

 vm.offerList = function()
 {
 	vm.offer = {};
 	commonService.commonApiCall(vm.offer,'store_offer/offer_list').then(function(response){
			
 		console.log("user list:",response);

 		vm.offer_list = response.data.offers;
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

}]);