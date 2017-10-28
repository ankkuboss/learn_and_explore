/*app.directive('selectTwo', ['$timeout',function($timeout){
	return {
		restrict: 'A',
		link: function($scope, iElm, iAttrs) {
			// iAttrs.$observe('selectTwo',function(){
			// 	$timeout(function(){
			// 		if(!$scope.$$phase) {
			// 			//iElm.val(null).trigger("change");
			// 		}
			// 	});
			// });
			if(iAttrs.selectTwo)
			{
				iElm.select2($scope.$eval('{'+iAttrs.selectTwo+'}'));
				iAttrs.$observe('defaultSelected',function(){
					$timeout(function(){
							iElm.select2('val',iAttrs.defaultSelected);						
					},500);
				});
				
			}
			else
			{
				iElm.select2({});
			}
		}
	};
}]);*/

app.directive('selectTwo', function($timeout){
	return {
		restrict: 'A',
		link: function($scope, iElm, iAttrs) {
			iAttrs.$observe('placeholder',function(){
				$timeout(function(){
					if(iAttrs.selectTwo)
					{
						iElm.select2($scope.$eval('{'+iAttrs.selectTwo+'}'));
					}
					else
					{
						iElm.select2();
					}
				});	
			});
		}
	};
});

app.directive('rangeSlider', ['$timeout',function (timer) { 
	return {
		restrict: 'EA',       
		replace: true,
		scope:{
			rangeModel:"=rangeModel",
			rangeFun:"&",
		},
		link: function (scope, element, attrs) 
		{
			element.slider({
				range: true,
				min: 0,
				max: 250,
				values: [scope.rangeModel.min, scope.rangeModel.max],
				animate: "slow",
				create: function(event, ui) 
				{
					var target = $(event.target);
					var temp = '<div class="text-center">' + '<span style="float:left"></span>' + '<span style="float:right"></span>' + '</div>';
					$(temp).insertAfter(target);
					var minSpan = target.next('div').find('span').eq(0);
					var maxSpan = target.next('div').find('span').eq(1);
					minSpan.text("$" + $(this).slider('values')[0]);
					maxSpan.text("$" + $(this).slider('values')[1]);
				},
				slide: function(event, ui) 
				{
					var target = $(event.target);
					var minSpan = target.next('div').find('span').eq(0);
					var maxSpan = target.next('div').find('span').eq(1);
					minSpan.text("$" + ui.values[0]);
					maxSpan.text("$" + ui.values[1]);
					// update range model
					scope.rangeModel = {min:ui.values[0],max:ui.values[1]} ;
					scope.$apply();
					attrs.$set('ngModel', scope.rangeModel, true);
					// call parent function to update lobby data
					scope.rangeFun(scope.rangeModel);
				}
			});
		}
	}
}]);

app.directive('passwordStrength', function() {
		return {
				restrict: 'EA',
				scope: {
						verystrong: '@verystrong',
						strong: '@strong',
						medium: '@medium',
				},
				// template: '<input type="password" class="form-control pass-field" placeholder="Password"  name="signup_password" id="signup_password" ng-model="SignupFormObj.password" maxlength="20" />\
				// <label for="" class="passstrength"></label>',
				link: function(scope, iElement, iAttrs) {
						iElement.bind("keyup", function(e) {
								
								// var tempObj = angular.element((iElement[0].querySelector('input')));
								var tempObj = iElement;                                
								tempObj.addClass('focusout');
								var strongRegex = new RegExp("^(?=.{10,})(?=.*[a-z])(?=.*[0-9])(?=.*\\W).*$", "g");
								var mediumRegex = new RegExp("^(?=.{9,})(((?=.*[A-Z])(?=.*[a-z]))|((?=.*[A-Z])(?=.*[0-9]))|((?=.*[a-z])(?=.*[0-9]))).*$", "g");
								var enoughRegex = new RegExp("(?=.{8,}).*", "g");
								if (false == enoughRegex.test(tempObj.val())) {
										tempObj.removeClass('focusout');
										tempObj.next('label').removeClass().addClass('passstrength');
								} else if (strongRegex.test(tempObj.val())) {
										tempObj.next('label').removeClass().addClass('passstrength strong');
										tempObj.next('label').animate({
												width: defaults.verystrong + "%"
										}, 100);
								} else if (mediumRegex.test(tempObj.val())) {
										tempObj.next('label').removeClass().addClass('passstrength medium');
										tempObj.next('label').animate({
												width: defaults.strong + "%"
										}, 100);
								} else {
										tempObj.next('label').removeClass().addClass('passstrength weak');
										tempObj.next('label').animate({
												width: defaults.medium + "%"
										}, 100);
								}
								return true;
						});
						var defaults = {
								verystrong: 50,
								strong: 30,
								medium: 15
						}
						$.extend(defaults, scope);

				},
		};
});
app.directive("progressbar", function () {
		return {
				restrict: "A",
				scope: {
						total: "=",
						current: "="
				},
				link: function (scope, element) {
						 scope.$watch("current", function (value) {
								element.css("width", (scope.current / scope.total * 100).toFixed(2) + "%");
						});
						scope.$watch("total", function (value) {
								element.css("width", (scope.current / scope.total * 100).toFixed(2) + "%");
						})
				}
		};
});

