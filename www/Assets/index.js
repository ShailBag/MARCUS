document.addEventListener("deviceready", onDeviceReady, false);

function onDeviceReady() {
    StatusBar.backgroundColorByHexString("#3b8ab8");
   receivedEvent("deviceready");
   var db = window.sqlitePlugin.openDatabase({name: "Marcus.db", location: 'default'});
   db.transaction(populateDB, function (e) {
       HomeFactory.ErrorLog('Error processing SQL-populateDB', e.message);
   }, successCB);
 
}

function successCB() {
 window.location = "Layout.html";
}

function populateDB(tx) {	
    tx.executeSql('CREATE TABLE IF NOT EXISTS USER (ID INTEGER primary key AUTOINCREMENT,Name,LongName,Password,IsActive, site NULL, UserID INTEGER, UserSign,LastSyncDate DATETIME)');
    tx.executeSql('CREATE TABLE IF NOT EXISTS mrWatchList (ID INTEGER primary key ,itemCode)');
    
}

function receivedEvent(id) {
     var parentElement = document.getElementById(id);
     var listeningElement = parentElement.querySelector('.listening');
     var receivedElement = parentElement.querySelector('.received');

     listeningElement.setAttribute('style', 'display:none;');
     receivedElement.setAttribute('style', 'display:block;');

 }