var app = angular.module('learn_and_explore', [
		'ui.router',
		'oc.lazyLoad',
		'ngScrollbars'
	]);

app.config(['$stateProvider', '$locationProvider', '$httpProvider', '$urlRouterProvider', '$ocLazyLoadProvider', 'ScrollBarsProvider', function($stateProvider, $locationProvider, $httpProvider, $urlRouterProvider, $ocLazyLoadProvider, $ScrollBarsProvider) {

	$ocLazyLoadProvider.config({
		debug: false
		// global configs go here
	});

	$ScrollBarsProvider.defaults = {
        scrollButtons: {
            scrollAmount: 'auto', // scroll amount when button pressed
            enable: false // enable scrolling buttons by default
        },
        theme: 'dark',
        advanced:{
        	updateOnContentResize: true
    	},
    	autoHideScrollbar: true,
        scrollbarPosition: "inside",
        axis: 'yx' // enable 2 axis scrollbars by default
    };

	$urlRouterProvider.rule(function($injector, $location) {
		var path = $location.path();
		var hasTrailingSlash = path[path.length-1] === '/';

		if(hasTrailingSlash) {
			//if last charcter is a slash, return the same url without the slash  
			var newPath = path.substr(0, path.length - 1); 
			return newPath; 
		}
	}).otherwise(function($injector){
		$injector.invoke(['$state', function($state) {
			$state.go('404', {}, { location: false } );
		}]);
	});

	$stateProvider.state('404',{
		templateUrl: site_url+'template/_404',
		data: {pageTitle:'404'},
	})
	/*.state('/',{
		url:'/',
		templateUrl: site_url+'template/home-index',
		data: {pageTitle:'Home'},
		controller:'homeCtrl',
		resolve:{
			deps: ['$ocLazyLoad', function($ocLazyLoad) {
				return $ocLazyLoad.load([{
					insertBefore: '#ng_load_plugins_before',
					files: [
						'assets/js/lib/validate.min.js',
						'assets/js/app/controller/home.js'
					]
				},{
					insertBefore: '#ng_load_plugins_before',
					cache: false,
					files: ['utility/javascript_var/home.js']
				}]);
			}]
		},
		onEnter: function($state,$rootScope){
			if($rootScope.is_logged_in){
           		$state.go('league-summary');
        	}
		}
	})*/
	.state('admin',{
		url:'/',
		cache: true, //required
		templateUrl: site_url+'public/templates/auth/login.html',
		data: {pageTitle:'Admin Login', routename:'home',meta_desc:'home_meta_desc',lang:['auth.js']},
		controller:'LoginCtrl',
		resolve:{
			deps: ['$ocLazyLoad', function($ocLazyLoad) {
				return $ocLazyLoad.load([{
					insertBefore: '#load_plugins_before',
					files: [
						'public/js/app/controller/auth.js'
					]
				},{
					insertBefore: '#load_plugins_before',
					cache: false,
					files: ['template/javascript_var/auth.js'
						]
				}]);
			}]
		},
		onEnter: function($state,$rootScope){
			if($rootScope.is_logged_in){
           		//$state.go('league-summary');
        	}
		}
	})
	.state('users',{
		url:'/users',
		templateUrl: site_url+'public/templates/user/user.html',
		data: {pageTitle:'Users', routename:'users'},
		controller:'userCtrl',
		resolve:{
			deps: ['$ocLazyLoad', function($ocLazyLoad) {
				return $ocLazyLoad.load([{
					insertBefore: '#load_plugins_before',
					files: [
						'public/js/lib/validate.min.js',
						'public/js/app/controller/userCtrl.js'
					]
				}]);
			}]
		}
	})
	.state('user_details',{
		url:'/user_details/:user_id',
		templateUrl: site_url+'public/templates/user/user_details.html',
		data: {pageTitle:'Users', routename:'users'},
		controller:'userCtrl',
		resolve:{
			deps: ['$ocLazyLoad', function($ocLazyLoad) {
				return $ocLazyLoad.load([{
					insertBefore: '#load_plugins_before',
					files: [
						'public/js/lib/validate.min.js',
						'public/js/app/controller/userCtrl.js'
					]
				}]);
			}]
		}
	})
	.state('storeOffers',{
		url:'/store_offer',
		templateUrl:site_url+'public/templates/storeoffers/store_offers.html',
		data: {pageTitle:'Store Offers',routename:'storeoffers', lang:['storeoffers.js']},
		controller:'storeOfferCtrl',
		resolve:{
			deps: ['$ocLazyLoad', function($ocLazyLoad) {
				return $ocLazyLoad.load([{
					insertBefore: '#load_plugins_before',
					files: [
						'public/js/lib/validate.min.js',
						'public/js/app/controller/storeOffers.js'
					]
				},{
					insertBefore: '#load_plugins_before',
					cache: false,
					files: ['template/javascript_var/login.js']
				}]);
			}]
		},
		onEnter: function($state,$rootScope){
			
		}
	})
	.state('withdrawal_list',{
		url:'/withdrawal_list',
		templateUrl:site_url+'public/templates/withdrawal_list/withdrawal_list.html',
		data: {pageTitle:'Withdrawal list',routename:'withdrawal', lang:['withdrawal.js']},
		controller:'withdrawalCtrl',
		resolve:{
			deps: ['$ocLazyLoad', function($ocLazyLoad) {
				return $ocLazyLoad.load([{
					insertBefore: '#load_plugins_before',
					files: [
						'public/js/lib/validate.min.js',
						'public/js/app/controller/withdrawalCtrl.js'
					]
				},{
					insertBefore: '#load_plugins_before',
					cache: false,
					files: ['template/javascript_var/login.js']
				}]);
			}]
		},
		onEnter: function($state,$rootScope){
			
		}
	})
	.state('banners',{
		url:'/banners',
		templateUrl:site_url+'public/templates/banner/banner_list.html',
		data: {pageTitle:'Banner list',routename:'banner', lang:['banner.js']},
		controller:'bannerCtrl',
		resolve:{
			deps: ['$ocLazyLoad', function($ocLazyLoad) {
				return $ocLazyLoad.load([{
					insertBefore: '#load_plugins_before',
					files: [
						'public/js/lib/validate.min.js',
						'public/js/app/controller/bannerCtrl.js'
					]
				},{
					insertBefore: '#load_plugins_before',
					cache: false,
					files: ['template/javascript_var/login.js']
				}]);
			}]
		},
		onEnter: function($state,$rootScope){
			
		}
	})
	.state('signup',{
		url:'/signup',
		templateUrl:site_url+'template/auth/signup',
		data: {pageTitle:'Signup',routename:'signup', lang:['signup.js']},
		controller:'SignupCtrl',
		resolve:{
			deps: ['$ocLazyLoad', function($ocLazyLoad) {
				return $ocLazyLoad.load([{
					insertBefore: '#ng_load_plugins_before',
					files: [
						'assets/js/lib/validate.min.js',
						'assets/js/lib/select2.full.min.js',
						'assets/js/app/controller/auth.js'
					]
				},{
					insertBefore: '#ng_load_plugins_before',
					cache: false,
					files: ['utility/javascript_var/signup.js']
				}]);
			}]
		},
		onEnter: function($state,$rootScope){
			
		}
	})
	.state('forgotpassword',{
		url:'/forgotpassword',
		templateUrl:site_url+'template/auth/forgotpassword',
		data: {pageTitle:'Forgot Password', routename:'forgotpassword',lang:['forgot_password.js']},
		controller:'ForgotPasswordCtrl',
		resolve:{
			deps: ['$ocLazyLoad', function($ocLazyLoad) {
				return $ocLazyLoad.load([{
					insertBefore: '#ng_load_plugins_before',
					files: [
						'assets/js/lib/validate.min.js',
						'assets/js/app/controller/auth.js'
					]
				},{
					insertBefore: '#ng_load_plugins_before',
					cache: false,
					files: ['utility/javascript_var/forgot_password.js']
				}]);
			}]
		}
	})
	.state('forgotsuccess',{
		url:'/forgotsuccess',
		templateUrl:site_url+'template/auth/forgotsuccess',
		data: {pageTitle:'Forgot Success', routename:'forgotsuccess',lang:['forgot_password.js']},
		controller:'ForgotPasswordCtrl',
		resolve:{
			deps: ['$ocLazyLoad', function($ocLazyLoad) {
				return $ocLazyLoad.load([{
					insertBefore: '#ng_load_plugins_before',
					files: [
						'assets/js/lib/validate.min.js',
						'assets/js/app/controller/auth.js'
					]
				},{
					insertBefore: '#ng_load_plugins_before',
					cache: false,
					files: ['utility/javascript_var/forgot_password.js']
				}]);
			}]
		}
	})
	.state('resetpassowrd',{
		url:'/resetpassowrd',
		templateUrl:site_url+'template/auth/resetpassword',
		data: {pageTitle:'Reset Passowrd', routename:'resetpassowrd',lang:['resetpassowrd.js']},
		controller:'ResetPasswordCtrl',
		resolve:{
			deps: ['$ocLazyLoad', function($ocLazyLoad) {
				return $ocLazyLoad.load([{
					insertBefore: '#ng_load_plugins_before',
					files: [
						'assets/js/lib/validate.min.js',
						'assets/js/app/controller/auth.js'
					]
				},{
					insertBefore: '#ng_load_plugins_before',
					cache: false,
					files: ['utility/javascript_var/resetpassowrd.js']
				}]);
			}]
		}
	})
	.state('changepassowrd',{
		url:'/changepassowrd',
		templateUrl:site_url+'template/user/changepassowrd',
		data: {pageTitle:'Change Passowrd', routename:'changepassowrd',lang:['resetpassowrd.js']},
		controller:'ChangePasswordCtrl',
		resolve:{
			deps: ['$ocLazyLoad', function($ocLazyLoad) {
				return $ocLazyLoad.load([{
					insertBefore: '#ng_load_plugins_before',
					files: [
						'assets/js/lib/validate.min.js',
						'assets/js/app/controller/myprofile.js'
					]
				},{
					insertBefore: '#ng_load_plugins_before',
					cache: false,
					files: ['utility/javascript_var/resetpassowrd.js']
				}]);
			}]
		}
	})
	.state('settings',{
		url:'/settings',
		templateUrl:site_url+'template/user/myprofile',
		data: {pageTitle:'Settings', routename:'settings',meta_desc:'settings_meta_desc',lang:['settings.js']},
		controller:'myprofileCtrl',
		resolve:{
			deps: ['$ocLazyLoad', function($ocLazyLoad) {
				return $ocLazyLoad.load([{
					insertBefore: '#ng_load_plugins_before',
					files: [
						'assets/js/lib/validate.min.js',
						'assets/js/app/controller/myprofile.js'
					]
				},{
					insertBefore: '#ng_load_plugins_before',
					cache: false,
					files: ['utility/javascript_var/settings.js']
				}]);
			}]
		}
	});
	


$httpProvider.interceptors.push(['$q', '$location', '$rootScope', function($q, $location, $rootScope) {
		var web_language = localStorage.getItem('web_language');
		return {
			request: function(config) {
				
				/*************************** Loader Button Icon Remove *********************/				

				// use if using cashe
				if($rootScope.current_loader)
				{
					angular.element('.loader-overlay').show();
					angular.element('.loader').show();
				}
				//angular.element('.loader-overlay').show();
				//angular.element('.loader').show();
				/*******************************************************************/
				var key = sessionStorage.getItem(AUTH_KEY);
				//for app version
				config.headers['AppVersion'] = '1.0';
				config.headers['language'] = web_language;
				if(key == null)
				{
					if(localStorage.getItem(AUTH_KEY))
					{
						config.headers[AUTH_KEY] = localStorage.getItem(AUTH_KEY);
					}
					else
					{
						config.headers[AUTH_KEY] = '';	
					}
				}
				else 
				{
					config.headers[AUTH_KEY] = key;
				}
				return config;
			},

			response: function(response) {
				/*************************** Loader Button Icon Remove *********************/
				angular.element('.loader-overlay').hide();
				angular.element('.loader').hide();
				/*******************************************************************/
				return response || $q.state(response);
			},

			responseError: function(rejection) {
				angular.element($rootScope.current_loader).removeClass('disabled');
				angular.element($rootScope.current_loader).removeClass('loading');
				$rootScope.current_loader = "";

				angular.element('.loader-overlay').hide();
				angular.element('.loader').hide();

				if(rejection.status == 401)
				{
					$rootScope.is_logged_in = false;
					sessionStorage.clear();
					localStorage.clear();
					localStorage.setItem('next_url', window.location.href );
					//localStorage.setItem('next_url', $rootScope.$state.current.name );
					// window.location.href = site_url+'lobby';
					window.location.href = site_url;
					// $rootScope.$state.go('login');
				}
				return $q.reject(rejection);
			}
		};
	}]);

	$httpProvider.defaults.headers.common["X-Requested-With"] = 'XMLHttpRequest';
	$locationProvider.html5Mode(true);
}]);

