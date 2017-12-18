angular.module("learn_and_explore").controller('LoginCtrl',LoginCtrl);

LoginCtrl.$inject=  ['$scope', 'commonService', '$state', '$rootScope'];

function LoginCtrl($scope, commonService, $state, $rootScope) {
	$scope.LoginFormObj				= {};
	$scope.LoginFormObj.email		= '';
	$scope.LoginFormObj.password	= '';
	$scope.LoginFormObj.checkbox	= false;
	$scope.LoginFormObj.social_type	= '';
	$scope.LoginFormObj.social_id	= 0;

	console.log('lang1:',$rootScope.lang);
	// For getting twitter data 
	$rootScope.twitter_user_data	= {};	

	$rootScope.$watch("twitter_user_data", function(newValue, oldValue) 
	{
		if(newValue.status)
		{
			$scope.TWLogin(newValue);		
		}
	});
	
	var vm  = $scope;
	vm.doLogin = function() 
	{
		console.log("user:",vm.user);
		
		commonService.commonApiCall(vm.user,'auth/login').then(function(response){
			sessionStorage.setItem(AUTH_KEY,response.data[AUTH_KEY]);

			sessionStorage.setItem('is_logged_in',true);
			$rootScope.userLogin = true;
			$rootScope.is_logged_in = true;
			$rootScope.userName = response.data;			
			localStorage.clear();
			localStorage.setItem(AUTH_KEY,response.data[AUTH_KEY]);
			var next_url = 'users';
			$state.go(next_url);
			window.location = next_url;

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

	};


}


angular.module("learn_and_explore").controller('ForgotPasswordCtrl',ForgotPasswordCtrl);

ForgotPasswordCtrl.$inject =  ['$scope','$state', 'commonService', '$rootScope','$timeout'];

function ForgotPasswordCtrl($scope, $state, commonService, $rootScope,$timeout) {
	$scope.ForgotFormObj       = {};
	$scope.ForgotFormObj.email = '';	
	$rootScope.forgot_email = '';
	$scope.doForgotPassword = function() 
	{
		$rootScope.current_loader = "#forgot_button";
		var post_data = {email: $scope.ForgotFormObj.email};
		commonService.commonApiCall(post_data,'auth/forgot_password').then(function(response){
					if (response.ResponseCode == 200)
					{
						$rootScope.forgot_email = $scope.ForgotFormObj.email;
						$scope.ForgotFormObj.email = "";
						$rootScope.alert_success = response.Message;
						$timeout(function(){
							$state.go('forgotsuccess');
						},1000);
					}				
				},
				function (error)
				{
					angular.element('#forgot_email_error').text(error.Message).show();
				}
			);
	};
}

angular.module("learn_and_explore").controller('ResetPasswordCtrl',ResetPasswordCtrl );

ResetPasswordCtrl.$inject = ['$scope', '$rootScope', 'dataSavingHttp', '$stateParams', '$timeout','$state'];

 function ResetPasswordCtrl($scope, $rootScope, dataSavingHttp, $stateParams,$timeout,$state) {
	
	$scope.ResetPasswordFormObj					= {};
	$scope.ResetPasswordFormObj.reset_code		= '';
	$scope.ResetPasswordFormObj.password		= '';
	$scope.ResetPasswordFormObj.conf_password	= '';

	$scope.doResetPassword = function() {
		var resetPass = $scope.ResetPasswordFormObj.password;
		$rootScope.current_loader = "#reset_pwd_loader";
		var post_data = {
				"reset_code" :  $scope.ResetPasswordFormObj.reset_code,
				"password" : 	resetPass,
				"confirm_password" : $scope.ResetPasswordFormObj.conf_password,
			};
		dataSavingHttp({
			url: site_url+"auth/reset_password",
			data : post_data,
		}).success(function (response) {
			if(response.ResponseCode == 200){				
				$rootScope.alert_success = response.Message;
				$timeout(function() {
					$state.go('login');
				},2000);
			}
		}).error(function (error) {
			if(error.ResponseCode == 500){
				
				$rootScope.alert_error = error.GlobalError;	
			}
		});
	};
}



