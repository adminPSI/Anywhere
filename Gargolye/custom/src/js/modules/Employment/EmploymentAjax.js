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

    async function getEmployeeInfoByIDAsync(positionId) {
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
                    '/getEmployeeInfoByID/',
                data:
                    '{"token":"' +
                    $.session.Token +
                    '", "positionId":"' +
                    positionId +
                    '"}',
                contentType: 'application/json; charset=utf-8',
                dataType: 'json',
            });
            return result;
        } catch (error) {
            throw new Error(error.responseText);
        }
    }

    async function insertEmploymentPathAsync(
        employmentPath, newStartDate, newEndDate, currentEndDate, peopleID, userID, existingPathID
    ) {
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
                    '/insertEmploymentPath/',
                data: JSON.stringify({
                    token: $.session.Token,
                    employmentPath: employmentPath,
                    newStartDate: newStartDate,
                    newEndDate: newEndDate,
                    currentEndDate: currentEndDate,
                    peopleID: peopleID,
                    userID: userID,
                    existingPathID: existingPathID,
                }),
                contentType: 'application/json; charset=utf-8',
                dataType: 'json',
            });
            return result;
        } catch (error) {
            throw new Error(error.responseText);
        }
    }

    async function insertEmploymentInfoAsync(
        startDatePosition, endDatePosition, position, jobStanding, employer, transportation, typeOfWork, selfEmployed, name, phone, email, peopleID, userID, PositionId, typeOfEmployment
    ) {
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
                    '/insertEmploymentInfo/',
                data: JSON.stringify({
                    token: $.session.Token,
                    startDatePosition: startDatePosition,
                    endDatePosition: endDatePosition,
                    position: position,
                    jobStanding: jobStanding,
                    employer: employer,
                    transportation: transportation,
                    typeOfWork: typeOfWork,
                    selfEmployed: selfEmployed,
                    name: name,
                    phone: phone,
                    email: email,
                    peopleID: peopleID,
                    userID: userID,
                    PositionId: PositionId,
                    typeOfEmployment: typeOfEmployment,
                }),
                contentType: 'application/json; charset=utf-8',
                dataType: 'json',
            });
            return result;
        } catch (error) {
            throw new Error(error.responseText);
        }
    }

    async function getJobStandingsDropDownAsync() {
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
                    '/getJobStandingsDropDown/',
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

    async function getEmployerDropDownAsync() {
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
                    '/getEmployerDropDown/',
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

    async function getPositionDropDownAsync() {
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
                    '/getPositionDropDown/',
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

    async function getTransportationDropDownAsync() {
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
                    '/getTransportationDropDown/',
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

    async function getTypeOfWorkDropDownAsync() {
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
                    '/getTypeOfWorkDropDown/',
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

    async function getTypeOfEmploymentDropDownAsync() {
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
                    '/getTypeOfEmploymentDropDown/',
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

    async function getWagesEntriesAsync(positionID) {
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
                    '/getWagesEntries/',
                data:
                    '{"token":"' +
                    $.session.Token +
                    '", "positionID":"' +
                    positionID +
                    '"}',
                contentType: 'application/json; charset=utf-8',
                dataType: 'json',
            });
            return result;
        } catch (error) {
            throw new Error(error.responseText);
        }
    }

    async function getWagesCheckboxEntriesAsync(positionID) {
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
                    '/getWagesCheckboxEntries/',
                data:
                    '{"token":"' +
                    $.session.Token +
                    '", "positionID":"' +
                    positionID +
                    '"}',
                contentType: 'application/json; charset=utf-8',
                dataType: 'json',
            });
            return result;
        } catch (error) {
            throw new Error(error.responseText);
        }
    }

    async function insertWagesAsync(
        hoursWeek, hoursWages, startDate, endDate, PositionId, wagesID, userID
    ) {
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
                    '/insertWages/',
                data: JSON.stringify({
                    token: $.session.Token,
                    hoursWeek: hoursWeek,
                    hoursWages: hoursWages,
                    startDate: startDate,
                    endDate: endDate,
                    PositionId: PositionId,
                    wagesID: wagesID,
                    userID: userID
                }),
                contentType: 'application/json; charset=utf-8',
                dataType: 'json',
            });
            return result;
        } catch (error) {
            throw new Error(error.responseText);
        }
    }


    async function saveCheckboxWagesAsync(
        chkboxName, IsChacked, PositionId, textboxValue, userID
    ) {
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
                    '/saveCheckboxWages/',
                data: JSON.stringify({
                    token: $.session.Token,
                    chkboxName: chkboxName,
                    IsChacked: IsChacked,
                    PositionId: PositionId,
                    textboxValue: textboxValue,
                    userID: userID
                }),
                contentType: 'application/json; charset=utf-8',
                dataType: 'json',
            });
            return result;
        } catch (error) {
            throw new Error(error.responseText);
        }
    }

    async function getPositionTaskEntriesAsync(positionID) {
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
                    '/getPositionTaskEntries/',
                data:
                    '{"token":"' +
                    $.session.Token +
                    '", "positionID":"' +
                    positionID +
                    '"}',
                contentType: 'application/json; charset=utf-8',
                dataType: 'json',
            });
            return result;
        } catch (error) {
            throw new Error(error.responseText);
        }
    }

    async function getInitialPerformanceDropdownAsync() {
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
                    '/getInitialPerformanceDropdown/',
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

    async function insertPositionTaskAsync(
        task, description, startDate, endDate, initialPerformance, initialPerformanceNotes, employeeStandard, PositionId, jobTaskID, userID
    ) {
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
                    '/insertPositionTask/',
                data: JSON.stringify({
                    token: $.session.Token,
                    task: task,
                    description: description,
                    startDate: startDate,
                    endDate: endDate,
                    initialPerformance: initialPerformance,
                    initialPerformanceNotes: initialPerformanceNotes,
                    employeeStandard: employeeStandard,
                    PositionId: PositionId,
                    jobTaskID: jobTaskID,
                    userID: userID
                }),
                contentType: 'application/json; charset=utf-8',
                dataType: 'json',
            });
            return result;
        } catch (error) {
            throw new Error(error.responseText);
        }
    }

    async function getWorkScheduleEntriesAsync(positionID) {
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
                    '/getWorkScheduleEntries/',
                data:
                    '{"token":"' +
                    $.session.Token +
                    '", "positionID":"' +
                    positionID +
                    '"}',
                contentType: 'application/json; charset=utf-8',
                dataType: 'json',
            });
            return result;
        } catch (error) {
            throw new Error(error.responseText);
        }
    }

    async function isNewPositionEnableAsync(consumerIds) {
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
                    '/isNewPositionEnable/',
                data:
                    '{"token":"' +
                    $.session.Token +
                    '", "consumerIds":"' +
                    consumerIds +
                    '"}',
                contentType: 'application/json; charset=utf-8',
                dataType: 'json',
            });
            return result;
        } catch (error) {
            throw new Error(error.responseText);
        }
    }

    async function getEmployeementPathAsync(consumersId) {
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
                    '/getEmployeementPath/',
                data:
                    '{"token":"' +
                    $.session.Token +
                    '", "consumersId":"' +
                    consumersId +
                    '"}',
                contentType: 'application/json; charset=utf-8',
                dataType: 'json',
            });
            return result;
        } catch (error) {
            throw new Error(error.responseText);
        }
    }

    async function insertWorkScheduleAsync(
        dayOfWeek, startTime, endTime, PositionId, WorkScheduleID, userID
    ) {
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
                    '/insertWorkSchedule/',
                data: JSON.stringify({
                    token: $.session.Token,
                    dayOfWeek: dayOfWeek,
                    startTime: startTime,
                    endTime: endTime,
                    PositionId: PositionId,
                    WorkScheduleID: WorkScheduleID,
                    userID: userID,
                }),
                contentType: 'application/json; charset=utf-8',
                dataType: 'json',
            });
            return result;
        } catch (error) {
            throw new Error(error.responseText);
        }
    }

    async function getLastTaskNumberAsync(positionID) {
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
                    '/getLastTaskNumber/',
                data:
                    '{"token":"' +
                    $.session.Token +
                    '", "positionID":"' +
                    positionID +
                    '"}',
                contentType: 'application/json; charset=utf-8',
                dataType: 'json',
            });
            return result;
        } catch (error) {
            throw new Error(error.responseText);
        }
    }

    function deleteWagesBenefits(dataObj, callback) {
        $.ajax({
            type: 'POST',
            url: $.webServer.protocol + '://' + $.webServer.address + ':' + $.webServer.port + '/' + $.webServer.serviceName + '/deleteWagesBenefits/',
            data:
                '{"token":"' +
                $.session.Token +
                '","wagesID":"' +
                dataObj.wagesID +
                '"}',
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            success: function (response) {
                var res = response.deleteWagesBenefitsResult;
                callback(res);
            },
            error: function (xhr, status, error) { },
        });
    }

    function deleteWorkSchedule(dataObj, callback) {
        $.ajax({
            type: 'POST',
            url: $.webServer.protocol + '://' + $.webServer.address + ':' + $.webServer.port + '/' + $.webServer.serviceName + '/deleteWorkSchedule/',
            data:
                '{"token":"' +
                $.session.Token +
                '","WorkScheduleID":"' +
                dataObj.WorkScheduleID +
                '"}',
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            success: function (response) {
                var res = response.deleteWorkScheduleResult;
                callback(res);
            },
            error: function (xhr, status, error) { },
        });
    }

    function deletePostionTask(dataObj, callback) {
        $.ajax({
            type: 'POST',
            url: $.webServer.protocol + '://' + $.webServer.address + ':' + $.webServer.port + '/' + $.webServer.serviceName + '/deletePostionTask/',
            data:
                '{"token":"' +
                $.session.Token +
                '","jobTaskID":"' +
                dataObj.jobTaskID +
                '","PositionID":"' +
                dataObj.PositionID +
                '"}',
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            success: function (response) {
                var res = response.deletePostionTaskResult;
                callback(res);
            },
            error: function (xhr, status, error) { },
        });
    }

    async function getEmployeeStatusDropDownAsync() {
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
                    '/getEmployeeStatusDropDown/',
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

    async function createNewEmploymentPathAsync(
        currentStatus, pathToEmployment, pathToStartDate, peopleID, userID
    ) {
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
                    '/createNewEmploymentPath/',
                data: JSON.stringify({
                    token: $.session.Token,
                    currentStatus: currentStatus,
                    pathToEmployment: pathToEmployment,
                    pathToStartDate: pathToStartDate,
                    peopleID: peopleID,
                    userID: userID
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
        getEmployeeInfoByIDAsync,
        insertEmploymentPathAsync,
        insertEmploymentInfoAsync,
        getJobStandingsDropDownAsync,
        getEmployerDropDownAsync,
        getPositionDropDownAsync,
        getTransportationDropDownAsync,
        getTypeOfWorkDropDownAsync,
        getWagesEntriesAsync,
        getWagesCheckboxEntriesAsync,
        insertWagesAsync,
        saveCheckboxWagesAsync,
        getPositionTaskEntriesAsync,
        getInitialPerformanceDropdownAsync,
        insertPositionTaskAsync,
        getWorkScheduleEntriesAsync,
        isNewPositionEnableAsync,
        getEmployeementPathAsync,
        insertWorkScheduleAsync,
        getLastTaskNumberAsync,
        deleteWagesBenefits,
        deleteWorkSchedule,
        deletePostionTask,
        getEmployeeStatusDropDownAsync,
        createNewEmploymentPathAsync,
        getTypeOfEmploymentDropDownAsync,
    };
})();
