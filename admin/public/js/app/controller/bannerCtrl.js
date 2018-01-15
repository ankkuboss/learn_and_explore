angular.module("learn_and_explore").controller('bannerCtrl', ['$scope', 'commonService', '$state', '$rootScope','fileUpload', bannerCtrl]);

function bannerCtrl($scope, commonService, $state, $rootScope,fileUpload) {


	console.log($rootScope.is_logged_in);

	if($rootScope.is_logged_in == "false")
		window.location = site_url;

		var vm              = $scope;
		vm.banner_list      = [];
		vm.bannerObj        = {};
		vm.uploadBannerFile = uploadBannerFile;
		vm.bannerList       = bannerList;
		vm.add_banner       = add_banner;


		
		angular.element("#add_banner_modal").on('hidden.bs.modal', function () {
    // do something…
    console.log('modal close');
    vm.bannerObj        = {};
})

	 function bannerList()
	 {
	 	vm.banner = {};
	 	commonService.commonApiCall(vm.banner,'banner/banner_list').then(function(response){
				
	 		console.log("banner list:",response);

	 		vm.banner_list = response.data.banners;
				},function (error)
				{
					
				}
			);

	 }

	function uploadBannerFile()
  	{
       var file = vm.myFile;
       
       console.log('file is ' );
       console.dir(file);
       
       var uploadUrl = "banner/upload_banner_image";
       fileUpload.uploadFileToUrl(file, uploadUrl)
         .success(function(response){

         	vm.bannerObj.image= response.data.image_url;
         	console.log('file_response:',response);
         	vm.myFile = "";
         	
               })
            
               .error(function(){
               	vm.bannerObj.image="";
               });
  };

   function add_banner()
   {
		commonService.commonApiCall(vm.bannerObj,'banner/add_banner').then(function(response){
			
 		console.log("add banner reponse:",response.message);
 		$rootScope.addAlert('success',response.message);
 		angular.element("#add_banner_modal").modal("hide");
 		vm.bannerObj = {};
			},function (error)
			{
				$rootScope.addAlert('',error.global_error);
			}
		);   		
   }

}