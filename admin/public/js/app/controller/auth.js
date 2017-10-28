angular.module("learn_and_explore").controller('LoginCtrl', ['$scope', 'commonService', '$state', '$rootScope', function ($scope, commonService, $state, $rootScope) {
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

	
	//Facebook Login
	$scope.FbLogin = function(){
		facebookService.FbLoginStatusCheck().then(function(response){
			$scope.FbUserData(response);
		}, function(error){

		});
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

angular.module("learn_and_explore").controller('LineupCtrl', ['$scope','$state','commonService', '$rootScope', '$timeout',function ($scope, $state, commonService, $rootScope, $timeout) {
	
	$scope.countryList = [];
	$scope.clubList = [];

	$scope.rosterList = [];
	$scope.filterKey = {};
	$scope.lineupParam = {}

	// sign up post object
	$rootScope.SignupFormObj				= {};
	$rootScope.SignupFormObj.email			= '';	
	$rootScope.SignupFormObj.password		= '';
	$rootScope.SignupFormObj.social_type	= '';
	$rootScope.SignupFormObj.social_id		= 0;
	$rootScope.SignupFormObj.device_type	= 1;
	$rootScope.SignupFormObj.device_id		= 0;
	
	$rootScope.SignupFormObj.lineup			= [];
	$rootScope.SignupFormObj.team_name 		= '';
	$rootScope.SignupFormObj.country 		= '';
	$rootScope.SignupFormObj.favourite_club	= '';
	$rootScope.SignupFormObj.salary_cap		= DEFAULT_SALARY_CAP;

	// roster object
	$scope.rosterParam = {}; 
	$scope.rosterParam.offset = 0;
	$scope.rosterParam.price_sort = "DESC";
	$scope.rosterParam.filter_key = 'minutesPlayed';
	$scope.rosterParam.position = '';
	$scope.rosterParam.search = '';
	$scope.is_load_more = true;

	$scope.deadlineDate = ''; 
	$scope.lineup = [];
	$scope.isloading          = false;

	if($rootScope.is_logged_in)
	{
		$rootScope.user_league_id			= localStorage.getItem('user_league_id');
		$rootScope.user_game_unique_id		= localStorage.getItem('user_game_unique_id');
		$rootScope.SignupFormObj.league_id	= localStorage.getItem('user_league_id');
		$scope.rosterParam.league_id		= localStorage.getItem('user_league_id');
	}
	else if(!$rootScope.is_logged_in && localStorage.getItem('non_login_user_league_id')!=null)
	{
		$rootScope.user_league_id			= localStorage.getItem('non_login_user_league_id');
		$rootScope.user_game_unique_id		= localStorage.getItem('non_login_user_game_unique_id');
		$rootScope.SignupFormObj.league_id	= localStorage.getItem('non_login_user_league_id');		
		$scope.rosterParam.league_id		= localStorage.getItem('non_login_user_league_id');
	}
	else if(!$rootScope.is_logged_in && localStorage.getItem('non_login_user_league_id')==null)
	{
		localStorage.setItem('non_login_user_league_id',1);
		localStorage.setItem('non_login_user_game_unique_id','pOeAMIiqk');
		$rootScope.user_league_id			= localStorage.getItem('non_login_user_league_id');
		$rootScope.user_game_unique_id		= localStorage.getItem('non_login_user_game_unique_id');
		$rootScope.SignupFormObj.league_id	= localStorage.getItem('non_login_user_league_id');		
		$scope.rosterParam.league_id		= localStorage.getItem('non_login_user_league_id');
	}


	$scope.loadSignUPData = function()
	{
		if(!$rootScope.is_logged_in){ $scope.getMasterCountry();}
		$scope.getMasterData();
		$timeout(function(){
			$scope.getRoster();
		},200)
	}

	$scope.getMasterData = function()
	{
		var get_lineup_master_data = localStorage.getItem('get_lineup_master_data_'+LANG_ABBR+'_'+$rootScope.user_league_id);
		
		if(get_lineup_master_data)
		{
			var get_lineup_master_data = JSON.parse(get_lineup_master_data);
			$scope.deadlineDate = get_lineup_master_data.deadline_date;
			$scope.lineup = get_lineup_master_data.lineup;	
		}
		else
		{
			commonService.commonApiCall({league_id:$scope.rosterParam.league_id},'common/get_lineup_master_data').then(function(response){
				$scope.deadlineDate = response.Data.deadline_date;
				$scope.lineup = response.Data.lineup;
				localStorage.setItem('get_lineup_master_data_'+LANG_ABBR+'_'+$rootScope.user_league_id,JSON.stringify(response.Data));
			},function (error){});
		}
	}
	
	// for using non login and login view 
	if($rootScope.is_logged_in)
	{
		$scope.masterLeagueList = [];
	}
	$scope.getmyLeague = function()
	{
		commonService.commonApiCall({league_id:$scope.rosterParam.league_id},'league_summary/my_leagues').then(function(response){
				$scope.masterLeagueList = response.Data
		},function (error){});
	}
	
	$scope.changeLeague = function(league)
	{
		if(league.is_joined>0)
		{
			$timeout(function(){
				$state.go('league-summary');
			},100)
		}
		$scope.ResetLineup();
		$scope.rosterList = [];
		$scope.clubList = [];
		if($rootScope.is_logged_in)
		{
			$rootScope.user_league_id = league.league_id;
			$rootScope.user_game_unique_id = league.game_unique_id;
			localStorage.setItem('user_league_id',league.league_id);
			localStorage.setItem('user_game_unique_id',league.game_unique_id);
		}
		else if(!$rootScope.is_logged_in)
		{
			$rootScope.user_league_id			= league.league_id;
			$rootScope.user_game_unique_id		= league.game_unique_id
			localStorage.setItem('non_login_user_league_id',league.league_id);
			localStorage.setItem('non_login_user_game_unique_id',league.game_unique_id);
		}
		$scope.rosterParam.league_id = league.league_id;
		$scope.SignupFormObj.league_id = league.league_id;
		$scope.SignupFormObj.game_unique_id = league.game_unique_id;
		$scope.rosterParam.offset = 0;
		$scope.getMasterData();
		if($rootScope.user_league_id)
		{
			$scope.getRoster();
		}
	}

	var checkCountryArray = ['AE','SA','QA','LB','JO','EG'];

	$scope.getMasterCountry = function()
	{
		var allCountry = [];
		var get_master_country = localStorage.getItem('get_master_country_'+LANG_ABBR);
		if(get_master_country)
		{
			//$scope.countryList = JSON.parse(get_master_country);
			allCountry = JSON.parse(get_master_country);
			angular.forEach(allCountry,function(value,key){
				var countryCheck = checkCountryArray.indexOf(value.abbr);
				var test = allCountry.indexOf(allCountry[countryCheck]);
				if(countryCheck!=-1)
				{
					$scope.countryList[countryCheck] = value;
				}
				else
				{
					$scope.countryList = $scope.countryList.concat(value);
				}
			})
		}
		else
		{
			commonService.commonApiCall({},'common/get_master_country').then(function(response){
				//$scope.countryList = response.Data.countries;
				allCountry = response.Data.countries;
				angular.forEach(allCountry,function(value,key){
					var countryCheck = checkCountryArray.indexOf(value.abbr);
					var test = allCountry.indexOf(allCountry[countryCheck]);
					if(countryCheck!=-1)
					{
						$scope.countryList[countryCheck] = value;
					}
					else
					{
						$scope.countryList = $scope.countryList.concat(value);
					}
				})
				localStorage.setItem('get_master_country_'+LANG_ABBR,JSON.stringify(response.Data.countries));
			},function (error){});
		}

	}

	$scope.getRoster = function()
	{
		if(!$scope.is_load_more || $scope.isloading)return;
		$scope.isloading = true;
		commonService.commonApiCall($scope.rosterParam,'league_summary/get_player_stats').then(function(response){
			$scope.rosterList			= $scope.rosterList.concat(response.Data.player_list);
			$scope.clubList				= response.Data.team;
			$scope.filterKey			= response.Data.filter_key;
			$scope.rosterParam.offset	= response.Data.next_offset;
			$scope.is_load_more			= response.Data.is_load_more;
			$scope.isloading = false;
		},function (error){
			$scope.isloading = false;
		});
	}

	$scope.shortByClub = function()
	{
		$scope.rosterList = [];
		$scope.rosterParam.offset = 0;
		$scope.is_load_more = true;
		$scope.getRoster();
	}

	$scope.shortByPosition = function(val)
	{
		$scope.rosterList = [];
		$scope.rosterParam.offset = 0;
		$scope.is_load_more = true;
		$scope.rosterParam.position = val;
		$scope.getRoster();
	}

	$scope.shortByFilter = function()
	{
		$scope.rosterList = [];
		$scope.rosterParam.offset = 0;
		$scope.is_load_more = true;
		$scope.getRoster();
	}

	$scope.searchByName = function()
	{
		$scope.rosterList = [];
		$scope.rosterParam.offset = 0;
		$scope.is_load_more = true;
		$scope.getRoster();
	}

	$scope.sortByPrice = function(sort)
	{
		$scope.rosterList = [];
		$scope.rosterParam.offset = 0;
		$scope.is_load_more = true;
		$scope.rosterParam.price_sort = 'DESC';
		if(sort=='DESC')
		{
			$scope.rosterParam.price_sort = 'ASC';
		}
		$scope.is_load_more = true;
		$scope.getRoster();
	}

	$scope.filterRoster = function(val)
	{
		$scope.rosterList = [];
		$scope.rosterParam.offset = 0;
		$scope.is_load_more = true;
		$scope.rosterParam.position = val;
		$scope.getRoster();
		if (screen.width < 992) 
		{
        	$('body').toggleClass('model-show');
        }
	}
	$scope.resetRoster = function()
	{
		$scope.rosterList = [];
		$scope.rosterParam.search = '';
		$scope.rosterParam.offset = 0;
		$scope.is_load_more = true;
		$scope.rosterParam.position = '';
		$scope.getRoster();

	}

	$scope.maxPositions = {GK:2, DF:5, MD:5, FW:3};
	$scope.added_positions = {GK:0, DF:0, MD:0, FW:0};
	$scope.totalLineupTeamCount = [];
	$scope.selectedPlayerUniqueID = [];

	$scope.proccessLineup = function(player)
	{
		if(Number($rootScope.SignupFormObj.salary_cap) < Number(player.salary))
		{
			
			$rootScope.alert_error = $rootScope.lang.SALARY_NOT_ENOUGH;	
			return false;
		}
		else if($scope.totalLineupTeamCount[player.team_id]!=undefined && $scope.totalLineupTeamCount[player.team_id] == 3)
		{
			
			$rootScope.alert_error = $rootScope.lang.TEAM_ERROR;
			return false;
		}
		else
		{
			$scope.AddPlayer(player);
		}
	}

	$scope.AddPlayer = function(player)
	{
		for (var i = 0; i < $scope.lineup.length; i++) 
		{
			var element = $scope.lineup[i];
			var allowed_positions_arr = element.allowed_positions.split(',');
			var added = $scope.lineup[i].player.length;
			if(allowed_positions_arr.indexOf(player.position)!==-1 && added===0)
			{
				if($scope.selectedPlayerUniqueID.indexOf(player.player_unique_id)==-1)
				{
					player.index = i;
					$scope.lineup[i].player = player;
					$scope.selectedPlayerUniqueID.push(player.player_unique_id);
					//$scope.addedAllPositions[player.position]++
					$scope.added_positions[player.position]++;
					// salary
					$rootScope.SignupFormObj.salary_cap = Number($rootScope.SignupFormObj.salary_cap) - Number(player.salary);
					$rootScope.SignupFormObj.salary_cap = $rootScope.SignupFormObj.salary_cap.toFixed(1);
					
					var team = player.team_id;
					if($scope.totalLineupTeamCount[team] !== undefined)
					{
						$scope.totalLineupTeamCount[team]++;
					}
					else
					{
						$scope.totalLineupTeamCount[team] = 1;
					}
					break;
				}
				else
				{
					
					$rootScope.alert_error = $rootScope.lang.PLAYER_ALREADY_ADDED;
				}
				break;
			}
		}
	}

	$scope.removePlayer = function(userlineup)
	{
		var index  = userlineup.index;
		var player = userlineup.player;

		var selectedPlayerindex = $scope.selectedPlayerUniqueID.indexOf(player.player_unique_id);
		$scope.selectedPlayerUniqueID.splice(selectedPlayerindex,1);

		// salary
		$rootScope.SignupFormObj.salary_cap = Number($rootScope.SignupFormObj.salary_cap) + Number(player.salary);
		$rootScope.SignupFormObj.salary_cap = $rootScope.SignupFormObj.salary_cap.toFixed(1);

		$scope.lineup[index].player = [];
		var team = player.team_id;
		$scope.totalLineupTeamCount[team]--;
		$scope.added_positions[player.position]--;
		if(player.position!=$scope.rosterParam.position)
		{
			$scope.shortByPosition(player.position);
		}
	}

	$scope.signNextStep = function()
	{

		if($scope.selectedPlayerUniqueID.length!=15)
		{
			
			$rootScope.alert_error = $rootScope.lang.LINEUP_FILL_ERROR;
			return false;
		}
		else if(!$rootScope.SignupFormObj.team_name && $rootScope.SignupFormObj.team_name=='')
		{
			
			$rootScope.alert_error = $rootScope.lang.TEAM_NAME_ERROR;
			return false;
		}
		else if(!$rootScope.SignupFormObj.country && $rootScope.SignupFormObj.country=='')
		{
			
			$rootScope.alert_error = $rootScope.lang.COUNTRY_ERROR;
			return false;
		}
		else if(!$rootScope.SignupFormObj.favourite_club && $rootScope.SignupFormObj.favourite_club=='')
		{
			
			$rootScope.alert_error = $rootScope.lang.CLUB_ERROR;
			return false;
		}
		else
		{
			$rootScope.SignupFormObj.game_unique_id		= $rootScope.user_game_unique_id;
			for (var i = 0; i < $scope.lineup.length ; i++) 
			{
				var lineupObj = {
									player_unique_id:$scope.lineup[i].player.player_unique_id,
									position:$scope.lineup[i].player.position,
									master_game_roster_id:$scope.lineup[i].player.master_game_roster_id,
									salary:$scope.lineup[i].player.salary,
									player_team_id:$scope.lineup[i].player.team_id
								}
				$rootScope.SignupFormObj.lineup.push(lineupObj);	
			}
			$timeout(function(){
				$state.go('signup');
			},500);
		}
	}

	$scope.saveLineup = function()
	{
		if($scope.selectedPlayerUniqueID.length!=15)
		{
			
			$rootScope.alert_error = $rootScope.lang.LINEUP_FILL_ERROR;
			return false;
		}
		else if(!$rootScope.SignupFormObj.team_name && $rootScope.SignupFormObj.team_name=='')
		{
			
			$rootScope.alert_error = $rootScope.lang.TEAM_NAME_ERROR;
			return false;
		}
		else if(!$rootScope.SignupFormObj.favourite_club && $rootScope.SignupFormObj.favourite_club=='')
		{
			
			$rootScope.alert_error = $rootScope.lang.CLUB_ERROR;
			return false;
		}
		else
		{
			$rootScope.SignupFormObj.game_unique_id		= $rootScope.user_game_unique_id;
			for (var i = 0; i < $scope.lineup.length ; i++) 
			{
				var lineupObj = {
									player_unique_id:$scope.lineup[i].player.player_unique_id,
									position:$scope.lineup[i].player.position,
									master_game_roster_id:$scope.lineup[i].player.master_game_roster_id,
									salary:$scope.lineup[i].player.salary,
									player_team_id:$scope.lineup[i].player.team_id
								}
				$rootScope.SignupFormObj.lineup.push(lineupObj);	
			}

			$scope.lineupParam.lineup = $rootScope.SignupFormObj.lineup;
			$scope.lineupParam.league_id = $rootScope.SignupFormObj.league_id;
			$scope.lineupParam.game_unique_id = $rootScope.SignupFormObj.game_unique_id;
			$scope.lineupParam.team_name = $rootScope.SignupFormObj.team_name;
			$scope.lineupParam.favourite_club = $rootScope.SignupFormObj.favourite_club;
			//save lineup
			commonService.commonApiCall($scope.lineupParam,'lineup/add_user_lineup').then(function(response){
				$rootScope.alert_success =  response.Message;
				$timeout(function(){
					$state.go('league-summary');
				},200);
			},function (error){
				$rootScope.alert_success =  error.GlobalError;
			});
			
		}

	}

	$scope.autoPick = function()
	{
		$scope.resteAutopick();
		var postData = {league_id:$rootScope.user_league_id,game_unique_id:$rootScope.user_game_unique_id}
		commonService.commonApiCall(postData,'common/player_roster_autopick').then(function(response){
			var rosterArray = response.Data.player_roster;
			for (var i = 0; i < rosterArray.length; i++)
			{
				$scope.AddPlayer(rosterArray[i]);
			}
			$rootScope.SignupFormObj.salary_cap = Number(DEFAULT_SALARY_CAP)-Number(response.Data.lineup_salary);
			$rootScope.SignupFormObj.salary_cap = $rootScope.SignupFormObj.salary_cap.toFixed(1);
		},function (error){});

	}
	
	$scope.ResetLineup = function()
	{
		$rootScope.SignupFormObj.salary_cap 	= DEFAULT_SALARY_CAP;
		$rootScope.SignupFormObj.email			= '';	
		$rootScope.SignupFormObj.password		= '';
		$rootScope.SignupFormObj.social_type	= '';
		$rootScope.SignupFormObj.social_id		= 0;
		$rootScope.SignupFormObj.device_type	= 1;
		$rootScope.SignupFormObj.device_id		= 0;
		$rootScope.SignupFormObj.lineup			= [];
		$rootScope.SignupFormObj.team_name 		= '';
		$rootScope.SignupFormObj.country 		= '';
		$rootScope.SignupFormObj.favourite_club	= '';

		$timeout(function(){
			angular.element('#signup_country').val("").trigger("change");
			angular.element('#signup_club').val("").trigger("change");
		},100)

		$scope.selectedPlayerUniqueID 			= [];
		$scope.totalLineupTeamCount 			= [];
		commonService.commonApiCall({league_id:$scope.rosterParam.league_id},'common/get_lineup_master_data').then(function(response){
			$scope.lineup = response.Data.lineup;
			var lineupLenght = response.Data.lineup.length;
			for (var i = 0; i < lineupLenght; i++) 
			{
				$scope.added_positions[$scope.lineup[i].allowed_positions]--;
			}
		},function (error){});

	}
	$scope.resteAutopick = function()
	{
		$scope.added_positions = {GK:0, DF:0, MD:0, FW:0};
		$scope.selectedPlayerUniqueID 			= [];
		$scope.totalLineupTeamCount 			= [];
		commonService.commonApiCall({league_id:$scope.rosterParam.league_id},'common/get_lineup_master_data').then(function(response){
			$scope.lineup = response.Data.lineup;
		},function (error){});
	}

}]);

angular.module("learn_and_explore").controller('SignupCtrl', ['$scope','$state','commonService', '$rootScope', '$timeout','facebookService',function ($scope, $state, commonService, $rootScope, $timeout, facebookService) {

	$rootScope.user_league_id			= localStorage.getItem('non_login_user_league_id');
	$rootScope.user_game_unique_id		= localStorage.getItem('non_login_user_game_unique_id');
	$rootScope.SignupFormObj.league_id	= localStorage.getItem('non_login_user_league_id');

	$scope.changeLeague = function(val,game_id)
	{
		// /return false;
		if($rootScope.SignupFormObj.lineup !=undefined && $rootScope.SignupFormObj.lineup.length>0)
		{
			/*if (confirm($rootScope.lang.CONFIRM) == true) 
			{*/
				
				localStorage.setItem('user_league_id',val);
				localStorage.setItem('user_game_unique_id',game_id);
				$rootScope.user_league_id = val;
				$rootScope.user_game_unique_id = game_id;
				$timeout(function(){
					$state.go('lineup');
				},1000);
			/*}*/
			/*else
			{
				return false;	
			}*/
		}
	}	


	// sign up proccess
	// For getting twitter data 
	$rootScope.twitter_user_data	= {};	
	$rootScope.$watch("twitter_user_data", function(newValue, oldValue) 
	{
		if(newValue.status)
		{
			$scope.TWLogin(newValue);		
		}
	});

	$scope.doSignup = function() {
		 
		$rootScope.current_loader = "#signup_button";
		var sigupPass = $scope.SignupFormObj.password;
		var post_data = $rootScope.SignupFormObj;
			commonService.commonApiCall(post_data,'auth/login_signup').then(function(response){
					if (response.ResponseCode == 200)
					{
						sessionStorage.setItem(AUTH_KEY,response.Data[AUTH_KEY]);
						sessionStorage.setItem('is_logged_in',true);
						$rootScope.userLogin = true;
						$rootScope.is_logged_in = true;

						$rootScope.alert_success = response.Message;
						$rootScope.SignupFormObj = {};
						$timeout(function(){
							$state.go('league-summary');
						},1000);
					}					
				},
				function (error)
				{
					angular.forEach(error.Error, function(value, key) {						
						angular.element('#signup_'+key+'_error').text(value).show();						
					});
					
					$rootScope.alert_error = error.global_error;
				}
			);
	};

	$scope.FbLogin = function() {
		facebookService.FbLoginStatusCheck().then(function(response){			
			$scope.FbUserData(response);
		}, function(error){

		});
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



