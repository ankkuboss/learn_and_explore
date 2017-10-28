app.service('commonService', function($q, $http, $rootScope,$window){


	this.set_current_user = function set_current_user(user){
		
		localStorage.setItem('is_logged_in', true);
		localStorage.setItem('user_data',JSON.stringify(user));

	}

	this.get_current_user = function get_current_user(){
		
		var user_data = localStorage.getItem("user_data");
		return JSON.parse(user_data);
	}

	this.check_login = function(){
		var login_flag = localStorage.getItem('is_logged_in'); 

		if(login_flag===null || login_flag===undefined)
		{
			login_flag= false;
		}
		
		return login_flag;
		
	}

	

	this.commonApiCall = function(values,url){
		var deferred = $q.defer();
		$http.post(site_url+url, values).success(function (data) {
            // $rootScope.checkLogin(data);
		    deferred.resolve(data);
		}).error(function (data) {
		    deferred.reject(data);
		});
		return deferred.promise;		
	};
	
	this.commonApiGet = function(url){
		var deferred = $q.defer();
		$http.get(site_url+url).success(function (data) {
            // $rootScope.checkLogin(data);
		    deferred.resolve(data);
		}).error(function (data) {
		    deferred.reject(data);
		});
		return deferred.promise;		
	} 

	this.store_offer = {};
	this.redirect_to_retailer = function(store_offer)
	{

		if($rootScope.is_logged_in == "true")
		{
			this.store_offer =store_offer; 
			
			angular.element("#proceed_to_retailer_Modal").modal('show');
		}
		else{
			angular.element("#signinModal").modal('show');
		}

	} 

	this.redirect_from_banner = function(link)
	{

		if($rootScope.is_logged_in == "true")
		{
			 
			//open in new tab
			$window.open(link, '_blank');
			//angular.element("#proceed_to_retailer_Modal").modal('show');
		}
		else{
			angular.element("#signinModal").modal('show');
		}

	}


	this.proceed_to_retailer = function(store_offer)
	{
		$window.open(store_offer.link, '_blank');
	}

});



app.factory('showFormError', [function () {
	var bindError = function(error, element){
		var element_id = angular.element(element).attr('id');
		var field = '#'+element_id+'_error';
		angular.element(field).empty();
		angular.element(field).append(error.text());
		angular.element(field).show();
		return true;
	};
	return bindError;
}]);

app.factory('hideFormError', [function() {
	var bindError = function(error, element){
		var element_id = angular.element(element).attr('id');
		var field = '#'+element_id+'_error';
		angular.element(field).empty();
		angular.element(field).hide();
		return true;
	};
	return bindError;
}]);

app.factory('showServerError', [function() {
	var bindError = function(error){
		var errors = error.error;
		for(index in errors){
			errortext = errors[index];
			var field = '#'+index+'_error';
			angular.element(field).empty().append(errortext).removeClass('hide').show();
		}
		return true;
	};
	return bindError;
}]);
app.factory('dataSavingHttp', ['$http','$location',function($http,$location) {
	var wrapper = function(requestConfig) {
		var options = angular.extend({
			url: "",
			method: "POST",
			data : '',
			dataType: "json",
		},requestConfig);

		var key = sessionStorage.getItem(AUTH_KEY);
		options.headers = {};
		if(key == null)
		{
			options.headers[AUTH_KEY]='';
		}
		else 
		{
			options.headers[AUTH_KEY]=key;
		}
		var httpPromise = $http(options);
		httpPromise.success(function(result, status, headers, config){
			var l = window.location;
			wrapper.lastApiCallConfig = config;
			wrapper.lastApiCallUri = l.protocol + '//' + l.host + '' + config.url + '?' +
				(function(params){
					var pairs = [];
					angular.forEach(params, function(val, key){
						pairs.push(encodeURIComponent(key)+'='+encodeURIComponent(val));
					});
					return pairs.join('&')
				})(config.params);
			wrapper.lastApiCallResult = result;
		})
		return httpPromise;
	};
	return wrapper;
}]);
// directive to create salary format
app.filter('salaryFormat', ['$sce',function ($sce) {
	return function (item, withCurrency) {
		if(item || item == 0){
			if(typeof item === "string"){
				var n = item.split('.');
				if(n[1]!=undefined&&n[1]==0){
					item = n[0];
				}
			}
			formattedsalary = item.toString().replace(/(^\d{1,3}|\d{3})(?=(?:\d{3})+(?:$|\.))/g , '$1,');
			// Universal Currency code
			return (withCurrency==true)?$sce.trustAsHtml(formattedsalary):$sce.trustAsHtml(currency_code+formattedsalary);
		}
		return item;
	};
}]);


app.filter('ordinal', function(){
  return function(number){
    if(isNaN(number) || number < 1){
      return number;
    } else {
       var lastDigit = Number(number);
      if(lastDigit === 1)
      {
        return number + 'st';
      } else if(lastDigit === 2)
      {
        return number + 'nd';
      } else if (lastDigit === 3)
      {
        return number + 'rd';
      } else if (lastDigit > 3)
      {
        return number + 'th';
      }
      else
      {
      	return number + 'th';
      }
    }
  }
})

app.factory('socket', function ($rootScope, $timeout) {
	var socket  = function(){};
	socket.on   = function(){};
	socket.emit = function(){};
	if(typeof io != "undefined")
	{
		var socket = io(NodeAddr, {secure: 'https:' == location.protocol} );	
	}
	return {
		on: function (eventName, callback) {
			socket.on(eventName, function(){  
				var args = arguments;
				$timeout(function(){
					$rootScope.$apply(function(){
						callback.apply(socket, args);
					});
				});
			});
		},
		emit: function (eventName, data, callback) {
			socket.emit(eventName, data, function(){
				var args = arguments;
				$rootScope.$apply(function(){
					if (callback) {
						callback.apply(socket, args);
					}
				});
			})
		}
	};
});

app.filter('orderObjectBy', function() {
  return function(items, field, reverse) {
    var filtered = [];
    angular.forEach(items, function(item) {
      filtered.push(item);
    });
    filtered.sort(function (a, b) {
      return (a[field] > b[field] ? 1 : -1);
    });
    if(reverse) filtered.reverse();
    return filtered;
  };
});

app.filter('removeString', function () {
    return function (text,ele) {    	
        var str = text.replace(ele, ' ');
        return str;
    };
});


app.filter('trust', ['$sce',function($sce) {
  return function(value, type) {
    return $sce.trustAs(type || 'html', value);
  }
}]);

app.filter('myDateFormat', function myDateFormat($filter){
  return function(text){
    var  tempdate= new Date(text.replace(/-/g,"/"));
    return $filter('date')(tempdate, "MMM dd H:mm");
  }
});

 app.service('fileUpload', ['$http', function ($http) {
            this.uploadFileToUrl = function(file, uploadUrl){
               var fd = new FormData();
               fd.append('userfile', file);
            
              return $http.post(site_url+uploadUrl, fd, {
                  transformRequest: angular.identity,
                  headers: {'Content-Type': undefined}
               })
            
             
            }
         }]);




app.service('CopyService', ['$window', function ($window) {
	var body = angular.element($window.document.body);
	var textarea = angular.element('<textarea/>');
	textarea.css({
		position: 'fixed',
		opacity: '0'
	});

	return function (toCopy) {
		textarea.val(toCopy);
		body.append(textarea);
		textarea[0].select();

		try {
			var successful = document.execCommand('copy');
			if (!successful) throw successful;
		} catch (err) {
			window.prompt("Copy to clipboard: Ctrl+C, Enter", toCopy);
		}

		textarea.remove();
	}
}])
