var rosterToDoListWidgetAjax = (function () {

    async function getRosterToDoListWidgetData(peopleId) {
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
                    '/getRosterToDoListWidgetData/',
                data: JSON.stringify({
                    token: $.session.Token,
                    responsiblePartyId: peopleId,
                    isCaseLoad: $.session.RosterCaseLoad 
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
        getRosterToDoListWidgetData,
    };
})();
