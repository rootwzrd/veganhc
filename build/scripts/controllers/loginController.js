
appAppcontrollers.controller('appApp-loginCntrl',function loginController ( $scope, $rootScope, AppConstants,SelectView,SessionManager, $location,loggerService ) {
	"use strict";

	var log = loggerService('appApp-loginCntrl');
	log.log("Inside appApp-loginCntrl");

	$scope.username='';
	$scope.password='';

	$scope.signIn=function(){

	}
	
	$scope.cancel=function(){
		$scope.username='';
		$scope.password='';
		
	}
	

});

