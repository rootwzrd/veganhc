var appApp = angular.module("appApp", [ 'ngRoute', 'ngSanitize', 'ngTouch','ngResource','ngAnimate','appApp-application','logger']);
var appAppConstants=angular.module('appApp-constants', []);
var commonSrv = angular.module('appApp-commons', []);
var appAppcontrollers = angular.module('appApp-controllers', []);
var appAppdirectives = angular.module('appApp-directives', []);
var appAppservices = angular.module('appApp-services', []);
var appAppfilters = angular.module('appApp-filters', []);
var appAppGlobal={};
angular.module('appApp-application', [ 'appApp-commons', 'appApp-controllers','appApp-directives', 'appApp-services',
                                          'appApp-constants','appApp-filters']);

//setting all urls from the appAppGlobal.Routes (config.json)
appApp.config(['$routeProvider', function routeProvider($routeProvider) {
	'use strict';
	var views=appAppGlobal.Routes;
	for (var viewKey in views) {
		if (views.hasOwnProperty(viewKey)) {
			switch (viewKey) {
			case 'otherwise':
				$routeProvider.otherwise(views[viewKey]);
				break;
			default:
				$routeProvider.when(viewKey, (views[viewKey]).settings);
			break;
			}
		}
	}
}]);

appApp.run(['$rootScope','SessionManager','SelectView','loggerService',
               function appAppRun($rootScope, SessionManager, SelectView,loggerService) {
	'use strict';

	$rootScope.hideSpinner = false;
	$rootScope.locations = [];
	//$rootScope.loggerQueue = FixedQueue( 100, [ "appApp started"] );
	$rootScope.currentView='';
	$rootScope.pageTitle='';
	$rootScope.bodyColour="gray";
	
	var log=loggerService('rootscope');
	// Logout function is available in any pages
	$rootScope.logout = function() {
		//log.log("inside logout");
		SessionManager.clearSession();
		SelectView.gotoLogin();
	};

	$rootScope.logs = function(){
		$('.logs_container').toggleClass('open',500);
	};

	/*$rootScope.clearLogs = function(){
		$rootScope.loggerQueue = FixedQueue( 100, [ "Log cleared"] );
	};


	$rootScope.setlog = function(loggerMsg) {
		if($rootScope.headerVars.LoggerOn)
			$rootScope.loggerQueue.add(loggerMsg);
	};*/

	$rootScope.$on('$routeChangeSuccess', function routeChangeSuccess($event, current) {

		if(current&& current.originalPath&& current.originalPath.length>0 &&
				current.originalPath!==$rootScope.currentView){

			$rootScope.currentView=current.originalPath;
			//log.log("current url",$rootScope.currentView);
			var peripheralArray=[];
			if(appAppGlobal.Routes.hasOwnProperty($rootScope.currentView) && (appAppGlobal.Routes[$rootScope.currentView]).config){

				var pageConfig=appAppGlobal.Routes[$rootScope.currentView].config;

				$rootScope.pageTitle=(pageConfig.header)?pageConfig.header:'';
				$rootScope.bodyColour=(pageConfig.bodyColor)?pageConfig.bodyColor:'gray';
				

				
			} 
			
		}
	});

} ]);



/**  Bootstrapping angular app after loading connfig.json file**/


$(function () {
	'use strict';
	$.ajax({
		url: "scripts/config.json",
		type:"GET",
	}).done(function startup(configData) {

		try{
			var data=angular.fromJson(configData);
			var Config=data.Common;//add all common properties first.
			// Set your constant provider
			if(Config){
				for(var commonkey in Config){
					if(Config.hasOwnProperty(commonkey)){
						appAppConstants.value(commonkey, Config[commonkey]);
					}
				}
			}
			if(data.Global){
				Config=data.Global;
				if(Config){
					for(var envkey in Config){
						if(Config.hasOwnProperty(envkey)){
							appAppGlobal[envkey]= Config[envkey];
						}
					}
				} 
			}
			var debug=false;
			if(data.Env){
				Config=debug?(data.Env.debug):(data.Env.app);
				if(Config){
					for(var envkey in Config){
						if(Config.hasOwnProperty(envkey)){
							appAppConstants.value(envkey, Config[envkey]);
						}
					}
				}
			}
		}
		catch(e){
			throw new Error("[appApp-constants] - Configuration not found");
		}


		// Bootstraping angular app
		angular.bootstrap(document, ['appApp']);

	});
});



