var ConsumerFinancesWidgetAjax = (function () {
    var absentLocationsArray = [];
    var consumerArray = [];

    function getLocationsForDashboardAbsent(callback) {
        if (absentLocationsArray.length > 0) {
            callback(absentLocationsArray);
            return;
        }
        $.ajax({
            type: 'POST',
            url:
                $.webServer.protocol + '://' +
                $.webServer.address + ':' +
                $.webServer.port + '/' +
                $.webServer.serviceName + '/getLocationsJSON/',
            data: '{"token":"' + $.session.Token + '"}',
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            success: function (response, status, xhr) {
                var res = response.getLocationsJSONResult;
                absentLocationsArray = res;
                callback(res);
            },
            error: function (xhr, status, error) {
            },
        });
    }

    function getCFWidgetConsumers(callback) {
        if (consumerArray.length > 0) {
            callback(consumerArray);
            return;
        }

        $.ajax({
            type: 'POST',
            url:
                $.webServer.protocol + '://' +
                $.webServer.address + ':' +
                $.webServer.port + '/' +
                $.webServer.serviceName + '/getCFWidgetConsumers/',
            data: '{"token":"' + $.session.Token + '"}',
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            success: function (response, status, xhr) {
                var res = response.getCFWidgetConsumersResult;
                consumerArray = res; 
                callback(res);
            },
            error: function (xhr, status, error) {
            },
        });
    }

    function getConsumerFinanceWidgetEntriesDataAjax(filterData, callback) {
        $.ajax({
            type: 'POST',
            url:
                $.webServer.protocol + '://' +
                $.webServer.address + ':' +
                $.webServer.port + '/' +
                $.webServer.serviceName + '/getConsumerFinanceWidgetEntriesData/',
            data: JSON.stringify(filterData),
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            success: function (response, status, xhr) {
                var res = response.getConsumerFinanceWidgetEntriesDataResult;
                callback(res, null);
            },
            error: function (xhr, status, error) {
                callback(error, null);
            },
        });
    }

    return {
        getLocationsForDashboardAbsent: getLocationsForDashboardAbsent,
        getCFWidgetConsumers: getCFWidgetConsumers,
        getConsumerFinanceWidgetEntriesDataAjax: getConsumerFinanceWidgetEntriesDataAjax,
    };
})();
