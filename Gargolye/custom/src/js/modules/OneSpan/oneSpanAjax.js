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
            filePath: "C:\\Users\\erick.bey\\OneSpanSignDemo.pdf",
            emails: ["erickbey10@gmail.com", "erick.bey@primarysolutions.net"],
            //emails: ["michaeltaft8@gmail.com"],
            names: ["Crystal Schneider", "Michael Taft"]
            //names: ["Michael Taft"]
        };
        $.ajax({
            type: 'POST',
            url: $.webServer.protocol + '://' + $.webServer.address + ':' + $.webServer.port + '/' + $.webServer.serviceName + '/oneSpanBuildSigners/',
            data: JSON.stringify(retrieveData),
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            success: function (response, status, xhr) {
                var res = response.oneSpanBuildSignersResult;
                console.log(res)
            },
            error: function (xhr, status, error) {
                //alert("Error\n-----\n" + xhr.status + '\n' + xhr.responseText);
            },
        });
    }

    function oneSpanGetSignedDocuments() {
        // packageId needs changed, this was hard coded for a test
        const retrieveData = {
            token: $.session.Token,
            packageId: "9loIkS5Jd8D24n0ISuCEPdss07w=",
        };
        $.ajax({
            type: 'POST',
            url: $.webServer.protocol + '://' + $.webServer.address + ':' + $.webServer.port + '/' + $.webServer.serviceName + '/oneSpanGetSignedDocuments/',
            data: JSON.stringify(retrieveData),
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            success: function (response, status, xhr) {
                var res = response.oneSpanGetSignedDocumentsResult;
                console.log(res)
            },
            error: function (xhr, status, error) {
                console.log('error')
                // alert("Error\n-----\n" + xhr.status + '\n' + xhr.responseText);
            },
        })
    }
	

	return {
        sendPackage,
        oneSpanBuildSigners,
        oneSpanGetSignedDocuments
	};
})();
