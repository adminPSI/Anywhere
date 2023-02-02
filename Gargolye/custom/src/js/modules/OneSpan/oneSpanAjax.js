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
            url: 
                $.webServer.protocol + 
                '://' + $.webServer.address + 
                ':' + $.webServer.port + 
                '/' + 
                $.webServer.serviceName + 
                '/sendOneSpanPackage/',
            data: JSON.stringify(retrieveData),
			contentType: 'application/json; charset=utf-8',
			dataType: 'json',
			success: function(response, status, xhr) {
                var res = response.sendPackageResult;
                return res;
			},
			error: function(xhr, status, error) {
				//alert("Error\n-----\n" + xhr.status + '\n' + xhr.responseText);
			},
		});
	}

    function oneSpanBuildSigners(retrieveData) {
        //token, assessmentID, userID, versionID, extraSpace, isp
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
                '/oneSpanBuildSigners/',
            data: JSON.stringify(retrieveData),
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            success: function (response, status, xhr) {
                var res = response.oneSpanBuildSignersResult;
                return res;
            },
            error: function (xhr, status, error) {
                // alert("Error\n-----\n" + xhr.status + '\n' + xhr.responseText);
            },
        });
    }

    async function oneSpanGetSignedDocuments(retrieveData) {
        // token, packageId, planId
        try {
            const data = await $.ajax({
                type: 'POST',
                url: 
                    $.webServer.protocol + 
                    '://' + 
                    $.webServer.address + 
                    ':' + 
                    $.webServer.port + 
                    '/' + 
                    $.webServer.serviceName + 
                    '/oneSpanGetSignedDocuments/',
                data: JSON.stringify(retrieveData),
                contentType: 'application/json; charset=utf-8',
                dataType: 'json',
        });

        return data.oneSpanGetSignedDocumentsResult;
        
     } catch (error) {
            console.log(error)
        }
    }

    async function oneSpanCheckDocumentStatus(retrieveData) {
        // token, assessmentId
        try {
          const data = await $.ajax({
            type: 'POST',
            url: 
                $.webServer.protocol + 
                '://' + 
                $.webServer.address + 
                ':' + 
                $.webServer.port + 
                '/' + 
                $.webServer.serviceName + 
                '/oneSpanCheckDocumentStatus/',
            data: JSON.stringify(retrieveData),
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            });

            return data.oneSpanCheckDocumentStatusResult;

        } catch (error) {
            console.log(error);
          }
    }

	return {
        sendPackage,
        oneSpanBuildSigners,
        oneSpanGetSignedDocuments,
        oneSpanCheckDocumentStatus
	};
})();
