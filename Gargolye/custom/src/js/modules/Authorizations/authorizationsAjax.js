const authorizationsAjax = (function () {
    async function getPageData(retrieveData) {
        // token
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
                    '/getAuthorizationPageData/',
                data: JSON.stringify(retrieveData),
                contentType: 'application/json; charset=utf-8',
                dataType: 'json',
            });
            return data.getAuthorizationPageDataResult;
        } catch (error) {
            console.log(error.responseText);
        }
    }

    async function getFilterDropdownData(retrieveData) {
        // token
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
                    '/getAuthorizationFilterData/',
                data: JSON.stringify(retrieveData),
                contentType: 'application/json; charset=utf-8',
                dataType: 'json',
            });
            return data.getAuthorizationFilterDataResult;
        } catch (error) {
            console.log(error.responseText);
        }
    }

    async function getAssessmentEntriesAsync(consumerIds, methodology, score, startDateFrom, startDateTo, endDateFrom, endDateTo, priorAuthApplFrom, priorAuthApplTo, priorAuthRecFrom, priorAuthRecTo, priorAuthAmtFrom, priorAuthAmtTo) {
        try {
            const result = await $.ajax({
                type: 'POST',
                url:
                    $.webServer.protocol +
                    '://' +
                    $.webServer.address +
                    ':' +
                    $.webServer.port +
                    '/' +
                    $.webServer.serviceName +
                    '/getAssessmentEntries/',
                data:
                    '{"token":"' +
                    $.session.Token +
                    '", "consumerIds":"' +
                    consumerIds +
                    '", "methodology":"' +
                    methodology +
                    '", "score":"' +
                    score +
                    '", "startDateFrom":"' +
                    startDateFrom +
                    '", "startDateTo":"' +
                    startDateTo +
                    '", "endDateFrom":"' +
                    endDateFrom +
                    '", "endDateTo":"' +
                    endDateTo +
                    '", "priorAuthApplFrom":"' +
                    priorAuthApplFrom +
                    '", "priorAuthApplTo":"' +
                    priorAuthApplTo +
                    '", "priorAuthRecFrom":"' +
                    priorAuthRecFrom +
                    '", "priorAuthRecTo":"' +
                    priorAuthRecTo +
                    '", "priorAuthAmtFrom":"' +
                    priorAuthAmtFrom +
                    '", "priorAuthAmtTo":"' +
                    priorAuthAmtTo +
                    '"}',
                contentType: 'application/json; charset=utf-8',
                dataType: 'json',
            });

            return result;
        } catch (error) {
            throw new Error(error.responseText);
        }
    }

    async function getScoreAsync(MethodologyID) {
        try {
            const result = await $.ajax({
                type: 'POST',
                url:
                    $.webServer.protocol +
                    '://' +
                    $.webServer.address +
                    ':' +
                    $.webServer.port +
                    '/' +
                    $.webServer.serviceName +
                    '/getScore/',
                data: JSON.stringify({
                    token: $.session.Token,
                    methodologyID: MethodologyID,
                }),
                contentType: 'application/json; charset=utf-8',
                dataType: 'json',
            });
            return result;
        } catch (error) {
            throw new Error(error.responseText);
        }
    }

    return {
        getPageData,
        getFilterDropdownData,
        getAssessmentEntriesAsync,
        getScoreAsync,
    };
})();
