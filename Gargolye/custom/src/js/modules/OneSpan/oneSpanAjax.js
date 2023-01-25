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

    function oneSpanBuildSigners(retrieveData) {
        //(string packageName, string documentName, string filePath, string[] emails, string[] names, string[] teamMember)
        // const retrieveData = {
        //     token: $.session.Token,
        //     packageName: "Franklin County One Span Demo",
        //     documentName: "Plan report", 
        //     filePath: "C:\\Users\\mike.taft\\OneSpanSignDemo.pdf",
        //     emails: ["erick.bey@primarysolutions.net", "erickbey10@gmail.com", "erickbe10@yahoo.com", "erickbey1@outlook.com"],
        //     names: ["Crystal Schneider", "Michael Taft", "Karin Crabbe", "Angie Theller"]
        // };

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
                // alert("Error\n-----\n" + xhr.status + '\n' + xhr.responseText);
            },
        });
    }

    function oneSpanGetSignedDocuments(retrieveData) {
        // token, packageId, signatureId?
        // const retrieveData = {
        //     token: $.session.Token,
        //     packageId: "tJtJIoFk24oranK-ZPHHbm4CE64=",
        // };
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
