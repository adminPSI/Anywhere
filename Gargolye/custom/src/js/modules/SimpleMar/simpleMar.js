var simpleMar = (function () {
    
    async function simpleMarLogin() {
        await simpleMarAjax.simpleMarLogin();
    }

    return {
        simpleMarLogin,   
    }
})();