app.directive('loginForm', ['showFormError','hideFormError', '$rootScope', function (showFormError, hideFormError, $rootScope) {
	return {
		restrict: 'A',
		scope: {
			submitLogin:'&'
		},
		link: function postLink(scope, iElement, iAttrs) {
			scope.validationRulesLogin = {
											login_email		:{required:true,email:true},
											login_password	:{required:true}
										};
			scope.validationMessage    = {
											login_email:{required:$rootScope.lang.LOGIN_EMAIL_ERROR,email:$rootScope.lang.LOGIN_EMAIL_INVALID_ERROR
														},
											login_password:{required:$rootScope.lang.LOGIN_PASSWORD_ERROR}
										};
			iElement.validate({
				errorElement: "span",
				rules:scope.validationRulesLogin,
				messages:scope.validationMessage,
				errorPlacement: function (error, element){
					showFormError(error, element);
				},
				highlight: function (element, errorClass) {
					$(element).closest('.form-group').addClass('has-error');
				},
				submitHandler: function(form) {
					scope.submitLogin();
				},
				success: function(error, element) {
					hideFormError(error, element);
				}
			});
		}
	};
}]);

app.directive('signupForm', ['showFormError', 'hideFormError', '$rootScope', function (showFormError, hideFormError, $rootScope) {
	return {
		restrict: 'A',
		scope: {
			submitSignup:'&'
		},
		link: function postLink(scope, iElement, iAttrs) {
   
			scope.validationRulesSignup = {       
				email            :{required:true, email:true},
				password         :{required:true, minlength:6,maxlength:50}    
			};

			scope.validationSignupMessage    = {   
				email            :{required:$rootScope.lang.SIGNUP_EMAIL_ERROR,email:$rootScope.lang.EMAIL_INVALID_ERROR},
				password         :{required:$rootScope.lang.SIGNUP_PASSWORD_ERROR,minlength:$rootScope.lang.PASSWORD_LENGTH_ERROR},       
			};

			iElement.validate({
				errorElement: "span",
				rules:scope.validationRulesSignup,
				messages:scope.validationSignupMessage,
				errorPlacement: function (error, element){
					showFormError(error, element);
				},
				highlight: function (element, errorClass) {
					$(element).closest('.form-group').addClass('has-error');
				},
				submitHandler: function(form) {         
					scope.submitSignup();
				},
				success: function(error, element) {
					hideFormError(error, element);
				}
			});
		}
	};
}]);

app.directive('forgotPasswordForm', ['showFormError','hideFormError','$rootScope',function (showFormError, hideFormError, $rootScope) {
	return {
		restrict: 'A',
		scope: {
			submitForgotPassword:'&'
		},
		link: function postLink(scope, iElement, iAttrs) {
			scope.validationRulesForgotPassword = {forgot_email:{required:true,email:true}};
			scope.validationMessageForgotPassword = {forgot_email:{required:$rootScope.lang.FORGOT_EMAIL_ERROR,email:$rootScope.lang.EMAIL_INVALID_ERROR}};
			iElement.validate({
				errorElement: "span",
				rules:scope.validationRulesForgotPassword,
				messages:scope.validationMessageForgotPassword,
				errorPlacement: function (error, element){
					//showFormError(error, element);
					$(element).addClass('error-msg-icn');
				},
				submitHandler: function(form) {
					scope.submitForgotPassword();
				},
				success: function(error, element) {
					$(element).removeClass('error-msg-icn');
					$(element).addClass('success-msg-icn');
					//$(element).addClass('success-msg-icn');
					//hideFormError(error, element);
				}
			});
		}
	};
}]);

app.directive('resetPasswordForm', ['showFormError','$rootScope','hideFormError',function (showFormError,$rootScope, hideFormError) {
	return {
		restrict: 'A',
		scope: {
			submitResetPassword:'&'
		},
		link: function postLink(scope, iElement, iAttrs) {
			scope.validationRulesResetPassword = {
				reset_code : {required:true,minlength:6,maxlength:50},
				reset_new_password :{required:true, minlength:6,maxlength:50},
				reset_conf_password:{required:true, minlength:6,maxlength:50, equalTo:"#reset_new_password"}
			};
			scope.validationMessageResetPassword = {
				reset_code : {required:$rootScope.lang.RESET_CODE_ERROR,minlength:$rootScope.lang.CODE_LENGTH_ERROR},
				reset_new_password :{required:$rootScope.lang.PASSWORD_ERROR,minlength:$rootScope.lang.PASSWORD_LENGTH_ERROR},
				reset_conf_password:{required:$rootScope.lang.PASSWORD_ERROR,minlength:$rootScope.lang.PASSWORD_LENGTH_ERROR, equalTo:$rootScope.lang.PASSWORD_MATCH_ERROR}
			};
			iElement.validate({
				errorElement: "span",
				rules:scope.validationRulesResetPassword,
				messages:scope.validationMessageResetPassword,
				errorPlacement: function (error, element){
					//showFormError(error, element);
					$(element).addClass('error-msg-icn');
				},
				submitHandler: function(form) {
					scope.submitResetPassword();
				},
				success: function(error, element) {
					//hideFormError(error, element);
					$(element).removeClass('error-msg-icn');
					$(element).addClass('success-msg-icn');
				}
			});
		}
	};
}]);

app.directive('changePasswordForm', ['showFormError','$rootScope','hideFormError',function (showFormError,$rootScope,hideFormError) {
	return {
		restrict: 'A',
		scope: {
			submitChangePassword:'&'
		},
		link: function postLink(scope, iElement, iAttrs) {
			scope.validationRulesChangesPassword = {
				//change_old_password :{required:true, minlength:6,maxlength:50},
				change_new_password :{required:true, minlength:6,maxlength:50},
				change_conf_password:{required:true, minlength:6,maxlength:50, equalTo:"#change_new_password"},
			};
			scope.validationMessageChangePassword = {
				//change_old_password :{required:$rootScope.lang.CHANGE_OLDPASSWORD_ERROR, minlength:$rootScope.lang.PASSWORD_LENGTH_ERROR},
				change_new_password :{required:$rootScope.lang.CHANGE_NEWPASSWORD_ERROR, minlength:$rootScope.lang.PASSWORD_LENGTH_ERROR},
				change_conf_password:{required:$rootScope.lang.CHANGE_CONFPASSWORD_ERROR, minlength:$rootScope.lang.PASSWORD_LENGTH_ERROR, equalTo:$rootScope.lang.CONFIRM_PASSWORD_MATCH_ERROR}
			};
			iElement.validate({
				errorElement: "span",
				rules:scope.validationRulesChangesPassword,
				messages:scope.validationMessageChangePassword,
				errorPlacement: function (error, element){
					showFormError(error, element);
					$(element).removeClass('success-msg-icn');
					$(element).addClass('error-msg-icn');
				},
				submitHandler: function(form) {
					scope.submitChangePassword();
				},
				success: function(error, element) {
					$(element).removeClass('error-msg-icn');
					$(element).addClass('success-msg-icn');
					hideFormError(error, element);
				}
			});
		}
	};
}]);

