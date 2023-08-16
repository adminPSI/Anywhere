$.session = {};
$.session.firstRunShit = true;
$.session.ViewMyInformation = false;
$.session.UpdateMyInformation = false;
//$.session.firstRunShitLocationAbsentWidget = true;
$.session.DayServiceView = false;
$.session.DayServiceInsert = false;
$.session.DayServiceUpdate = false;
$.session.DayServiceDelete = false;
$.session.DayServiceNonBillable = false;
$.session.DayServiceOverRide = false;
$.session.DenyStaffClockUpdate = false;
$.session.DenyClockUpdate = false;
$.session.DemographicsView = false;
$.session.DemographicsUpdate = false;
$.session.DemographicsBasicDataView = false;
$.session.DemographicsRelationshipsView = false;
$.session.DemographicsPictureUpdate = false;
$.session.DemographicsPictureDelete = false;
$.session.DemographicsNotesView = false;
$.session.DemographicsViewAttachments = false;
$.session.viewLocationSchedulesKey = false;
$.session.DemographicsViewDOB = false;
$.session.DemographicsViewMedicaid = false;
$.session.DemographicsViewMedicare = false;
$.session.DemographicsViewResident = false;
$.session.DemographicsViewSSN = false;
$.session.GoalsView = false;
$.session.GoalsUpdate = false;
$.session.CaseNotesView = false;
$.session.CaseNotesTablePermissionView = false;
$.session.CaseNotesViewEntered = false;
$.session.CaseNotesUpdate = false;
$.session.CaseNotesUpdateEntered = false;
$.session.CaseNotesCaseloadRestriction = false;
$.session.CaseNotesSSANotes = false;
$.session.SingleEntryView = false;
$.session.SingleEntryUpdate = false;
$.session.anywhereMainPermission = false;
$.session.WorkshopView = false;
$.session.WorkshopUpdate = false;
$.session.isCurrentlySingleEntry = false;
$.session.groupNoteId = '';
$.session.caseNoteEditSecond = false;
$.session.caseNoteLocationCodePreference = '';
$.session.caseNoteLocationNamePreference = '';
$.session.caseNoteNeedCodePreference = '';
$.session.caseNoteNeedNamePreference = '';
$.session.caseNoteServiceCodePreference = '';
$.session.caseNoteServiceNeedPreference = '';
$.session.caseNoteBillingCodeCodePreference = '';
$.session.caseNoteBillingCodeNamePreference = '';
$.session.caseNoteBillingCodeServiceFundingPreference = '';
$.session.caseNoteDisplayGroupNoteDivPreference = false;
$.session.caseNoteDisplayGroupNoteCheckedPreference = false;
$.session.locationRequiredCheck = false;
$.session.serviceRequiredCheck = false;
$.session.needRequiredCheck = false;
$.session.contactRequiredCheck = false;
$.session.vendorRequiredCheck = false;
$.session.caseNoteListResponse = '';
$.session.vendorFlag = false;
$.session.groupConsumerCount = 0;
$.session.consumersForGroupCounter = 0;
$.session.timeOverlapConsumers = [];
$.session.overlapNoteIds = [];
$.session.consumerIdArray = [];
$.session.caseNoteConsumerId = '';
$.session.caseNoteTimeCheck = 'pass';
$.session.groupNamesExist = false;
$.session.existingGroupNoteIdForUpdate = '';
$.session.startTimeForGroupNoteUpdateCompare = '';
$.session.endTimeForGroupNoteUpdateCompare = '';
$.session.serviceDateForGroupNoteUpdateCompare = '';
$.session.serviceOrBillingCodeForGroupNoteUpdateCompare = '';
$.session.caseNotePreferencesSet = false;
$.session.consumerEditId = '';
$.session.updateAllGroupDropDowns = false;
$.session.isSingleEdit = false;
$.session.changeFromSingleToGroupNote = false;
$.session.editingConsumerId = '';
$.session.dontLoadAppAfterDelete = false;
$.session.consumerGroupCount = 0;
$.session.groupSaveCounter = 0;
$.session.editOnLoad = false;
$.session.groupOverlapCheckCounter = 1;
$.session.overlapScreenLock = false;
$.session.UpdateCaseNotesDocTime = false;
$.session.batchedNoteEdit = false;
$.session.groupNoteAttemptWithDocTime = false;
$.session.sendToDODD = false;
//remove section when ready for testing.  Forcing all features on.
//$.session.CaseNotesView = true;
//$.session.CaseNotesTablePermissionView = true;
//$.session.CaseNotesUpdate = true;
//$.session.CaseNotesCaseloadRestriction = true;
$.session.defaultIncidentTrackingDaysBack = '7';
$.session.editNoteMileageOnLoadFlag = false;
$.session.SEViewAdminWidget = false;
$.session.ciBShow = false;
$.session.singleEntry15minDoc = 'N';
$.session.Roster = false;
$.session.Name = '';
$.session.LName = '';
$.session.isAdmin = false;
$.session.PeopleId = '';
$.session.StaffLocId = '';
$.session.UserId = '';
$.session.Token = '';
$.session.Error = '';
$.session.ver = '';
$.session.browser = '';
$.session.browserVer = '';
$.session.OS = '';
$.session.locations = [];
$.session.locationids = [];
$.session.lastMenuSelection = new Date(); //keeps menu's from double popping for people that are jackrabbits on the touchscreen.

