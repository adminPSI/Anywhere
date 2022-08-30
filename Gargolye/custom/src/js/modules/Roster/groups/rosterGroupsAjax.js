var customGroupsAjax = (function() {
  // Done
  function getConsumerGroups(locationId, callback) {
    return $.ajax({
      type: "POST",
      url: $.webServer.protocol + "://" + $.webServer.address + ":" + $.webServer.port + "/" + $.webServer.serviceName + "/getConsumerGroupsJSON/",
      data: '{"locationId":"' + locationId +'", "token":"' + $.session.Token +'"}',
      contentType: "application/json; charset=utf-8",
      dataType: "json",
    });

    // $.ajax({
    //   type: "POST",
    //   url:
    //     $.webServer.protocol + "://" +
    //     $.webServer.address + ":" +
    //     $.webServer.port + "/" +
    //     $.webServer.serviceName + "/getConsumerGroupsJSON/",
    //   data: '{"locationId":"' + locationId +'", "token":"' + $.session.Token +'"}',
    //   contentType: "application/json; charset=utf-8",
    //   dataType: "json",
    //   success: function(response, status, xhr) {
    //     var res = response.getConsumerGroupsJSONResult;
    //     callback(res);
    //   }
    // });
  }
	
	function addCustomGroup(groupName, locationId, callback) {
		$.ajax({
			type: 'POST',
			url: $.webServer.protocol + '://' + $.webServer.address + ':' + $.webServer.port + '/' + $.webServer.serviceName + '/addCustomGroupJSON/',
			data: '{"groupName":"' + groupName + '","locationId":"' + locationId + '","token":"' + $.session.Token + '"}',
			contentType: 'application/json; charset=utf-8',
			dataType: 'json',
			success: function(response, status, xhr) {
				var res = response.addCustomGroupJSONResult;
				callback();
			},
		});
  }
	function removeCustomGroup(groupId, callback) {
		$.ajax({
			type: 'POST',
			url: $.webServer.protocol + '://' + $.webServer.address + ':' + $.webServer.port + '/' + $.webServer.serviceName + '/removeCustomGroup/',
			data: '{"groupId":"' + groupId + '"}',
			contentType: 'application/json; charset=utf-8',
			dataType: 'json',
			success: function(response, status, xhr) {
				var res = JSON.stringify(response);
				callback();
			},
		});
		$.session.deletedGroupId = groupId;
	}
	function addConsumerToGroup(groupId, consumerId, callback) {
		$.ajax({
			type: 'POST',
			url: $.webServer.protocol + '://' + $.webServer.address + ':' + $.webServer.port + '/' + $.webServer.serviceName + '/addConsumerToGroup/',
			data: '{"groupId":"' + groupId + '","consumerId":"' + consumerId + '"}',
			contentType: 'application/json; charset=utf-8',
			dataType: 'json',
			success: function(response, status, xhr) {
        var res = JSON.stringify(response);
				callback();
      }
		});
	}
	function removeConsumerFromGroup(groupId, consumerId, callback) {
		$.ajax({
			type: 'POST',
			url: $.webServer.protocol + '://' + $.webServer.address + ':' + $.webServer.port + '/' + $.webServer.serviceName + '/removeConsumerFromGroup/',
			data: '{"groupId":"' + groupId + '","consumerId":"' + consumerId + '"}',
			contentType: 'application/json; charset=utf-8',
			dataType: 'json',
			success: function(response, status, xhr) {
				var res = JSON.stringify(response);
        callback();
			},
			//error: function (xhr, status, error) { alert("Error\n-----\n" + xhr.status + '\n' + xhr.responseText); },
		});
  }

	return {
    // Old Ajax
    getConsumerGroups,
		addCustomGroup,
    addConsumerToGroup,
    removeCustomGroup,
		removeConsumerFromGroup,
	};
})();
