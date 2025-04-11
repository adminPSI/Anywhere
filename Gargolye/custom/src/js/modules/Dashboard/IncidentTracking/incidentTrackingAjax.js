var incidentTrackingWidgetAjax = (function () {
    //$.session.incidentTrackingViewCaseLoad
    function getITDashboardWidgetDataAjax(callback) {
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
                '/getITDashboardWidgetData/',
            data:
                '{"token":"' +
                $.session.Token +
                '","viewCaseLoad":"' +
                $.session.incidentTrackingCaseLoad +
                '"}',
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            success: function (response, status, xhr) {
                var res = response.getITDashboardWidgetDataResult;
                callback(res);
            },
            error: function (xhr, status, error) {
                callback(error, null);
            },
        });
    }

    return {
        getITDashboardWidgetDataAjax,
    };
})();