//DEFAULT SESSION VALUES --- Getting set in sessionsajax
$.session.defaultDayServiceLocation;
$.session.dsCertified; //True = Day Service Certified False = Not DS Certified
$.session.defaultDayServiceLocationFlag = true;
$.session.defaultRosterLocation;
$.session.defaultRosterLocationFlag = false;
$.session.defaultStaffLocation = 0;
$.session.defaultDayServiceLocationName;
$.session.defaultWorkshopLocation;
$.session.defaultWorkshopLocationValue;
$.session.defaultRosterLocationName;
$.session.defaultRosterGroupValue;
$.session.defaultDSTimeClockValue;
$.session.defaultDSTimeClockName;
//////////
$.session.areInSalesForce = false;
$.session.RosterDeleteAbsent = false;
$.session.defaultStaffLocationName = 0;
$.session.selectedLocation = ['0', 'defaultlocation'];
// $.session.height = 0;
// $.session.width = 0;
$.session.strongPassword = 'Y'; //variable that tells whether or not a strong password is required.Default is Y to keep expired password rules the same.
$.session.errorMessage = '';
$.session.selectedGroupId = 0;
$.session.deletedGroupId = 0; //Added to handle the delete group issue when deleting from the page where you are in the group to be deleted
$.session.changePasswordLinkSelected = '';
$.session.advancedPasswordLength = '';
$.session.dsLocationHistoryFlag = false;
$.session.dsLocationHistoryValue = 0;
$.session.initialTimeOut = '';
$.session.initialTimeIn = '';
$.session.singleLoadedConsumerId = '';
$.session.passwordSpecialCharacters = '';
$.session.daysBackGoalsEdit = '';
$.session.singleLoadedConsumerName = '';
$.session.serviceStartDate = '';
$.session.serviceEndDate = '';
$.session.defaultCaseNoteReviewDays = '';
$.session.defaultProgressNoteReviewDays = '';
$.session.defaultProgressNoteChecklistReviewDays = '';
$.session.countCheck = 0;
$.session.applicationName = '';
$.session.viewableGoalTypeIds = [];
$.session.outcomesPermission = '';
$.session.dayServicesPermission = '';
$.session.caseNotesPermission = '';
$.session.singleEntryPermission = '';
$.session.workshopPermission = '';
$.session.workshopPermission = '';
$.session.intellivuePermission = '';
$.session.passwordResetPermission = '';
// $.session.formsPermission = '';
// $.session.OODPermission = '';
$.session.anywhereResetPasswordPermission = '';
$.session.anywhereConsumerFinancesPermission = '';
$.session.anywhereEmploymentPermission = '';
$.session.selectedConsumerIdForGoalsDateBack = '';
$.session.caseNoteEdit = false;
$.session.consumerIdToEdit = '';
$.session.planPeopleId = '';
$.session.showDynamic = true;
$.session.singleEntryUseServiceLocations = false;
$.session.editCaseNoteId = '';
//$.session.groupCaseNoteId = '';
$.session.tempServiceFunding = 'N';
$.session.usePersonalPrefernces = 'N';
$.session.defaultSeviceId = '';
$.session.defaultSeviceName = '';
//Added to save session filters
$.session.useSessionFilterVariables = false;
$.session.filterServiceStart = '';
$.session.filterServiceEnd = '';
$.session.filterDateEnteredStart = '';
$.session.filterDateEnteredEnd = '';
$.session.filterBillerId = '';
$.session.filterBillerName = '';
$.session.groupAddOnNames = [];
$.session.intellivueSessionID = '';
$.session.singleEntryApproveEnabled = '';
$.session.anAdmin = false;
$.session.ViewAdminSingleEntry = false;
$.session.communityIntegrityRequired = 'n/a';
$.session.singleEntryAddConsumersOnBillable = 'N';
$.session.workshopBatchId = '';
$.session.infiniteLoopFlag == false;
//$.session.singleEntryReportCurrentlyProcessing = false;
$.session.viewLocationSchedulesKey = false;
$.session.incidentTrackingPermission = '';
$.session.singleEntryLocationRequired = '';
$.session.SingleEntryEditTimeEntry = false; // MAT changed
$.session.singleEntryGottenById = false;
$.session.singleEntrycrossMidnight = false;
//Incident Tracking
$.session.incidentTrackingView = false;
$.session.incidentTrackingViewPerm = [];
$.session.incidentTrackingReviewedBy = false;
$.session.incidentTrackingUpdate = false;
$.session.incidentTrackingInsert = false;
$.session.incidentTrackingDelete = false;
$.session.incidentTrackingViewCaseLoad = false;
$.session.defaultIncidentTrackingReviewDays = '';
$.session.incidentTrackingPopulateIncidentDate = '';
$.session.incidentTrackingPopulateIncidentTime = '';
$.session.incidentTrackingPopulateReportedDate = '';
$.session.incidentTrackingPopulateReportedTime = '';
$.session.incidentTrackingEmailIncident = '';
/////////
$.session.infalHasConnectionString = false;
$.session.isPSI = false;
$.session.anywhereMinutestotimeout = '';
$.session.useAbsentFeature = 'Y';
$.session.useProgressNotes = 'Y';
$.session.singleEntryEditLocationHack = '';
$.session.HideProgressNotes = false;
var firstLoad = true;
$.session.portraitPath = '';
$.session.isASupervisor = false;
$.session.seAdminRemoveMap = false;
$.session.removeGoalsWidget = false;
$.session.createTimeEntries = false;
//Login
$.session.changeEmailSent = false;
// Single Entry Geo Location Position
$.session.geoLocationPosition = '';
// Single Entry Signautre, Note and ____ Instances
$.session.evvDataCache = {};
$.session.singleEntryShowConsumerSignature = 'N';
$.session.singleEntryShowConsumerNote = 'N';
//Scheduling
$.session.schedulingUpdate = false;
$.session.schedulingView = false;
$.session.schedulingStartDayOfWeek = 0;
$.session.schedAllowCallOffRequests = 'N';
$.session.schedRequestOpenShifts = 'N';
$.session.hideAllScheduleButton = false;
//Plan
$.session.planUpdate = false;
$.session.planDelete = false;
$.session.planView = false;
$.session.planInsertNewTeamMember = false;
$.session.planAssignCaseload = false;
$.session.downloadPlans = false;
$.session.planSignatureUpdateDOB = false;
$.session.planSignatureUpdateBuildingNumber = false;
$.session.planClearSignature = false;
// Transportation
$.session.transportationUpdate = false;
$.session.transportationView = false;
$.session.transportationManageRoute = false;
$.session.transportationAddRoute = false;
// eMAR
$.session.emarView = false;
// Speech To Text
$.session.sttEnabled = false;
// Forms
$.session.formsDelete = false;
$.session.formsInsert = false;
$.session.formsUpdate = false;
$.session.formsView = false;
$.session.formsCaseload = false;
$.session.formsFormtype = false;

// OOD
$.session.OODDelete = false;
$.session.OODInsert = false;
$.session.OODUpdate = false;
$.session.OODView = false;

// Consumer Finance
$.session.CFDelete = false;
$.session.CFInsert = false;
$.session.CFUpdate = false;
$.session.CFView = false;
$.session.CFADDPayee = false;
$.session.CFEditAccountEntries = false; //

// Reset Password
$.session.ResetPasswordView = false;
$.session.ResetPasswordUpdate = false;

// Employment
$.session.EmploymentView = false;
$.session.EmploymentUpdate = false;

$.session.consumerId = '';
// $.session.sttCaseNotesEnabled = false; Will be a system setting, setting true for now for dev

//Needs updated for every release.
$.session.version = '2023.4';
//State Abbreviation
$.session.stateAbbreviation = '';
// temp holder for the device GUID when logging in
$.session.deviceGUID = '';
//API Keys
$.session.azureSTTApi = '';
$.session.isActiveUsers = true; // to get active and inactive user both

$(window).resize(function () {
  //resizeActionCenter();
});

function setDefaultLoc(type, value) {
  //alert("setDefaultLoc " + type + " " + value + " " + $.session.defaultStaffLocation);

  if (type == 1) {
    $.session.defaultStaffLocation = value;
    //alert("setDefaultLoc " + type + " " + value + " " + $.session.StaffLocId);
    createCookie('defaultStaffLocation', value, 7);
  }

  if (type == 2) {
    //createCookie('defaultRosterLocation', value, 7);
    saveDefaultLocationValueAjax('2', value);
    if (value == 0) {
      createCookie('defaultRosterLocationFlag', true, 7);
    } else {
      createCookie('defaultRosterLocationFlag', false, 7);
    }
  }

  if (type == 3) {
    if (
      $.session.defaultDayServiceLocationFlag == 'true' ||
      $.session.defaultDayServiceLocationFlag == null
    ) {
      //createCookie('defaultDayServiceLocationNameValue', value, 7);
      saveDefaultLocationValueAjax('3', value);
    }
    if ($.session.dsLocationHistoryFlag == true) {
      $.session.defaultDayServiceLocation = value;
    }
  }
}

function createCookie(name, value, days) {
  if (days) {
    var date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    var expires = '; expires=' + date.toGMTString();
  } else var expires = '';
  var test = escape(value);
  document.cookie = escape(name) + '=' + escape(value) + expires + '; path=/';
}

function readCookie(name) {
  var nameEQ = escape(name) + '=';
  var ca = document.cookie.split(';');
  for (var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == ' ') c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) == 0) return unescape(c.substring(nameEQ.length, c.length));
  }
  return null;
}

function eraseCookie(name) {
  createCookie(name, '', -1);
}

