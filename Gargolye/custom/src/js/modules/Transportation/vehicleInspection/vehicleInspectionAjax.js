const TRANS_vehicleInspectionAjax = (function() {

  function getInspectionCategories() {
    const data = {
      token: $.session.Token,
    }
    return $.ajax({
			type: 'POST',
			url: $.webServer.protocol + '://' + $.webServer.address + ':' + $.webServer.port + '/' + $.webServer.serviceName + '/getInspectionCategories/',
			data: JSON.stringify(data),
			contentType: 'application/json; charset=utf-8',
			dataType: 'json',
		});
  }

  function insertVehicleInspection(data) {
    return $.ajax({
			type: 'POST',
			url: $.webServer.protocol + '://' + $.webServer.address + ':' + $.webServer.port + '/' + $.webServer.serviceName + '/insertVehicleInspection/',
			data: JSON.stringify(data),
			contentType: 'application/json; charset=utf-8',
			dataType: 'json',
		});
  }
  function insertUpdateVehicleInspectionDetails(data) {
    return $.ajax({
			type: 'POST',
			url: $.webServer.protocol + '://' + $.webServer.address + ':' + $.webServer.port + '/' + $.webServer.serviceName + '/insertUpdateVehicleInspectionDetails/',
			data: JSON.stringify(data),
			contentType: 'application/json; charset=utf-8',
			dataType: 'json',
		});
  }

  function getCompletedInspections(data) {
    return $.ajax({
			type: 'POST',
			url: $.webServer.protocol + '://' + $.webServer.address + ':' + $.webServer.port + '/' + $.webServer.serviceName + '/getCompletedInspections/',
			data: JSON.stringify(data),
			contentType: 'application/json; charset=utf-8',
			dataType: 'json',
		});
	}
	
  function getVehicleInspectionDetails(vehicleInspectionId) {
		const data = {
			token: $.session.Token,
			vehicleInspectionId: vehicleInspectionId
		}
    return $.ajax({
			type: 'POST',
			url: $.webServer.protocol + '://' + $.webServer.address + ':' + $.webServer.port + '/' + $.webServer.serviceName + '/getVehicleInspectionDetails/',
			data: JSON.stringify(data),
			contentType: 'application/json; charset=utf-8',
			dataType: 'json',
		});
	}
	
	function updateVehicleInspection(data) {
		return $.ajax({
			type: 'POST',
			url: $.webServer.protocol + '://' + $.webServer.address + ':' + $.webServer.port + '/' + $.webServer.serviceName + '/updateVehicleInspection/',
			data: JSON.stringify(data),
			contentType: 'application/json; charset=utf-8',
			dataType: 'json',
		});
	}

	function deleteVehicleInspection(vehicleInspectionId) {
		const data = {
			token: $.session.Token,
			vehicleInspectionId: vehicleInspectionId
		}
    return $.ajax({
			type: 'POST',
			url: $.webServer.protocol + '://' + $.webServer.address + ':' + $.webServer.port + '/' + $.webServer.serviceName + '/deleteVehicleInspection/',
			data: JSON.stringify(data),
			contentType: 'application/json; charset=utf-8',
			dataType: 'json',
		});
	}

  return {
    getInspectionCategories,
    insertVehicleInspection,
    getCompletedInspections,
		insertUpdateVehicleInspectionDetails,
		getVehicleInspectionDetails,
		updateVehicleInspection,
		deleteVehicleInspection
  }
})();