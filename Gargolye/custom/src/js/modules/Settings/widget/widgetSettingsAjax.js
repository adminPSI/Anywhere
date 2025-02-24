const widgetSettingsAjax = (function () {
    function getWidgetSettings() {
        data = {
            token: $.session.Token
        };
        return $.ajax({
            type: "POST",
            url:
                $.webServer.protocol +
                "://" +
                $.webServer.address +
                ":" +
                $.webServer.port +
                "/" +
                $.webServer.serviceName +
                "/getUserWidgetSettings/",
            data: JSON.stringify(data),
            contentType: "application/json; charset=utf-8",
            dataType: "json"
        });
    }

    function setWidgetSettingConfig(widgetId, widgetConfig, showHide) {
        data = {
            token: $.session.Token,
            widgetId: widgetId,
            showHide: showHide,
            widgetConfig: widgetConfig
        };
        return $.ajax({
            type: "POST",
            url:
                $.webServer.protocol +
                "://" +
                $.webServer.address +
                ":" +
                $.webServer.port +
                "/" +
                $.webServer.serviceName +
                "/updateUserWidgetSettings/",
            data: JSON.stringify(data),
            contentType: "application/json; charset=utf-8",
            dataType: "json"
        });
    }

    function setWidgetSettingOrder(updatedListOrder) {
        data = {
            token: $.session.Token,
            updatedListOrder: updatedListOrder,
        };
        return $.ajax({
            type: "POST",
            url:
                $.webServer.protocol +
                "://" +
                $.webServer.address +
                ":" +
                $.webServer.port +
                "/" +
                $.webServer.serviceName +
                "/updateUserWidgetOrderSettings/",
            data: JSON.stringify(data),
            contentType: "application/json; charset=utf-8",
            dataType: "json"
        });
    }

    function setWidgetFilter(widgetId, filterKey, filterValue) {
        data = {
            token: $.session.Token,
            widgetId: widgetId,
            filterKey: filterKey,
            filterValue: filterValue
        };
        return $.ajax({
            type: "POST",
            url:
                $.webServer.protocol +
                "://" +
                $.webServer.address +
                ":" +
                $.webServer.port +
                "/" +
                $.webServer.serviceName +
                "/setWidgetFilter/",
            data: JSON.stringify(data),
            contentType: "application/json; charset=utf-8",
            dataType: "json"
        });
    }

    async function getWidgetFilter(widgetId, filterKey, callback) {
        data = {
            token: $.session.Token,
            widgetId: widgetId,
            filterKey: filterKey,
        };
        return $.ajax({
            type: "POST",
            url:
                $.webServer.protocol +
                "://" +
                $.webServer.address +
                ":" +
                $.webServer.port +
                "/" +
                $.webServer.serviceName +
                "/getWidgetFilter/",
            data: JSON.stringify(data),
            contentType: "application/json; charset=utf-8",
            dataType: "json"
        });
    }

    return {
        getWidgetSettings,
        setWidgetSettingConfig,
        setWidgetSettingOrder,
        setWidgetFilter,
        getWidgetFilter
    };
})();