function setSessionVariables() {
  var cookieInnards = $.session.permissionString;

  $('result', cookieInnards).each(function () {
    tmpWindow = $('window_name', this).text();
    tmpPerm = $('permission', this).text();
    tmpSpec = $('special_data', this).text();

    if (tmpWindow == 'IsAnAdmin') {
      if (tmpPerm == 'Y') $.session.isAdmin = true;
    }

    if (tmpWindow == 'SEShowServiceLocations') {
      if (tmpPerm == 'Y') {
        //Require a consumer to be picked
        $.session.singleEntryUseServiceLocations = true;
      }
    }

    if (tmpWindow == 'SEAddConsumerOnBillable') {
      if (tmpPerm == 'P') {
        //Require a consumer to be picked
        $.session.singleEntryAddConsumersOnBillable = 'P';
      } else if (tmpPerm == 'Y') {
        //Do not require a consumer to be picked, but give a warning
        $.session.singleEntryAddConsumersOnBillable = 'Y';
      } else {
        //Do not require a consumerto be picked, and give no warning
        $.session.singleEntryAddConsumersOnBillable = 'N';
      }
    }

    if (tmpWindow == 'SEDocumentTime') {
      if (tmpPerm == 'Y') {
        //Enable 15 minutes intervals
        $.session.singleEntry15minDoc = 'Y';
      } else {
        //Do not enable/disable 15 minute document intervals
        $.session.singleEntry15minDoc = 'N';
      }
    }

    if (tmpWindow == 'Anywhere Day Services') {
      if (tmpPerm == 'View') {
        $.session.DayServiceView = true;
        $.session.Roster = true;
        $('#dayservicesettingsbutton').removeClass('disabledModule');
      }

      if (tmpPerm == 'Override location requirement') {
        $.session.DayServiceOverRide = true;
      }

      if (tmpPerm == 'Update') {
        $.session.DayServiceUpdate = true;
      }

      if (tmpPerm == 'Delete') {
        $.session.DayServiceDelete = true;
      }

      if (tmpPerm == 'Insert') {
        $.session.DayServiceInsert = true;
      }

      if (tmpPerm == 'Deny TimeClock Change') {
        $.session.DenyClockUpdate = true;
      }
    }

    //Goals Permissions
    if (tmpWindow == 'Anywhere Service Activity') {
      if (tmpPerm == 'View') {
        $.session.GoalsView = true;
        $('#goalssettingsbutton').removeClass('disabledModule');
      }
      if (tmpPerm == 'Update') {
        $.session.GoalsUpdate = true;
      }
    }

    //Single Entry Permissions
    if (tmpWindow == 'Anywhere Single Entry') {
      if (tmpPerm == 'View') {
        $.session.SingleEntryView = true;
        $('#singleentrybutton').removeClass('disabledModule');
      }
      if (tmpPerm == 'Update') {
        $.session.SingleEntryUpdate = true;
      }
      if (tmpPerm == 'Edit Time Entry') {
        $.session.SingleEntryEditTimeEntry = true;
      }
    }

    //Workshop Module
    if (tmpWindow == 'Anywhere Workshop') {
      if (tmpPerm == 'View') {
        $.session.WorkshopView = true;
        $('#workshopbutton').removeClass('disabledModule');
      }
      if (tmpPerm == 'Update') {
        $.session.WorkshopUpdate = true;
      }
    }

    if (tmpWindow == 'Anywhere Case Notes') {
      if (tmpPerm == 'View') {
        $('#casenotessettingsdiv').removeClass('disabledModule');
        $.session.CaseNotesView = true;
      }
      if (tmpPerm == 'View Entered') {
        $.session.CaseNotesViewEntered = true;
      }
      if (tmpPerm == 'Update Entered') {
        $.session.CaseNotesUpdateEntered = true;
      }
      if (tmpPerm == 'Update') {
        $.session.CaseNotesUpdate = true;
      }
      if (tmpPerm == 'Caseload Only') {
        $.session.CaseNotesCaseloadRestriction = true;
      }
      if (tmpPerm == 'SSA Notes') {
        $.session.CaseNotesSSANotes = true;
      }
    }

    //Absent and progress notes/
    if (tmpWindow == 'Anywhere Roster') {
      if (tmpPerm == 'Delete Absent') {
        $.session.RosterDeleteAbsent = true;
      }
      if (tmpPerm == 'Hide Progress Notes') {
        $.session.HideProgressNotes = true;
      }
    }
    //Demographics
    if (tmpWindow == 'Anywhere Demographics') {
      if (tmpPerm == 'View') {
        $.session.DemographicsView = true;
      }
      if (tmpPerm == 'Update') {
        $.session.DemographicsUpdate = true;
      }

      if (tmpPerm == 'View Relationships') {
        $.session.DemographicsRelationshipsView = true;
      }

      if (tmpPerm == 'View General') {
        $.session.DemographicsBasicDataView = true;
      }

      if (tmpPerm == 'Update Picture') {
        $.session.DemographicsPictureUpdate = true;
      }
      if (tmpPerm == 'Delete Picture') {
        $.session.DemographicsPictureDelete = true;
      }

      if (tmpPerm == 'View Notes') {
        $.session.DemographicsNotesView = true;
      }

      if (tmpPerm == 'View Attachments') {
        $.session.DemographicsViewAttachments = true;
      }

      if (tmpPerm == 'View Location Schedule') {
        $.session.viewLocationSchedulesKey = true;
      }
      if (tmpPerm == 'View DOB') {
        $.session.DemographicsViewDOB = true;
      }
      if (tmpPerm == 'View Medicaid Number') {
        $.session.DemographicsViewMedicaid = true;
      }
      if (tmpPerm == 'View Medicare Number') {
        $.session.DemographicsViewMedicare = true;
      }
      if (tmpPerm == 'View Resident Number') {
        $.session.DemographicsViewResident = true;
      }
      if (tmpPerm == 'View SSN') {
        $.session.DemographicsViewSSN = true;
      }
    }

    //Incident Tracking Permissons
    if (tmpWindow == 'Anywhere Incident Tracking') {
      if (tmpPerm == 'View Case Load') {
        $.session.incidentTrackingViewCaseLoad = true;
      } else if (tmpPerm == 'Delete') {
        $.session.incidentTrackingDelete = true;
      } else if (tmpPerm == 'Insert') {
        $.session.incidentTrackingInsert = true;
      } else if (tmpPerm == 'Update') {
        $.session.incidentTrackingUpdate = true;
      } else if (tmpPerm == 'View') {
        $.session.incidentTrackingView = true;
      } else if (tmpPerm == 'Reviewed By User') {
        $.session.incidentTrackingReviewedBy = true;
      } else if (tmpPerm == 'Email Incident') {
        $.session.incidentTrackingEmailIncident = true;
      } else {
        $.session.incidentTrackingViewPerm.push(tmpPerm.replace('View ', '').toLowerCase());
      }
    }

    //Anywhere Plan
    if (tmpWindow == 'Anywhere Plan' || $.session.isPSI == true) {
      if (tmpPerm == 'Update' || $.session.isPSI == true) {
        $.session.planUpdate = true;
      }
      if (tmpPerm == 'Delete Plan' || $.session.isPSI == true) {
        $.session.planDelete = true;
      }
      if (tmpPerm == 'View' || $.session.isPSI == true) {
        $.session.planView = true;
      }
      if (tmpPerm == 'Send to DODD' || $.session.isPSI == true) {
        $.session.sendToDODD = true;
      }
      if (tmpPerm == 'Insert New Team Member' || $.session.isPSI == true) {
        $.session.planInsertNewTeamMember = true;
      }
      if (tmpPerm == 'Assign Case Load' || $.session.isPSI == true) {
        $.session.planAssignCaseload = true;
      }
      if (tmpPerm == 'Update DOB' || $.session.isPSI == true) {
        $.session.planSignatureUpdateDOB = true;
      }
      if (tmpPerm == 'Update Building Number' || $.session.isPSI == true) {
        $.session.planSignatureUpdateBuildingNumber = true;
      }
      if (tmpPerm == 'Clear Signatures' || $.session.isPSI == true) {
        $.session.planClearSignature = true;
      }
      if (tmpPerm == 'Download Plans' || $.session.isPSI == true) {
        $.session.downloadPlans = true;
      }
    }
    if (tmpWindow == 'Anywhere Authorization' || $.session.isPSI == true) {
      debugger;
    }
    //AeMAR
    if (tmpWindow == 'Anywhere eMAR' || $.session.isPSI == true) {
      if (tmpPerm == 'View' || $.session.isPSI == true) {
        $.session.emarView = true;
      }
    }
    //Anywhere Transportation
    if (tmpWindow == 'Anywhere Transportation' || $.session.isPSI == true) {
      if (tmpPerm == 'Update') {
        $.session.transportationUpdate = true;
      }
      if (tmpPerm == 'View' || $.session.isPSI == true) {
        $.session.transportationView = true;
      }
      if (tmpPerm == 'Manage Routes' || $.session.isPSI == true) {
        $.session.transportationManageRoute = true;
      }
      if (tmpPerm == 'Add Routes' || $.session.isPSI == true) {
        $.session.transportationAddRoute = true;
      }
    }

    if (tmpWindow == 'Anywhere Scheduling' || $.session.isPSI == true) {
      if (tmpPerm == 'Update') {
        $.session.schedulingUpdate = true;
      }
      if (tmpPerm == 'View' || $.session.isPSI == true) {
        $.session.schedulingView = true;
      }
    }

    // Anywhere Forms
    if (tmpWindow == 'Anywhere Forms' || $.session.isPSI == true) {
      if (tmpPerm == 'Update' || $.session.isPSI == true) {
        $.session.formsUpdate = true;
      }
      if (tmpPerm == 'Delete' || $.session.isPSI == true) {
        $.session.formsDelete = true;
      }
      if (tmpPerm == 'View' || $.session.isPSI == true) {
        $.session.formsView = true;
      }
      if (tmpPerm == 'Insert' || $.session.isPSI == true) {
        $.session.formsInsert = true;
      }
      if (tmpPerm == 'Case Load') {
        $.session.formsCaseload = true;
      }
      if ($.session.isPSI == true) {
        $.session.formsCaseload = false;
      }
    }

    if (tmpPerm.length > 9) {
      if (tmpPerm.substring(0, 9) == 'Form Type') {
        $.session.formsFormtype = true;
        if (tmpWindow == 'IsAnAdmin') {
          if (tmpPerm == 'Y') $.session.isAdmin = true;
        }
      }
    }

    // OOD
    if (tmpWindow == 'Anywhere OOD' || $.session.isPSI == true) {
      if (tmpPerm == 'Update' || $.session.isPSI == true) {
        $.session.OODUpdate = true;
      }
      if (tmpPerm == 'Delete' || $.session.isPSI == true) {
        $.session.OODDelete = true;
      }
      if (tmpPerm == 'View' || $.session.isPSI == true) {
        $.session.OODView = true;
      }
      if (tmpPerm == 'Insert' || $.session.isPSI == true) {
        $.session.OODInsert = true;
      }
    }

    // Consumer Finance
    if (tmpWindow == 'Anywhere Consumer Finances' || $.session.isPSI == true) {
      if (tmpPerm == 'Update' || $.session.isPSI == true) {
        $.session.CFUpdate = true;
      }
      if (tmpPerm == 'Delete' || $.session.isPSI == true) {
        $.session.CFDelete = true;
      }
      if (tmpPerm == 'View' || $.session.isPSI == true) {
        $('#consumerfinancessettingsdiv').removeClass('disabledModule');
        $.session.CFView = true;
      }
      if (tmpPerm == 'Insert' || $.session.isPSI == true) {
        $.session.CFInsert = true;
      }
      if (tmpPerm == 'Add Payee' || $.session.isPSI == true) {
        $.session.CFADDPayee = true;
      }
      if (tmpPerm == 'Edit Account Entries' || $.session.isPSI == true) {
        $.session.CFEditAccountEntries = true;
      }
    }

    //Reset Password
    if (tmpWindow == 'Anywhere Reset Passwords') {
      if (tmpPerm == 'View' || $.session.isPSI == true) {
        $('#Adminsettingdiv').removeClass('disabledModule');
        $.session.ResetPasswordView = true;
      }
      if (tmpPerm == 'Update' || $.session.isPSI == true) {
        $.session.ResetPasswordUpdate = true;
      }
    }

    //Employment
    if (tmpWindow == 'Anywhere Employment' || $.session.isPSI == true) {
      if (tmpPerm == 'View' || $.session.isPSI == true) {
        $('#Employmentsettingsdiv').removeClass('disabledModule');
        $.session.EmploymentView = true;
      }
      if (tmpPerm == 'Update' || $.session.isPSI == true) {
        $.session.EmploymentUpdate = true;
      }
    }

    if (tmpWindow == 'Anywhere User Home') {
      if (tmpPerm == 'Deny Staff TimeClock Change') {
        $.session.DenyStaffClockUpdate = true;
      }
      if (tmpPerm == 'View My Information') {
        $.session.ViewMyInformation = true;
      }
      if (tmpPerm == 'Update My Information') {
        $.session.UpdateMyInformation = true;
      }
    }

    if (tmpWindow == 'admin') {
      $.session.DayServiceView = true;
      $.session.DayServiceInsert = true;
      $.session.DayServiceUpdate = true;
      $.session.DayServiceDelete = true;
      $.session.DayServiceNonBillable = true;
      $.session.DayServiceOverRide = true;
      $.session.Roster = true;
      $.session.DenyClockUpdate = false;
      $.session.DenyClockUpdate = false;
    }

    if (tmpWindow == 'Name') {
      $.session.Name = tmpPerm;
      $.session.UserId = tmpSpec;
    }

    if (tmpWindow == 'LName') {
      $.session.LName = tmpPerm;
      $.session.PeopleId = tmpSpec;
    }

    if (tmpWindow == 'Token') {
      $.session.Token = tmpSpec;
    }

    if (tmpWindow == 'ProductName') {
      $.session.ProductName = tmpPerm.toUpperCase();
    }

    if (tmpWindow == 'stafflocation') {
      $.session.locations.push(tmpPerm);
      $.session.locationids.push(tmpSpec);
    }

    if (tmpWindow == 'Default Staff Location') {
      $.session.defaultStaffLocation = tmpPerm;
    }

    if (tmpWindow == 'Default Roster Location') {
      //not sure what this was intended for.  Was breaking roster location save
      // $.session.defaultRosterLocation = tmpPerm;
    }

    if (tmpWindow == 'Default Day Service Location') {
      $.session.defaultDayServiceLocation = tmpPerm;
    }
  });

  if ($.session.UserId === 'ash' || $.session.UserId === 'mike') {
    $.session.ViewMyInformation = true;
    $.session.UpdateMyInformation = true;
  }
  // TODO-ASH: move this somewhere else eventually
  if (!$.session.ViewMyInformation) {
    const informationMenuBtn = document.querySelector(`[data-menu='information']`);
    informationMenuBtn.style.display = 'none';
  }
}

