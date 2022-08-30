var absentWidgetAjax = (function() {
  var absentLocationsArray = [];

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
			success: function(response, status, xhr) {
				var res = response.getLocationsJSONResult;
				res.unshift({
          ID: '000',
          Name: 'ALL'
				});
				// cache results
				absentLocationsArray = res;
				callback(res);
			},
			error: function(xhr, status, error) {
			},
		});
	}

	function getConsumerGroupsForDashboardAbsent(locationId, callback) {
		$.ajax({
			type: 'POST',
			url:
				$.webServer.protocol + '://' +
				$.webServer.address + ':' +
				$.webServer.port + '/' +
				$.webServer.serviceName + '/getConsumerGroupsJSON/',
			data: JSON.stringify({ token: $.session.Token, locationId }),
			contentType: 'application/json; charset=utf-8',
			dataType: 'json',
			success: function(response, status, xhr) {
        var res = response.getConsumerGroupsJSONResult;
        res = res.filter(r => r.GroupCode !== 'CAS' && r.GroupCode !== 'NAT');
				callback(res, null);
			},
			error: function(xhr, status, error) {
			},
		});
	}

	function getAbsentWidgetFilterDataAjax(filterData, callback) {
		$.ajax({
			type: 'POST',
			url:
				$.webServer.protocol + '://' +
				$.webServer.address + ':' +
				$.webServer.port + '/' +
				$.webServer.serviceName + '/getAbsentWidgetFilterData/',
			data: JSON.stringify(filterData),
			contentType: 'application/json; charset=utf-8',
			dataType: 'json',
			success: function(response, status, xhr) {
        var res = JSON.parse(response.getAbsentWidgetFilterDataResult);
        callback(res, null);
			},
			error: function(xhr, status, error) {
				callback(error, null);
			},
		});
	}

	return {
		getLocationsForDashboardAbsent: getLocationsForDashboardAbsent,
		getConsumerGroupsForDashboardAbsent: getConsumerGroupsForDashboardAbsent,
		getAbsentWidgetFilterDataAjax: getAbsentWidgetFilterDataAjax,
	};
})();
