var FSSAjax = (function () {
    // FSS Main/Landing Page
   
    async function getFSSPageData(retrieveData) {
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
                    '/getFSSPageData/',
                data: JSON.stringify(retrieveData),
                contentType: 'application/json; charset=utf-8',
                dataType: 'json',
            });
            return data.getFSSPageDataResult;
        } catch (error) {
            console.log(error.responseText);
        }
    }

    function getActiveInactiveFamilylist(dataObj, callback) {
        $.ajax({
            type: 'POST',
            url: $.webServer.protocol + '://' + $.webServer.address + ':' + $.webServer.port + '/' + $.webServer.serviceName + '/getActiveInactiveFamilylist/',
            data:
                '{"token":"' +
                $.session.Token +
                '","isActive":"' +
                dataObj.isActive +
                '"}',
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            success: function (response, status, xhr) {
                var res = response.getActiveInactiveFamilylistResult;
                callback(res);
            },
            error: function (xhr, status, error) { },
        });
    }

    async function getFamilyInfoByID(familyId) {
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
                    '/getFamilyInfoByID/',
                data:
                    '{"token":"' +
                    $.session.Token +
                    '", "familyId":"' +
                    familyId +
                    '"}',
                contentType: 'application/json; charset=utf-8',
                dataType: 'json',
            });
            return result;
        } catch (error) {
            throw new Error(error.responseText);
        }
    }

    async function updateFamilyInfo(retrieveData) {
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
                    '/updateFamilyInfo/',
                data: JSON.stringify(retrieveData),
                contentType: 'application/json; charset=utf-8',
                dataType: 'json',
            });
            return data.updateFamilyInfoResult;
        } catch (error) {
            console.log(error.responseText);
        }
    }

    async function getFamilyMembers(familyID) {
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
                    '/getFamilyMembers/',
                data:
                    '{"token":"' +
                    $.session.Token +
                    '", "familyID":"' +
                    familyID +
                    '"}',
                contentType: 'application/json; charset=utf-8',
                dataType: 'json',
            });
            return result;
        } catch (error) {
            throw new Error(error.responseText);
        }
    }

    async function getMembers() {
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
                    '/getMembers/',
                data:
                    '{"token":"' +
                    $.session.Token +                  
                    '"}',
                contentType: 'application/json; charset=utf-8',
                dataType: 'json',
            });
            return result;
        } catch (error) {
            throw new Error(error.responseText);
        }
    }

    async function insertMemberInfo(retrieveData) {
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
                    '/insertMemberInfo/',
                data: JSON.stringify(retrieveData),
                contentType: 'application/json; charset=utf-8',
                dataType: 'json',
            });
            return data.insertMemberInfoResult;
        } catch (error) {
            console.log(error.responseText);
        }
    }

    async function deleteMemberInfo(retrieveData) {
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
                    '/deleteMemberInfo/',
                data: JSON.stringify(retrieveData),
                contentType: 'application/json; charset=utf-8',
                dataType: 'json',
            });
            return data.deleteMemberInfoResult;
        } catch (error) {
            console.log(error.responseText);
        }
    }

    async function getFunding() {
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
                    '/getFunding/',
                data:
                    '{"token":"' +
                    $.session.Token +
                    '"}',
                contentType: 'application/json; charset=utf-8',
                dataType: 'json',
            });
            return result;
        } catch (error) {
            throw new Error(error.responseText);
        }
    }

    async function insertAuthorization(retrieveData) {
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
                    '/insertAuthorization/',
                data: JSON.stringify(retrieveData),
                contentType: 'application/json; charset=utf-8',
                dataType: 'json',
            });
            return data.insertAuthorizationResult;
        } catch (error) {
            console.log(error.responseText);
        }
    }

    async function insertUtilization(retrieveData) {
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
                    '/insertUtilization/',
                data: JSON.stringify(retrieveData),
                contentType: 'application/json; charset=utf-8',
                dataType: 'json',
            });
            return data.insertUtilizationResult;
        } catch (error) {
            console.log(error.responseText);
        }
    }

    async function getFamilyMembersDropDown() {
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
                    '/getFamilyMembersDropDown/',
                data:
                    '{"token":"' +
                    $.session.Token +
                    '"}',
                contentType: 'application/json; charset=utf-8',
                dataType: 'json',
            });
            return result;
        } catch (error) {
            throw new Error(error.responseText);
        }
    }

    async function getServiceCodes(fundingSourceID) {
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
                    '/getServiceCodes/',
                data:
                    '{"fundingSourceID":"' +
                    fundingSourceID +
                    '"}',
                contentType: 'application/json; charset=utf-8',
                dataType: 'json',
            });
            return result;
        } catch (error) {
            throw new Error(error.responseText);
        }
    }

    async function getVendors() {
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
                    '/getVendors/',
                data:
                    '{"token":"' +
                    $.session.Token +
                    '"}',
                contentType: 'application/json; charset=utf-8',
                dataType: 'json',
            });
            return result;
        } catch (error) {
            throw new Error(error.responseText);
        }
    }


    return {
        getFSSPageData,
        getActiveInactiveFamilylist,
        getFamilyInfoByID,
        updateFamilyInfo,
        getFamilyMembers,
        getMembers,
        insertMemberInfo,
        deleteMemberInfo,
        getFunding,
        insertAuthorization,
        insertUtilization,
        getFamilyMembersDropDown,
        getServiceCodes,
        getVendors
    };
})();