function setSession(callback) {
  var cookieInnards = readCookie('psi');

  //sets token from cookie.  This is needed for ajax call getUserPermissions().  Other session variables set in setSessionVariables()
  $('permissions', cookieInnards).each(function () {
    tmpWindow = $('window_name', this).text();
    tmpPerm = $('permission', this).text();
    tmpSpec = $('special_data', this).text();

    if (tmpWindow == 'Token') {
      $.session.Token = tmpSpec;
    }
  });
  getUserPermissions(callback);

  setInterval(function () {
    tokenCheck();
  }, 60000);
}

function checkforErrors(xmlReturn) {
  //check for Errors
  var retVal = 0;
  //alert("checkForErrors" + xmlReturn);
  var ErrorText = $('Error', xmlReturn).text();
  //alert('Error text: ' + ErrorText);
  //session didn't exist
  if (ErrorText == 'Error:606') {
    //setCookieOnFail("<Errors><Error>Please log in again.</Error></Errors>");
    errorMessage = 'Please log in again.';
    retVal = -1;
  }
  //session expired
  if (ErrorText == 'Error:607') {
    //setCookieOnFail("<Errors><Error>Session has timed out, please log in again.</Error></Errors>");
    errorMessage = 'Session has timed out, please log in again.';
    retVal = -1;
  }
  //session didn't exist
  if (ErrorText == 'Error:608') {
    //setCookieOnFail("<Errors><Error>This user name does not exist in demographics.</Error></Errors>");
    errorMessage = 'This user name does not exist in demographics.';
    retVal = -1;
  }
  if (ErrorText == 'Error:609') {
    //setCookieOnFail("<Errors><Error>Password has expired</Error></Errors>");
    errorMessage = 'Password has expired.';
    retVal = -1;
  }
  if (ErrorText == 'Error:610') {
    //setCookieOnFail("<Errors><Error>Previous Password is invalid</Error></Errors>");
    errorMessage = 'Previous Password is invalid.';
    retVal = -1;
  }
  return retVal;
}

