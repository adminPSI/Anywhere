const CaseNotesForm = (() => {
  function init() {
    return new FORM({
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
          type: 'date',
          label: 'Service Date',
          id: 'serviceDate',
          name: 'serviceDate',
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
  }

  return {
    init,
  };
})();
