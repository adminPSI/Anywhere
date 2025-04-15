var progressNotesAjax = (function() {
	// deleteConsumerNote is not being used ATM
	function deleteConsumerNote(noteId) {
		$.ajax({
			type: 'POST',
			url: $.webServer.protocol + '://' + $.webServer.address + ':' + $.webServer.port + '/' + $.webServer.serviceName + '/deleteConsumerNote/',
			data: '{"token":"' + $.session.Token + '", "noteId":"' + noteId + '"}',
			contentType: 'application/json; charset=utf-8',
			dataType: 'json',
			success: function(response, status, xhr) {
				var res = JSON.stringify(response);
			},
			error: function(xhr, status, error) {
				//alert("Error\n-----\n" + xhr.status + '\n' + xhr.responseText);
			},
		});
	}
	function getConsumersWithUnreadNotesByEmployeeAndLocation(locationId, callback) {
    return $.ajax({
			type: 'POST',
			url:
				$.webServer.protocol + '://' +
				$.webServer.address + ':' +
				$.webServer.port + '/' +
				$.webServer.serviceName + '/getConsumersWithUnreadNotesByEmployeeAndLocation/',
			data: '{"token":"' + $.session.Token + '", "locationId":"' + locationId + '"}',
			contentType: 'application/json; charset=utf-8',
			dataType: 'json',
		});
		
		// $.ajax({
		// 	type: 'POST',
		// 	url:
		// 		$.webServer.protocol + '://' +
		// 		$.webServer.address + ':' +
		// 		$.webServer.port + '/' +
		// 		$.webServer.serviceName + '/getConsumersWithUnreadNotesByEmployeeAndLocation/',
		// 	data: '{"token":"' + $.session.Token + '", "locationId":"' + locationId + '"}',
		// 	contentType: 'application/json; charset=utf-8',
		// 	dataType: 'json',
		// 	success: function(response, status, xhr) {
		// 		var results = JSON.parse(response.getConsumersWithUnreadNotesByEmployeeAndLocationResult);
		// 		callback(results);
		// 	},
		// });
	}

	function getConsumersWithUnreadNotesByEmployeeAndLocationPermission(locationId, callback) {
		var daysBackDate = convertDaysBack($.session.defaultProgressNoteReviewDays);
		var isCaseLoad = $.session.RosterCaseLoad;
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
				'/getConsumersWithUnreadNotesByEmployeeAndLocationPermission/',
			data: '{"token":"' + $.session.Token + '", "locationId":"' + locationId + '", "daysBackDate":"' + daysBackDate + '", "isCaseLoad":"' + isCaseLoad + '"}', 
			contentType: 'application/json; charset=utf-8',
			dataType: 'json',
			success: function(response, status, xhr) {
				var results = JSON.parse(response.getConsumersWithUnreadNotesByEmployeeAndLocationPermissionResult);
				callback(results);
			},
		});
	}
	function insertConsumerNote(insertData, callback) {
		//insertData = token, consumerId, noteTitle, note, locationId
		$.ajax({
			type: 'POST',
			url: $.webServer.protocol + '://' + $.webServer.address + ':' + $.webServer.port + '/' + $.webServer.serviceName + '/insertConsumerNote/',
			data: JSON.stringify(insertData),
			contentType: 'application/json; charset=utf-8',
			dataType: 'json',
			success: function(response, status, xhr) {
				var res = JSON.stringify(response);
				callback(res);
			},
			error: function(xhr, status, error) {},
		});
	}
	function selectNotesByConsumerAndLocation(consumerId, locationId, callback) {
		// called when note icon is clicked

		var datum = {
			token: $.session.Token,
			consumerId: consumerId,
			locationId: locationId
		};

		$.ajax({
			type: 'POST',
			url: '/' + $.webServer.serviceName + '/selectNotesByConsumerAndLocation/',
			data: JSON.stringify(datum),
			contentType: 'application/json; charset=utf-8',
			dataType: 'json',
			success: function(response, status, xhr) {
				var results = JSON.parse(response.selectNotesByConsumerAndLocationResult);
				callback(results);
			},
			error: function(xhr, status, error) {
				//alert("Error\n-----\n" + xhr.status + '\n' + xhr.responseText);
			},
		});
		return false;
	}
	function selectConsumerNote(noteId, callback) {
		$.ajax({
			type: 'POST',
			url: $.webServer.protocol + '://' + $.webServer.address + ':' + $.webServer.port + '/' + $.webServer.serviceName + '/selectConsumerNote/',
			data: '{"token":"' + $.session.Token + '", "noteId":"' + noteId + '"}',
			contentType: 'application/json; charset=utf-8',
			dataType: 'json',
			success: function(response, status, xhr) {
				var res = JSON.parse(response.selectConsumerNoteResult);
				callback(res);
			},
			error: function(xhr, status, error) {
				//alert("Error\n-----\n" + xhr.status + '\n' + xhr.responseText);
			},
		});
	}
	function updateConsumerNoteDateRead(noteId) {
		$.ajax({
			type: 'POST',
			url: $.webServer.protocol + '://' + $.webServer.address + ':' + $.webServer.port + '/' + $.webServer.serviceName + '/updateConsumerNoteDateRead/',
			data: '{"token":"' + $.session.Token + '", "noteId":"' + noteId + '"}',
			contentType: 'application/json; charset=utf-8',
			dataType: 'json',
			success: function(response, status, xhr) {
				var res = JSON.stringify(response);
			},
			error: function(xhr, status, error) {
				//alert("Error\n-----\n" + xhr.status + '\n' + xhr.responseText);
			},
		});
	}
	function updateConsumerNote(updateData, callback) {
		$.ajax({
			type: 'POST',
			url: $.webServer.protocol + '://' + $.webServer.address + ':' + $.webServer.port + '/' + $.webServer.serviceName + '/updateConsumerNote/',
			data: JSON.stringify(updateData),
			contentType: 'application/json; charset=utf-8',
			dataType: 'json',
			success: function(response, status, xhr) {
				var res = JSON.stringify(response);
				if (callback) callback(res);
			},
			error: function(xhr, status, error) {},
		});
	}

	function updateHideNote(updateData, callback) {
		$.ajax({
			type: 'POST',
			url: $.webServer.protocol + '://' + $.webServer.address + ':' + $.webServer.port + '/' + $.webServer.serviceName + '/updateHideNote/',
			data: JSON.stringify(updateData),
			contentType: 'application/json; charset=utf-8',
			dataType: 'json',
			success: function(response, status, xhr) {
				var res = JSON.stringify(response);
				if (callback) callback(res);
			},
			error: function(xhr, status, error) {},
		});
	}

	function getlocationsWithConsumersWithUnreadNotes(callback) {
		var daysBackDate = convertDaysBack($.session.defaultProgressNoteReviewDays);
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
				'/getlocationsWithConsumersWithUnreadNotes/',
			data: '{"token":"' + $.session.Token + '", "daysBackDate":"' + daysBackDate + '"}',
			contentType: 'application/json; charset=utf-8',
			dataType: 'json',
			success: function(response, status, xhr) {
				var res = response.getlocationsWithConsumersWithUnreadNotesResult;
				if (callback) callback(res);
			},
			error: function(xhr, status, error) {},
		});
	}
  
	return {
		getConsumersWithUnreadNotesByEmployeeAndLocation,
		insertConsumerNote,
		selectNotesByConsumerAndLocation,
		selectConsumerNote,
		updateConsumerNoteDateRead,
		updateConsumerNote,
		updateHideNote,
		getlocationsWithConsumersWithUnreadNotes,
		getConsumersWithUnreadNotesByEmployeeAndLocationPermission,
	};
})();