function setCookieOnFail(xmlReturn) {
  createCookie('psi', xmlReturn, 1);
  $.session.Token = '';
  if (xmlReturn.indexOf('Password has expired') > -1) {
    // do nothing
  } else {
    document.location.href = 'login.html';
  }
}

function checkForErrors() {
  var errorXml = readCookie('psi');
  $('#errortext').text($('Error', errorXml).text());

  if ($('#errortext').text().length > 0) {
    $('#error').css('display', 'block'); //show error

    if ($('#errortext').text().indexOf('expired') !== -1) {
      // if error is not expired password
      $('#login').css('display', 'none');
      $('#change').css('display', 'block');
      $('#changePassword').css('display', 'none');
    }
  } else {
    $('#error').css('display', 'none'); //hide error

    $('#login').css('display', 'block');
    $('#change').css('display', 'none');
    $('#changePassword').css('display', 'none');
  }
}

function customPasswordChangeClick() {
  // Called off of link to change password. Used to set sesson variable for checking against later.
  $.session.changePasswordLinkSelected = 'Y';
  customPasswordChange();
  $('#loginInfal').css('opacity', '-1');
}

function setUpPasswordResetMessages(res) {
  var error = '';
  var success = '';
  $('results', res).each(function () {
    error = $('Error', this).text();
    success = $('Success', this).text();
  });
  if (error.indexOf('808') != -1) {
    $('#confirmResetMessage').html(
      'A temporary password has been sent to your email address on file. If you do not receive an email please contact your System Administrator.',
    );
    $('#confirmResetMessage').css('color', '#f13c6e');
    $('#resetButton').text('Change Password');
    $.session.changeEmailSent = true;
  } else if (error.indexOf('888') != -1) {
    $('#confirmResetMessage').html('Forgot password functionality is not offered by your company.');
    $('#confirmResetMessage').css('color', '#f13c6e');
  } else {
    //var reset = true;
    //customPasswordChange(reset);
    $('#confirmResetMessage').html(
      'A temporary password has been sent to your email address on file. If you do not receive an email please contact your System Administrator.',
    );
    $('#confirmResetMessage').css('color', '#f13c6e');
    $('#resetButton').text('Change Password');
    r = document.getElementById('resetButton');
    r.addEventListener('click', () => customPasswordChange(reset), false);
    $.session.changeEmailSent = true;
  }
}

function toResetPage() {
  customPasswordChange(reset);
}

function resetPasswordClick() {
  // hide other forms
  $('#login').css('display', 'none');
  $('#change').css('display', 'none');

  // hide password help options
  $('#changePassword').css('display', 'none');
  $('#resetPassword').css('display', 'none');
  $('#loginInfal').css('opacity', '-1');

  // hide error and custom login text
  $('#error').css('display', 'none');
  $('#customLoginText').css('display', 'none');

  // display reset form and back to login button
  $('#reset').css('display', 'block');
  $('#backToLogin').css('display', 'flex');
}

function backToLoginPage() {
  $('#customLoginText').css('display', 'block');
  location.reload();
}

//Custom password change code
function customPasswordChange(reset) {
  // hide other forms
  $('#login').css('display', 'none');
  $('#reset').css('display', 'none');

  // hide password help options
  $('#resetPassword').css('display', 'none');
  $('#changePassword').css('display', 'none');

  // hide error and custom login text
  $('#error').css('display', 'none');
  $('#customLoginText').css('display', 'none');

  // display change form and back to login button
  $('#change').css('display', 'block');
  $('#backToLogin').css('display', 'flex');

  if ($.session.changePasswordLinkSelected === '') {
    $('#confirmMessage').text(
      'Your password has expired.  Please enter and confirm a new password.',
    );
  } else if (reset) {
    $('#confirmMessage').text('Your message has been sent.  Please reset password.');
  } else {
    $('#confirmMessage').text('Please enter and confirm a new password.');
  }
}

var BrowserDetect = {
  init: function () {
    this.browser = this.searchString(this.dataBrowser) || 'An unknown browser';
    this.version =
      this.searchVersion(navigator.userAgent) ||
      this.searchVersion(navigator.appVersion) ||
      'an unknown version';
    this.OS = this.searchString(this.dataOS) || 'an unknown OS';
  },
  searchString: function (data) {
    for (var i = 0; i < data.length; i++) {
      var dataString = data[i].string;
      var dataProp = data[i].prop;
      this.versionSearchString = data[i].versionSearch || data[i].identity;
      if (dataString) {
        if (dataString.indexOf(data[i].subString) != -1) return data[i].identity;
      } else if (dataProp) return data[i].identity;
    }
  },
  searchVersion: function (dataString) {
    var index = dataString.indexOf(this.versionSearchString);
    if (index == -1) return;
    return parseFloat(dataString.substring(index + this.versionSearchString.length + 1));
  },
  dataBrowser: [
    {
      string: navigator.userAgent,
      subString: 'Chrome',
      identity: 'Chrome',
    },
    {
      string: navigator.userAgent,
      subString: 'OmniWeb',
      versionSearch: 'OmniWeb/',
      identity: 'OmniWeb',
    },
    {
      string: navigator.vendor,
      subString: 'Apple',
      identity: 'Safari',
      versionSearch: 'Version',
    },
    {
      prop: window.opera,
      identity: 'Opera',
      versionSearch: 'Version',
    },
    {
      string: navigator.vendor,
      subString: 'iCab',
      identity: 'iCab',
    },
    {
      string: navigator.vendor,
      subString: 'KDE',
      identity: 'Konqueror',
    },
    {
      string: navigator.userAgent,
      subString: 'Firefox',
      identity: 'Firefox',
    },
    {
      string: navigator.vendor,
      subString: 'Camino',
      identity: 'Camino',
    },
    {
      // for newer Netscapes (6+)
      string: navigator.userAgent,
      subString: 'Netscape',
      identity: 'Netscape',
    },
    {
      string: navigator.userAgent,
      subString: 'MSIE',
      identity: 'Explorer',
      versionSearch: 'MSIE',
    },
    {
      string: navigator.userAgent,
      subString: 'Gecko',
      identity: 'Mozilla',
      versionSearch: 'rv',
    },
    {
      // for older Netscapes (4-)
      string: navigator.userAgent,
      subString: 'Mozilla',
      identity: 'Netscape',
      versionSearch: 'Mozilla',
    },
  ],
  dataOS: [
    {
      string: navigator.platform,
      subString: 'Win',
      identity: 'Windows',
    },
    {
      string: navigator.platform,
      subString: 'Mac',
      identity: 'Mac',
    },
    {
      string: navigator.userAgent,
      subString: 'iPhone',
      identity: 'iPhone/iPod',
    },
    {
      string: navigator.platform,
      subString: 'Linux',
      identity: 'Linux',
    },
  ],
};

