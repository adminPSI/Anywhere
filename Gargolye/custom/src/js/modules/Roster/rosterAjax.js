const rosterAjax = (function () {
    function getRosterLocations(callback) {
        return $.ajax({
            type: 'POST',
            url:
                $.webServer.protocol +
                '://' +
                $.webServer.address +
                ':' +
                $.webServer.port +
                '/' +
                $.webServer.serviceName +
                '/getLocationsJSON/',
            data: '{"token":"' + $.session.Token + '"}',
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
        });
    }
    function getConsumersByGroup(data, callback) {
        // data = {selectedGroupCode, selectedGroupId, selectedLocationId, selectedDate}
        var groupCode = data.selectedGroupCode;
        var retrieveId =
            groupCode === 'CST' || groupCode === 'TRA' || groupCode === 'NAT'
                ? data.selectedGroupId
                : data.selectedLocationId;
        var date = data.selectedDate;
        var daysBackDate = convertDaysBack($.session.defaultProgressNoteReviewDays);

        date = date ? date : UTIL.getTodaysDate();
        var selectedActive = data.selectedActive;
 
        return $.ajax({
            type: 'POST',
            url:
                $.webServer.protocol +
                '://' +
                $.webServer.address +
                ':' +
                $.webServer.port +
                '/' +
                $.webServer.serviceName +
                '/getConsumersByGroupJSON/',
            data:
                '{"groupCode":"' +
                groupCode +
                '", "retrieveId":"' +
                retrieveId +
                '", "token":"' +
                $.session.Token +
                '", "serviceDate":"' +
                date +
                '", "daysBackDate":"' +
                daysBackDate +
                '", "isActive":"' +
                selectedActive +
                '"}',
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
        });
    }
    function getIndividualAbsentData(data, callback) {
        //token, locationId, consumerId, checkDate
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
                '/checkForIndividualAbsentJSON/',
            //data: '{"token":"' + $.session.Token + '","consumerId":"' + consumerId + '"}',
            data: JSON.stringify(data),
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            success: function (response, status, xhr) {
                try {
                    var res = response.checkForIndividualAbsentJSONResult;
                } catch (e) {
                    callback('There was a problem parsing checkForIndividualAbsentResult');
                }
            },
            error: function (xhr, status, error) {
                callback(null);
            },
        });
    }
    function getAllAttachments(data, callback) {
        //data = {token, locationId, consumerId, checkDate}
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
                '/getAllAttachments/',
            data: JSON.stringify(data),
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            success: function (response, status, xhr) {
                try {
                    var res = response.getAllAttachmentsResult;
                    callback(res);
                } catch (e) {
                    callback('There was a problem parsing checkForIndividualAbsentResult');
                }
            },
        });
    }
    function getConsumerDemographics(consumerId, callback) {
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
                '/getConsumerDemographicsJSON/',
            data: '{"token":"' + $.session.Token + '","consumerId":"' + consumerId + '"}',
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            success: function (response, status, xhr) {
                var res = response.getConsumerDemographicsJSONResult;
                callback(res);
            },
        });
    }
    function getConsumerRelationships(consumerId, callback) {
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
                '/getConsumerRelationshipsJSON/',
            data: '{"token":"' + $.session.Token + '","consumerId":"' + consumerId + '"}',
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            success: function (response, status, xhr) {
                var res = response.getConsumerRelationshipsJSONResult;
                callback(res);
            },
        });
    }
    function getDemographicsNotes(consumerId, callback) {
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
                '/getDemographicsNotesJSON/',
            data: '{"token":"' + $.session.Token + '","consumerId":"' + consumerId + '"}',
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            success: function (response, status, xhr) {
                var res = response.getDemographicsNotesJSONResult;
                callback(res);
            },
        });
    }
    function getConsumerScheduleLocation(consumerId, callback) {
        data = {
            token: $.session.Token,
            consumerId: consumerId,
        };
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
                '/getConsumerScheduleLocation/',
            data: JSON.stringify(data),
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            success: function (response, status, xhr) {
                data = response.getConsumerScheduleLocationResult;
                callback(data);
            },
        });
    }
    function getConsumerSchedule(locationId, consumerId, callback) {
        data = {
            token: $.session.Token,
            locationId: locationId,
            consumerId: consumerId,
        };
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
                '/populateConsumerSchedule/',
            data: JSON.stringify(data),
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            success: function (response, status, xhr) {
                scheduleData = response.populateConsumerScheduleResult;
                callback(scheduleData);
            },
        });
    }
    async function updatePortrait(imageFile, id, portraitPath, callback) {
        await $.ajax({
            type: 'POST',
            url:
                $.webServer.protocol +
                '://' +
                $.webServer.address +
                ':' +
                $.webServer.port +
                '/' +
                $.webServer.serviceName +
                '/updatePortrait/',
            data:
                '{"token":"' +
                $.session.Token +
                '","employeeUserName":"' +
                $.session.UserId +
                '","imageFile":"' +
                imageFile +
                '","id":"' +
                id +
                '","portraitPath":"' +
                portraitPath +
                '"}',
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            success: function (response, status, xhr) {
                var res = JSON.stringify(response);
                callback();
            },
            error: function (xhr, status, error) {
                console.log(status);
                console.log(error);
                console.log(xhr.responseText);
            },
        });
    }
    function getPSIUserOptionList(callback) {
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
                '/getPSIUserOptionListJSON/',
            data: '{"token":"' + $.session.Token + '"}',
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            success: function (response, status, xhr) {
                var res = response.getPSIUserOptionListJSONResult;
                callback(null, res);
            },
            error: function (xhr, status, error) {
                callback(error, null);
                //alert("Error\n-----\n" + xhr.status + '\n' + xhr.responseText);
            },
        });
    }
    async function updateConsumerDemographics(retrieveData) {
        //type, value, consumerId
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
                    '/updateDemographicsRecord/',
                data: JSON.stringify(retrieveData),
                contentType: 'application/json; charset=utf-8',
                dataType: 'json',
            });

            return {
                ...data.updateDemographicsRecordResult,
            };
        } catch (error) {
            console.log(error);
        }
    }
    async function removeConsumerPhoto(retrieveData) {
        // consumerId
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
                    '/removeConsumerPhoto/',
                data: JSON.stringify(retrieveData),
                contentType: 'application/json; charset=utf-8',
                dataType: 'json',
            });

            return {
                ...data.removeConsumerPhotoResult,
            };
        } catch (error) {
            console.log(error);
        }
    }

    async function verifyDefaultEmailClient() {
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
                    '/verifyDefaultEmailClient/', 
                data: JSON.stringify(),
                contentType: 'application/json; charset=utf-8',
                dataType: 'json',
            });
            return data;
        } catch (error) {
            console.log(error);
        }
    }

    return {
        getRosterLocations,
        getConsumersByGroup,
        getIndividualAbsentData,
        getAllAttachments,
        getConsumerDemographics,
        getDemographicsNotes,
        getConsumerScheduleLocation,
        getConsumerSchedule,
        updatePortrait,
        getConsumerRelationships,
        getPSIUserOptionList,
        updateConsumerDemographics,
        removeConsumerPhoto,
        verifyDefaultEmailClient,
    };
})();
