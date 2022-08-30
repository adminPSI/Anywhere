var remainingDailyServicesWidgetAjax = (function() {
	function makeAjaxCall(url, successFunction, outcomeType, locationId, group, checkDate) {
		var todaydate = UTIL.getTodaysDate();
		var data = {};
		data.token = $.session.Token;
		if ($.session.outcomesWidgetOutcomeTypeId != undefined) {
			data.outcomeType = $.session.outcomesWidgetOutcomeTypeId;
		} else {
			data.outcomeType = outcomeType ? outcomeType : '%';
		}
		if ($.session.outcomesWidgetLocationId != undefined) {
			data.locationId = $.session.outcomesWidgetLocationId;
		} else {
			data.locationId = locationId ? locationId : '%';
		}
		if ($.session.outcomesWidgetGroupId != undefined) {
			data.group = $.session.outcomesWidgetGroupId;
		} else {
			data.group = group ? group : '%';
		}

 		if (checkDate != null) {
			data.checkDate = checkDate
		}
		else {
			data.checkDate = todaydate;
		}
 

		// data.checkDate = "2020-03-26"

	/* 	if ($.session.outcomesWidgetgoalsDate != null) {
			data.checkDate = $.session.outcomesWidgetgoalsDate;
		}
		else {
			data.checkDate = checkDate ? checkDate : todaydate;
		}
 */
   

		$.ajax({
			type: 'POST',
			url: $.webServer.protocol + '://' + $.webServer.address + ':' + $.webServer.port + '/' + $.webServer.serviceName + '/' + url + '/',
			data: JSON.stringify(data),
			contentType: 'application/json; charset=utf-8',
			dataType: 'json',
			success: successFunction,
		});
	}
	// Gets data for outcome types filter
	function populateOutcomeTypesFilter(callback) {
		makeAjaxCall(
			'populateOutcomeTypesRemainingServicesWidgetFilter',
			function(response, status, xhr) {
				var res = response.populateOutcomeTypesRemainingServicesWidgetFilterResult;
				callback(res);
			},
			null,
			null,
			null,
			null
		);
	}
	// Gets data for locations filter
	function populateLocationsFilter(callback) {
		makeAjaxCall(
			'populateLocationsRemainingServicesWidgetFilter',
			function(response, status, xhr) {
				var res = response.populateLocationsRemainingServicesWidgetFilterResult;
				callback(res);
			},
			null,
			null,
			null,
			null
		);
	}
	// Gets data for groups filter homeajax 310
	function populateGroupsFilter(locationId, callback) {
		makeAjaxCall(
			'populateGroupsRemainingServicesWidgetFilter',
			function(response, status, xhr) {
				var res = response.populateGroupsRemainingServicesWidgetFilterResult;
				callback(res);
			},
			null,
			locationId,
			null,
			null
		);
	}
	// Gets List of Consumers based off filtering
	function populateFilteredList(outcomeType, locationId, group, checkDate, callback) {
		//populateGroupsFilter(locationId);
		makeAjaxCall(
			'remainingServicesWidgetFilter',
			function(response, status, xhr) {
				var res = response.remainingServicesWidgetFilterResult;
				callback(res);
			},
			outcomeType,
			locationId,
			group,
			checkDate
		);
	}

	return {
		populateOutcomeTypesFilter: populateOutcomeTypesFilter,
		populateLocationsFilter: populateLocationsFilter,
		populateGroupsFilter: populateGroupsFilter,
		populateFilteredList: populateFilteredList,
	};
})();
