var singleEntryAjax = (function() {
	// deletes se record from review table
	function deleteSingleEntryRecord(singleEntryId, callback) {
		$.ajax({
			type: 'POST',
			url: $.webServer.protocol + '://' + $.webServer.address + ':' + $.webServer.port + '/' + $.webServer.serviceName + '/deleteSingleEntryRecord/',
			data: '{"token":"' + $.session.Token + '", "singleEntryId":"' + singleEntryId + '"}',
			contentType: 'application/json; charset=utf-8',
			dataType: 'json',
			success: function(response, status, xhr) {
				var res = JSON.stringify(response);
				callback(res);
			},
			error: function(xhr, status, error) {
				callback(null);
			},
		});
	}
	// gets consumers allowed on card
	function getSingleEntryConsumersPresent(singleEntryId, callback) {
		$.ajax({
			type: 'POST',
			url: $.webServer.protocol + '://' + $.webServer.address + ':' + $.webServer.port + '/' + $.webServer.serviceName + '/getSingleEntryConsumersPresentJSON/',
			data: '{"token":"' + $.session.Token + '", "singleEntryId":"' + singleEntryId + '"}',
			contentType: 'application/json; charset=utf-8',
			dataType: 'json',
			success: function(response, status, xhr) {
				var res = response.getSingleEntryConsumersPresentJSONResult;
				callback(res);
			},
			error: function(xhr, status, error) {},
		});
	}
	function getSubEmployeeListAndCountInfo(supervisorId, callback) {
		$.ajax({
			type: 'POST',
			url: $.webServer.protocol + '://' + $.webServer.address + ':' + $.webServer.port + '/' + $.webServer.serviceName + '/getSubEmployeeListAndCountInfoJSON/',
			data: '{"token":"' + $.session.Token + '", "supervisorId":"' + supervisorId + '"}',
			contentType: 'application/json; charset=utf-8',
			dataType: 'json',
			success: function(response, status, xhr) {
				var res = response.getSubEmployeeListAndCountInfoJSONResult;
				callback(res);
			},
			error: function(xhr, status, error) {
				callback(null);
			},
		});
	}
	function getSingleEntryPayPeriods(callback) {
		//If has value true use in admin only. If has value false use in both dropdowns
		$.ajax({
			type: 'POST',
			url: $.webServer.protocol + '://' + $.webServer.address + ':' + $.webServer.port + '/' + $.webServer.serviceName + '/getSingleEntryPayPeriodsJSON/',
			data: '{"token":"' + $.session.Token + '"}',
			contentType: 'application/json; charset=utf-8',
			dataType: 'json',
			beforeSend: function() {},
			complete: function() {},
			success: function(response, status, xhr) {
				var res = response.getSingleEntryPayPeriodsJSONResult;
				callback(res);
			},
			error: function(xhr, status, error) {
				callback(null);
			},
		});
	}
	function getRequiredSingleEntryFields(callback) {
		$.ajax({
			type: 'POST',
			url: $.webServer.protocol + '://' + $.webServer.address + ':' + $.webServer.port + '/' + $.webServer.serviceName + '/getRequiredSingleEntryFieldsJSON/',
			data: '{"token":"' + $.session.Token + '"}',
			contentType: 'application/json; charset=utf-8',
			dataType: 'json',
			success: function(response, status, xhr) {
				var res = response.getRequiredSingleEntryFieldsJSONResult;
				callback(res);
			},
			error: function(xhr, status, error) {
				callback(null);
			},
		});
	}
	function getWorkCodes(callback) {
		$.ajax({
			type: 'POST',
			url: $.webServer.protocol + '://' + $.webServer.address + ':' + $.webServer.port + '/' + $.webServer.serviceName + '/getWorkCodesJSON/',
			data: '{"token":"' + $.session.Token + '"}',
			contentType: 'application/json; charset=utf-8',
			dataType: 'json',
			success: function(response, status, xhr) {
				var res = response.getWorkCodesJSONResult;
				callback(res);
			},
			error: function(xhr, status, error) {
				callback(null);
			},
		});
	}
	function getSingleEntryLocations(callback) {
		$.ajax({
			type: 'POST',
			url: $.webServer.protocol + '://' + $.webServer.address + ':' + $.webServer.port + '/' + $.webServer.serviceName + '/getSingleEntryLocationsJSON/',
			data: '{"token":"' + $.session.Token + '"}',
			contentType: 'application/json; charset=utf-8',
			dataType: 'json',
			beforeSend: function() {},
			complete: function() {},
			success: function(response, status, xhr) {
				var res = response.getSingleEntryLocationsJSONResult;
				callback(res);
			},
			error: function(xhr, status, error) {
				callback(null);
			},
		});
	}
	// called when location dropdown is changed on se card
	function getSingleEntryUsersByLocation(locationId, seDate) {
		return $.ajax({
			type: 'POST',
			url: $.webServer.protocol + '://' + $.webServer.address + ':' + $.webServer.port + '/' + $.webServer.serviceName + '/getSingleEntryUsersByLocationJSON/',
			data: '{"token":"' + $.session.Token + '", "locationId":"' + locationId + '", "seDate":"' + seDate + '"}',
			contentType: 'application/json; charset=utf-8',
			dataType: 'json'
		});
		// $.ajax({
		// 	type: 'POST',
		// 	url: $.webServer.protocol + '://' + $.webServer.address + ':' + $.webServer.port + '/' + $.webServer.serviceName + '/getSingleEntryUsersByLocationJSON/',
		// 	data: '{"token":"' + $.session.Token + '", "locationId":"' + locationId + '", "seDate":"' + seDate + '"}',
		// 	contentType: 'application/json; charset=utf-8',
		// 	dataType: 'json',
		// 	success: function(response, status, xhr) {
		// 		var res = response.getSingleEntryUsersByLocationJSONResult;
		// 		callback(res);
		// 	},
		// 	error: function(xhr, status, error) {
		// 		callback(null);
		// 	},
		// });
	}
	// called before buliding review table
	function getSingleEntryByDate(dataObj, callback) {
		// dataObj = {userId, startDate, endDate, locationId, statusIn}
		// This gets data for time entry review page to populate the table
		$.ajax({
			type: 'POST',
			url: $.webServer.protocol + '://' + $.webServer.address + ':' + $.webServer.port + '/' + $.webServer.serviceName + '/getSingleEntryByDateJSON/',
			data:
				'{"token":"' +
				$.session.Token +
				'", "userId":"' +
				dataObj.userId +
				'", "startDate":"' +
				dataObj.startDate +
				'", "endDate":"' +
				dataObj.endDate +
				'", "locationId":"' +
				dataObj.locationId +
				'","statusIn":"' +
				dataObj.statusIn +
				'"}',
			contentType: 'application/json; charset=utf-8',
			dataType: 'json',
			success: function(response, status, xhr) {
				var res = response.getSingleEntryByDateJSONResult;
				callback(res);
			},
			error: function(xhr, status, error) {},
		});
	}
	// gets se record by id, used when clicked on row in review table
	function getSingleEntryById(singleEntryId, callback) {
		$.ajax({
			type: 'POST',
			url: $.webServer.protocol + '://' + $.webServer.address + ':' + $.webServer.port + '/' + $.webServer.serviceName + '/getSingleEntryByIdJSON/',
			data: '{"token":"' + $.session.Token + '", "singleEntryId":"' + singleEntryId + '"}',
			contentType: 'application/json; charset=utf-8',
			dataType: 'json',
			success: function(response, status, xhr) {
				var res = response.getSingleEntryByIdJSONResult;
				signatureAjax.getConsumersSignaturesAndNotes(singleEntryId);
				callback(res);
			},
			error: function(xhr, status, error) {},
		});
	}
	// called when saving new entry, after overlap check has ran
	async function insertSingleEntryNew(data, callback) {
		await $.ajax({
			type: 'POST',
			url: $.webServer.protocol + '://' + $.webServer.address + ':' + $.webServer.port + '/' + $.webServer.serviceName + '/insertSingleEntry/',
			data: JSON.stringify(data),
			contentType: 'application/json; charset=utf-8',
			dataType: 'json',
			success: function(response, status, xhr) {
				var res = JSON.stringify(response);
				res = res.split('@singleEntryRecordID>');
				var savedSingleEntryId = res[1].slice(0, -2);
				saveSignatureAndNote(savedSingleEntryId);
				callback(res);
			},
		});
	}
	// only called for when there is no locationId and has consumers
	function preInsertSingleEntry(insertData, callback) {
		$.ajax({
			type: 'POST',
			url: $.webServer.protocol + '://' + $.webServer.address + ':' + $.webServer.port + '/' + $.webServer.serviceName + '/preInsertSingleEntry/',
			data: JSON.stringify(insertData),
			contentType: 'application/json; charset=utf-8',
			dataType: 'json',
			success: function(response, status, xhr) {
				var results = response.preInsertSingleEntryResult;
        var savedSingleEntryId = results[0].singleEntryId;
        var consumersWithLocIdZero = ""        
				var filteredResults = results.filter(res => {
					if (res.singleEntryId != null) return true;
				});
        saveSignatureAndNote(filteredResults);
        results.forEach(result => {
            if (result.locationId === "" || result.locationId === "0") {
                consumersWithLocIdZero = consumersWithLocIdZero + result.consumerId + ', ';
            }
          });
        if (consumersWithLocIdZero != "") {
            alert("Please contact Primary Solutions, the following consumerId's were saved with a location id of '0'; " + consumersWithLocIdZero)
        }
        
				callback(results);
			},
		});
	}

	// called for when there is no locationId and has consumers
	// if a selected consumer has overlapping locations, this function returns all selected consumers and their locations to be processed
	function getSelectedConsumerLocations(insertData, callback) {
		$.ajax({
			type: 'POST',
			url: $.webServer.protocol + '://' + $.webServer.address + ':' + $.webServer.port + '/' + $.webServer.serviceName + '/getSelectedConsumerLocations/',
			data: JSON.stringify(insertData),
			contentType: 'application/json; charset=utf-8',
			dataType: 'json',
			success: function(response, status, xhr) {
				var results = response.getSelectedConsumerLocationsResult;
				callback(results);
			},
		});
	}

	// called when saving new entry
	function singleEntryOverlapCheck(overlapData, callback) {
		$.ajax({
			type: 'POST',
			url: $.webServer.protocol + '://' + $.webServer.address + ':' + $.webServer.port + '/' + $.webServer.serviceName + '/singleEntryOverlapCheckJSON/',
			data: JSON.stringify(overlapData),
			contentType: 'application/json; charset=utf-8',
			dataType: 'json',
			success: function(response, status, xhr) {
				var res = response.singleEntryOverlapCheckJSONResult;
				callback(res);
			},
			error: function(xhr, status, error) {
				callback(null);
			},
		});
	}
	// updates se record from review table
	function updateSingleEntryStatus(statusData, callback) {
		$.ajax({
			type: 'POST',
			url: $.webServer.protocol + '://' + $.webServer.address + ':' + $.webServer.port + '/' + $.webServer.serviceName + '/updateSingleEntryStatus/',
			data: JSON.stringify(statusData),
			contentType: 'application/json; charset=utf-8',
			dataType: 'json',
			success: function(response, status, xhr) {
				var res = JSON.stringify(response);
				if (callback) callback(res);
			},
			error: function(xhr, status, error) {},
		});
	}
	// called when updating entry
	function updateSingleEntry(updateData, callback) {
		$.ajax({
			type: 'POST',
			url: $.webServer.protocol + '://' + $.webServer.address + ':' + $.webServer.port + '/' + $.webServer.serviceName + '/updateSingleEntry/',
			data: JSON.stringify(updateData),
			contentType: 'application/json; charset=utf-8',
			dataType: 'json',
			success: function(response, status, xhr) {
				saveSignatureAndNote(updateData.singleEntryId);

				if (response.updateSingleEntryResult.match('Error ')) {
					callback('Your time record cannot be saved. Please contact Primary Solutions.');
					return;
				}

				callback('Time record has been saved.');
			},
			error: function(xhr, status, error) {
				callback('Your time record cannot be saved. Please contact Primary Solutions.');
			},
		});
	}

	// SE ADMIN AJAX CALLS
	//-------------------------------------
	function adminUpdateSingleEntryStatus(adminStatusData, callback) {
		//(string token, string singleEntryIdString, string newStatus, string userID)
		$.ajax({
			type: 'POST',
			url: $.webServer.protocol + '://' + $.webServer.address + ':' + $.webServer.port + '/' + $.webServer.serviceName + '/adminUpdateSingleEntryStatus/',
			data: JSON.stringify(adminStatusData),
			contentType: 'application/json; charset=utf-8',
			dataType: 'json',
			success: function(response, status, xhr) {
				var res = JSON.stringify(response);
				if (callback) callback(res);
			},
			error: function(xhr, status, error) {},
		});
	}
	function approveSingleEntryRecord(singleEntryId) {
		$.ajax({
			type: 'POST',
			url: $.webServer.protocol + '://' + $.webServer.address + ':' + $.webServer.port + '/' + $.webServer.serviceName + '/approveSingleEntryRecord/',
			data: '{"token":"' + $.session.Token + '", "singleEntryId":"' + singleEntryId + '"}',
			contentType: 'application/json; charset=utf-8',
			dataType: 'json',
			success: function(response, status, xhr) {
				var res = JSON.stringify(response);
				loadApp('singleentry');
			},
			error: function(xhr, status, error) {},
		});
	}
	function getSingleEntryEmployees(callback) {
		$.ajax({
			type: 'POST',
			url: $.webServer.protocol + '://' + $.webServer.address + ':' + $.webServer.port + '/' + $.webServer.serviceName + '/getSingleEntrySupervisorsJSON/',
			data: '{"token":"' + $.session.Token + '"}',
			contentType: 'application/json; charset=utf-8',
			dataType: 'json',
			success: function(response, status, xhr) {
				// var res = JSON.stringify(response);
				var res = response.getSingleEntrySupervisorsJSONResult;
				callback(res);
			},
			error: function(xhr, status, error) {
				callback(null);
			},
		});
	}
	function getSingleEntrySupervisors(supervisorId, callback) {
		$.ajax({
			type: 'POST',
			url: $.webServer.protocol + '://' + $.webServer.address + ':' + $.webServer.port + '/' + $.webServer.serviceName + '/getEmployeeListAndCountInfoJSON/',
			data: '{"token":"' + $.session.Token + '", "supervisorId":"' + supervisorId + '"}',
			contentType: 'application/json; charset=utf-8',
			dataType: 'json',
			success: function(response, status, xhr) {
				var res = response.getEmployeeListAndCountInfoJSONResult;
				callback(res);
			},
			error: function(xhr, status, error) {
				callback(null);
			},
		});
	}
	function getAdminSingleEntryLocations(callback) {
		$.ajax({
			type: 'POST',
			url: $.webServer.protocol + '://' + $.webServer.address + ':' + $.webServer.port + '/' + $.webServer.serviceName + '/getAdminSingleEntryLocationsJSON/',
			data: '{"token":"' + $.session.Token + '"}',
			contentType: 'application/json; charset=utf-8',
			dataType: 'json',
			beforeSend: function() {},
			complete: function() {},
			success: function(response, status, xhr) {
				// var res = JSON.stringify(response);
				var res = response.getAdminSingleEntryLocationsJSONResult;
				callback(res);
			},
			error: function(xhr, status, error) {
				callback(null);
			},
		});
	}
	function singleEntryFilterAdminList(filterData, callback) {
		$.ajax({
			type: 'POST',
			url: $.webServer.protocol + '://' + $.webServer.address + ':' + $.webServer.port + '/' + $.webServer.serviceName + '/singleEntryFilterAdminListJSON/',
			data: JSON.stringify(filterData),
			contentType: 'application/json; charset=utf-8',
			dataType: 'json',
			success: function(response, status, xhr) {
				var res = response.singleEntryFilterAdminListJSONResult;
				callback(res);
			},
		});
	}
	function getAddressByLatLong(lat, lng, callback) {
		$.ajax({
			type: 'GET',
			url: 'https://maps.googleapis.com/maps/api/geocode/json?latlng=' + lat + ',' + lng + '&key=' + $.googleMapAPI,
			dataType: 'json',
			success: function(response, status, xhr) {
				if (response && response.results && response.results[0] && response.results[0].formatted_address) {
					callback(response.results[0].formatted_address);
				} else callback('');
			},
			error: function(xhr, status, error) {
				callback('');
			},
		});
	}
	function getUserSingleEntryLocationsForPayPeriod(data, callback) {
		$.ajax({
			type: 'POST',
			url:
				$.webServer.protocol +
				'://' +
				$.webServer.address +
				':' +
				$.webServer.port +
				'/' +
				$.webServer.serviceName +
				'/getUserSingleEntryLocationsForPayPeriod/',
			data: JSON.stringify(data),
			contentType: 'application/json; charset=utf-8',
			dataType: 'json',
			success: function(response, status, xhr) {
				var res = JSON.stringify(response);
				callback(res);
			},
			error: function(xhr, status, error) {},
		});
	}
	function getSingleEntryUsersWC(getUserData, callback) {
		//getUserdata must contain token and date from single entry page
		$.ajax({
			type: 'POST',
			url: $.webServer.protocol + '://' + $.webServer.address + ':' + $.webServer.port + '/' + $.webServer.serviceName + '/getSingleEntryUsersWCJSON/',
			data: JSON.stringify(getUserData),
			contentType: 'application/json; charset=utf-8',
			dataType: 'json',
			success: function(response, status, xhr) {
				var res = response.getSingleEntryUsersWCJSONResult;
				callback(res);
			},
			error: function(xhr, status, error) {
				callback(null);
			},
		});
	}

	function getLocationsAndResidences(callback) {
		$.ajax({
			type: 'POST',
			url: $.webServer.protocol + '://' + $.webServer.address + ':' + $.webServer.port + '/' + $.webServer.serviceName + '/getLocationsAndResidencesJSON/',
			data: '{"token":"' + $.session.Token + '"}',
			contentType: 'application/json; charset=utf-8',
			dataType: 'json',
			beforeSend: function() {},
			complete: function() {},
			success: function(response, status, xhr) {
				// var res = JSON.stringify(response);
				var res = response.getLocationsAndResidencesJSONResult;
				callback(res);
			},
			error: function(xhr, status, error) {
				callback(null);
			},
		});
	}
	function getEvvReasonCodes(callback) {
		$.ajax({
			type: 'POST',
			url: $.webServer.protocol + '://' + $.webServer.address + ':' + $.webServer.port + '/' + $.webServer.serviceName + '/getSingleEntryEvvReasonCodesJSON/',
			data: '{"token":"' + $.session.Token + '"}',
			contentType: 'application/json; charset=utf-8',
			dataType: 'json',
			beforeSend: function() {},
			complete: function() {},
			success: function(response, status, xhr) {
				var res = response.getSingleEntryEvvReasonCodesJSONResult;
				callback(res);
			},
			error: function(xhr, status, error) {
				callback(null);
			},
		});
	}

	function getEvvEligibility(consumerId, entryDate, callback) {
		$.ajax({
			type: 'POST',
			url: $.webServer.protocol + '://' + $.webServer.address + ':' + $.webServer.port + '/' + $.webServer.serviceName + '/getSingleEntryEvvEligibilityJSON/',
			data: '{"token":"' + $.session.Token + '", "consumerId":"' + consumerId + '" , "entryDate":"' + entryDate + '"}',
			contentType: 'application/json; charset=utf-8',
			dataType: 'json',
			beforeSend: function() {},
			complete: function() {},
			success: function(response, status, xhr) {
				var res = response.getSingleEntryEvvEligibilityJSONResult;
				callback(res);
			},
			error: function(xhr, status, error) {
				callback(null);
			},
		});
	}


	return {
		deleteSingleEntryRecord,
		getSingleEntryConsumersPresent,
		getSubEmployeeListAndCountInfo,
		getSingleEntryPayPeriods,
		getRequiredSingleEntryFields,
		getWorkCodes,
		getSingleEntryLocations,
		getSingleEntryUsersByLocation,
		getSingleEntryByDate,
		getSingleEntryById,
		insertSingleEntryNew,
		preInsertSingleEntry,
		getSelectedConsumerLocations,
		singleEntryOverlapCheck,
		updateSingleEntryStatus,
		updateSingleEntry,
		// ADMIN SE FUNCTIONS
		approveSingleEntryRecord,
		adminUpdateSingleEntryStatus,
		getSingleEntryEmployees,
		getSingleEntrySupervisors,
		//getSingleEntryPayPeriodsAdminAjax,
		getAdminSingleEntryLocations,
		singleEntryFilterAdminList,
		getAddressByLatLong,
		getUserSingleEntryLocationsForPayPeriod,
		getSingleEntryUsersWC,
    getLocationsAndResidences,
	getEvvReasonCodes,
	getEvvEligibility
	};
})();
