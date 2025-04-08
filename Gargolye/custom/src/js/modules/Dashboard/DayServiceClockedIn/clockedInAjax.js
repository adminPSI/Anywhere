var clockedInWidgetAjax = (function() {

    function getLocationsForDashboardDayServices(callback) {
        $.ajax({
            type: "POST",
            url:
                $.webServer.protocol + "://" +
                $.webServer.address + ":" +
                $.webServer.port + "/" +
                $.webServer.serviceName + "/getDashboardDayServicesLocationsJSON/",
            data: '{"token":"' + $.session.Token + '"}',
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response, status, xhr) {
                res = response.getDashboardDayServicesLocationsJSONResult;
                callback(res);
            },
            error: function (xhr, status, error) {
            }
        });
    }

    function getClockedInConsumerNamesDayServicesAjax(locationId, callback) {
        var isCaseLoad = $.session.DayServiceCaseLoad;
        $.ajax({
            type: "POST",
            url:
                $.webServer.protocol + "://" +
                $.webServer.address + ":" +
                $.webServer.port + "/" +
                $.webServer.serviceName + "/getClockedInConsumerNamesDayServicesJSON/",
            data: '{"token":"' + $.session.Token + '", "locationId":"' + locationId + '", "isCaseLoad":"' + isCaseLoad + '"}',
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response, status, xhr) {
                var res = response.getClockedInConsumerNamesDayServicesJSONResult;
                callback(res);
            },
            error: function (xhr, status, error) {
            }
        });
    } 

    function getClockedInStaffNamesDayServicesAjax(locationId, callback) {
        $.ajax({
            type: "POST",
            url:
                $.webServer.protocol + "://" +
                $.webServer.address + ":" +
                $.webServer.port + "/" +
                $.webServer.serviceName + "/getClockedInStaffNamesDayServicesJSON/",
            data: '{"token":"' + $.session.Token + '", "locationId":"' + locationId + '"}',
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response, status, xhr) {
                var res = response.getClockedInStaffNamesDayServicesJSONResult;
                callback(res);
            },
            error: function (xhr, status, error) {
            }
        });
    }

    return {
        getLocationsForDashboardDayServices,
        getClockedInConsumerNamesDayServicesAjax,
        getClockedInStaffNamesDayServicesAjax
    }
}());