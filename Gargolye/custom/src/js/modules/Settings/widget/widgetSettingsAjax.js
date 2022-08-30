const widgetSettingsAjax = (function() {
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

  return {
    getWidgetSettings,
    setWidgetSettingConfig
  };
})();
