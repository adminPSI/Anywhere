var EmploymentAjax = (function () {
    // Employment Main/Landing Page
    async function getEmploymentEntriesAsync(consumerIds, employer, position, positionStartDate, positionEndDate, jobStanding) { 
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
                    '/getEmploymentEntries/',
                data:
                    '{"token":"' +
                    $.session.Token +
                    '", "consumerIds":"' +
                    consumerIds +
                    '", "employer":"' +
                    employer +
                    '", "position":"' +
                    position +
                    '", "positionStartDate":"' +
                    positionStartDate +
                    '", "positionEndDate":"' +
                    positionEndDate +
                    '", "jobStanding":"' +
                    jobStanding +
                    '"}',
                contentType: 'application/json; charset=utf-8',
                dataType: 'json',
            });
            return result;
        } catch (error) {
            throw new Error(error.responseText);
        }
    }

    async function getEmployersAsync() {
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
                    '/getEmployers/',
                data: JSON.stringify({
                    token: $.session.Token,

                }),
                contentType: 'application/json; charset=utf-8',
                dataType: 'json',
            });
            return result;
        } catch (error) {
            throw new Error(error.responseText);
        }
    }

    async function getPositionsAsync() {
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
                    '/getPositions/',
                data: JSON.stringify({
                    token: $.session.Token,

                }),
                contentType: 'application/json; charset=utf-8',
                dataType: 'json',
            });
            return result;
        } catch (error) {
            throw new Error(error.responseText);
        }
    }

    async function getJobStandingsAsync() {
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
                    '/getJobStandings/',
                data: JSON.stringify({
                    token: $.session.Token,

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
        getEmploymentEntriesAsync,
        getEmployersAsync,
        getPositionsAsync,
        getJobStandingsAsync,
    };
})();