app.directive('addPasswordForm', ['showFormError','$rootScope','hideFormError',function (showFormError,$rootScope, hideFormError) {
	return {
		restrict: 'A',
		scope: {
			submitAddPassword:'&'
		},
		link: function postLink(scope, iElement, iAttrs) {
			scope.validationRulesAddPassword = {
				add_new_password :{required:true, minlength:6,maxlength:50},
				add_conf_password:{required:true, minlength:6,maxlength:50, equalTo:"#add_new_password"},
			};
			scope.validationMessageAddPassword = {
				add_new_password :{required:$rootScope.lang.ADD_NEWPASSWORD_ERROR, minlength:$rootScope.lang.PASSWORD_LENGTH_ERROR},
				add_conf_password:{required:$rootScope.lang.ADD_CONFPASSWORD_ERROR, minlength:$rootScope.lang.PASSWORD_LENGTH_ERROR, equalTo:$rootScope.lang.CONFIRM_PASSWORD_MATCH_ERROR}
			};
			iElement.validate({
				errorElement: "span",
				rules:scope.validationRulesAddPassword,
				messages:scope.validationMessageAddPassword,
				errorPlacement: function (error, element){
					showFormError(error, element);
				},
				submitHandler: function(form) {
					scope.submitAddPassword();
				},
				success: function(error, element) {
					hideFormError(error, element);
				}
			});
		}
	};
}]);

app.directive('inviteForm', ['showFormError','hideFormError', '$rootScope', function (showFormError, hideFormError, $rootScope) {
	return {
		restrict: 'A',
		scope: {
			submitHandle:'&'
		},
		link: function postLink(scope, iElement, iAttrs) {
			scope.validationRulesInvite = {
											invite_emails	: {required:true,multiemails:true},
										};
			scope.validationMessageInvite    = {
											invite_emails	: {required:$rootScope.lang.INVITE_FRIEND_ERROR,multiemails:$rootScope.lang.INVITE_FRIEND_INVALID},
										};
			iElement.validate({
				errorElement: "span",
				rules:scope.validationRulesInvite,
				messages:scope.validationMessageInvite,
				errorPlacement: function (error, element){
					showFormError(error, element);
				},
				highlight: function (element, errorClass) {
					$(element).closest('.form-group').addClass('has-error');
				},
				submitHandler: function(form) {
					scope.submitHandle();
				},
				success: function(error, element) {
					hideFormError(error, element);
				}
			});
		}
	};
}]);

app.directive('showMessage', ['$rootScope',function($rootScope){
	return {
		restrict: 'A',
		link: function($scope, element, attribute){ 
			attribute.$observe('showMessage',function(){     
			$.jGrowl.defaults.pool = 1;  
				if($rootScope.alert_success!="" && $rootScope.alert_success!= undefined)
				{
					angular.element(".growl-success").remove();
					//$.jGrowl($rootScope.alert_success, {position: 'center',theme: 'growl-success', header: 'Success!',life: 5000 });
					$.jGrowl($rootScope.alert_success, {position: 'center',theme: 'growl-success', life: 5000 });
					$rootScope.alert_success =''
				}
				else if($rootScope.alert_error!="" && $rootScope.alert_error != undefined)
				{
					angular.element(".growl-error").remove();
					//$.jGrowl($rootScope.alert_error, {position: 'center',theme: 'growl-error', header: 'Error!',life: 5000 });
					$.jGrowl($rootScope.alert_error, {position: 'center',theme: 'growl-error', life: 5000 });
					$rootScope.alert_error   ='';
				}
				else if($rootScope.alert_warning !="" && $rootScope.alert_warning != undefined)
				{
					angular.element(".growl-warning").remove();
					//$.jGrowl($rootScope.alert_warning, {position: 'center',theme: 'growl-warning', header: 'Warning!',life: 5000 });
					$.jGrowl($rootScope.alert_warning, {position: 'center',theme: 'growl-warning',life: 5000 });
					$rootScope.alert_warning ='';
				}
			});
		}
	};
}]);

app.directive('openPopup', ['$compile','$timeout', function ($compile, $timeout) {  
	return {
		restrict: 'AE',    
		controller : "@",
		name:"controllerName",    
		link: function(scope, elem, iAttrs) 
		{      
			 $("#site_model").empty();
			var elemId = iAttrs.target.replace('#','');
			var template = '<div class="modal slide" id="'+elemId+'" tabindex="-1" role="dialog" aria-labelledby="forgotpasswordModal" ng-include src="getTemplateUrl()"></div>';
			scope.getTemplateUrl = function()
			{
			 return site_url+'popup/'+iAttrs.fileTarget+'.php';
			}
			$("#site_model").append($compile(template)(scope));      
		}
	}
}]);

