const TRANS_routeDocumentationAjax = (function() {

    function getRouteInformation(tripCompletedId) {
        const data = {
            token: $.session.Token,
            tripsCompletedId: tripCompletedId
        }
        return $.ajax({
            type: 'POST',
            url: $.webServer.protocol + '://' + $.webServer.address + ':' + $.webServer.port + '/' + $.webServer.serviceName + '/getTripInformation/',
            data: JSON.stringify(data),
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
        });
    }
    function getRouteConsumers(tripCompletedId) {
        const data = {
            token: $.session.Token,
            tripsCompletedId: tripCompletedId
        }
        return $.ajax({
            type: 'POST',
            url: $.webServer.protocol + '://' + $.webServer.address + ':' + $.webServer.port + '/' + $.webServer.serviceName + '/getTripConsumers/',
            data: JSON.stringify(data),
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
        });
    }
    function getConsumerDetails(consumerId) {
        const data = {
            token: $.session.Token,
            consumerId: consumerId
        }
        return $.ajax({
            type: 'POST',
            url: $.webServer.protocol + '://' + $.webServer.address + ':' + $.webServer.port + '/' + $.webServer.serviceName + '/getConsumerDetails/',
            data: JSON.stringify(data),
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
        });
    }
    function updateTripDetails(data) {
        return $.ajax({
            type: 'POST',
            url: $.webServer.protocol + '://' + $.webServer.address + ':' + $.webServer.port + '/' + $.webServer.serviceName + '/updateTripDetails/',
            data: JSON.stringify(data),
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
        });
    }
    function insertUpdateTripConsumers(data) {
        return $.ajax({
            type: 'POST',
            url: $.webServer.protocol + '://' + $.webServer.address + ':' + $.webServer.port + '/' + $.webServer.serviceName + '/insertUpdateTripConsumers/',
            data: JSON.stringify(data),
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
        });
    }

    function deleteConsumerFromTrip(data) {
        return $.ajax({
            type: 'POST',
            url: $.webServer.protocol + '://' + $.webServer.address + ':' + $.webServer.port + '/' + $.webServer.serviceName + '/deleteConsumerFromTrip/',
            data: JSON.stringify(data),
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
        });
    }

    async function getImportValue(selectedLocationId) {
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
                    '/getImportValue/',
                data: '{"token":"' + $.session.Token + '", "selectedLocationId":"' + selectedLocationId + '"}',
                contentType: 'application/json; charset=utf-8',
                dataType: 'json',
            });
            return result;
        } catch (error) {
            throw new Error(error.responseText);
        }
    }

    async function getRouteLocations() {
        try {
            const result = await $.ajax({
                type: 'POST',
                url: $.webServer.protocol + '://' + $.webServer.address + ':' + $.webServer.port + '/' + $.webServer.serviceName + '/getRouteLocations/',
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
        getRouteInformation,
        getRouteConsumers,
        getConsumerDetails,
        updateTripDetails,
        insertUpdateTripConsumers,
        deleteConsumerFromTrip,
        getImportValue,
        getRouteLocations
    }
})();