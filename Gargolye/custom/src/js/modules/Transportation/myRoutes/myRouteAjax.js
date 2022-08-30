const TRANS_myRotueAjax = (function() {

  function getTrips(date) {
    const data = {
      token: $.session.Token,
      serviceDateStart: date,
      serviceDateStop: date,
      personId: $.session.PeopleId,
      locationId: '%'
    }
    return $.ajax({
			type: 'POST',
			url: $.webServer.protocol + '://' + $.webServer.address + ':' + $.webServer.port + '/' + $.webServer.serviceName + '/getTrips/',
			data: JSON.stringify(data),
			contentType: 'application/json; charset=utf-8',
			dataType: 'json',
		});
  }

  return {
    getTrips
  }
})();