app.directive('myprofileForm', ['showFormError', '$rootScope','hideFormError', function (showFormError, $rootScope,hideFormError) {
	return {
		restrict: 'A',
		scope: {
			submitMyprofile:'&'
		},
		link: function postLink(scope, iElement, iAttrs) {

			scope.validationRulesMyProfile = {
				first_name:{required:true,minlength:1},
				last_name :{required:true,minlength:1},
				email     :{required:true, email:true},
				dob       :{required:true},
				phone_no  :{minlength:10,required:true}
			};
			
			scope.validationMyProfileMessage    = {
				first_name:{required:$rootScope.lang.PROFILE_FIRSTNAME_ERROR},
				last_name :{required:$rootScope.lang.PROFILE_LASTNAME_ERROR},
				email     :{required:$rootScope.lang.PROFILE_EMAIL_ERROR,email:$rootScope.lang.EMAIL_INVALID_ERROR},	
				dob       :{required:$rootScope.lang.PROFILE_DOB_ERROR},
				phone_no  :{required:$rootScope.lang.PROFILE_PHONE_ERROR},	
			};

			iElement.validate({
				errorElement: "span",
				focusInvalid: false,
				rules:scope.validationRulesMyProfile,
				messages:scope.validationMyProfileMessage,
				errorPlacement: function (error, element){
					showFormError(error, element);                    
				},
				highlight: function (element, errorClass) {
					$(element).closest('.form-group').addClass('has-error');
				},
				submitHandler: function(form) {
					scope.submitMyprofile();
				},
				success: function(error, element) {					
					hideFormError(error, element);
				}
			});
		}
	};
}]);

app.directive('resetForm', ['$timeout',function($timeout){
	return {
		restrict: 'A',
		link: function($scope, iElm, iAttrs) {
			iElm.bind("click",function(e){
				if(typeof angular.element(iAttrs.resetForm)[0] != undefined && angular.element(iAttrs.resetForm)[0].reset != undefined ){
					angular.element(iAttrs.resetForm)[0].reset();
				}
				angular.element(iAttrs.resetForm +' .myerror').hide().html('');
				angular.forEach(angular.element(iAttrs.resetForm+' select'), function(v,k){
					angular.element(v).select2("val","");
				});      
				if(iAttrs.resetForm=='#frmwithdraw')
				{
					angular.element('#frmlivecheck .myerror').hide().html('');
				}
			});
		}
	};
}]);

app.directive('initDate', ['$timeout',function($timeout){  
	return {  
		restrict:'EA',
		link: function($scope, iElm, iAttrs) {
			$timeout(function() {
				var options = {
					autoclose: true,
					todayHighlight: false
				}

				iElm.datepicker(options).on('changeDate', function(ev)
				{
					if(iAttrs.id == "draftc_date")
					{
						var selectedDate = $.datepicker.formatDate('mm/dd/yy', $('#draftc_date').datepicker( "getDate" ));
						var currentDate = $.datepicker.formatDate('mm/dd/yy', new Date());
						if(selectedDate == currentDate)
						{
							// round off current time to nearest quarter hours.
							var coeff = 1000 * 60 * 15;
							var date = new Date();  //or use any other date
							var rounded = new Date(Math.ceil(date.getTime() / coeff) * coeff);
							var cur_time = rounded.toLocaleTimeString().replace(/([\d]+:[\d]{2})(:[\d]{2})(.*)/, "$1$3");
					  
							$('#timepicker').timepicker('option', 'minTime',cur_time);
							$('#timepicker').val('');
							$('#draft_time_error').text('').hide().addClass('hide');
						}
						else
						{
							$('#timepicker').timepicker('option', 'minTime','00:00 AM');
							$('#timepicker').val('');
							$('#draft_time_error').text('').hide().addClass('hide');
						}	
					}
				});
				// open datepicker on click of icon
				var component = iElm.siblings('[data-toggle="datepicker"]');
				if (component.length) 
				{
					component.on('click', function () 
					{
						iElm.trigger('focus');
					});
				}
				// for first onclick event open datepicker
				if(iAttrs.id == "draftc_date")
				{
					iElm.click(function() 
					{
						iElm.trigger('focus');
					});	
				}
			}, 1500);
		}
	};
}]);

// directive for timePicker
app.directive('initTimePicker', ['$timeout',function($timeout){  
	return {  
		restrict:'EA',
		link: function($scope, iElm, iAttrs) {
			$timeout(function() {
				var coeff = 1000 * 60 * 15;
				var date = new Date();  //or use any other date
				var rounded = new Date(Math.ceil(date.getTime() / coeff) * coeff);
				var cur_time = rounded.toLocaleTimeString().replace(/([\d]+:[\d]{2})(:[\d]{2})(.*)/, "$1$3");
				var options = {
					scrollDefaultNow: true,
					timeFormat		: 'h:i A',
					minTime			:  cur_time,
					step			: 15, 
					disableTextInput: true,
					forceRoundTime  : true
				};

				iAttrs.$observe('initTimePicker', function()
				{
					var newoptions = $scope.$eval('{'+iAttrs.initTimePicker+'}');
					var extendedoption = angular.extend(options, newoptions);
					iElm.timepicker(extendedoption);
				});
				// open datepicker on click of icon
				var component = iElm.siblings('[data-toggle="timepicker"]');
				if (component.length) 
				{
					component.on('click', function () 
					{
						iElm.trigger('focus');
					});
				}
			}, 1000);
		}
	};
}]);

// directive to create salary format
app.filter('salaryFormat', function ($sce) {
	return function (item) {   
			if(item || item == 0)
			{
				formattedsalary = item.toString().replace( /(^\d{1,3}|\d{3})(?=(?:\d{3})+(?:$|\.))/g , '$1,' );
				// Universal Currency code
				return $sce.trustAsHtml( currency_code +formattedsalary );
			}
	};
});

