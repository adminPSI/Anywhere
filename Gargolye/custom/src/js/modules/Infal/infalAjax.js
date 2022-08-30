var infalAjax = (function() {

    function InfalGetJobsAjax(empId, callback) {
        $.ajax({
            type: "POST",
            url: $.webServer.protocol + "://" + $.webServer.address + ":" + $.webServer.port +
                "/" + $.webServer.serviceName + "/InfalGetJobs/",
            //data: '{"id":"' + $.session.PeopleId + '"}',
            //data: '{"id":"' + 1308 + '"}',
            data: JSON.stringify(empId),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response, status, xhr) {
                var res = JSON.parse(response.InfalGetJobsResult);
                callback(null, res);
            },
            error: function (xhr, status, error) {
                callback(error, null);
            },
        });
    } 
    
    function InfalGetClockInsAndOutsAjax(empId, callback) {
        $.ajax({
            type: "POST",
            url: $.webServer.protocol + "://" + $.webServer.address + ":" + $.webServer.port +
                "/" + $.webServer.serviceName + "/InfalGetClockInsAndOuts/",
            data: JSON.stringify(empId),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response, status, xhr) {
                var res = JSON.parse(response.InfalGetClockInsAndOutsResult);
                callback(null, res);
            },
            error: function (xhr, status, error) {
                callback(error, null);
            },
        });
    }
    
    function InfalClockInAjax(data, callback) {
        $.ajax({
            type: "POST",
            url: $.webServer.protocol + "://" + $.webServer.address + ":" + $.webServer.port +
                "/" + $.webServer.serviceName + "/InfalClockIn/",
            //data: '{"id":"' + $.session.PeopleId + '"}',
            data: JSON.stringify(data),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response, status, xhr) {
                var res = JSON.stringify(response);
                resObj = JSON.parse(res);
                callback(resObj);
            },
            error: function (xhr, status, error) {
                callback(error, null);
            },
        });
    }
    
    function InfalClockOutAjax(data, callback) {
        $.ajax({
            type: "POST",
            url: $.webServer.protocol + "://" + $.webServer.address + ":" + $.webServer.port +
                "/" + $.webServer.serviceName + "/InfalClockOut/",
            //data: '{"id":"' + $.session.PeopleId + '"}',
            data: JSON.stringify(data),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response, status, xhr) {
                var res = JSON.stringify(response);
                callback(null, res);
            },
            error: function (xhr, status, error) {
                callback(error, null);
            },
        });
    }
    
    function getInfalUserNameAjax(empId, callback) {
        $.ajax({
            type: "POST",
            url: $.webServer.protocol + "://" + $.webServer.address + ":" + $.webServer.port +
                "/" + $.webServer.serviceName + "/getInfalUserName/",
            data: '{"empId":"' + empId + '"}',
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response, status, xhr) {
                var res = JSON.stringify(response);
                callback(res);
            },
            error: function (xhr, status, error) {
                callback(error, null);
            },
        });
    }

	return {
        InfalGetJobsAjax,
        InfalGetClockInsAndOutsAjax,
        InfalClockInAjax,
        InfalClockOutAjax,
        getInfalUserNameAjax
	};
})();