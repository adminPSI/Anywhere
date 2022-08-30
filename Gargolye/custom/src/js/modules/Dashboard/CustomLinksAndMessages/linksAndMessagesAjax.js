var linksAndMessagesWidgetAjax = (function() {
	function getSystemMessagesAndCustomLinks(callback) {
		$.ajax({
			type: 'POST',
			url:
        $.webServer.protocol + '://' + 
        $.webServer.address + ':' + 
        $.webServer.port + '/' + 
        $.webServer.serviceName + '/getSystemMessagesAndCustomLinksJSON/',
			data: '{"token":"' + $.session.Token + '"}',
			contentType: 'application/json; charset=utf-8',
			dataType: 'json',
			success: function(response, status, xhr) {
				var res;
				try {
          res = response.getSystemMessagesAndCustomLinksJSONResult;
          callback(res, null);
				} catch (e) {
					callback(null, error);
				}
			},
			error: function(xhr, status, error) {
				callback(error, null);
			},
		});
  }
  
  function loadCaraSolva() {
    var data = {token: $.session.Token};
    $.ajax({
      type: "POST",
      url: 
        $.webServer.protocol + "://" + 
        $.webServer.address + ":" + 
        $.webServer.port + "/" + 
        $.webServer.serviceName + "/CaraSolvaURL/",
      data: JSON.stringify(data),
      contentType: "application/json; charset=utf-8",
      dataType: "json",
      success: function (response, status, xhr) {
        if (response && response.CaraSolvaURLResult) {
          window.open(response.CaraSolvaURLResult, "_blank");
        }
      },
    });
  }

	return {
    getSystemMessagesAndCustomLinks,
    loadCaraSolva
	};
})();
