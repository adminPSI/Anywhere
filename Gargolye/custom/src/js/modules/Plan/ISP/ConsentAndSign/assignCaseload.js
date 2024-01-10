const csAssignCaseload = (() => {
  // data
  let consumerswithSaleforceIds;
  let caseManagersfromOptionsTable;
  let assignmentResults;
  // case manager
  let currentCaseManagerSelected;
  // consumer
  let currentconsumersSelected = [];
  // dom
  let assignCaseLoadPopup;
  let assignBtn;

  function toggleAssignButton() {
    if (!currentCaseManagerSelected || currentconsumersSelected.length === 0) {
      assignBtn.classList.add('disabled');
      return;
    }

    assignBtn.classList.remove('disabled');
  }
  function showConfirmationPopup() {
    let selectedConsumerObjs = [];

    const confirmCaseLoadPopup = POPUP.build({
      id: 'sig_assignCaseLoadConfirmPopup',
      classNames: 'confirmCaseLoadPopup',
      hideX: true,
    });

    const message = document.createElement('p');
    message.classList.add('popupMessage');
    message.innerHTML = `
      These individuals are about to be assigned in Salesforce to <span>${currentCaseManagerSelected.name}</span>. Do you want to proceed?
    `;

    const assignedConsumerList = document.createElement('div');
    assignedConsumerList.classList.add('assignedConsumerList');

    const btnWrap = document.createElement('div');
    btnWrap.classList.add('btnWrap');

    currentconsumersSelected.forEach(consumer => {
      // set data to OBJ
      selectedConsumerObjs.push({
        id: consumer.id,
        name: consumer.name,
      });
      // build list
      const c = document.createElement('p');
      c.innerText = consumer.name;
      assignedConsumerList.appendChild(c);
    });

    const confirmBtn = button.build({
      text: 'confirm',
      style: 'secondary',
      type: 'contained',
      callback: async () => {
        assignedConsumerList.innerHTML = '';
        btnWrap.innerHTML = '';
        message.innerHTML = '';
        confirmCaseLoadPopup.removeChild(message);
        confirmCaseLoadPopup.removeChild(assignedConsumerList);
        confirmCaseLoadPopup.removeChild(btnWrap);

        const spinner = PROGRESS.SPINNER.get('Assigning Individuals...');
        confirmCaseLoadPopup.appendChild(spinner);

        assignmentResults = await consentAndSignAjax.assignStateCaseManagertoConsumers({
          // token: $.session.Token,
          caseManagerId: currentCaseManagerSelected.id,
          consumers: selectedConsumerObjs,
        });

        confirmCaseLoadPopup.removeChild(spinner);
        confirmCaseLoadPopup.appendChild(message);
        confirmCaseLoadPopup.appendChild(assignedConsumerList);
        confirmCaseLoadPopup.appendChild(btnWrap);

        const processedStateConsumerObjs = JSON.parse(assignmentResults);
        const filteredStateConsumers = processedStateConsumerObjs.filter(obj =>
          obj.assignresult.includes('Case Manger Not Assigned'),
        );

        if (filteredStateConsumers.length === 0) {
          POPUP.hide(confirmCaseLoadPopup);
          POPUP.hide(assignCaseLoadPopup);
          currentCaseManagerSelected = null;
          currentconsumersSelected = [];
          return;
        }

        message.innerHTML = `The following consumers were not able to be assigned to <span>${currentCaseManagerSelected.name}</span>. Please contact DODD.`;

        processedStateConsumerObjs.forEach(consumer => {
          if (consumer.assignresult.includes('Case Manger Not Assigned')) {
            const c = document.createElement('p');
            c.innerHTML = `${consumer.name}`;
            // c.innerHTML = `${consumer.name} <span>Assign result: ${consumer.assignresult}</span>`;
            assignedConsumerList.appendChild(c);
          }
        });

        const okBtn = button.build({
          text: 'ok',
          style: 'secondary',
          type: 'contained',
          callback: () => {
            POPUP.hide(confirmCaseLoadPopup);
            POPUP.hide(assignCaseLoadPopup);
            currentCaseManagerSelected = null;
            currentconsumersSelected = [];
          },
        });
        btnWrap.appendChild(okBtn);

        // reset values last
        currentCaseManagerSelected = null;
        currentconsumersSelected = [];
      },
    });
    const cancelBtn = button.build({
      text: 'cancel',
      style: 'secondary',
      type: 'contained',
      callback: () => {
        DOM.ACTIONCENTER.removeChild(confirmCaseLoadPopup);
        assignCaseLoadPopup.style.display = 'block';
      },
    });

    btnWrap.appendChild(confirmBtn);
    btnWrap.appendChild(cancelBtn);

    confirmCaseLoadPopup.appendChild(message);
    confirmCaseLoadPopup.appendChild(assignedConsumerList);
    confirmCaseLoadPopup.appendChild(btnWrap);

    assignCaseLoadPopup.style.display = 'none';
    POPUP.show(confirmCaseLoadPopup);
  }

  async function showAssignCaseLoadPopup() {
    caseManagersfromOptionsTable = await consentAndSignAjax.getCaseManagersfromOptionsTable({
      token: $.session.Token,
    });
    consumerswithSaleforceIds = await consentAndSignAjax.getConsumerswithSaleforceIds({
      token: $.session.Token,
    });

    // Poup
    assignCaseLoadPopup = POPUP.build({
      id: 'sig_assignCaseLoadPopup',
      classNames: 'assignCaseLoadPopup',
      hideX: true,
      header: 'Assign Case Load',
    });
    const popupMessage = document.createElement('p');
    popupMessage.classList.add('popupMessage');
    
    if ($.session.applicationName === 'Gatekeeper') {
      popupMessage.innerText ='*Must select a Case Manager and at least one consumer before clicking Assign button.';
    } else {
      popupMessage.innerText ='*Must select a QIDP and at least one consumer before clicking Assign button.';
    }
    

    const innerWrap = document.createElement('div');
    innerWrap.classList.add('peopleListWrap');

    // Case Managers
    const caseManagersContainer = document.createElement('div');
    caseManagersContainer.classList.add('assignCaseLoadPeopleList');

    const cmHeading = document.createElement('p');

    if ($.session.applicationName === 'Gatekeeper') {
      cmHeading.innerText = 'Select a Case Manager';
    } else {
      cmHeading.innerText = 'Select a QIDP';
    }

    CM_SEARCH_BTN = button.build({
      id: 'searchBtn',
      text: 'Search',
      icon: 'search',
      style: 'secondary',
      type: 'contained',
    });

    CM_SEARCH_WRAP = document.createElement('div');
    CM_SEARCH_WRAP.classList.add('consumerSearch');
    CM_SEARCH_INPUT = document.createElement('input');
    ($.session.applicationName === 'Gatekeeper') ? CM_SEARCH_INPUT.setAttribute('placeholder', 'search case managers') : CM_SEARCH_INPUT.setAttribute('placeholder', 'search QIDPs');
    CM_SEARCH_WRAP.appendChild(CM_SEARCH_BTN);
    CM_SEARCH_WRAP.appendChild(CM_SEARCH_INPUT);
    CM_filterBtn = button.build({
      text: 'Filter',
      icon: 'filter',
      style: 'secondary',
      type: 'contained',
      classNames: 'filterBtn',
      // callback: showFilterPopup
      callback: () => {
        cnFilters.init(filterValues);
      },
    });

    const multiSelectBodyCM = document.createElement('div');
    caseManagersfromOptionsTable.forEach(person => {
      let caseManager = document.createElement('p');
      caseManager.classList.add('caseManager');
      caseManager.setAttribute('data-personId', person.id);
      caseManager.innerText = person.name;
      multiSelectBodyCM.appendChild(caseManager);

      caseManager.addEventListener('click', e => {
        //* There can only ever be one case manager selected
        const isSelected = e.target.classList.contains('selected');

        if (isSelected) {
          e.target.classList.remove('selected');
          currentCaseManagerSelected = null;
        } else {
          // check for existing case manager & remove
          const existing = [...multiSelectBodyCM.querySelectorAll('.caseManager.selected')];
          existing.forEach(row => row.classList.remove('selected'));
          // set new case manager
          e.target.classList.add('selected');
          currentCaseManagerSelected = person;
        }

        toggleAssignButton();
      });
    });

    caseManagersContainer.appendChild(cmHeading);
  
    var CM_btnWrap = document.createElement('div');
    CM_btnWrap.classList.add('cnbtnWrap');
    CM_btnWrap.appendChild(CM_filterBtn);

    caseManagersContainer.appendChild(CM_SEARCH_WRAP);

    CM_SEARCH_BTN.addEventListener('click', event => {
      CM_SEARCH_WRAP.classList.toggle('searchOpen');
      CM_SEARCH_INPUT.value = '';
      CM_SEARCH_INPUT.focus();
    });
    CM_SEARCH_INPUT.addEventListener('keyup', event => {
      if (event.keyCode === 13) {
        caseManagerSearch(event.target.value);
      }
    });
   
    caseManagersContainer.appendChild(multiSelectBodyCM);

    // Consumers
    const consumersContainer = document.createElement('div');
    consumersContainer.classList.add('assignCaseLoadPeopleList');

    const cHeading = document.createElement('p');
    cHeading.innerText = 'Select one (or multiple) consumers';

    C_SEARCH_BTN = button.build({
      id: 'searchBtn',
      text: 'Search',
      icon: 'search',
      style: 'secondary',
      type: 'contained',
    });
  
    C_SEARCH_WRAP = document.createElement('div');
    C_SEARCH_WRAP.classList.add('consumerSearch');
    C_SEARCH_INPUT = document.createElement('input');
    C_SEARCH_INPUT.setAttribute('placeholder', 'search consumers');
    C_SEARCH_WRAP.appendChild(C_SEARCH_BTN);
    C_SEARCH_WRAP.appendChild(C_SEARCH_INPUT);
    C_filterBtn = button.build({
      text: 'Filter',
      icon: 'filter',
      style: 'secondary',
      type: 'contained',
      classNames: 'filterBtn',
      // callback: showFilterPopup
      callback: () => {
        cnFilters.init(filterValues);
      },
    });  

    const multiSelectBodyC = document.createElement('div');
    consumerswithSaleforceIds.forEach(person => {
      let consumer = document.createElement('p');
      consumer.setAttribute('data-personId', person.id);
      consumer.innerText = person.name;
      multiSelectBodyC.appendChild(consumer);

      consumer.addEventListener('click', e => {
        //* Multiple consumers can be selected
        const isSelected = e.target.classList.contains('selected');

        if (isSelected) {
          e.target.classList.remove('selected');
          currentconsumersSelected = currentconsumersSelected.filter(cs => cs.id !== person.id);
        } else {
          e.target.classList.add('selected');
          currentconsumersSelected.push(person);
        }

        toggleAssignButton();
      });
    });

    consumersContainer.appendChild(cHeading);
  
    var C_btnWrap = document.createElement('div');
    C_btnWrap.classList.add('cnbtnWrap');
    C_btnWrap.appendChild(C_filterBtn);

    consumersContainer.appendChild(C_SEARCH_WRAP);

    consumersContainer.appendChild(multiSelectBodyC);

      C_SEARCH_BTN.addEventListener('click', event => {
      C_SEARCH_WRAP.classList.toggle('searchOpen');
      C_SEARCH_INPUT.value = '';
      C_SEARCH_INPUT.focus();
    });
    C_SEARCH_INPUT.addEventListener('keyup', event => {
      if (event.keyCode === 13) {
        consumerSearch(event.target.value);
      }
    });
 
    // Action Buttons
    assignBtn = button.build({
      text: 'ASSIGN',
      style: 'secondary',
      type: 'contained',
      callback: async function () {
        showConfirmationPopup();
      },
    });
    assignBtn.classList.add('disabled');

    var cancelBtn = button.build({
      text: 'CANCEL',
      style: 'secondary',
      type: 'contained',
      callback: function () {
        currentCaseManagerSelected = null;
        currentconsumersSelected = [];
        POPUP.hide(assignCaseLoadPopup);
      },
    });

    var btnWrap = document.createElement('div');
    btnWrap.classList.add('btnWrap');
    btnWrap.appendChild(assignBtn);
    btnWrap.appendChild(cancelBtn);

    innerWrap.appendChild(caseManagersContainer);
    innerWrap.appendChild(consumersContainer);

    assignCaseLoadPopup.appendChild(popupMessage);
    assignCaseLoadPopup.appendChild(innerWrap);
    assignCaseLoadPopup.appendChild(btnWrap);

    POPUP.show(assignCaseLoadPopup);
  }

  function caseManagerSearch(searchValue) {
    searchValue = searchValue.toLowerCase();
    // gather all names shown
    //reset the array containing list of consumers that are being displayed
    displayedCaseManagers = [searchValue];
    caseManagersfromOptionsTable.forEach(caseManager => {
      var fullName = caseManager.name.toLowerCase();
     // var fullNameReversed = `${lastName} ${firstName}`;
      var matchesName = fullName.indexOf(searchValue);
    //  var matchesNameReverse = fullNameReversed.indexOf(searchValue);
     // var consumer = document.getElementById(consumer.id);
      var thisCaseManager = document.querySelector(`[data-personid="${caseManager.id}"]`);

      if (matchesName !== -1 ) {
        thisCaseManager.classList.remove('hidden');
        displayedCaseManagers.push(caseManager.id);
      } else {
        thisCaseManager.classList.add('hidden');
        var index = displayedCaseManagers.indexOf(caseManager.id);
        if (index > -1) displayedCaseManagers.splice(index, 1);
      }
    });
  }

  function consumerSearch(searchValue) {
    searchValue = searchValue.toLowerCase();
    // gather all names shown
    //reset the array containing list of consumers that are being displayed
    displayedConsumers = [searchValue];
    consumerswithSaleforceIds.forEach(consumer => {
      var fullName = consumer.name.toLowerCase();
     // var fullNameReversed = `${lastName} ${firstName}`;
      var matchesName = fullName.indexOf(searchValue);
    //  var matchesNameReverse = fullNameReversed.indexOf(searchValue);
     // var consumer = document.getElementById(consumer.id);
      var thisConsumer = document.querySelector(`[data-personid="${consumer.id}"]`);

      if (matchesName !== -1 ) {
        thisConsumer.classList.remove('hidden');
        displayedConsumers.push(consumer.id);
      } else {
        thisConsumer.classList.add('hidden');
        var index = displayedConsumers.indexOf(consumer.id);
        if (index > -1) displayedConsumers.splice(index, 1);
      }
    });
  }

  return {
    showAssignCaseLoadPopup,
  };
})();