// custom filter to order by on objects
app.filter('orderObjectBy', function() {
  return function(items, field, reverse) 
  {
	var filtered = [];
	angular.forEach(items, function(item,key) {
	  item["player_unique_id"] = key;
	  filtered.push(item);
	});
	filtered.sort(function (a, b) {
	  return (a[field] > b[field] ? 1 : -1);
	});
	if(reverse) filtered.reverse();
	return filtered;
  };
});
// load more on scroll directive
app.directive('whenScrollEnds', function () {
	return {
		restrict: "A",
		link: function (scope, element, attrs) {
			var processingScroll = false;

			var visibleHeight = element.height();
			var threshold = 100;

			element.scroll(function () {
				var scrollableHeight = element.prop('scrollHeight');
				var hiddenContentHeight = scrollableHeight - visibleHeight;
				if (hiddenContentHeight - element.scrollTop() <= threshold)
				{
					// Scroll is almost at the bottom. Loading more rows
					scope.$apply(attrs.whenScrollEnds);
				}
			});
		}
	};
});

// game count down converter directive
app.directive('gameCounter', [function () {
		return {
				restrict: 'A',
				link: function ($scope, iElement, iAttrs) {
 
						iAttrs.$observe('gameCounter',function()
						{
								var arr = $scope.$eval('{'+iAttrs.gameCounter+'}');
								if(!arr.from || !arr.timestamp)
										return;
							 
								if(!arr.days_game_start || arr.days_game_start == 0)
								{
										iElement.countdown(arr);
								}
						});
				}
		};
}])


app.directive('appFilereader', function($q) {
		var slice = Array.prototype.slice;
		return {
			restrict: 'A',
			require: '?ngModel',
			link: function(scope, element, attrs, ngModel) {

				if (!ngModel) return;
				ngModel.$render = function() {}

				element.bind('change', function(e) {
					var element = e.target;
					if(!element.value) return;

					element.disabled = true;
					$q.all(slice.call(element.files, 0).map(readFile))
						.then(function(values) {
							if (element.multiple) ngModel.$setViewValue(values);
							else ngModel.$setViewValue(values.length ? values[0] : null);
							element.value = null;
							element.disabled = false;
						});

					function readFile(file) {
						var deferred = $q.defer();

						var reader = new FileReader()
						reader.onload = function(e) {
							deferred.resolve(e.target.result);


						}
						reader.onerror = function(e) {
							deferred.reject(e);

						}
						reader.readAsDataURL(file);

						return deferred.promise;
					}

				}); //change

			} //link

		}; //return

	});

app.directive('numbersOnly', [function(){
	// Runs during compile
	return {
		restrict: 'A', // E = Element, A = Attribute, C = Class, M = Comment
		link: function($scope, iElm, iAttrs, controller) {
			iElm.keypress(function(event){
				if ((event.which!=46||iElm.val().indexOf('.')!=-1) && (event.which<48||event.which>57) && event.which!=8 && event.which!=0)
				{
					event.preventDefault();
				}
			});
		}
	};
}]);

app.directive('intigerOnly', [function(){
	return {
		restrict: 'A', // E = Element, A = Attribute, C = Class, M = Comment
		require: 'ngModel',
		link: function($scope, iElm, iAttrs, controller) {
			controller.$parsers.push(function (inputValue) {
				// this next if is necessary for when using ng-required on your input. 
				// In such cases, when a letter is typed first, this parser will be called
				// again, and the 2nd time, the value will be undefined
				if (inputValue == undefined) return '' 
				var transformedInput = inputValue.replace(/[^0-9]/g, ''); 
				if (transformedInput!=inputValue) {
					controller.$setViewValue(transformedInput);
					controller.$render();
				}
				return transformedInput;
			});
		}
	};
}]);


app.directive("whenScrolled", function(){
	return{
		restrict: 'A',
		link: function($scope, elem, attrs){
			elem.bind("scroll", function(e){
				raw = this;
				if($scope.loading===true){
					e.preventDefault();
					e.stopPropagation();
				}
				if(raw.scrollTop+raw.offsetHeight+5 >= raw.scrollHeight){
					$scope.$apply(attrs.whenScrolled);
				}
			});
		}
	};
});

app.directive("addRoundLi", [function(){
	return{
		restrict: 'EA',
		link: function($scope, elem, attrs){
			if (attrs.currIndex == 0) {
				angular.element('.rounds').remove();
			}
			var str = attrs.addRoundLi.split('==');			
			if (str[0] != str[1]&&str[1]!=""&&str[2]!="") 
			{
				angular.element(elem).before('<li class="rounds"><span>Round '+str[0]+'</span></li>');
			}
		}
	};
}]);


app.directive('checkPlrImageExist', ['$rootScope', function($rootScope){	
	var $elem = function(elDef){
		return angular.element(document.createElement(elDef));
	};
	var imageExist = function(url, callback){
		  var img = new Image();
		  img.onload = function() { callback(true); };
		  img.onerror = function() { callback(false); };
		  img.src = url;
	}	
	return {
		restrict:'E',
		replace:true,
		scope : {
			playerId	: '=',
			imgCls	: '@'
		},
		template : "<figure class='{{imgCls}}'>",
		link: function($scope, iElm, iAttrs) 
		{			
			var pathInfo = $rootScope.playerImgInfo;
			var imageUrl = pathInfo.base_path+$scope.playerId+"."+pathInfo.ext;	 	
			var plrImg = $elem('img');
			plrImg.addClass('img-circle');			
			imageExist(imageUrl, function(exists) {				
				if (exists) {
					plrImg[0].src = imageUrl;
					iElm.append(plrImg);
				}else{
					plrImg[0].src = site_url+'assets/img/'+"default-player.jpg";
					iElm.append(plrImg);
				}
			});			

		}
	};

}]);



