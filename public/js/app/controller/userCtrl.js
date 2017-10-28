angular.module("learn_and_explore").controller('userCtrl', ['$scope', 'commonService', '$state', '$rootScope','fileUpload','$timeout', function ($scope, commonService, $state, $rootScope,fileUpload,$timeout) {


console.log($rootScope.is_logged_in);

if($rootScope.is_logged_in == "false")
	window.location = site_url;

 var vm = $scope;
 vm.user_list = [];

 vm.userList  = userList;
 vm.get_my_profile = get_my_profile;
 vm.update_profile = update_profile;
 vm.update_bank_details = update_bank_details;
 vm.uploadFile = uploadFile;

function userList()
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

  function get_my_profile()
 {
 	vm.my_profile = {};
 	commonService.commonApiCall(vm.user,'user/my_profile/get_my_profile').then(function(response){
			
 		console.log("user list:",response);

 		vm.my_profile = response.data;
 		
			},function (error)
			{
				// if(error.ResponseCode==501)
				// {
					
				// 	//$rootScope.alert_error = error.Error.lineup;
				// }
				// else
				// {
					
				// 	//$rootScope.alert_error = error.GlobalError;
				// 	/*angular.forEach(error.Error, function(value, key) {
				//   		angular.element('#login_'+key+'_error').text(value).show();
				// 	});*/
				// }
			}
		);

 }

 function update_profile()
 {
 	var profile_data = {
 		first_name: vm.my_profile.first_name,
 		last_name:vm.my_profile.last_name
 	}
 	commonService.commonApiCall(profile_data,'user/my_profile/update_profile').then(function(response){
			
 		console.log("user list:",response);
 		$rootScope.addAlert('success',response.message);
 		vm.my_profile = response.data;

 		$timeout(function(){
 			vm.get_my_profile();
 		},200);
 		
			},function (error)
			{
				$rootScope.addAlert('',error.global_error);
			}
		);
 }

 function update_bank_details()
 {
 	var bank_data = {
 		account_holder_name: vm.my_profile.account_holder_name,
 		bank_name:vm.my_profile.bank_name,
 		branch_name:vm.my_profile.branch_name,
 		account_number:vm.my_profile.account_number,
 		ifsc_code:vm.my_profile.ifsc_code
 		
 	}
 	commonService.commonApiCall(bank_data,'user/my_profile/update_bank_details').then(function(response){
			
 		console.log("user list:",response);
 		$rootScope.addAlert('success',response.message);

 		vm.my_profile = response.data;
 		$timeout(function(){
 			vm.get_my_profile();
 		},200);
 		
			},function (error)
			{
				$rootScope.addAlert('',error.global_error);
			}
		);
 }

  function uploadFile()
  {
       var file = vm.myFile;
       
       console.log('file is ' );
       console.dir(file);
       
       var uploadUrl = "user/my_profile/upload_profile_image";
       fileUpload.uploadFileToUrl(file, uploadUrl)
         .success(function(response){

         	console.log('file_response:',response);
         	vm.my_profile.profile_image = response.data.image_url;

               })
            
               .error(function(){
               });
  };

}]);