app.run(['$rootScope', '$location', '$state','$timeout','commonService', function ($rootScope, $location, $state, $timeout,commonService) {
	$rootScope.alert_success='';
	$rootScope.alert_warning='';
	$rootScope.alert_error='';
	$rootScope.lang = SERVER_GLOBAL;
	console.log("lang:",$rootScope.lang);
	$rootScope.salary_cap_unit = DEFAULT_SALARY_UNIT;
	$rootScope.is_logged_in = sessionStorage.getItem('is_logged_in');
	$rootScope.SignupFormObj = {};
	$rootScope.metaDesc  = '';

	$rootScope.get_master_league = localStorage.getItem('get_master_league_'+LANG_ABBR);
	$rootScope.my_leagues = localStorage.getItem('my_leagues_'+LANG_ABBR);
	
	$rootScope.notSorted = function(obj){
		if (!obj) {
			return [];
		}
		return Object.keys(obj);
	};
	
	$rootScope.$on('$stateChangeStart', function() {
		angular.element('body').removeClass('open-menu');
		angular.element('.side-menu').removeClass('open');
		angular.element('.dropdown').removeClass('open');
		$rootScope.pageTitle  = '';
		$rootScope.metaDesc  = '';
		
		

    });

  	// detect mobile device
  	$rootScope.detectmob = function()
  	{
  		if( navigator.userAgent.match(/Android/i)
                 || navigator.userAgent.match(/webOS/i)
                 || navigator.userAgent.match(/iPhone/i)
                 || navigator.userAgent.match(/iPad/i)
                 || navigator.userAgent.match(/iPod/i)
                 || navigator.userAgent.match(/BlackBerry/i)
                 || navigator.userAgent.match(/Windows Phone/i)
                 ){
                    return true;
                  }
                 else {
                    return false;
                  }
  	};

  	$rootScope.to_Number = function(date)
	{
	   return Number(date);
	}

	 $rootScope.alerts = [
   ];

  $rootScope.addAlert = function(type,msg) {

  	if(!type || type =="")
  	{
  		type= "danger";
  	}
    $rootScope.alerts.push({type:type,msg: msg});
    $timeout(
    	function(){
    		$rootScope.closeAlert($rootScope.alerts.length-1);
    	},2000);
  };

  $rootScope.closeAlert = function(index) {
    $rootScope.alerts.splice(index, 1);
  };

   $scope.menu_states = {};
    $scope.menu_states.activeItem = 'users_li';
    $scope.menu_items = [{
        id: 'users_li',
        title: 'Users',
        state:"users"
    }, {
        id: 'store_offers_li',
        title: 'Store Offers',
        state:'storeOffers'
    }, {
        id: 'banners_li',
        title: 'Banners',
        state:'banners'
    }];


}]);