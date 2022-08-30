var oneSpanAjax = (function() {
	'use-strict';
	//Incident Save
	//Send incident notification
    function sendPackage() {
        const retrieveData = {
            test: "test:",
        };
		$.ajax({
			type: 'POST',
            url: $.webServer.protocol + '://' + $.webServer.address + ':' + $.webServer.port + '/' + $.webServer.serviceName + '/sendOneSpanPackage/',
            data: JSON.stringify(retrieveData),
			contentType: 'application/json; charset=utf-8',
			dataType: 'json',
			success: function(response, status, xhr) {
                var res = response.sendPackageResult;
			},
			error: function(xhr, status, error) {
				//alert("Error\n-----\n" + xhr.status + '\n' + xhr.responseText);
			},
		});
	}

    function oneSpanBuildSigners() {
        //(string packageName, string documentName, string filePath, string[] emails, string[] names)
        const retrieveData = {
            token: $.session.Token,
            packageName: "Franklin County One Span Demo",
            documentName: "Plan report", 
            filePath: "C:\\Users\\mike.taft\\OneSpanSignDemo.pdf",
            emails: ["michaeltaft8@gmail.com", "michaeltaft8@gmail.com", "michaeltaft8@gmail.com", "mike.taft@primarysolutions.net"],
            //emails: ["michaeltaft8@gmail.com"],
            names: ["Crystal Schneider", "Karin Crabbe", "Angie Theller", "Michael Taft"]
            //names: ["Michael Taft"]
        };
        $.ajax({
            type: 'POST',
            url: $.webServer.protocol + '://' + $.webServer.address + ':' + $.webServer.port + '/' + $.webServer.serviceName + '/oneSpanBuildSigners/',
            data: JSON.stringify(retrieveData),
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            success: function (response, status, xhr) {
                var res = response.sendPackageResult;
            },
            error: function (xhr, status, error) {
                //alert("Error\n-----\n" + xhr.status + '\n' + xhr.responseText);
            },
        });
    }
	

	return {
        sendPackage,
        oneSpanBuildSigners,
	};
})();
