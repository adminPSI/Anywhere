var adminSingleEntryWidgetAjax = (function() {
	function getSingleEntryAdminApprovalNumbers(callback) {
		$.ajax({
			type: 'POST',
			url:
				$.webServer.protocol + '://' +
				$.webServer.address + ':' +
				$.webServer.port + '/' +
				$.webServer.serviceName + '/getSingleEntryAdminApprovalNumbersJSON/',
			data: '{"token":"' + $.session.Token + '"}',
			contentType: 'application/json; charset=utf-8',
			dataType: 'json',
			success: function(response, status, xhr) {
				res = response.getSingleEntryAdminApprovalNumbersJSONResult;
				callback(res, null);
			},
			error: function(xhr, status, error) {
				callback(null, error);
			},
		});
	}

	function getSingleEntryAdminLocations(callback) {
		$.ajax({
			type: 'POST',
			url:
				$.webServer.protocol + '://' +
				$.webServer.address + ':' +
				$.webServer.port + '/' +
				$.webServer.serviceName + '/getSingleEntryAdminLocations/',
			data: '{"token":"' + $.session.Token + '"}',
			contentType: 'application/json; charset=utf-8',
			dataType: 'json',
			success: function(response, status, xhr) {
				res = response.getSingleEntryAdminLocationsResult;
				callback(res, null);
			},
			error: function(xhr, status, error) {
				callback(null, error);
			},
		});
	}

	return {
		getSingleEntryAdminApprovalNumbers,
		getSingleEntryAdminLocations,
	};
})();
