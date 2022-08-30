// function getLocationNameFromId(id) {
// 	for (var i in $.session.locations) {
// 		if ($.session.locationids[i] == id) return $.session.locations[i];
// 	}
// }

//ANYW_Dashboard_GetRemainingGoalsCount
// Not Being Called
// function getRemainingGoalsCountForDashboard(callback) {
// 	$.ajax({
// 		type: 'POST',
// 		url: $.webServer.protocol + '://' + $.webServer.address + ':' + $.webServer.port + '/' + $.webServer.serviceName + '/getRemainingGoalsCountForDashboard/',
// 		data: '{"token":"' + $.session.Token + '"}',
// 		contentType: 'application/json; charset=utf-8',
// 		dataType: 'json',
// 		success: function(response, status, xhr) {
// 			var res = JSON.stringify(response);
// 			callback(null, res);
// 		},
// 		error: function(xhr, status, error) {
// 			//alert("Error\n-----\n" + xhr.status + '\n' + xhr.responseText);
// 			callback(error, null);
// 		},
// 	});
// }

// function getLocationsForDashboardAbsent
// function getConsumerGroupsForDashboardAbsent

// Not Being Called
// function getClockedInDayServicesAtLocationCountsAjax(locationId, callback) {
// 	$.ajax({
// 		type: 'POST',
// 		url: $.webServer.protocol + '://' + $.webServer.address + ':' + $.webServer.port + '/' + $.webServer.serviceName + '/getClockedInDayServicesAtLocationCounts/',
// 		data: '{"token":"' + $.session.Token + '", "locationId":"' + locationId + '"}',
// 		contentType: 'application/json; charset=utf-8',
// 		dataType: 'json',
// 		success: function(response, status, xhr) {
// 			var res = JSON.stringify(response);
// 			callback(null, res);
// 		},
// 		error: function(xhr, status, error) {
// 			callback(error, null);
// 		},
// 	});
// }

// function getInfalLoginCredentialsAjax(callback) {
// 	$.ajax({
// 		type: 'POST',
// 		url: $.webServer.protocol + '://' + $.webServer.address + ':' + $.webServer.port + '/' + $.webServer.serviceName + '/getInfalLoginCredentials/',
// 		data: '{"token":"' + $.session.Token + '"}',
// 		contentType: 'application/json; charset=utf-8',
// 		dataType: 'json',
// 		success: function(response, status, xhr) {
// 			var res = JSON.parse(response.getInfalLoginCredentialsResult);
// 			if (res[0] && res[0].App_Password) ID = res[0].App_Password;
// 			if ((ID = 0)) {
// 				//go  get ssn and use it to get emp id from infal, pass it along and then update user application cred table
// 			}
// 			callback(null, res);
// 		},
// 		error: function(xhr, status, error) {
// 			//alert("Error\n-----\n" + xhr.status + '\n' + xhr.responseText);
// 		},
// 	});
// }

function changeFromPSIAjax(userId, callback) {
	$.ajax({
		type: 'POST',
		url: $.webServer.protocol + '://' + $.webServer.address + ':' + $.webServer.port + '/' + $.webServer.serviceName + '/changeFromPSI/',
		data: '{"token":"' + $.session.Token + '", "userID":"' + userId + '"}',
		contentType: 'application/json; charset=utf-8',
		dataType: 'json',
		success: function(response, status, xhr) {
			var res = JSON.stringify(response);
			eraseCookie('psiuser');
			var overlay = document.createElement('div');
			if ($('permissions', res).is('*') && checkforErrors(res) == 0) {
				eraseCookie('psi');
				createCookie('psi', res, 1);
				success = true;
				document.location.href = 'anywhere.html';
			} else if (res.indexOf('609') > -1) {
				//checkForErrors();
				customPasswordChange();
			} else {
				$('#error').css('opacity', '1');
				$('#error').css('display', 'block');
				if ($('#error').hasClass('hippaRestriction')) {
					$('#errortext').text('Password cannot match a recently used password');
				} else if ($('#error').hasClass('userInputError')) {
					$('#errortext').text('Invalid username or password');
				} else if (res.indexOf('608') > -1) {
					$('#errortext').text('This user name does not exist in demographics.');
				} else {
                    $('#errortext').text('Invalid user name or password.');
				}
			}
		},
		error: function(xhr, status, error) {
			//alert(
			//   "There was a problem connecting to the database. Please click OK to continue. If the problem persists, please contact Primary Solutions." +
			//   xhr.status + '\n' + xhr.responseText);
		},
		complete: function() {
			// hide gif here, eg:
			$('body').css('cursor', 'auto');
		},
	});
}
