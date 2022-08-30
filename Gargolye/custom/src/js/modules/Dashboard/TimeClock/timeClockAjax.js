var timeClockAjax = (function() {
	function clockInStaff() {
		var locationId = '';
		var locationId = defaults.getLocation("timeClock");
		if (locationId == null || locationId == '') locationId = 0;

		$.ajax({
			type: 'POST',
			url: $.webServer.protocol + '://' + $.webServer.address + ':' + $.webServer.port + '/' + $.webServer.serviceName + '/clockInStaff/',
        data: '{"token":"' + $.session.Token + '", "locationId":"' + locationId + '", "createTimeEntries":"' + $.session.createTimeEntries + '"}',
			contentType: 'application/json; charset=utf-8',
			dataType: 'json',
        success: function (response, status, xhr) {            
				var res = JSON.stringify(response);
				 if (res.indexOf('517') > -1) {
       $.session.timeClockError = 'You are not assigned as Day Service Staff.';
			  }
				 if (res.indexOf('611') > -1) {
       $.session.timeClockError = 'You are not assigned as Day Service Staff';
				 }
				 if (res.indexOf('612') > -1) {
       $.session.timeClockError = 'You do not have an active staff location assigned to you.';
				 }
				 if (res.indexOf('610') > -1) {
       $.session.timeClockError = 'You are already clocked in!';
				 }
				if (res.indexOf('613') > -1) {
      window.timeOverlapError = true;
      $.session.timeClockError = 'Time Overlap';
				} else {
					window.timeOverlapError = false; //needed to reset previous error value
				}
			},
			complete: function(jqXHR, status) {
				getStaffActivity(timeClock.processStaffActivity);
			},
		});
	}

	function clockOutStaff() {
		$.ajax({
			type: 'POST',
			url: $.webServer.protocol + '://' + $.webServer.address + ':' + $.webServer.port + '/' + $.webServer.serviceName + '/clockOutStaff/',
			data: '{"token":"' + $.session.Token + '"}',
			contentType: 'application/json; charset=utf-8',
			dataType: 'json',
			success: function(response, status, xhr) {
				var res = JSON.stringify(response);
			},
			complete: function(jqXHR, status) {
				getStaffActivity(timeClock.processStaffActivity);
			},
		});
	}

	function getStaffActivity(callback) {
		var d = new Date();
		var timeClockDate = [d.getFullYear(), d.getMonth() + 1, d.getDate()].join('-');

		$.ajax({
			type: 'POST',
			url: $.webServer.protocol + '://' + $.webServer.address + ':' + $.webServer.port + '/' + $.webServer.serviceName + '/getStaffActivityJSON/',
			data: '{"token":"' + $.session.Token + '", "serviceDate":"' + timeClockDate + '"}',
			contentType: 'application/json; charset=utf-8',
			dataType: 'json',
			success: function(response, status, xhr) {
				res = response.getStaffActivityJSONResult;
				callback(res);
			},
			error: function(xhr, status, error) {
				callback(null);
			},
			// complete: function(jqXHR, status) {
			// 	showDownArrow();
			// },
		});
	}

	function updateStaffClockTime(data, callback) {
		$.ajax({
			type: 'POST',
			url: $.webServer.protocol + '://' + $.webServer.address + ':' + $.webServer.port + '/' + $.webServer.serviceName + '/updateStaffClockTime/',
			data:
				'{"token":"' + $.session.Token +
				'", "serviceDate":"' + UTIL.getDBDateNow() +
				'", "orginalTime":"' + data.orgTime +
				'", "newTime":"' + data.newTime +
				'", "isClockIn":"' + data.isStartTime +
				'", "checkedAgainstTime":"' + data.orgTime +
				'","location":"' + data.loc + '"}',
			contentType: 'application/json; charset=utf-8',
			dataType: 'json',
			success: function(response, status, xhr) {
				var res = JSON.stringify(response);
				if (res.indexOf('613') > -1) {
      $.session.timeClockError = 'Time Overlap';
					window.timeOverlapError = true;
				} else {
					window.timeOverlapError = false;
        }
        callback();
			},
			complete: function(jqXHR, status) {
				//getStaffActivity(timeClock.processStaffActivity);
			},
		});

		$.session.initialTimeOut = '';
		$.session.initialTimeIn = '';
	}

	return {
		clockInStaff,
		clockOutStaff,
		getStaffActivity,
		updateStaffClockTime,
	};
})();
