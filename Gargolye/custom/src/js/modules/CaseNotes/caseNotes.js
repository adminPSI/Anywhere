//TODO: Build new roster picker (new mini roster)
//TODO: Build Overview Table

// MAIN
const CaseNotes = (() => {
  async function loadPage() {
    const moduleWrap = _DOM.createElement('div', { id: 'UI', class: 'caseNotesModule' });

    // DATE NAVIGATION
    //--------------------------------------------------
    const dateNavigation = new DateNavigation({
      onDateChange(selectedDate) {
        // do stuff with newly selected date
        console.log('From CaseNotes.js', selectedDate);
      },
    });

    dateNavigation.build().renderTo(moduleWrap);

    // ROSTER PICKER
    //--------------------------------------------------
    const rosterPicker = new RosterPicker();
    //groupCode: 'CAS' for caseload only
    // move retrieve data for fetchConsumers inside RosterPIcker
    await rosterPicker.fetchConsumers({
      groupCode: 'ALL',
      retrieveId: '0',
      serviceDate: '2023-10-05',
      daysBackDate: '2023-06-28',
    });
    rosterPicker.build().renderTo(moduleWrap);

    // FORM
    //--------------------------------------------------
    const cnForm = new Form({
      elements: [
        {
          type: 'select',
          label: $.session.applicationName === 'Gatekeeper' ? 'Bill Code:' : 'Serv. Code:',
          id: 'serviceCode',
          name: 'serviceCode',
        },
        {
          type: 'select',
          label: 'Location',
          id: 'location',
          name: 'location',
        },
        {
          type: 'select',
          label: 'Service',
          id: 'service',
          name: 'service',
        },
        {
          type: 'select',
          label: 'Service Location',
          id: 'serviceLocation',
          name: 'serviceLocation',
        },
        {
          type: 'select',
          label: 'Need',
          id: 'need',
          name: 'need',
        },
        {
          type: 'select',
          label: 'Vendor',
          id: 'vendor',
          name: 'vendor',
        },
        {
          type: 'select',
          label: 'Contact',
          id: 'contact',
          name: 'contact',
        },
        {
          type: 'time',
          label: 'Start Time',
          id: 'startTime',
          name: 'startTime',
        },
        {
          type: 'time',
          label: 'End Time',
          id: 'endTime',
          name: 'endTime',
        },
        {
          type: 'number',
          label: 'Mileage',
          id: 'mileage',
          name: 'mileage',
        },
        {
          type: 'text',
          label: 'Note',
          id: 'noteText',
          name: 'noteText',
        },
        {
          type: 'checkbox',
          label: 'Confidential',
          id: 'confidential',
          name: 'confidential',
        },
      ],
    });
    cnForm.build().renderTo(moduleWrap);

    DOM.ACTIONCENTER.appendChild(moduleWrap);
  }

  async function init() {
    DOM.clearActionCenter();

    loadPage();
  }

  return {
    init,
  };
})();
