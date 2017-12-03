angular.module("learn_and_explore").controller('LoginCtrl', ['$scope', 'commonService', '$state', '$rootScope','$window', function ($scope, commonService, $state, $rootScope,$window) {
	
	
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

	$rootScope.error_msg = "";
	vm.user_data = {};
	vm.commonService = commonService;
	


	vm.user_login = function() 
	{
		console.log("user:",vm.LoginObj);
		
		commonService.commonApiCall(vm.LoginObj,'auth/login').then(function(response){
			sessionStorage.setItem(AUTH_KEY,response.data[AUTH_KEY]);

			sessionStorage.setItem('is_logged_in',true);
			localStorage.setItem(AUTH_KEY,response.data[AUTH_KEY]);
			//$rootScope.userLogin = true;
			//$rootScope.is_logged_in = true;
			vm.user_data = response.data;
			vm.commonService.set_current_user(response.data);	
			var next_url = 'users';
			//$state.go(next_url);
			angular.element("#signinModal").modal("hide");
			window.location.reload();

			},function (error)
			{
				$rootScope.addAlert('',error.global_error);
			}
		);

	};

	
	//Facebook Login
	$scope.FbLogin = function(){
		// facebookService.FbLoginStatusCheck().then(function(response){
		// 	$scope.FbUserData(response);
		// }, function(error){

		// });
	}

	//Facebook Login aditional function
	$scope.FbUserData = function(user_data){
		var post_data = {
				"first_name"  : user_data.first_name,
				"last_name"	  : user_data.last_name,
				"email"       : user_data.email, 
				"password"    : '',
				"device_id"   : '0',
				"device_type" : '1',
				"remember_me" : $scope.LoginFormObj.checkbox,
				"social_type" : 'facebook',
				"social_id"   : user_data.id,
				"page"   	  : 'login',
				"image"		  : user_data.picture.large,
			};
		$scope.doLogin(post_data);
	};

	//Twitter Login
	$scope.TWLogin= function(data)
	{
		if(data.status == true)
		{
			var post_data = {
					"first_name"	: data.name,
					"username"		: data.screen_name,
					"device_id"		: '0',
					"device_type"	: '1',
					"social_type"	: 'twitter',
					"social_id"		: data.id,
					"image"			: data.profile_pic,
				};
			$scope.doLogin(post_data);
		} else {
			$rootScope.alert_error = data.message;
		}
	};

	

}]);


angular.module("learn_and_explore").controller('SignupCtrl', ['$scope','$state','commonService', '$rootScope', '$timeout',function ($scope, $state, commonService, $rootScope, $timeout ) {
	

	// sign up proccess
	// For getting twitter data 


	$scope.signup = function() {
		 
		//$rootScope.current_loader = "#signup_button";
		
		var post_data = $scope.userObj;
			commonService.commonApiCall(post_data,'auth/signup').then(function(response){
					if (response.response_code == 200)
					{
						sessionStorage.setItem(AUTH_KEY,response.data[AUTH_KEY]);
						sessionStorage.setItem('is_logged_in',true);
						$rootScope.userLogin = true;
						$rootScope.is_logged_in = true;

						$rootScope.addAlert('success',response.message);
						angular.element("#signupModal").modal("hide");
						$rootScope.userObj = {};
						$timeout(function(){
							
						},1000);
					}					
				},
				function (error)
				{
					angular.forEach(error.error, function(value, key) {						
						angular.element('#signup_'+key+'_error').text(value).show();						
					});
					
					$rootScope.alert_error = error.global_error;
				}
			);
	};

	$scope.FbLogin = function() {
		// facebookService.FbLoginStatusCheck().then(function(response){			
		// 	$scope.FbUserData(response);
		// }, function(error){

		// });
	}
	

	//Facebook Login aditional function
	$scope.FbUserData = function(user_data){
		var post_data = {
				"first_name"		: user_data.first_name,
				"last_name"			: user_data.last_name,
				"email"				: user_data.email,
				"device_id"			: '0',
				"device_type"		: '1',
				"social_type"		: 'facebook',
				"social_id"			: user_data.id,
				"page"				: 'signup',
				"image"				: user_data.picture.large,
				"lineup"			: $rootScope.SignupFormObj.lineup,	
				"country"			: $rootScope.SignupFormObj.country,	
				"favourite_club"	: $rootScope.SignupFormObj.favourite_club,
				"league_id"			: $rootScope.SignupFormObj.league_id,
				"game_unique_id"	: $rootScope.SignupFormObj.game_unique_id,
				"team_name"			: $rootScope.SignupFormObj.team_name,
			};
		$scope.dosocialSignup(post_data);
	};

	//Twitter Login
	$scope.TWLogin= function(data){
		if(data.status == true){
			var post_data = {
					"first_name"		: data.name,
					"username"			: data.screen_name,
					"device_id"			: '0',
					"device_type"		: '1',
					"social_type"		: 'twitter',
					"social_id"			: data.id,
					"image"				: data.profile_pic,
					"lineup"			: $rootScope.SignupFormObj.lineup,	
					"country"			: $rootScope.SignupFormObj.country,	
					"favourite_club"	: $rootScope.SignupFormObj.favourite_club,
					"league_id"			: $rootScope.SignupFormObj.league_id,
					"game_unique_id"	: $rootScope.SignupFormObj.game_unique_id,
					"team_name"			: $rootScope.SignupFormObj.team_name,
				};
			$scope.dosocialSignup(post_data);
		} else {
			$rootScope.alert_error = data.message;
		}
	};
		
	$scope.dosocialSignup = function(post_data) {
		$rootScope.current_loader = "#signup_loader";
		commonService.commonApiCall(post_data,'auth/login_signup').then(function(response){
				if (response.ResponseCode == 200)
					{
						sessionStorage.setItem(AUTH_KEY,response.Data[AUTH_KEY]);
						sessionStorage.setItem('is_logged_in',true);
						$rootScope.userLogin = true;
						$rootScope.is_logged_in = true;
						
						if(response.Data.redirect_url)
						{
							$state.go(response.Data.redirect_url);
						}
						else
						{
							$state.go('league-summary');
						}
					}
				},
				function (error){
					if(error.ResponseCode==501)
					{
						
						$rootScope.alert_error = error.Error.lineup;
					}
					else
					{
						angular.forEach(error.Error, function(value, key) {
					  		angular.element('#'+key+'_error').text(value).show();
						});
					}
				}
			);		
	};	


	
}]);

angular.module("learn_and_explore").controller('ForgotPasswordCtrl', ['$scope','$state', 'commonService', '$rootScope','$timeout', function ($scope, $state, commonService, $rootScope,$timeout) {
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
}]);

angular.module("learn_and_explore").controller('ResetPasswordCtrl', ['$scope', '$rootScope', 'dataSavingHttp', '$stateParams', '$timeout','$state', function ($scope, $rootScope, dataSavingHttp, $stateParams,$timeout,$state) {
	
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
}]);



