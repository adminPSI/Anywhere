var intellivue = (function(){
  var redirectPopup;

  function getLoginCredentials(consumerId) {
    data = {
      token: $.session.Token,
      consumerId: consumerId,
      userId: $.session.UserId,
      applicationName: $.session.applicationName,
    };
    $.ajax({
      type: 'POST',
      url: $.webServer.protocol + '://' + $.webServer.address + ':' + $.webServer.port + '/' + $.webServer.serviceName + '/getIntellivueAppId/',
      data: JSON.stringify(data),
      contentType: 'application/json; charset=utf-8',
      dataType: 'json',
      success: function(response, status, xhr) {
        data = response.getIntellivueAppIdResult;
        POPUP.hide(redirectPopup);
        window.open(data, '_blank');
      },
    });
    }

    //gets the app list to display. Pass it the token and $.session.UserId 
    function getApplicationListHostedWithUser(callback) {
        data = {
            token: $.session.Token,
            userId: $.session.UserId 
        };
        $.ajax({
            type: 'POST',
            url: $.webServer.protocol + '://' + $.webServer.address + ':' + $.webServer.port + '/' + $.webServer.serviceName + '/getApplicationListHostedWithUser/',
            data: JSON.stringify(data),
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            success: function (response, status, xhr) {
                data = response.getApplicationListHostedWithUserResult;
                data = UTIL.parseXml(data);
                var test = [];
                var map = new Map();
                var applicationobjectArray = [].slice.call(data.getElementsByTagName('ApplicationEntry'));              
                
                applicationobjectArray.forEach(Applications => {
                    var appName = Applications.getAttribute('Name');
                    var refId = Applications.getAttribute('RefID');
                    test.push(appName);
                    map.set(refId, appName);
                });
                callback(map);
            },
        });
    }

    function getViewURL(consumerId, appName, callback) {
        data = {
            token: $.session.Token,
            consumerId: consumerId,
            userId: $.session.UserId,
            appName: appName,
            applicationName: $.session.applicationName
        };
        $.ajax({
            type: 'POST',
            url: $.webServer.protocol + '://' + $.webServer.address + ':' + $.webServer.port + '/' + $.webServer.serviceName + '/getIntellivueViewURL/',
            data: JSON.stringify(data),
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            success: function (response, status, xhr) {
               // data = response.getIntellivueViewURLResult;
               // POPUP.hide(redirectPopup);
                // window.open(response.getIntellivueViewURLResult, '_blank');
               callback(response.getIntellivueViewURLResult) 
            },
        });
    }
  
  function showIntellivueRedirectWarning() {
    redirectPopup = POPUP.build({
      header: 'You are being redirected outside Anywhere to Intellivue. If you are using a popup blocker please make sure it is disabled.'
    });
  
    POPUP.show(redirectPopup);
  }

  return {
    getLoginCredentials,
    showIntellivueRedirectWarning,
    getApplicationListHostedWithUser,
    getViewURL
  }
})();