app.directive('fundwithdrawForm', ['showFormError', 'hideFormError', '$rootScope', function (showFormError, hideFormError, $rootScope) {
	return {
		restrict: 'A',
		scope: {
			fwithSubmit:'&'
		},
		link: function postLink(scope, iElement, iAttrs) {      
			scope.validationRulesWithdraw = {       
				fullname            :{required:true, minlength:3, maxlength:25},
				email            	:{required:true, email:true},
				amount           	:{required:true,max:+$rootScope.userBalance,min:10}
											  
			};

			scope.validationWithdrawMessage    = {   
				fullname             :{required:$rootScope.lang.WITHDRAW_FUND_FULLNAME},
				amount           	:{required:$rootScope.lang.WITHDRAW_FUND_AMOUNT,max:$rootScope.lang.WITHDRAW_NO_SUFFICIENT_AMOUNT},
				email            	:{required:$rootScope.lang.WITHDRAW_FUND_EMAIL,email:$rootScope.lang.WITHDRAW_FUND_EMAIL_INVALID_ERROR}    
			};

			iElement.validate({
				errorElement: "span",
				rules:scope.validationRulesWithdraw,
				messages:scope.validationWithdrawMessage,
				errorPlacement: function (error, element){
					showFormError(error, element);
				},
				submitHandler: function(form) {         
					scope.fwithSubmit();
				},
				success: function(error, element) {
					hideFormError(error, element);
				}
			});
		}
	};

}]);

app.directive('creategameForm', ['showFormError', 'hideFormError', '$rootScope', function (showFormError, hideFormError, $rootScope) {
	return {
		restrict: 'A',
		scope: {
			submitCreategame:'&'
		},
		link: function postLink(scope, iElement, iAttrs) {      
			scope.validationRulesCreategame = {
				game_name			:{required:true},       
				league_type			:{required:true},
				size				:{required:true},
				start_week			:{required:true},
				end_week			:{required:true},
			};

			scope.validationCreategameMessage    = { 
				game_name			:{required:$rootScope.lang.LEAGUE_NAME_REQUIRED},
				league_type			:{required:$rootScope.lang.LEAGUE_TYPE_REQUIRED},
				size				:{required:$rootScope.lang.LEAGUE_SIZE_REQUIRED},
				start_week			:{required:$rootScope.lang.LEAGUE_START_WEEK_REQUIRED},
				end_week			:{required:$rootScope.lang.LEAGUE_END_WEEK_REQUIRED},
			};

			iElement.validate({
				errorElement: "span",
				rules:scope.validationRulesCreategame,
				messages:scope.validationCreategameMessage,
				errorPlacement: function (error, element){
					showFormError(error, element);
				},
				highlight: function (element, errorClass) {
					$(element).closest('.form-group').addClass('has-error');
				},
				submitHandler: function(form) {         
					scope.submitCreategame();
				},
				success: function(error, element) {
					hideFormError(error, element);
				}
			});
		}
	};
}]);

app.directive('sendmessageForm', ['showFormError', 'hideFormError', '$rootScope', function (showFormError, hideFormError, $rootScope) {
	return {
		restrict: 'A',
		scope: {
			submitSendmessage:'&'
		},
		link: function postLink(scope, iElement, iAttrs) {      
			scope.validationRulesSendmessage = {       
				message_title			:{required:true, maxlength: $rootScope.lang.TITLE_MAX_LENGTH},
				message_desc			:{required:true, maxlength: $rootScope.lang.MESSAGE_MAX_LENGTH}
			};

			scope.validationSendmessageMessage    = {   
				message_title			:{required: $rootScope.lang.MESSAGE_TITLE_REQUIRED, maxlength: $rootScope.lang.TITLE_MAX_LENGTH_ERROR},
				message_desc			:{required: $rootScope.lang.MESSAGE_DESC_REQUIRED, maxlength: $rootScope.lang.MESSAGE_MAX_LENGTH_ERROR}
			};

			iElement.validate({
				errorElement: "span",
				rules:scope.validationRulesSendmessage,
				messages:scope.validationSendmessageMessage,
				errorPlacement: function (error, element){
					showFormError(error, element);
				},
				submitHandler: function(form) {         
					scope.submitSendmessage();
				},
				success: function(error, element) {
					hideFormError(error, element);
				}
			});
		}
	};
}]);

app.directive('chatgameForm', ['showFormError', 'hideFormError', '$rootScope', function (showFormError, hideFormError, $rootScope) {
	return {
		restrict: 'A',
		scope: {
			submitChatgame:'&'
		},
		link: function postLink(scope, iElement, iAttrs) {      
			scope.validationRulesChatgameMessage = {       
				chat_message			:{required:true}
			};

			scope.validationChatgameMessage    = {   
				chat_message			:{required: $rootScope.lang.MESSAGE_DESC_REQUIRED}
			};

			iElement.validate({
				errorElement: "span",
				rules:scope.validationRulesChatgameMessage,
				messages:scope.validationChatgameMessage,
				errorPlacement: function (error, element){
					showFormError(error, element);
				},
				submitHandler: function(form) {         
					scope.submitChatgame();
				},
				success: function(error, element) {
					hideFormError(error, element);
				}
			});
		}
	};
}]);
app.directive('userchatForm', ['showFormError', 'hideFormError', '$rootScope', function (showFormError, hideFormError, $rootScope) {
	return {
		restrict: 'A',
		scope: {
			submitUserchat:'&'
		},
		link: function postLink(scope, iElement, iAttrs) {      
			scope.validationRulesUserchatMessage = {       
				user_chat_message	:{required:true}
			};

			scope.validationUserchatMessage    = {   
				user_chat_message	:{required: $rootScope.lang.MESSAGE_DESC_REQUIRED}
			};

			iElement.validate({
				errorElement: "span",
				rules:scope.validationRulesUserchatMessage,
				messages:scope.validationUserchatMessage,
				errorPlacement: function (error, element){
					showFormError(error, element);
				},
				submitHandler: function(form) {         
					scope.submitUserchat();
				},
				success: function(error, element) {
					hideFormError(error, element);
				}
			});
		}
	};
}]);


