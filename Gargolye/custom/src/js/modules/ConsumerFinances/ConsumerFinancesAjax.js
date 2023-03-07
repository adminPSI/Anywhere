var ConsumerFinancesAjax = (function () {
    // OOD Main/Landing Page
    async function getAccountTransectionEntriesAsync(consumerIds, activityStartDate, activityEndDate, accountName, payee, category, amount, checkNo, balance, enteredBy) {
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
                    '/getAccountTransectionEntries/',
                data:
                    '{"token":"' +
                    $.session.Token +
                    '", "consumerIds":"' +
                    consumerIds +
                    '", "activityStartDate":"' +
                    activityStartDate +
                    '", "activityEndDate":"' +
                    activityEndDate +
                    '", "accountName":"' +
                    accountName +
                    '", "payee":"' +
                    payee +
                    '", "category":"' +
                    category +
                    '", "amount":"' +
                    amount +
                    '", "checkNo":"' +
                    checkNo +
                    '", "balance":"' +
                    balance +
                    '", "enteredBy":"' +
                    enteredBy +
                    '"}',
                contentType: 'application/json; charset=utf-8',
                dataType: 'json',
            });
            return result;
        } catch (error) {
            throw new Error(error.responseText);
        }
    }
    // OOD Main/Landing Page
    async function getActiveAccountAsync() {
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
                    '/getActiveAccount/',
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

    async function getPayeesAsync() {
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
                    '/getPayees/',
                data: JSON.stringify({
                    token: $.session.Token,
                    UserId: $.session.UserId,
                }),
                contentType: 'application/json; charset=utf-8',
                dataType: 'json',
            });
            return result;
        } catch (error) {
            throw new Error(error.responseText);
        }
    }

    async function getCategoriesAsync(CategoryID) {
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
                    '/getCatogories/',
                data: JSON.stringify({
                    token: $.session.Token,
                    categoryID: CategoryID,
                }),
                contentType: 'application/json; charset=utf-8',
                dataType: 'json',
            });
            return result;
        } catch (error) {
            throw new Error(error.responseText);
        }
    }

    async function getSubCategoriesAsync(CategoryID) {
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
                    '/getSubCatogories/',
                data: JSON.stringify({
                    token: $.session.Token,
                    categoryID: CategoryID,
                }),
                contentType: 'application/json; charset=utf-8',
                dataType: 'json',
            });
            return result;
        } catch (error) {
            throw new Error(error.responseText);
        }
    }

    async function insertPayeeAsync(
        payeeName,
        payeeaddress1,
        payeeaddress2,
        payeecity,
        payeestate,
        payeezipcode
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
                    '/insertPayee/',
                data: JSON.stringify({
                    token: $.session.Token,
                    payeeName: payeeName,
                    address1: payeeaddress1,
                    address2: payeeaddress2,
                    city: payeecity,
                    state: payeestate,
                    zipcode: payeezipcode,
                    userId: $.session.UserId
                }),
                contentType: 'application/json; charset=utf-8',
                dataType: 'json',
            });
            return result;
        } catch (error) {
            throw new Error(error.responseText);
        }
    }

    async function insertAccountAsync(
        date, amount, amountType, AccountID, payee, CategoryID, subCategory, checkNo, description, attachmentType, attachment, receipt, BtnName, regId
    ) {
        try {
            debugger; 
            var binary = '';
            var bytes = new Uint8Array(attachment);
            var len = bytes.byteLength;
            for (var i = 0; i < len; i++) {
                binary += String.fromCharCode(bytes[i]);
            }
            let abString = window.btoa(binary);
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
                    '/insertAccount/',
                data: JSON.stringify({
                    token: $.session.Token,
                    date: date,
                    amount: amount,
                    amountType: amountType,
                    account: AccountID,
                    payee: payee,                   
                    category: CategoryID,
                    subCategory: subCategory,
                    checkNo: checkNo,
                    description: description,
                    attachmentType: attachmentType,
                    attachment: abString,
                    receipt: receipt,  
                    userId: $.session.UserId,
                    eventType: BtnName,
                    regId: regId
                }),
                contentType: 'application/json; charset=utf-8',
                dataType: 'json',
            });
            return result;
        } catch (error) {
            throw new Error(error.responseText);
        }
    }

    async function getAccountEntriesByIDAsync(registerId) {
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
                    '/getAccountEntriesById/',
                data:
                    '{"token":"' +
                    $.session.Token +
                    '", "registerId":"' +
                    registerId +
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
        getAccountTransectionEntriesAsync,
        getActiveAccountAsync,
        getPayeesAsync,
        getCategoriesAsync,
        getSubCategoriesAsync,
        insertPayeeAsync,
        insertAccountAsync,
        getAccountEntriesByIDAsync,

    };
})();
