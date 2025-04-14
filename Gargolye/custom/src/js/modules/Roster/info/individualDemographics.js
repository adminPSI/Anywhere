const individualDemographics = (() => {
    function unload() {
        _DOM.ACTIONCENTER.removeAttribute('data-ui');
        WaitingListAssessment.unload();
    }

    async function load(selectedConsumer) {
        _DOM.ACTIONCENTER.innerHTML = '';
        _DOM.ACTIONCENTER.setAttribute('data-ui', true);
        _DOM.setActiveModuleAttribute('demographicesList');

        moduleWrapEle = _DOM.createElement('div', { class: 'demographicesList' });
        moduleHeaderEle = _DOM.createElement('div', { class: 'demographicesList__header' });
        moduleBodyEle = _DOM.createElement('div', { class: 'demographicesList__body' });

        moduleWrapEle.appendChild(moduleHeaderEle);
        moduleWrapEle.appendChild(moduleBodyEle);
        _DOM.ACTIONCENTER.appendChild(moduleWrapEle);

        var ConsumerID = Number(selectedConsumer.getAttribute('data-consumer-id'));
        const resp = await _UTIL.fetchData('getConsumerDemographicsInformation', { ConsumerId: ConsumerID });

        if ($.session.applicationName === 'Advisor') { 
            const consumerServiceLocation = await _UTIL.fetchData('getConsumerServiceLocation', { ConsumerId: ConsumerID });
            const consumerRelationships = await _UTIL.fetchData('getConsumerIndividualRelationships', { ConsumerId: ConsumerID });
            const consumerCategories = await _UTIL.fetchData('getConsumerCategories', { ConsumerId: ConsumerID });
            const consumerAppointmnets = await _UTIL.fetchData('getConsumerAppointmnets', { ConsumerId: ConsumerID });

            individualAssessment.init({
                wlData: resp.getConsumerDemographicsInformationResult[0],
                selectedConsumer: selectedConsumer,
                moduleHeader: moduleHeaderEle,
                moduleBody: moduleBodyEle,
                locations: consumerServiceLocation.getConsumerServiceLocationResult,
                relationship: consumerRelationships.getConsumerIndividualRelationshipsResult,
                categories: consumerCategories.getConsumerCategoriesResult,
                appointment: consumerAppointmnets.getConsumerAppointmnetsResult,
            });
        }
        else {
            individualAssessment.init({
                wlData: resp.getConsumerDemographicsInformationResult[0],
                selectedConsumer: selectedConsumer,
                moduleHeader: moduleHeaderEle,
                moduleBody: moduleBodyEle,              
            });
        }
        
    }

    return {
        init: load,
        unload,
    };
})();