app.directive('leaguesettingsForm', ['showFormError', 'hideFormError', '$rootScope', function (showFormError, hideFormError, $rootScope) {
	return {
		restrict: 'A',
		scope: {
			submitLeaguesettings:'&'
		},
		link: function postLink(scope, iElement, iAttrs) {      
			scope.validationRulesCreategame = {
				draftc_date			:{required:true},
				timepicker			:{required:true},
				keeper_date_picker  :{required:true},
				trade_end_date_picker: {required:true},
			};

			scope.validationCreategameMessage    = { 
				draftc_date			 :{required:$rootScope.lang.DRAFT_DATE_REQUIRED},
				timepicker			 :{required:$rootScope.lang.DRAFT_TIME_REQUIRED},
				keeper_date_picker	 :{required:$rootScope.lang.KEEPER_DATE_REQUIRED},
				trade_end_date_picker:{required:$rootScope.lang.TRADE_DATE_REQUIRED},
			};

			iElement.validate({
				errorElement: "span",
				rules:scope.validationRulesCreategame,
				messages:scope.validationCreategameMessage,
				errorPlacement: function (error, element){
					showFormError(error, element);
				},
				submitHandler: function(form) {         
					scope.submitLeaguesettings();
				},
				success: function(error, element) {
					hideFormError(error, element);
				}
			});
		}
	};
}]);

app.directive('dragItem', function() {		
	return {
		restrict: 'A',
		link: function(scope, iElement, iAttrs) {
				$('#selectedPlayerQueue').sortable({
					start	: scope.dragStart,
					update	: scope.dragEnd
				});
		}
	};
});

/*
	Filter to replace String.
*/
app.filter('replaceStr',function(){
	return function(input,str,rpl){
		var re = new RegExp(str, 'g');
		return input.replace(re,rpl);
	}
});

app.directive('notificationCount', ['$rootScope','$timeout','commonService', function ($rootScope,$timeout,commonService) {
 return {
	 restrict: 'E',      
	link: function(scope, element, attrs) {
	$rootScope.$on('$stateChangeSuccess', function() {
		if ( sessionStorage.getItem(AUTH_KEY) == null )
		{
			return false;
		}
		
		commonService.commonApiCall({},'invitation/get_invite_count').then(
			function(response)
			{				
				$rootScope.notiCnt = response.Data.invite_count;
			},
			function (error)
			{
			   // console.log(error.Error,"ERROR OCCURED");
			}
		);		
	});  	  
  }
 };
}]);

app.directive('toolTip', ['$compile',function($compile){	
	return {
		restrict: 'A',
		link: function(scope, iElm, iAttrs){
			iAttrs.$observe('title',function(){
				//iElm.tooltip( "destroy" );
				iElm.bootstrapTooltip();
			});
		}
	};
}]);

app.directive('ngConfirmClick', [
	function(){
		return {
			link: function (scope, element, attr) {
				var msg = attr.ngConfirmClick || "Are you sure?";
				var clickAction = attr.confirmedClick;
				element.bind('click',function (event) {
					if ( window.confirm(msg) ) {
						scope.$eval(clickAction)
					}
				});
			}
		};
	}
]);

// TO resolve conflict between bootstarp tooltip and jquery-ui-dragdrop. 
$(document).ready(function(){
	$.fn.bootstrapTooltip = $.fn.tooltip.noConflict();
});

app.directive('addFundForm', ['showFormError', 'hideFormError', '$rootScope', function (showFormError, hideFormError, $rootScope) {
	return {
		restrict: 'A',
		scope: {
			submitAddFund:'&'
		},
		link: function postLink(scope, iElement, iAttrs) {      
			scope.validationRulesDepositFund = {       
				deposit_amt			:{required:true}
			};

			scope.validationDepositFundMessage    = {   
				deposit_amt			:{required: $rootScope.lang.DEPOSIT_FUND_REQUIRED}
			};

			iElement.validate({
				errorElement: "label",
				rules:scope.validationRulesDepositFund,
				messages:scope.validationDepositFundMessage,
				errorPlacement: function (error, element){
					showFormError(error, element);
				},
				submitHandler: function(form) {         
					scope.submitAddFund();
				},
				success: function(error, element) {
					hideFormError(error, element);
				}
			});
		}
	};
}]);



app.directive('countdownDraft', ['Util','$interval',function (Util, $interval) {
	return {
		restrict: 'A',
		scope: { 
			date: '@',
			servertime: '@',
			dirTimeUp : '&'
		 },
		link: function (scope, element) 
		{  
			angular.element('.clock-loader').hide(); 
		   var future = Number(scope.date);
		   servertime = Number(scope.servertime);           
		   if (typeof future != "undefined" && future != "" && (future > servertime)) {
				var MainDiff = clientFuture ="";
				 MainDiff = future - servertime;
				 clientFuture = Math.floor(new Date().getTime()+MainDiff);
				$interval(function () {
					// var diff;
					var now = Number(new Date().getTime());                        
					if(now>clientFuture)
					{
						scope.dirTimeUp();
					}
					else
					{                        	
						var diff = Math.floor((clientFuture - now) / 1000);
						element.text('00:00:00');
						return element.text(Util.dhms(diff));
					}
					return true;
				}, 1000);
		   }                       
		}
	};
}
	]).factory('Util', [function () {
			return {
				dhms: function (t) {
					var days, hours, minutes, seconds;
					// days = Math.floor(t / 86400);
					// t -= days * 86400;
					hours = Math.floor(t / 3600) % 24;
					t -= hours * 3600;
					minutes = Math.floor(t / 60) % 60;
					t -= minutes * 60;
					seconds = t % 60;
					return [
						// days + ':',
						(hours < 10? '0' : '') + hours + ':',
						(minutes < 10? '0' : '') + minutes + ':',
						(seconds < 10? '0' : '') + seconds + ''
					].join('');
				}
			};
		}]);

	app.directive('dragAndSwap', ['$compile','$rootScope',function($compile, $rootScope){	
	return {
		restrict: 'A',
		scope: {
			  swapAction: "="
		},
		link: function(scope, iElm, iAttrs){
			function makeDragable(elem)
			{
				$(elem).draggable({
				revert: "invalid",
				cursor: "move",
				helper: "clone"
				});
				$(elem).droppable({
					drop: function(event, ui) {
						var swap_type = $(this).attr('data-swap-type');
						if(ui.draggable.attr('data-swap-type') !== $(this).attr('data-swap-type'))
						{
							return;
						}
						var source = JSON.parse(ui.draggable.attr('data-player'));
						var target = JSON.parse($(this).attr('data-player'));
						if(source.roster_position !== target.roster_position)
						{
							$rootScope.alert_error = "invalid position";
							return;
						}
						var s_p_id = ui.draggable.attr('data-player-id');
						var t_p_id = $(this).attr('data-player-id');
						// call for update position
						scope.swapAction(s_p_id, t_p_id, swap_type);

						var $dragElem = $(ui.draggable).clone().replaceAll(this);
						$(this).replaceAll(ui.draggable);
						makeDragable(this);		           
						makeDragable($dragElem);		           
					}
				});	
			}
			makeDragable(iElm);
		}
	};
}]);
  
