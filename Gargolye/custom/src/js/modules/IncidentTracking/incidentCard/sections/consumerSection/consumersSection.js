var itConsumerSection = (function() {
	// DOM
  //---------------------
  var section;
  var sectionBody;
  var consumerError;
  var consumersWrap;
  var consumerSections;
	// DATA
  //---------------------
  var activeConsumers = [];
  var consumersInvolved;
  var consumerInvolvedIdArray;
	// Values
  //---------------------

  function clearData(){
    consumerFollowUp.clearData();
    consumerInjuries.clearData();
    consumerIntervention.clearData();
    consumerInvolvement.clearData();
    consumerReporting.clearData();
    consumerReview.clearData();
    activeConsumers = [];
  }
  function deleteConsumerData(consumerId) {
    consumerFollowUp.deleteConsumerData(consumerId);
    consumerInjuries.deleteConsumerData(consumerId);
    consumerIntervention.deleteConsumerData(consumerId);
    consumerInvolvement.deleteConsumerData(consumerId);
    consumerReporting.deleteConsumerData(consumerId);
    consumerReview.deleteConsumerData(consumerId);
  }

  function getConsumersInvolved() {
    if (consumersInvolved) return [...consumersInvolved];
  }
  function getConsumersInvolvedIds() {
    if (consumerInvolvedIdArray && consumerInvolvedIdArray.length > 0) {
      return [...consumerInvolvedIdArray];
    }
  }

  function showConsumersWrap() {
    consumersWrap.classList.add('visible');
    consumerSections.classList.remove('visible');
  }
  function displayCount() {
    var count = activeConsumers.length;
    var countHolder = section.querySelector('span[data-count="consumers"]');
		countHolder.innerHTML = `( ${count} )`;
  }
  function checkForRequiredConsumer() {
    if (activeConsumers.length === 0) {
      consumerError.classList.remove('hidden');
      consumersWrap.classList.remove('visible');
      consumerSections.classList.remove('visible');

      incidentCard.toggleSave(true);
			return;
    }

    consumerError.classList.add('hidden');
    consumersWrap.classList.add('visible');
  }
  function removeConsumerErrors() {
    var consumerCards = [].slice.call(consumersWrap.querySelectorAll('.consumerCard'));
    consumerCards.forEach(card => card.classList.remove('error'));
    incidentCard.toggleSave(false);
  }
  function showConsumerError(consumerIdArray) {
    incidentCard.toggleSave(true);

    var consumerCards = [].slice.call(consumersWrap.querySelectorAll('.consumerCard'));

    if (consumerIdArray[0] === '%') {
      // mark all
      // show error "At least one consumer must have PPI checked."
      consumerCards.forEach(card => card.classList.add('error'));
      return;
    }

    consumerCards.forEach(card => {
      var cardId = card.dataset.consumerId;
      if (consumerIdArray.includes(cardId)) {
        card.classList.add('error');
      } else {
        card.classList.remove('error');
      }
    });
  }

  function moveConsumersToConsumersInvolved(consumers) {
    var initPromises = [];

    consumersWrap.classList.add('visible');

    consumers.forEach(consumer => {
      //If consumer is already on the selected consumer list ignore
			if (activeConsumers.filter(actConsumer => actConsumer.id === consumer.id).length > 0) return
			consumer.card.classList.remove('highlighted');
			var clone = consumer.card.cloneNode(true);
			var card = buildConsumer(clone);
      consumersWrap.appendChild(card);
      var initPromise = consumerInvolvement.initConsumerData(consumer.id);
      initPromises.push(initPromise);
    });

    activeConsumers = roster2.getActiveConsumers();
    checkForRequiredConsumer();
    displayCount();

    Promise.all(initPromises).then(() => {
      consumerInvolvement.checkRequiredFields();
    });
  }
  function removeConsumerFromConsumersInvolved(selectedConsumerId) {
    var consumerCard = document.querySelector(`[data-consumer-id="${selectedConsumerId}"]`).parentElement;
    consumersWrap.removeChild(consumerCard);

    consumerSections.classList.remove('visible');
    
    incidentCard.toggleActionBtns(false);

    roster2.removeConsumerFromActiveConsumers(selectedConsumerId);
    activeConsumers = roster2.getActiveConsumers();

    deleteConsumerData(selectedConsumerId);

    checkForRequiredConsumer();
    consumerInvolvement.checkRequiredFields();
    displayCount();
    roster2.toggleMiniRosterBtnVisible(true)
  }
  
  // Populate
  //-----------------------------------------------
  function populateConsumersWrap() {
    consumerInvolvedIdArray = [];

    consumersInvolved.forEach(c => {
      consumerInvolvedIdArray.push({id: c.consumerId, involvedId: c.consumerInvolvedId});
      // build consumer card
      var consumer = roster2.buildConsumerCard({
        FN: c.firstName,
        LN: c.lastName,
        id: c.consumerId
      });
      // build incident card
      var card = buildConsumer(consumer);
      consumersWrap.appendChild(card);
      // move consumer to avtive list
      roster2.addConsumerToActiveConsumers(consumer);
    });

    activeConsumers = roster2.getActiveConsumers();

    consumersWrap.classList.add('visible');

    checkForRequiredConsumer();
    consumerInvolvement.checkRequiredFields();
    displayCount();
  }

  // Consumer Card
  //-----------------------------------------------
	function buildConsumer(consumerCard) {
    function checkInvolvedRequirements() {
      const locationId = consumerInvolvement.involvementDataLookup(consumerCard.dataset.consumerId).locationId;
      const involvementSec = document.querySelector("[data-sectionid='4']");
      if (locationId === "" || consumerInvolvement.checkOneHasPPI() === false) {
        involvementSec.classList.add('sectionError');
      } else {
        involvementSec.classList.remove('sectionError');
      }
    }    
		consumerCard.classList.remove('highlighted');

		var cardWrap = document.createElement('div');
		cardWrap.classList.add('incidentCard__consumer');
    
		// build card
		cardWrap.appendChild(consumerCard);

		// card event
		cardWrap.addEventListener('click', function() {
			if (event.target === consumerCard) {
        incidentCard.toggleActionBtns(true);
        consumersWrap.classList.remove('visible');
        consumerSections.classList.add('visible');
        consumerSubSections.showMenu(consumerCard);
        checkInvolvedRequirements()
        if (document.querySelector('.consumerListBtn')) roster2.toggleMiniRosterBtnVisible(false);
			}
		});

		return cardWrap;
	}

  // Section
  //-----------------------------------------------
  function buildSection(options, consumersInvolvedData) {
    var opts = options;
    consumersInvolved = consumersInvolvedData;

		section = document.createElement('div');
		section.classList.add('incidentSection', 'visible');
		section.setAttribute('data-card-page', 'consumers');
		section.setAttribute('data-page-num', opts.pageNumber);

		var heading = document.createElement('div');
    heading.classList.add('incidentSection__header');
		heading.innerHTML = `<h3>Consumers Involved <span data-count="consumers"></span></h3>`;

		sectionBody = document.createElement('div');
    sectionBody.classList.add('incidentSection__body');
    
		consumerError = document.createElement('p');
		consumerError.classList.add('consumerError');
    consumerError.innerHTML = 'You must select at least one consumer';
    
    consumersWrap = document.createElement('div');
    consumersWrap.classList.add('consumersWrap');

    consumerSections = consumerSubSections.build(consumersInvolved);

    sectionBody.appendChild(consumerError);
    sectionBody.appendChild(consumersWrap);
    sectionBody.appendChild(consumerSections);
    
    section.appendChild(heading);
    section.appendChild(sectionBody);

    if (consumersInvolved) {
      populateConsumersWrap();
    } else {
      consumerInvolvedIdArray = undefined;
    }
    
    return section;
  }
  
  return {
    build: buildSection,
    addConsumers: moveConsumersToConsumersInvolved,
    removeConsumer: removeConsumerFromConsumersInvolved,
    showConsumersWrap,
    getConsumersInvolved,
    getConsumersInvolvedIds,
    removeConsumerErrors,
    showConsumerError,
    clearData,
  }
})();