//if browser hasn't been filled in for this session fill it in.
if ($.session.browser == '') {
  BrowserDetect.init();
  $.session.browser = BrowserDetect.browser;
  $.session.OS = BrowserDetect.OS;
  $.session.browserVer = BrowserDetect.version;
}

function convertMilitaryTimeToAMPM(inputTime) {
  var hour = '';
  var minute = '';
  var amPM = '';
  var convertedTime = '';
  if (inputTime.length < 5 && inputTime != '') {
    inputTime = '0' + inputTime;
  }
  // Parse the input time into hours and minutes:
  for (var i = 0; i < inputTime.length; i++) {
    if (isNaN(inputTime.charAt(i)) == false && inputTime.charAt(i) != ' ') {
      if (i < 2) {
        hour = hour + inputTime.charAt(i);
      }

      if (i == 3 || i == 4) {
        minute = minute + inputTime.charAt(i);
      }
    }
  }

  // Default to AM:
  amPM = 'AM';

  // If the hour = "00":
  if (hour == '00') {
    hour = '12';
  } else {
    // If the hour = "12":
    if (hour == '12') {
      // Set to PM:
      amPM = 'PM';
    }
  }

  // If the time is greater than Noon:
  if (hour > '12') {
    var x = +hour;
    x = x - 12;
    hour = String(x);

    // Set to PM:
    amPM = 'PM';
  }

  if (hour.length == 1) hour = '0' + hour;

  if (minute.length == 1) minute = '0' + minute;

  // Create the converted time:
  convertedTime = hour + ':' + minute + ' ' + amPM;

  return convertedTime;
}

function overClicky() {
  var now = new Date();
  var outStr = now.getHours() + now.getMinutes() + now.getSeconds();
  var last = $.session.lastMenuSelection;
  var lastStr = last.getHours() + last.getMinutes() + last.getSeconds();
  var compared = outStr - lastStr;

  compared = Math.abs(compared);

  if (compared < 2) return true;
  return false;
}

if (typeof String.prototype.startsWith != 'function') {
  // see below for better implementation!
  String.prototype.startsWith = function (str) {
    return this.indexOf(str) == 0;
  };
}

function IsPasswordStrong(password) {
  let preSpecialCharCheckString = $.session.passwordSpecialCharacters;
  // Remove the escapes, and re-add escapes after the string has been re-joined with commas.
  preSpecialCharCheckString = preSpecialCharCheckString.replaceAll(`\\\\`, `\\`);
  preSpecialCharCheckString = preSpecialCharCheckString.replaceAll(`\\"`, `"`);
  const specCharNoCommas = preSpecialCharCheckString.split('');
  let withCommas = specCharNoCommas.join((separator = ','));
  // Add in escapes
  withCommas = withCommas.replaceAll(`\\`, `\\\\`);
  withCommas = withCommas.replaceAll(`/`, `\\/`);
  withCommas = withCommas.replaceAll(`-`, `\\-`);
  withCommas = withCommas.replaceAll(`]`, `\\]`);
  withCommas = withCommas.replaceAll(`[`, `\\[`);
  const specChar = new RegExp(`[${withCommas}]`, 'g');

  if (password.length < $.session.advancedPasswordLength) return 0;
  if (!password.match(/[a-z]/) || !password.match(/[A-Z]/)) return 0;
  if (!password.match(specChar)) return 0;
  if (/\d/.test(password) === false) return 0;

  return 1;
}

function checkChangePasswordLoginValues() {
  var user = document.getElementById('username2');
  var pass = document.getElementById('password2');
  var pass1 = document.getElementById('newpassword1');
  var pass2 = document.getElementById('newpassword2');

  if (user.value === '' || pass.value === '') {
    document.getElementById('changebutton').classList.add('disabled');
    return 0;
  } else if (pass1 === '' || pass2.value === '') {
    document.getElementById('changebutton').classList.add('disabled');
  } else {
    document.getElementById('changebutton').classList.remove('disabled');
  }
}

function checkPass() {
  var user = document.getElementById('username2');
  var pass = document.getElementById('password2');
  var pass1 = document.getElementById('newpassword1');
  var pass2 = document.getElementById('newpassword2');
  var message = document.getElementById('confirmMessage');
  strongPassword = $.session.strongPassword;
  // PW Can't contain more than one backslash in a row
  if (pass1.value.match(/\\{2,}/g)) {
    $('#error').css('opacity', '1');
    $('#error').css('display', 'block');
    $('#errortext').text(`Your password can't contain more than one \\ in a row.`);
    document.getElementById('changebutton').classList.add('disabled');
    return 0;
  } else {
    $('#error').css('opacity', '0');
    $('#error').css('display', 'none');
    $('#errortext').text(``);
    document.getElementById('changebutton').classList.remove('disabled');
  }

  //Extra condition for whether or not a strong password is required
  if (strongPassword === 'N') {
    if (pass1.value === '' || pass2.value === '' || user.value === '' || pass.value === '') {
      message.innerHTML = 'Please enter and confirm a new password.';
      message.classList.add('password-error');
      document.getElementById('changebutton').classList.add('disabled');
      return 0;
    }

    //passwords match?
    if (pass1.value !== pass2.value) {
      message.innerHTML = 'Passwords Do Not Match!';
      message.classList.add('password-error');
      document.getElementById('changebutton').classList.add('disabled');
      return 0;
    } else {
      message.innerHTML = '';
      message.classList.remove('password-error');
      document.getElementById('changebutton').classList.remove('disabled');
      return 1;
    }
  } else {
    //if both are null
    if (
      pass1.value.length === 0 &&
      pass2.value.length === 0 &&
      $.session.changePasswordLinkSelected === ''
    ) {
      message.innerHTML = 'Your password has expired, please enter and confirm a new password.';
      document.getElementById('changebutton').classList.add('disabled');
      return 0;
    }

    //is password strong?
    if (IsPasswordStrong(pass1.value) !== 1) {
      // specialCharDisplay. Remove the escape from backslash and quote.
      let specialCharDisplay = $.session.passwordSpecialCharacters.replaceAll(`\\\\`, `\\`);
      specialCharDisplay = specialCharDisplay.replaceAll(`\\"`, `"`);
      message.innerHTML = `
        Passwords must meet all of the following requirements: Be at least ${$.session.advancedPasswordLength} characters long, 
        have a special character (${specialCharDisplay}), have a number, and include upper and lower case letters.
      `;
      message.classList.add('password-error');
      document.getElementById('changebutton').classList.add('disabled');
      return 0;
    }

    //passwords match?
    if (pass1.value === '' || pass2.value === '' || user.value === '' || pass.value === '') {
      message.innerHTML = 'Please enter and confirm a new password.';
      message.classList.add('password-error');
      document.getElementById('changebutton').classList.add('disabled');
      return 0;
    }
    //passwords match?
    if (pass1.value !== pass2.value) {
      message.innerHTML = 'Passwords Do Not Match!';
      message.classList.add('password-error');
      document.getElementById('changebutton').classList.add('disabled');
      return 0;
    } else {
      message.innerHTML = '';
      message.classList.remove('password-error');
      document.getElementById('changebutton').classList.remove('disabled');
      return 1;
    }
  }
}