app.directive('numbersOnly', [function(){
	// Runs during compile
	return {
		restrict: 'A', // E = Element, A = Attribute, C = Class, M = Comment
		link: function($scope, iElm, iAttrs, controller) {
			iElm.keypress(function(event){
				if ((event.which!=46||iElm.val().indexOf('.')!=-1) && (event.which<48||event.which>57) && event.which!=8 && event.which!=0)
				{
					event.preventDefault();
				}
			});
		}
	};
}]);

/*Directive to allow max length for element [max-length ="10"]*/
app.directive('maxLength',[function(){
	return{
		restrict: 'A',
		link: function($scope, iElm, iAttrs){			
			iElm.keypress(function(event){				
				if (event.which!=8 && event.which!=0 && iElm.val().length >= iAttrs.maxLength)
				{
					event.preventDefault();
				}
			});
		}
	};
}]);

app.directive('noSpecialChar', [function() {
	return {
	  require: 'ngModel',
	  restrict: 'A',
	  link: function(scope, element, attrs, modelCtrl) {
		modelCtrl.$parsers.push(function(inputValue) {
		  if (inputValue == undefined)
			return ''
		  cleanInputValue = inputValue.replace(/[^\w\s]/gi, '');
		  if (cleanInputValue != inputValue) {
			modelCtrl.$setViewValue(cleanInputValue);
			modelCtrl.$render();
		  }
		  return cleanInputValue;
		});
	  }
	}
}]);

app.directive('bodyscrolled', function () {
	return {
		restrict: 'A',
		link: function ($scope, element, attrs) {
				
			angular.element(window).bind("scroll", function() {
				var windowHeight = "innerHeight" in window ? window.innerHeight : document.documentElement.offsetHeight;
				var body = document.body, html = document.documentElement;
				var docHeight = Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight,  html.scrollHeight, html.offsetHeight);
				windowBottom = windowHeight + window.pageYOffset;
				if (windowBottom >= docHeight) {
					$scope.$apply(attrs.bodyscrolled);
				}
			});
		}
	};
});

app.directive('copyToClipboard',  function ($window) {
        var body = angular.element($window.document.body);
        var textarea = angular.element('<textarea/>');
        textarea.css({
            position: 'fixed',
            opacity: '0'
        });

        function copy(toCopy) {
            textarea.val(toCopy);
            body.append(textarea);
            textarea[0].select();

            try {
                var successful = document.execCommand('copy');
                if (!successful) throw successful;
            } catch (err) {
                console.log("failed to copy", toCopy);
            }
            textarea.remove();
        }

        return {
            restrict: 'A',
            link: function (scope, element, attrs) {
                element.bind('click', function (e) {
                    copy(attrs.copyToClipboard);
                });
            }
        }
    });

app.directive('ngEnter', function() {
        return function(scope, element, attrs) {
            element.bind("keydown keypress", function(event) {
                if(event.which === 13) {
                    scope.$apply(function(){
                        scope.$eval(attrs.ngEnter, {'event': event});
                    });

                    event.preventDefault();
                }
            });
        };
    });

app.directive('svg', function($http) {
    return {
        link: function(scope, element, attrs) {
            var imgId = attrs.id;
            var imgClass = attrs.class;
            var imgUrl = attrs.src;

            // Load svg content
            $http.get(imgUrl).success(function(data, status) {
                var svg = angular.element(data);
                for (var i = svg.length - 1; i >= 0; i--) {
                    if (svg[i].constructor.name == 'SVGSVGElement') {
                        svg = angular.element(svg[i]);
                        break;
                    }
                }

                if (typeof imgId !== 'undefined') {
                    svg.attr('id', imgId);
                }

                if (typeof imgClass !== 'undefined') {
                    svg.attr('class', imgClass);
                }
                // Remove invalid attributes
                svg = svg.removeAttr('xmlns:a');
                element.replaceWith(svg);
            });
            scope.$on('$destroy', function() {
                $svg.remove();
            });

        }
    };
})


app.directive('fileModel', ['$parse', function ($parse) {
            return {
               restrict: 'A',
               link: function(scope, element, attrs) {
                  var model = $parse(attrs.fileModel);
                  var modelSetter = model.assign;
                  
                  element.bind('change', function(){
                     scope.$apply(function(){
                        modelSetter(scope, element[0].files[0]);
                     });
                  });
               }
            };
         }]);


