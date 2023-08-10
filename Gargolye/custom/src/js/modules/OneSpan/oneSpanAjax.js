var oneSpanAjax = (function() {
	'use-strict';

    async function oneSpanBuildSigners(retrieveData) {
        //token, assessmentID, userID, versionID, extraSpace, isp, oneSpan
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
                    '/oneSpanBuildSigners/',
                data: JSON.stringify(retrieveData),
                contentType: 'application/json; charset=utf-8',
                dataType: 'json',
            });

            return await data.oneSpanBuildSignersResult;//
        } catch (error) {
            console.log(error)
        }
    }
    //function oneSpanBuildSigners() {
    //    $.ajax({
    //        type: 'POST',
    //        url:
    //            $.webServer.protocol + '://' +
    //            $.webServer.address + ':' +
    //            $.webServer.port + '/' +
    //            $.webServer.serviceName + '/oneSpanBuildSigners/',
    //        data: '{"token":"' + $.session.Token + '"}',
    //        contentType: 'application/json; charset=utf-8',
    //        dataType: 'json',
    //        success: function (response, status, xhr) {
    //            var res;
    //            try {
    //                res = response.oneSpanBuildSignersResult;
    //                //callback(res, null);
    //            } catch (e) {
    //               // callback(null, error);
    //            }
    //        },
    //        error: function (xhr, status, error) {
    //            callback(error, null);
    //        },
    //    });
    //}
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

        return  await data.oneSpanGetSignedDocumentsResult;
        
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

        oneSpanBuildSigners,
        oneSpanGetSignedDocuments,
        oneSpanCheckDocumentStatus
	};
})();
