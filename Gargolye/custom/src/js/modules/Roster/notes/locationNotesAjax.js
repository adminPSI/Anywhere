var locationNotesAjax = (function() {
	function deleteLocationNote(noteId) {
		$.ajax({
			type: 'POST',
			url: $.webServer.protocol + '://' + $.webServer.address + ':' + $.webServer.port + '/' + $.webServer.serviceName + '/deleteLocationNote/',
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
	function doesLocationHaveUnreadNotes(locationId, callback) {
		var daysBackDate = convertDaysBack($.session.defaultProgressNoteReviewDays);
		var datum = {
			token: $.session.Token,
			locationId: locationId,
			daysBackDate: daysBackDate,
		};
		$.ajax({
			type: 'POST',
			url: $.webServer.protocol + '://' + $.webServer.address + ':' + $.webServer.port + '/' + $.webServer.serviceName + '/checkIfLocationHasUnreadNotes/',
			data: '{"token":"' + $.session.Token + '", "locationId":"' + locationId + '", "daysBackDate":"' + daysBackDate + '"}',
			contentType: 'application/json; charset=utf-8',
			dataType: 'json',
			success: function(response, status, xhr) {
				var results = JSON.parse(response.checkIfLocationHasUnreadNotesResult);
				callback(results);
			},
		});
	}
	function getLocationsWithUnreadNotes(callback) {
		var daysBackDate = convertDaysBack($.session.defaultProgressNoteReviewDays);
		return $.ajax({
			type: 'POST',
			url: $.webServer.protocol + '://' + $.webServer.address + ':' + $.webServer.port + '/' + $.webServer.serviceName + '/getLocationsWithUnreadNotes/',
			data: '{"token":"' + $.session.Token + '", "daysBackDate":"' + daysBackDate + '"}',
			contentType: 'application/json; charset=utf-8',
			dataType: 'json',
    });
    // $.ajax({
		// 	type: 'POST',
		// 	url: $.webServer.protocol + '://' + $.webServer.address + ':' + $.webServer.port + '/' + $.webServer.serviceName + '/getLocationsWithUnreadNotes/',
		// 	data: '{"token":"' + $.session.Token + '", "daysBackDate":"' + daysBackDate + '"}',
		// 	contentType: 'application/json; charset=utf-8',
		// 	dataType: 'json',
		// 	success: function(response, status, xhr) {
		// 		var results = JSON.parse(response.getLocationsWithUnreadNotesResult);
		// 		callback(results);
		// 	},
		// });
	}
	function getLocationsWithUnreadNotesAndPermission(callback) {
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
				'/getLocationsWithUnreadNotesAndPermission/',
			data: '{"token":"' + $.session.Token + '", "daysBackDate":"' + daysBackDate + '"}',
			contentType: 'application/json; charset=utf-8',
			dataType: 'json',
			success: function(response, status, xhr) {
				var results = JSON.parse(response.getLocationsWithUnreadNotesAndPermissionResult);
				callback(results);
			},
		});
	}
	function getLocationProgressNotes(locationId, callback) {
		var daysBackDate = convertDaysBack($.session.defaultProgressNoteReviewDays);
		var datum = {
			token: $.session.Token,
			locationId: locationId,
			daysBackDate: daysBackDate,
		};
		$.ajax({
			type: 'POST',
			url: '/' + $.webServer.serviceName + '/selectNotesByLocation/',
			data: JSON.stringify(datum),
			contentType: 'application/json; charset=utf-8',
			dataType: 'json',
			success: function(response, status, xhr) {
				var results = JSON.parse(response.selectNotesByLocationResult);
				callback(results);
			},
		});
	}
	function getLocationProgressNotesAndPermission(locationId, callback) {
		var daysBackDate = convertDaysBack($.session.defaultProgressNoteReviewDays);
		var datum = {
			token: $.session.Token,
			locationId: locationId,
			daysBackDate: daysBackDate,
		};
		$.ajax({
			type: 'POST',
			url: '/' + $.webServer.serviceName + '/selectNotesByLocationAndPermission/',
			data: JSON.stringify(datum),
			contentType: 'application/json; charset=utf-8',
			dataType: 'json',
			success: function(response, status, xhr) {
				var results = JSON.parse(response.selectNotesByLocationAndPermissionResult);
				callback(results);
			},
		});
	}
	function insertLocationNote(insertData, callback) {
		// used to add a new note
		//insertData = token, noteTitle, note, locationId
		$.ajax({
			type: 'POST',
			url: $.webServer.protocol + '://' + $.webServer.address + ':' + $.webServer.port + '/' + $.webServer.serviceName + '/insertLocationNote/',
			data: JSON.stringify(insertData),
			contentType: 'application/json; charset=utf-8',
			dataType: 'json',
			success: function(response, status, xhr) {
				var res = JSON.stringify(response);
				callback(res);
			},
		});
	}
	function selectLocationNote(noteId, callback) {
		$.ajax({
			type: 'POST',
			url: $.webServer.protocol + '://' + $.webServer.address + ':' + $.webServer.port + '/' + $.webServer.serviceName + '/selectLocationNote/',
			data: '{"token":"' + $.session.Token + '", "noteId":"' + noteId + '"}',
			contentType: 'application/json; charset=utf-8',
			dataType: 'json',
			success: function(response, status, xhr) {
				var res = JSON.parse(response.selectLocationNoteResult);
				if (callback) callback(res);
			},
		});
	}
	function updateLocationNoteDateRead(noteId, callback) {
		$.ajax({
			type: 'POST',
			url: $.webServer.protocol + '://' + $.webServer.address + ':' + $.webServer.port + '/' + $.webServer.serviceName + '/updateLocationNoteDateRead/',
			data: '{"token":"' + $.session.Token + '", "noteId":"' + noteId + '"}',
			contentType: 'application/json; charset=utf-8',
			dataType: 'json',
			success: function(response, status, xhr) {
				var res = JSON.stringify(response);
				callback(res);
			},
		});
	}
	function updateLocationNote(updateData, callback) {
		// used to add a new note within a note
		$.ajax({
			type: 'POST',
			url: $.webServer.protocol + '://' + $.webServer.address + ':' + $.webServer.port + '/' + $.webServer.serviceName + '/updateLocationNote/',
			data: JSON.stringify(updateData),
			contentType: 'application/json; charset=utf-8',
			dataType: 'json',
			success: function(response, status, xhr) {
				var res = JSON.stringify(response);
				if (callback) callback(res);
			},
		});
  }

	return {
		doesLocationHaveUnreadNotes,
    getLocationsWithUnreadNotes,
		getLocationProgressNotes,
		insertLocationNote,
		selectLocationNote,
		updateLocationNoteDateRead,
		updateLocationNote,
		getLocationProgressNotesAndPermission,
		getLocationsWithUnreadNotesAndPermission,
	};
})();
