$.session.schedulingUpdate = true;
$.session.schedulingView = true;
$.session.schedAllowCallOffRequests = 'Y';
$.session.schedRequestOpenShifts = 'Y';
$.session.hideAllScheduleButton = false;

const scheduleArray = [
  {
    name: 'My Shifts',
    groupId: 1,
    events: [],
    groups: null,
  },
  {
    name: 'All Shifts',
    groupId: 2,
    events: [],
    groups: null,
  },
  {
    name: 'Open Shifts',
    groupId: 3,
    events: [],
    groups: null,
  },
  {
    name: 'Pending Request Open Shifts',
    groupId: 4,
    events: [],
    groups: null,
  },
  {
    name: 'Pending Call Off Shifts',
    groupId: 5,
    events: [],
    groups: null,
  },
  {
    name: 'Appointments',
    groupId: 6,
    events: [],
    groups: null,
  },
];
