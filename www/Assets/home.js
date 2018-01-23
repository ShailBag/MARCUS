mainApp.controller('homeCtrl', ['$scope', 'HomeFactory', function ($scope, HomeFactory) {
	//setTimeout(shownotify, 40000);
    setInterval(shownotify, 50000);
    var t = 0;
	function shownotify()
	{
		var msg = 'Result 1';
		if( t == 0){
			msg = 'Result 1';
			t = 1;
		}
		else{
			msg = "Other result";
			t = 0;
		}
		cordova.plugins.notification.local.schedule({
			title: 'MARCUS Alert',
			text: msg,
			foreground: true
		});
	}
	
}]);

mainApp.factory("HomeFactory", ["$rootScope", "$http", function ($rootScope, $http) {
    this.GetBaseUrl = function () {
        if (this.UserInfo.UserSign != undefined) {
            UserSign = this.UserInfo.UserSign;
        }
        return onlineApplicationUrl + "/" + UserSign + "/" + this.UserSiteID + "/" + UserLang + "/" + ModuleName + "/" + dataSyncController;
    }

    
    return this;
}]);