const TRANS_addRouteAjax = (function() {

  function insertTrip(data) {
    return $.ajax({
			type: 'POST',
			url: $.webServer.protocol + '://' + $.webServer.address + ':' + $.webServer.port + '/' + $.webServer.serviceName + '/insertTripCompleted/',
			data: JSON.stringify(data),
			contentType: 'application/json; charset=utf-8',
			dataType: 'json',
		});
  }

  return {
    insertTrip
  }
})();