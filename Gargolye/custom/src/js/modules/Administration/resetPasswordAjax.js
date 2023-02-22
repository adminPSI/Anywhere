const resetPasswordAjax = (function () {

    function getActiveInactiveUserlist(dataObj, callback) {
        // dataObj = {IsInActive}
        // This gets data for reset password page to populate the user table
        $.ajax({
            type: 'POST',
            url: $.webServer.protocol + '://' + $.webServer.address + ':' + $.webServer.port + '/' + $.webServer.serviceName + '/getActiveInactiveUserDateJSON/',
            data:
                '{"token":"' +
                $.session.Token +
                '","isActive":"' +
                dataObj.isActive +
                '"}',
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            success: function (response, status, xhr) {
                var res = response.getActiveInactiveUserDateJSONResult;
                callback(res);
            },
            error: function (xhr, status, error) { },
        });
    }

    function changeUserPassword(dataObj, callback) {
        $.ajax({
            type: 'POST',
            url: $.webServer.protocol + '://' + $.webServer.address + ':' + $.webServer.port + '/' + $.webServer.serviceName + '/getUserCredDateJSON/',
            data:
                '{"token":"' +
                $.session.Token +
                '","userId":"' +
                dataObj.UserID +
                '"}',
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            success: function (response, status, xhr) {
                var res = response.getUserCredDateJSONResult;
                myObj = JSON.parse(res)
                getPassword = myObj[0].password;

                $.ajax({
                    type: 'POST',
                    url:
                        $.webServer.protocol +
                        '://' +
                        $.webServer.address +
                        ':' +
                        $.webServer.port +
                        '/' +
                        $.webServer.serviceName +
                        '/resetPassword/',
                    data:
                        '{"userId":"' +
                        dataObj.UserID +
                        '", "hash":"' +
                        $().crypt({
                            method: 'md5',
                            source: getPassword,
                        }) +
                        '", "newPassword":"' +
                        dataObj.newPW +
                        '", "changingToHashPassword":"' +
                        $().crypt({
                            method: 'md5',
                            source: dataObj.confirmPW,
                        }) +
                        '"}',
                    contentType: 'application/json; charset=utf-8',
                    dataType: 'json',
                    success: function (response, status, xhr) {
                        var res = JSON.stringify(response);
                        callback(res);
                    },
                });
            },
            error: function (xhr, status, error) {
            },
        });
    }

    return {
        getActiveInactiveUserlist,
        changeUserPassword
    }
})();