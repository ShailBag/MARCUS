mainApp.controller('loginCtrl', ['$scope', '$location', '$http', 'HomeFactory', function ($scope, $location, $http, HomeFactory) {
    var element = $('#loadingText');
    $("#qlHeader").hide();
    $("#qlInnerPageHeader").hide();
    HomeFactory.UserInfo = new Object();
    HomeFactory.UserSiteID = 0;
    HomeFactory.IsPullComplete = false;
    HomeFactory.IsOnlineLogin = false;
    HomeFactory.isOffline = false;    
    window.localStorage.removeItem('UserEmail');
		//customize the default "Loading..." text
		kendo.ui.progress.messages = {
			loading: "Signing In..."
		};
		
        $scope.email = "sb@b.com";
        $scope.Password = "Pass@234";
                $scope.CallFunction = function () {
	var db = window.sqlitePlugin.openDatabase({ name: "QuayBoard.db", location: 'default' });
            if ($scope.email == null || $scope.Password == null) {
                alert("UserID & Password Should not be Blank.");
            }
            else {
				if (navigator.network.connection.type == Connection.NONE) {
                    db.transaction(searchOfflineUserDB, function (e) {
                        HomeFactory.ErrorLog('Login-searchOfflineUserDB', e.message);
                    });
                }
                else {
					kendo.ui.progress(element, true);
                    $http({
                        url: onlineApplicationUrl + '/Account/CordovaLogin',
                        dataType: 'json',
                        params: { Email: $scope.email, Password: $scope.Password },
                        method: 'POST',
                        crossDomain: true,
                        headers: {
                            "Content-Type": "application/json"
                        }
                    }).then(function (res) {
                        if (res.data == 'true') {
                            HomeFactory.IsOnlineLogin = true;
                            db.transaction(searchOnlineUserDB, function (e) {
                                HomeFactory.ErrorLog('Login-searchOnlineUserDB', e.message);
                            });
                        }
                        else {
							kendo.ui.progress(element, false);
                            alert("Not Valid UserID");
                        }
                        }, function (res) {
                            kendo.ui.progress(element, false);
                            alert('Server is Down.\nPlease Contact Administrator.');
                            HomeFactory.ErrorLog('Login', res.message);
                        });
                }
            }

            function searchOfflineUserDB(tx) {
				kendo.ui.progress(element, true);
                var EmailID = $scope.email.toLowerCase();
                var Password = $scope.Password;
                tx.executeSql('SELECT * FROM USER where Name=? and Password=?', [EmailID, Password], queryOfflineSuccess, function (e) {
                    HomeFactory.ErrorLog('Login-searchOfflineUserDB', e.message);
                });
            }

            function searchOnlineUserDB(tx) {
                var EmailID = $scope.email.toLowerCase();
                tx.executeSql('SELECT * FROM USER where Name="' + EmailID + '"', [], queryOnlineSuccess, function (e) {
                    HomeFactory.ErrorLog('Login-searchOnlineUserDB', e.message);
                });
            }



            function queryOnlineSuccess(tx, resultSet) {
                if (resultSet.rows.length > 0) {
                    var EmailID = $scope.email.toLowerCase();
                    var Password = $scope.Password;
                    var IsActive = '1';
                    tx.executeSql('UPDATE USER SET Password= "' + Password + '" WHERE Name = "' + EmailID + '"', [], successCB, function (e) {
                        HomeFactory.ErrorLog('Login-queryOnlineSuccess', e.message);
                    });

                }
                else {

                    var EmailID = $scope.email.toLowerCase();
                    var Password = $scope.Password;
                    var IsActive = '1';
                    tx.executeSql('INSERT INTO USER(Name,LongName,Password,IsActive)VALUES (?,?,?,?)', [EmailID, EmailID, Password, IsActive]);
                    tx.executeSql('SELECT * FROM USER', [], successCB, function (e) {
                        HomeFactory.ErrorLog('Login-queryOnlineSuccess', e.message);
                    });
                }


            }

            function successCB(tx, resultSet) {
                var len = resultSet.rows.length;
                SetUserName();
                window.location = "#/home";
            }
                      
            function queryOfflineSuccess(tx, resultSet) {
                if (resultSet.rows.length > 0) {
                    SetUserName();
                    window.location = "#/home";
                }
                else {                    
                    kendo.ui.progress(element, false);
                    alert("Invalid UserID");
                }
            }

            function SetUserName() {
                window.localStorage.setItem('UserEmail', $scope.email.toLowerCase());
                window.localStorage.setItem('Password', $scope.Password);
            }
            
		};
	}]);
document.addEventListener("backbutton", onBackKeyDown, false);
function onBackKeyDown() {

    if (window.location.hash == '#/home') {

        kendo.confirm("Do you want to exit ?").then(function () {           
            navigator.app.exitApp();
        }, function () {

        });
    }
    else if (window.location.hash == '#/login') {
        kendo.confirm("Do you want to exit ?").then(function () {  
                   navigator.app.exitApp();
        }, function () {

        });



        // Exit app if current page is a login page
    }
    else {
        navigator.app.backHistory(); // Go back in history in any other case
    }
}
