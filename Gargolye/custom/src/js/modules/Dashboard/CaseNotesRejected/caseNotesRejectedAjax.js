const CN_RejectedWidgetAjax = (function() {

  function getCaseNotesRejected(daysBack, callback) {
		$.ajax({
			type: 'POST',
			url: $.webServer.protocol + '://' + $.webServer.address + ':' + $.webServer.port + '/' + $.webServer.serviceName + '/getDashboardCaseNotesRejected/',
			data: '{"token":"' + $.session.Token + '", "daysBack":"' + daysBack + '", "isCaseLoad":"' + $.session.CaseNotesCaseloadRestriction + '"}', 
			contentType: 'application/json; charset=utf-8',
			dataType: 'json',
			success: function(response, status, xhr) {
				// var res = JSON.stringify(response.getDashboardCaseNotesRejectedResult);
				callback(response.getDashboardCaseNotesRejectedResult);
			},
			error: function(xhr, status, error) {
				//alert("Error\n-----\n" + xhr.status + '\n' + xhr.responseText);
			},
		});
  }
  
  function getGroupCaseNotes(groupNoteIds, callback) {
	$.ajax({
		type: 'POST',
		url: $.webServer.protocol + '://' + $.webServer.address + ':' + $.webServer.port + '/' + $.webServer.serviceName + '/getDashboardGroupCaseNoteConsumerNames/',
		data: '{"token":"' + $.session.Token + '", "groupNoteIds":"' + groupNoteIds + '"}',
		contentType: 'application/json; charset=utf-8',
		dataType: 'json',
		success: function(response, status, xhr) {
			// var res = JSON.stringify(response.getDashboardCaseNotesRejectedResult);
			callback(response.getDashboardGroupCaseNoteConsumerNamesResult);
		},
		error: function(xhr, status, error) {
			//alert("Error\n-----\n" + xhr.status + '\n' + xhr.responseText);
		},
	});
}


  return {
	  getCaseNotesRejected,
	  getGroupCaseNotes
  };
})();