Date.prototype.monthNames = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

Date.prototype.getMonthName = function () {
  return this.monthNames[this.getMonth()];
};
Date.prototype.getShortMonthName = function () {
  return this.getMonthName().substr(0, 3);
};

// function loadSettings() {
// 	var settingsBox = $("#settingsbox");
// 	var helpBox = $("#helpbox");

// 	if (settingsBox[0].style.display === 'none') {
// 		helpBox.css("display", "none");
// 		settingsBox.css("display", "block");
// 	} else {
// 		settingsBox.css("display", "none");
// 	}

//   $("#consumerclockinhelp").remove();
//   $(".consumerclockinhelptriangle").remove();
//   $("#goalshelp").remove();
//   $(".hrtriangleright").remove();
//   firstLoad = false;
// }

// function loadHelp() {
//     $("#settingsbox").css("display", "none");
//     $("#helpbox").css("display", "block");
//     $("#consumerclockinhelp").remove();
//     $(".consumerclockinhelptriangle").remove();
//     $("#goalshelp").remove();
//     $(".hrtriangleright").remove();
// }

function setDefaultValue(type, value, event, name) {
  event.stopPropagation();
  var mySrc = $(event.srcElement);
  mySrc.parents('locationpopupbox').hide();
  var typeName = '';
  var switchCase = 0;
  switch (type) {
    case 1:
      typeName = 'Default Staff Location';
      $('#0').text(event.srcElement.text);
      break;
    case 2:
      typeName = 'Default Roster Location';
      $('#1').text(event.srcElement.text);
      createCookie('defaultRosterGroupName', 'Everyone', 7);
      createCookie('defaultRosterGroupValue', 'ALL', 7);
      saveDefaultLocationNameAjax('6', 'Everyone');
      saveDefaultLocationValueAjax('6', 'ALL');
      $('#rostergroup6').text('Everyone');
      if (value != 0 && name != null) {
        getConsumerGroups(value, name);
        $.session.defaultRosterLocation = value;
        createCookie('defaultRosterLocationName', name, 7);
        saveDefaultLocationNameAjax('2', name);
      } else {
        createCookie('defaultRosterLocationName', 'Remember Last Location', 7);
        saveDefaultLocationNameAjax('2', 'Remember Last Location');
      }
      break;
    case 3:
      typeName = 'Default Day Service Location';
      $('#2').text(event.srcElement.text);
      if (value != 0 && name != null) {
        createCookie('defaultDayServiceLocationName', name, 7);
        createCookie('defaultDayServiceLocationNameValue', value, 7);
        createCookie('defaultDayServiceLocationFlag', false, 7);
        saveDefaultLocationNameAjax('3', name);
        saveDefaultLocationValueAjax('3', value);
        $.session.defaultDayServiceLocationFlag = 'false';
        $.session.dsLocationHistoryFlag = false;
      } else {
        var test = $(this).text();
        saveDefaultLocationNameAjax('3', 'Remember Last Location');
        if (name == null) {
          createCookie('defaultDayServiceLocationFlag', true, 7);
          $.session.defaultDayServiceLocationFlag = 'true';
        }
      }
      break;
    case 4:
      typeName = 'Default Time Clock Location';
      $('#timeclock4').text(event.srcElement.text);
      if (value != 0 && name != null) {
        createCookie('defaultTimeClockLocationName', name, 7);
        createCookie('defaultTimeClockLocationValue', value, 7);
        saveDefaultLocationNameAjax('4', name);
        saveDefaultLocationValueAjax('4', value);
      } else {
      }
      //New way to save to the database
      switchCase = '4';
      saveDefaultLocationValueAjax(switchCase, value);
      break;
    case 5:
      typeName = 'Default Workshop Location';
      $('#workshop5').text(event.srcElement.text);
      if (value != 0 && name != null) {
        createCookie('defaultWorkshopLocationName', name, 7);
        createCookie('defaultWorkshopLocationValue', value, 7);
        saveDefaultLocationNameAjax('5', name);
        saveDefaultLocationValueAjax('5', value);
      } else {
        createCookie('defaultWorkshopLocationName', 'Remember Last Location', 7);
        saveDefaultLocationNameAjax('5', 'Remember Last Location');
      }
      break;
    case 6:
      typeName = 'Default Roster Group';
      $('#rostergroup6').text(event.srcElement.text);
      if (value != 0 && name != null) {
        createCookie('defaultRosterGroupName', name, 7);
        createCookie('defaultRosterGroupValue', value, 7);
        saveDefaultLocationNameAjax('6', name);
        saveDefaultLocationValueAjax('6', value);
      } else {
        createCookie('defaultRosterGroupName', 'Everyone', 7);
        saveDefaultLocationNameAjax('6', 'Everyone');
      }
      break;
  }

  setDefaultLoc(type, value);
}

function tabletFocus(event) {
  var inputId;
  if ($.session.browser == 'Explorer' || $.session.browser == 'Mozilla') {
    inputId = event.srcElement.id;
  } else {
    inputId = event.target.id;
  }
  $('#' + inputId).focus();
}

// function browserSpecificEnabled() {
//     //this code is to add css classes for browser specific css
//     //not sure why ie11 says its mozilla and not msie??
//     if ($.browser.mozilla && $.browser.version == 11) {
//         $("html").addClass("ie11");
//     }
//     if ($.browser.msie && $.browser.version == 10) {
//         $("html").addClass("ie10");
//     }
// }

function customTextVersionWork(res) {
  var customText = '';
  $('results', res).each(function () {
    customText = $('customtext', this).text();
    $.session.ver = $('anywhereversion', this).text();
  });
  $(ver).text($.session.ver);
  if (customText != '') {
    $('#customLoginText').text(customText);
  } else {
    $('#customLoginText').text(
      'Primary Solutions, in conjunction with amazing people like you, has built a new product from the ground up that ' +
        "focuses on ease of use so that you can focus on what's really important.",
    );
  }
}

function checkVersions() {
  if ($.session.ver != $.session.version) {
    updateVersionAjax($.session.version);
  }
}

function getFormattedTime1(fullDate) {
  hours = fullDate.getHours();
  if (hours.toString().length == 1) {
    hours = '0' + hours;
  }
  min = fullDate.getMinutes();
  if (min.toString().length == 1) {
    min = '0' + min;
  }
  time = hours + ':' + min;
  time = convertMilitaryTimeToAMPM(time);
  time = time.replace('AM', '').replace('PM', '').replace(' ', '');
  return time;
}

function getAMPM(fullDate) {
  var ampm = '';
  hours = fullDate.getHours();
  if (hours.toString().length == 1) {
    hours = '0' + hours;
  }
  time = hours + ':' + fullDate.getMinutes();
  time = convertMilitaryTimeToAMPM(time);
  if (time.indexOf('AM') != -1) {
    ampm = 'AM';
  } else {
    ampm = 'PM';
  }
  return ampm;
}

//This is the function that was allowing access to the site. Going to probably need changed now.
function allowAccess(res) {
  var testInt = 0;
  $('result', res).each(function () {
    testInt = $('id', this).text();
  });
  if (testInt > 0) {
    eraseCookie('id');
    createCookie('id', testInt, 1);
    document.location.href = 'infalAnywhere.html';
  } else {
    $('#error').css('opacity', '1');
    $('#error').css('display', 'block');
    $('#errortext').text('Login unsuccessful');
  }
}

