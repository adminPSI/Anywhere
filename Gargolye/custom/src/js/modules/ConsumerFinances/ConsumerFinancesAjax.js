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


    return {
        getAccountTransectionEntriesAsync,
        getActiveAccountAsync,     
    };
})();
