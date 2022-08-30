const covidAjax = (function() {
  function getCovidChecklists(peopleId, date, consumerChecklist) {
    const data = {
      token: $.session.Token,
      peopleId: peopleId,
      assessmentDate: date,
      isConsumer: consumerChecklist
    }
    return $.ajax({
			type: 'POST',
			url: $.webServer.protocol + '://' + $.webServer.address + ':' + $.webServer.port + '/' + $.webServer.serviceName + '/getIndividualsCovidDetails/',
			data: JSON.stringify(data),
			contentType: 'application/json; charset=utf-8',
			dataType: 'json',
		});
  }
  function insertUpdateCovidChecklists(insertData) {
    return $.ajax({
			type: 'POST',
			url: $.webServer.protocol + '://' + $.webServer.address + ':' + $.webServer.port + '/' + $.webServer.serviceName + '/insertUpdateCovidAssessment/',
			data: JSON.stringify(insertData),
			contentType: 'application/json; charset=utf-8',
			dataType: 'json',
		});
  }
  function deleteCovidChecklist(checklistId) {
    const data = {
      token: $.session.Token,
      assessmentId: checklistId
    }
    return $.ajax({
			type: 'POST',
			url: $.webServer.protocol + '://' + $.webServer.address + ':' + $.webServer.port + '/' + $.webServer.serviceName + '/deleteCovidAssessment/',
			data: JSON.stringify(data),
			contentType: 'application/json; charset=utf-8',
			dataType: 'json',
		});
  }
  return {
    getCovidChecklists,
    insertUpdateCovidChecklists,
    deleteCovidChecklist
  }
})();