function checkModulePermissions() {
  if ($.session.DayServiceView == false) {
    $('#dayservicesettingsdiv').addClass('disabledModule');
  }
  if ($.session.GoalsView == false) {
    $('#goalssettingsdiv').addClass('disabledModule');
  }

  if ($.session.CaseNotesView == false || $.session.CaseNotesTablePermissionView == false) {
    $('#casenotessettingsdiv').addClass('disabledModule');
  }

  if ($.session.SingleEntryView == false) {
    $('#singleentrysettingsdiv').addClass('disabledModule');
  }

  if ($.session.WorkshopView == false) {
    $('#workshopsettingsdiv').addClass('disabledModule');
  }

  if ($.session.incidentTrackingView == false) {
    $('#incidenttrackingsettingsdiv').addClass('disabledModule');
  }

  if ($.session.schedulingView == false) {
    $('#schedulersettingsdiv').addClass('disabledModule');
  }

  if ($.session.planView == false) {
    $('#plansettingsdiv').addClass('disabledModule');
  }
  if ($.session.transportationView == false) {
    $('#transportationsettingsdiv').addClass('disabledModule');
  }
  if ($.session.emarView == false) {
    $('#emarsettingsdiv').addClass('disabledModule');
  }
  if ($.session.formsView == false) {
    $('#PDFFormssettingsdiv').addClass('disabledModule');
  }
  if ($.session.OODView == false) {
    $('#OODsettingsdiv').addClass('disabledModule');
  }
  if ($.session.ResetPasswordView == false) {
    $('#Adminsettingdiv').addClass('disabledModule');
  }
  if ($.session.EmploymentView == false) {
    $('#Employmentsettingsdiv').addClass('disabledModule');
  }
  if ($.session.CFView == false) {
    $('#consumerfinancessettingsdiv').addClass('disabledModule');
  }

  $('#adminsingleentrysettingsdiv').hide();
  if ($.session.ViewAdminSingleEntry === true) {
    if ($.session.SEViewAdminWidget === true) {
      $('#adminsingleentrysettingsdiv').show();
    }
  }
}

function disableModules() {
  if ($.session.applicationName == 'Gatekeeper') {
    $('#singleentrysettingsdiv').css('display', 'none');
    $('#adminsingleentrysettingsdiv').css('display', 'none');
    $('#transportationsettingsdiv').css('display', 'none');
    $('#OODsettingsdiv').css('display', 'none');

    $('#customlinks').css('display', 'none');
  }

  if ($.session.applicationName == 'Advisor') {
    $('#authorizationsdiv').css('display', 'none');
  }

  if ($.session.dayServicesPermission == 'Anywhere_DayServices') {
    // leave module on
  } else {
    $('#dayservicesettingsdiv').css('display', 'none');
  }

  if ($.session.outcomesPermission == 'Anywhere_Outcomes') {
    // leave module on
  } else {
    $('#goalssettingsdiv').css('display', 'none');
    //MAT - commented this out because it is in wrong spot.
    //$("#singlebuttondiv").css("display", "none");
  }

  if ($.session.workshopPermission == 'Anywhere_Workshop') {
    // leave module on
  } else {
    $('#workshopsettingsdiv').hide();
  }

  if ($.session.intellivuePermission == 'Intellivue') {
    // leave module on
  } else {
    $('#intellivuesettingsdiv').hide();
  }

  if ($.session.caseNotesPermission == 'Anywhere_CaseNotes') {
    // leave module on
  } else {
    $('#casenotessettingsdiv').css('display', 'none');
  }

  if ($.session.singleEntryPermission == 'Anywhere_SingleEntry') {
    // leave module on
  } else {
    $('#singleentrysettingsdiv').css('display', 'none');
  }

  if ($.session.singleEntryApproveEnabled == 'Y') {
    //Leave module on
  } else {
    //$("#adminsingleentrysettingsdiv").css("display", "none");
  }

  if ($.session.incidentTrackingPermission == 'Anywhere_Incident_Tracking') {
    //Leave module on
  } else {
    $('#incidenttrackingsettingsdiv').css('display', 'none');
  }

  if ($.session.anywhereSchedulingPermission == 'Anywhere_Scheduling') {
    //Leave module on
  } else {
    $('#schedulersettingsdiv').css('display', 'none');
  }

  if ($.session.covidPermission == 'COVID_19') {
    //Leave module on
  } else {
    $('#covidchecklistsettingsdiv').css('display', 'none');
  }
  if ($.session.transportationPermission == 'Anywhere_Transportation') {
    //Leave module on
  } else {
    $('#transportationsettingsdiv').css('display', 'none');
  }
  if ($.session.emarPermission == 'Anywhere_eMAR') {
    //Leave module on
  } else {
    $('#emarsettingsdiv').css('display', 'none');
  }
  if ($.session.formsPermission == 'Anywhere_Forms') {
    //Leave module on
  } else {
    $('#PDFFormssettingsdiv').css('display', 'none');
  }
  if ($.session.OODPermission == 'Anywhere_OOD') {
    //Leave module on
  } else {
    $('#OODsettingsdiv').css('display', 'none');
  }
  //if (($.session.passwordResetPermission = 'Anywhere')) {
  //  //
  //  //Leave module on
  //} else {
  //  $('#Adminsettingdiv').css('display', 'none');
  //}
  if ($.session.UserId === 'ash' || $.session.anywherePlanPermission == 'Anywhere_Plan') {
    //Leave module on
  } else {
    $('#plansettingsdiv').css('display', 'none');
  }

  if ($.session.anywhereResetPasswordPermission == 'Anywhere_Administration') {
    //Leave module on
  } else {
    $('#Adminsettingdiv').css('display', 'none');
  }

  if ($.session.anywhereConsumerFinancesPermission == 'Anywhere_Consumer_Finances') {
    //Leave module on
  } else {
    $('#consumerfinancessettingsdiv').css('display', 'none');
  }

  if ($.session.anywhereEmploymentPermission == 'Anywhere_Employment') {
    //Leave module on
  } else {
    $('#Employmentsettingsdiv').css('display', 'none');
  }
}

function setUpAdminPermissions() {
  $.session.DayServiceView = true;
  $.session.DayServiceInsert = true;
  $.session.DayServiceUpdate = true;
  $.session.DayServiceDelete = true;
  $.session.DayServiceNonBillable = true;
  $.session.DayServiceOverRide = true;
  $.session.DenyStaffClockUpdate = false;
  $.session.DenyClockUpdate = false;
  $.session.DemographicsView = true;
  $.session.DemographicsBasicDataView = true;
  $.session.DemographicsRelationshipsView = true;
  $.session.DemographicsPictureUpdate = true;
  $.session.DemographicsNotesView = true;
  $.session.GoalsView = true;
  $.session.GoalsUpdate = true;
  $.session.CaseNotesView = true;
  $.session.CaseNotesTablePermissionView = true;
  $.session.CaseNotesUpdate = true;
  $.session.CaseNotesCaseloadRestriction = false;
  $.session.SingleEntryView = true;
  $.session.SingleEntryUpdate = true;
  $.session.caseNoteEditSecond = true;
  $.session.caseNoteDisplayGroupNoteDivPreference = true;
  $.session.caseNoteDisplayGroupNoteCheckedPreference = true;
  $.session.updateAllGroupDropDowns = true;
  $.session.changeFromSingleToGroupNote = true;
  $.session.UpdateCaseNotesDocTime = true;
  $.session.anAdmin = true;
  $.session.ViewAdminSingleEntry = true;
  $.session.CaseNotesViewEntered = false;
  $.session.CaseNotesSSANotes = false;
  $.session.schedulingUpdate = true;
  $.session.schedulingView = true;
  $.session.schedulingStartDayOfWeek = 0;
  $.session.schedAllowCallOffRequests = 'N';
  $.session.schedRequestOpenShifts = 'N';
}
