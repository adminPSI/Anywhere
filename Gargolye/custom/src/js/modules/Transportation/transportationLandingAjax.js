const TRANS_mainLandingAjax = (function() {

  function getDrivers() {
    const data = {
      token: $.session.Token
    }
    return $.ajax({
			type: 'POST',
			url: $.webServer.protocol + '://' + $.webServer.address + ':' + $.webServer.port + '/' + $.webServer.serviceName + '/getDrivers/',
			data: JSON.stringify(data),
			contentType: 'application/json; charset=utf-8',
			dataType: 'json',
		});
  }

  function getVehicles() {
    const data = {
      token: $.session.Token,
    }
    return $.ajax({
			type: 'POST',
			url: $.webServer.protocol + '://' + $.webServer.address + ':' + $.webServer.port + '/' + $.webServer.serviceName + '/getVehicleDropdown/',
			data: JSON.stringify(data),
			contentType: 'application/json; charset=utf-8',
			dataType: 'json',
		});
  }
  function getAltAddresses() {
    const data = {
      token: $.session.Token,
      consumerId: "%"
    }
    return $.ajax({
			type: 'POST',
			url: $.webServer.protocol + '://' + $.webServer.address + ':' + $.webServer.port + '/' + $.webServer.serviceName + '/getAlternateAddresses/',
			data: JSON.stringify(data),
			contentType: 'application/json; charset=utf-8',
			dataType: 'json',
		});
  }
  return {
    getDrivers,
    getVehicles,
    getAltAddresses
  }
})();