//Widget id = 2
const CN_CaseLoadWidget = (function () {
  //Data
  let caseLoad, widgetSettings, demographicInfo;
  let consumerName;
  var widget;
  var widgetBody;
  let consumerCountlbl;
  // Settings
  let viewNotesDaysBack, lastNoteEnteredDaysBack, viewEnteredByOtherUsers;
  // dates
  let lastNoteEnteredDaysBackDate;

  function displayConsumerCount(caseLoad) {
    if (caseLoad && caseLoad.length !== 0) {
      consumerCountlbl = document.createElement('div');
      consumerCountlbl.innerHTML = `<div>
        <p style="font-family:Rubik;font-size:12px !important" ><span><center><b><i>Consumer Count: ${caseLoad.length} </i></b></center></span></p>
      </div>`;
    }
  }

  function populateCaseLoadWidget() {
    displayConsumerCount(caseLoad);

    const widget = document.getElementById('casenotescaseload');
    if (!widget) return;

    const widgetBody = widget.querySelector('.widget__body');
    if (caseLoad.length === 0) {
      widgetBody.innerHTML = `<span style="color:#DB162f;">No consumers on case load</span>`;
      return;
    }

    const tableOptions = {
      plain: true,
      columnHeadings: ['Consumer', 'Resident Number', 'Last Note'],
      tableId: 'caseLoadWidgetTable',
    };
    const caseLoadTable = table.build(tableOptions);

    widgetBody.innerHTML = '';
    widgetBody.appendChild(consumerCountlbl);
    widgetBody.appendChild(caseLoadTable);

    let caseLoadTableBody = document.getElementsByClassName('table__body')[0];
    caseLoadTableBody.classList.add('caseLoadTableBody');

    const tableData = caseLoad.map(consumer => {
      const name = `${consumer.lastName}, ${consumer.firstName}`;
      const resNumber = consumer.residentNumber;
      const dateString = consumer.lastNoteDate.split(' ')[0];
      const lastNoteDate = new Date(dateString);
      const dateDisp =
        lastNoteEnteredDaysBackDate < lastNoteDate
          ? consumer.lastNoteDate.split(' ')[0]
          : `<span style="color:#DB162f;">${
              dateString === '' ? 'No Case Notes Found' : dateString
            }</span>`;

      return {
        values: [name, resNumber, dateDisp],
        id: consumer.id,
        onClick: () => {
          getConsumerDemographics(consumer.id);
        },
      };
    });

    table.populate(caseLoadTable, tableData);
  }

  function rowPopup(consumerId) {
    // Demographics
    consumerName = `${demographicInfo.lastname}, ${demographicInfo.firstname}`;
    const popup = POPUP.build({
      header: consumerName,
      id: 'myCaseLoadPopup',
    });
    //Address
    const addressBlock = document.createElement('div');
    // addressBlock.classList.add("demographicSection");
    const address1 = demographicInfo.addressone;
    const address2 = demographicInfo.addresstwo;
    const city = demographicInfo.mailcity;
    const state = demographicInfo.mailstate;
    let zip = demographicInfo.mailzipcode;
    zip = zip ? zip.trim() : zip;
    addressBlock.innerHTML = `
    <h4>Address</h4>
    <p class="addressone">${address1}</p>
    <p class="addresstwo">${address2}</p>
    <p class="mail">${city}, ${state} ${zip}</p>`;
    popup.appendChild(addressBlock);

    //Contact Info
    const contactInfoBlock = document.createElement('div');
    // contactInfoBlock.classList.add("demographicSection");
    const tempPrimaryPhone = demographicInfo.primaryphone.split('%');
    const tempSecondaryPhone = demographicInfo.secondaryphone.split('%');
    const pPhoneNumber = UTIL.formatPhoneNumber(tempPrimaryPhone[0].trim());
    const sPhoneNumber = UTIL.formatPhoneNumber(tempSecondaryPhone[0].trim());
    const pPhoneType = tempPrimaryPhone.length > 1 ? tempPrimaryPhone[1] : '';
    const sPhoneType = tempSecondaryPhone.length > 1 ? tempSecondaryPhone[1] : '';
    const pPhone = `${pPhoneNumber} ${pPhoneType}`;
    const sPhone = `${sPhoneNumber} ${sPhoneType}`;
    contactInfoBlock.innerHTML = `
    <h4>Contact Info</h4>
    <p class="primaryphone">Primary: <a href=tel:+1-${pPhone}>${pPhone}</a></p>
    <p class="secondaryphone">Secondary: <a href=tel:+1-${sPhone}>${sPhone}</a></p>`;
    popup.appendChild(contactInfoBlock);

    // new case note button
    const newNoteBtn = button.build({
      text: 'New Case Note',
      style: 'secondary',
      type: 'contained',
      classNames: !$.session.CaseNotesUpdate ? ['newNoteBtn', 'disabled'] : ['newNoteBtn'],
      callback: () => {
        // Need to finish new note button once new roster is done
        POPUP.hide(popup);
        DOM.clearActionCenter();
        setActiveModuleSectionAttribute('caseNotes-new');
        UTIL.toggleMenuItemHighlight('casenotes');
        actioncenter.dataset.activeModule = 'casenotes';
        note.init('new', null, null, { id: consumerId, name: consumerName });
      },
    });

    // review case notes
    const reviewNotesBtn = button.build({
      text: 'Review Notes',
      style: 'secondary',
      type: 'contained',
      callback: () => {
        POPUP.hide(popup);
        DOM.clearActionCenter();
        setActiveModuleSectionAttribute('caseNotes-overview');
        UTIL.toggleMenuItemHighlight('casenotes');
        actioncenter.dataset.activeModule = 'casenotes';
        notesOverview.dashHandeler(
          viewNotesDaysBack,
          consumerId,
          viewEnteredByOtherUsers,
          consumerName,
        );
      },
    });

    const btnWrap = document.createElement('div');
    btnWrap.classList.add('btnWrap');
    btnWrap.appendChild(newNoteBtn);
    btnWrap.appendChild(reviewNotesBtn);
    popup.appendChild(btnWrap);

    POPUP.show(popup);
  }

  function getCaseLoadData(cb) {
    caseNotesAjax.getCaseLoadRestriction(res => {
      caseLoad = res.map(consumer => {
        const consumerObj = {
          id: consumer.id,
          firstName: consumer.FN,
          lastName: consumer.LN,
          lastNoteDate: consumer.last_note_datetime,
          residentNumber: consumer.resident_number,
        };
        return consumerObj;
      });
      cb();
    });
  }

  function getConsumerDemographics(consumerId) {
    rosterAjax.getConsumerDemographics(consumerId, res => {
      demographicInfo = res[0];
      rowPopup(consumerId);
    });
  }

  function setDefaultIfConfigNull() {
    widgetSettings.widgetConfig = {
      viewNotesDaysBack: 30,
      lastNoteEnteredDaysBack: 30,
      viewEnteredByOtherUsers: 'N',
    };
    widgetSettingsAjax.setWidgetSettingConfig(
      2,
      JSON.stringify(widgetSettings.widgetConfig),
      widgetSettings.showHide,
    );
  }

  function getDaysBackDate(daysBack) {
    const daysBackDate = new Date();
    daysBackDate.setDate(daysBackDate.getDate() - daysBack);
    return daysBackDate;
  }

  function cleanSettings() {
    viewNotesDaysBack = widgetSettings.widgetConfig.viewNotesDaysBack;
    lastNoteEnteredDaysBack = widgetSettings.widgetConfig.lastNoteEnteredDaysBack;
    viewEnteredByOtherUsers =
      widgetSettings.widgetConfig.viewEnteredByOtherUsers === 'N' ? false : true;
  }

  function init() {
    widgetSettings = dashboard.getWidgetSettings('2');
    if (widgetSettings.widgetConfig === null) setDefaultIfConfigNull();
    cleanSettings();
    lastNoteEnteredDaysBackDate = getDaysBackDate(lastNoteEnteredDaysBack);
    getCaseLoadData(populateCaseLoadWidget);

    widget = document.getElementById('casenotescaseload');
    widgetBody = widget.querySelector('.widget__body');

    displayConsumerCount();
  }

  return {
    init,
  };
})();
