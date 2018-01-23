var mainApp = angular.module('quayboard', ['ngRoute', 'kendo.directives']);
var kendoapp = new kendo.mobile.Application(document.body, { skin: "nova" });
var onlineApplicationUrl = 'http://172.16.23.101:8384';
mainApp.config(function($routeProvider) {	
	$routeProvider
        .when('/login', {
            templateUrl: 'Login.html',
            controller: 'loginCtrl'
        })
        .when('/home', {
			templateUrl: 'Home.html',
			controller:'homeCtrl'
		})
		.otherwise({			
            redirectTo: '/home'
		});
});

mainApp.controller('layoutCtrl', ['$scope', '$rootScope', 'HomeFactory', '$http', function ($scope, $rootScope, HomeFactory, $http) {
    $rootScope.InnerHeader = "";
    $scope.LogOut = function () {
        if (navigator.network.connection.type != Connection.NONE) {
            $http({
                url: onlineApplicationUrl + '/Account/LogOff',
                dataType: 'json',               
                method: 'POST',
                crossDomain: true,
                headers: {
                    "Content-Type": "application/json"
                }
            }).then(function (res) { });
        }
        window.location = "#/login";

    }

  
}]);

function ShowHomeHeader() {
    $("#qlHeader").show();
    $("#qlInnerPageHeader").hide();
    
}
function ShowInnerHeader() {
    $("#qlHeader").hide();
    $("#qlInnerPageHeader").show();
}

function GoBack() {
    navigator.app.backHistory()
}




