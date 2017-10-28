'use strict';
var app = angular.module('learn_and_explore');

app.controller('CommonCtrl', ['$scope', '$location', '$rootScope', '$state','showServerError', 'commonService','$templateCache', '$cacheFactory','$window',function($scope, $location, $rootScope, $state,showServerError,commonService, $templateCache, $cacheFactory,$window){

	var vm = $scope;
	vm.commonService = commonService;
    $rootScope.is_logged_in =vm.commonService.check_login();

    vm.states  = ["india","america","naijeria"];
    //function mapping
	vm.closeAlert              = closeAlert;	 
	vm.get_store_offers        = get_store_offers;
	vm.get_store_list          = get_store_list;
	vm.logout                  = logout;
	vm.get_random_store_offers = get_random_store_offers;
	vm.searchStore             = searchStore;
	vm.goToStore               = goToStore;
	vm.get_banner_list         = get_banner_list;

	vm.stores = [];
	vm.banner_list = [];

    function closeAlert()
	{
		$rootScope.error_msg = "";
	}
	if($rootScope.is_logged_in)
	{
		vm.user_data = vm.commonService.get_current_user();
	}
	

	$scope.myInterval = 3000;
  $scope.slides = [
    {
      image: 'http://lorempixel.com/400/200/'
    },
    {
      image: 'http://lorempixel.com/400/200/food'
    },
    {
      image: 'http://lorempixel.com/400/200/sports'
    },
    {
      image: 'http://lorempixel.com/400/200/people'
    }
  ];

  vm.store_offers= [];
  vm.store_list= [];

  vm.storePara= {};
  vm.storePara.offset = 0;
  vm.storePara.limit = 40;

function get_store_offers()
{
  	commonService.commonApiCall(vm.storePara,'store_offer/get_store_offers').then(function(response){
			
			//vm.store_offers.concat(response.data.result);	
			Array.prototype.push.apply(vm.store_offers, response.data.result);		
			vm.storePara.offset  = response.data.next_offset

			},function (error)
			{

			}
		);
  }


  	vm.banner_image_path = "";
  	function get_banner_list()
	{
  		commonService.commonApiCall({},'store_offer/get_banner_list').then(function(response){
			
			//Array.prototype.push.apply(vm.store_offers, response.data.result);		
			vm.banner_list  = response.data.banners;
			vm.banner_path = response.data.banner_path;
			},function (error)
			{

			}
		);
  }


  function get_random_store_offers()
{

  	commonService.commonApiCall({
  		limit:5,
  		sort_field:"rand()"
  	},'store_offer/get_store_offers').then(function(response){
			
			//vm.store_offers.concat(response.data.result);	
			vm.slides =response.data.result;		
			
			},function (error)
			{

			}
		);
  }



    function get_store_list(){
  	commonService.commonApiCall({},'store_offer/get_store_list').then(function(response){
			

			
			vm.store_list = response.data;			
			

			},function (error)
			{
				if(error.response_code==501)
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

  function searchStore(str)
  {
  	console.log("str:",str);

  	commonService.commonApiCall({q:str},'store_offer/get_store_list').then(function(response){
		
			vm.stores = response.data;			
			

			},function (error)
			{
				if(error.response_code==501)
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

  function goToStore(item, model, label, event)
  {
  	console.log("goto store called.",item,model,label,event);
  	$state.go("storeDetails",{store_id:item.store_id});
  }

	function logout(){
		sessionStorage.setItem('is_logged_in',false);
		//localStorage.setItem('is_logged_in',false);
			//$rootScope.userLogin = false;
			//$rootScope.is_logged_in = false;
			$rootScope.userName = "";			
			localStorage.clear();
			
			commonService.commonApiCall({},'user/my_profile/logout').then(function(response){
				window.location = site_url;
			},function (error)
			{
				
			}
		);

			//$state.go(next_url);
			

	}

	angular.element($window).bind("scroll", function() {
    var windowHeight = "innerHeight" in window ? window.innerHeight : document.documentElement.offsetHeight;
    var body = document.body, html = document.documentElement;
    var docHeight = Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight,  html.scrollHeight, html.offsetHeight);
    var windowBottom = windowHeight + window.pageYOffset;
    if (windowBottom >= docHeight) {
        vm.get_store_offers();
    }
});

}]);
