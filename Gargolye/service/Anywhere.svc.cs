using Anywhere.anypatch;
using Anywhere.Data;
using Anywhere.Log;
using Anywhere.service.Data;
using Anywhere.service.Data.AssessmentReOrderRows;
using Anywhere.service.Data.Authorization;
using Anywhere.service.Data.CaseNoteReportBuilder;
using Anywhere.service.Data.CaseNoteSSA;
using Anywhere.service.Data.ConsumerDemographics;
using Anywhere.service.Data.ConsumerFinances;
using Anywhere.service.Data.Covid;
using Anywhere.service.Data.Defaults;
using Anywhere.service.Data.DocumentConversion;
using Anywhere.service.Data.Employment;
using Anywhere.service.Data.eSignature___OneSpan;
using Anywhere.service.Data.PDF_Forms;
using Anywhere.service.Data.Plan;
using Anywhere.service.Data.Plan.Assessment;
using Anywhere.service.Data.PlanContactInformation;
using Anywhere.service.Data.PlanDiscoveryAssessmentSummary;
using Anywhere.service.Data.PlanInformedConsent;
using Anywhere.service.Data.PlanIntroduction;
using Anywhere.service.Data.PlanOutcomes;
using Anywhere.service.Data.PlanServicesAndSupports;
using Anywhere.service.Data.PlanSignature;
using Anywhere.service.Data.PlanValidation;
using Anywhere.service.Data.ReportBuilder;
using Anywhere.service.Data.ResetPassword;
using Anywhere.service.Data.SimpleMar;
using Anywhere.service.Data.Transportation;
using Anywhere.service.Data.WaitingListAssessment;
using Bytescout.PDF;
using OODForms;
using PDFGenerator;
using System;
using System.Collections.Generic;
using System.IO;
using System.IO.Compression;
using System.Management.Automation.Language;
using System.Text;
using System.Web.Script.Serialization;
using static Anywhere.service.Data.AnywhereAssessmentWorker;
using static Anywhere.service.Data.AnywhereWorker;
using static Anywhere.service.Data.Authorization.AuthorizationWorker;
using static Anywhere.service.Data.CaseNotesWorker;
using static Anywhere.service.Data.ConsumerFinances.ConsumerFinancesWorker;
using static Anywhere.service.Data.DocumentConversion.DisplayPlanReportAndAttachments;
using static Anywhere.service.Data.Employment.EmploymentWorker;
using static Anywhere.service.Data.OODWorker;
using static Anywhere.service.Data.PlanServicesAndSupports.ServicesAndSupportsWorker;
using static Anywhere.service.Data.ReportBuilder.ReportBuilderWorker;
using static Anywhere.service.Data.WaitingListAssessment.WaitingListWorker;

namespace Anywhere
{
    [System.ServiceModel.Activation.AspNetCompatibilityRequirements(RequirementsMode = System.ServiceModel.Activation.AspNetCompatibilityRequirementsMode.Required)]
    public class AnywhereService : IAnywhere
    {
        private static readonly log4net.ILog logger = log4net.LogManager.GetLogger(typeof(AnywhereService));
        private static Loger logger2 = new Loger();
        JavaScriptSerializer js = new JavaScriptSerializer();
        DataGetter dg = new DataGetter();
        OODDataGetter Odg = new OODDataGetter();
        IntelliviewDataGetter idg = new IntelliviewDataGetter();
        InfalWorker infalWorker = new InfalWorker();
        SingleEntryReport ser = new SingleEntryReport();
        PlanReport planRep = new PlanReport();
        forms.pdfView pdfView = new forms.pdfView();
        AnywhereAbsentWorker anyAbsentWorker = new AnywhereAbsentWorker();//
        AnywhereWorker anywhereWorker = new AnywhereWorker();
        AnywhereCaraSolvaWorker anywhereCaraSolvaWorker = new AnywhereCaraSolvaWorker();
        AnywhereAttachmentWorker anywhereAttachmentWorker = new AnywhereAttachmentWorker();
        SingleEntryWorker singleEntryWorker = new SingleEntryWorker();
        AnywhereScheduleWorker anywhereScheduleWorker = new AnywhereScheduleWorker();
        AnywhereWorkshopWorkerTwo anywhereWorkshopWorkerTwo = new AnywhereWorkshopWorkerTwo();
        IncidentTrackingWorker iTW = new IncidentTrackingWorker();
        DashboardWorker dashWork = new DashboardWorker();
        DayServicesWorker dsWorker = new DayServicesWorker();
        RosterWorker rosterWorker = new RosterWorker();
        CaseNotesWorker caseNotesWorker = new CaseNotesWorker();
        OutcomesWorker outcomesWorker = new OutcomesWorker();
        AnywherePlanWorker aPW = new AnywherePlanWorker();
        AssessmentWorker pAW = new AssessmentWorker();
        AnywhereAuthenticator aAuth = new AnywhereAuthenticator();
        WorkflowWorker wfw = new WorkflowWorker();
        FormWorker fw = new FormWorker();
        OODWorker Ow = new OODWorker();
        CovidWorker cw = new CovidWorker();
        CaseNoteSSAWorker cnSSA = new CaseNoteSSAWorker();
        TransportationWorker trW = new TransportationWorker();
        PlanOutcomesWorker poW = new PlanOutcomesWorker();
        AnywhereAssessmentWorker aAW = new AnywhereAssessmentWorker();
        pdfWorker pdfWorker = new pdfWorker();
        // PDFWorker pdfW = new PDFWorker();
        ServicesAndSupportsWorker ssw = new ServicesAndSupportsWorker();
        PlanInformedConsentWorker picw = new PlanInformedConsentWorker();
        PlanSignatureWorker psw = new PlanSignatureWorker();
        PlanContactInformationWorker pciw = new PlanContactInformationWorker();
        PlanDiscoverySummaryWorker pdsw = new PlanDiscoverySummaryWorker();
        PlanIntroductionWorker piw = new PlanIntroductionWorker();
        AssessmentReOrderRowsWorker arorw = new AssessmentReOrderRowsWorker();
        PlanDataGetter pdg = new PlanDataGetter();
        DefaultsWorker dw = new DefaultsWorker();
        OneSpanWorker osw = new OneSpanWorker();
        CaseNoteReportBuilderWorker cnReportWorker = new CaseNoteReportBuilderWorker();
        SignInUser siu = new SignInUser();
        DisplayPlanReportAndAttachments dpra = new DisplayPlanReportAndAttachments();
        ResetPasswordWorker resetPasswordWorker = new ResetPasswordWorker();
        ConsumerFinancesWorker cf = new ConsumerFinancesWorker();
        DemographicsWoker cdw = new DemographicsWoker();
        EmploymentWorker emp = new EmploymentWorker();
        AssessmentDataGetter assDG = new AssessmentDataGetter();
        ReportBuilderWorker rbw = new ReportBuilderWorker();
        AuthorizationWorker authWorker = new AuthorizationWorker();
        OODFormWorker OODfw = new OODFormWorker();
        PlanValidationWorker pv = new PlanValidationWorker();
        WaitingListWorker wlw = new WaitingListWorker();
        FinalizationButtonWorker fbw = new FinalizationButtonWorker();

        public AnywhereService()
        {
            log4net.Config.XmlConfigurator.Configure();
        }

        public string getLocations(string token)//MAT need to see if I can remove
        {
            if (token == null)
            {
                logger.Error("token was null :" + token);
                return "<error>Not all data was correct.</error>";
            }

            return dg.getLocations(token);
        }

        public SingleEntryWorker.LocationsAndResidences[] getLocationsAndResidencesJSON(string token)//MAT need to see if I can remove
        {
            return singleEntryWorker.getLocationsAndResidencesJSON(token);
        }

        //New version of Above
        public AnywhereWorker.RosterLocations[] getLocationsJSON(string token)
        {
            if (token == null)
            {
                logger.Error("token was null :" + token);
                return null;
            }

            return anywhereWorker.getLocationsJSON(token);
        }

        public DayServicesWorker.DayServiceLocations[] getDayServiceLocationsJSON(string token, string serviceDate)
        {
            return dsWorker.getDayServiceLocationsJSON(token, serviceDate);
        }

        public DayServicesWorker.ClockedInConsumers[] getDayServiceClockedInConsumers(string token, string consumerIdString, string serviceDate, string locationId)
        {
            return dsWorker.getDayServiceClockedInConsumers(token, consumerIdString, serviceDate, locationId);
        }

        public DayServicesWorker.DayServiceGroups[] getDayServiceGroups(string token, string locationId)
        {
            return dsWorker.getDayServiceGroups(token, locationId);
        }

        public string GetConsumerGroups(string locationId, string token)
        {
            return dg.getConsumerGroups(locationId, token);
        }

        public AnywhereWorker.ConsumerGroups[] getConsumerGroupsJSON(string locationId, string token)
        {
            return anywhereWorker.getConsumerGroupsJSON(locationId, token);
        }

        public string getConsumersByGroup(string groupCode, string retrieveId, string token, string serviceDate, string daysBackDate)
        {
            Int64 Num;
            bool isNum = Int64.TryParse(retrieveId, out Num);

            if (isNum)
            {
                return dg.getConsumersByGroup(groupCode, retrieveId, token, serviceDate, daysBackDate);
            }
            else
            {
                logger.Error("RetrieveId is not a number:" + retrieveId);
                return "<error>RetrieveID is Not a number.</error>";
            }
        }

        public AnywhereWorker.ConsumersByGroup[] getConsumersByGroupJSON(string groupCode, string retrieveId, string token, string serviceDate, string daysBackDate)
        {
            Int64 Num;
            bool isNum = Int64.TryParse(retrieveId, out Num);

            if (isNum)
            {
                return anywhereWorker.getConsumersByGroupJSON(groupCode, retrieveId, token, serviceDate, daysBackDate);
            }
            else
            {
                logger.Error("RetrieveId is not a number:" + retrieveId);
                return null;
            }
        }

        public string addConsumerToGroup(string groupId, string consumerId)
        {
            Int64 Num;
            bool isNum = Int64.TryParse(groupId, out Num);
            bool isNum2 = Int64.TryParse(consumerId, out Num);

            if (isNum && isNum2)
            {
                return dg.addConsumerToGroup(groupId, consumerId);
            }
            else
            {
                logger.Error("GroupId or consumerId is not a number:" + groupId + " " + consumerId);
                return "<error>Error parsing GroupId or consumerId</error>";
            }

        }

        public string removeConsumerFromGroup(string groupId, string consumerId)
        {
            Int64 Num;
            bool isNum = Int64.TryParse(groupId, out Num);
            bool isNum2 = Int64.TryParse(consumerId, out Num);

            if (isNum && isNum2)
            {
                return dg.removeConsumerFromGroup(groupId, consumerId);
            }
            else
            {
                logger.Error("GroupId or consumerId is not a number:" + groupId + " " + consumerId);
                return "<error>Error parsing GroupId or consumerId</error>";
            }

        }

        public RosterWorker.AddCustomGroup[] addCustomGroupJSON(string groupName, string locationId, string token)
        {
            char[] arr = groupName.ToCharArray();
            arr = Array.FindAll<char>(arr, (c => (char.IsLetterOrDigit(c) || char.IsWhiteSpace(c) || c == '-')));
            groupName = new string(arr);
            string error = "<error>Error group name must have at least 3 valid charaters</error>";

            // if (groupName.Length > 2)
            // {
            return rosterWorker.addCustomGroupJSON(groupName, locationId, token);
            // }
            // else
            // {
            //     return error;
            // }
        }

        public string removeCustomGroup(string groupId)
        {
            Int64 Num;
            bool isNum = Int64.TryParse(groupId, out Num);

            if (isNum)
            {
                return dg.removeCustomGroup(groupId);
            }
            else
            {
                logger.Error("groupId is not a number:" + groupId);
                return "<error>Error parsing groupId</error>";
            }
        }

        //Get strong password field for change
        public string getStrongPassword()
        {

            return dg.getStrongPassword();

        }

        public string getCustomTextAndAnywhereVersion()
        {
            return dg.getCustomTextAndAnywhereVersion();
        }

        public DayServicesWorker.DSConsumerActivityObject[] getConsumerDayServiceActivityJSON(string token, string peopleList, string serviceDate, string locationId, string groupCode, string retrieveId)
        {
            return dsWorker.getConsumerDayServiceActivityJSON(token, peopleList, serviceDate, locationId, groupCode, retrieveId);
        }

        public string massUserCheckByDate(string consumerIds, string serviceDate, string locationId)
        {
            return dg.massUserCheckByDate(consumerIds, serviceDate, locationId);
        }


        public string addDayServiceActivityMassClockInConsumer(string token, string consumerIds, string serviceDate, string locationId, string startTime)
        {
            return dg.addDayServiceActivityMassClockInConsumer(token, consumerIds, serviceDate, locationId, startTime);
        }

        public string addDayServiceActivityMassClockOutConsumer(string token, string consumerIds, string serviceDate, string locationId, string stopTime)
        {
            return dg.addDayServiceActivityMassClockOutConsumer(token, consumerIds, serviceDate, locationId, stopTime);
        }

        public string updateDayServiceActivity(string token, string consumerIds, string serviceDate, string locationId, string inputType, string inputTime, string dayServiceType, string selectedGroupId)
        {
            return dg.updateDayServiceActivity(token, consumerIds, serviceDate, locationId, inputType, inputTime, dayServiceType, selectedGroupId);
        }

        public string getLogIn(string userId, string hash, string deviceId)
        {
            return anywhereWorker.getLogIn(userId, hash, deviceId);
        }

        public string changeLogIn(string userId, string hash, string newPassword, string changingToHashPassword)
        {
            return dg.changeLogIn(userId, hash, newPassword, changingToHashPassword);
        }

        public string tokenCheck(string token)
        {
            return dg.tokenCheck(token);
        }

        public string clockInStaff(string token, string locationId, string createTimeEntries)
        {
            return dashWork.clockInStaff(token, locationId, createTimeEntries);
        }

        public string clockOutStaff(string token)
        {
            return dashWork.clockOutStaff(token);
        }

        public DashboardWorker.StaffActivityObj[] getStaffActivityJSON(string token, string serviceDate)
        {
            return dashWork.getStaffActivityJSON(token, serviceDate);
        }

        public string updateStaffClockTime(string token, string serviceDate, string orginalTime, string newTime, string isClockIn, string checkedAgainstTime, string location)
        {
            return dg.updateStaffClockTime(token, serviceDate, orginalTime, newTime, isClockIn, checkedAgainstTime, location);
        }

        public string deleteDayServiceMassDeleteConsumerActivity(string consumerIds, string serviceDate, string locationID)
        {
            return dg.deleteDayServiceMassDeleteConsumerActivity(consumerIds, serviceDate, locationID);
        }

        public string setDefaultSettings(string token, string settingKey, string settingValue)
        {
            return dg.setDefaultSettings(token, settingKey, settingValue);
        }

        public string saveGoal(string token, string objectiveId, string activityId, string date, string success, string goalnote, string promptType, string promptNumber, string locationId, string locationSecondaryId, string goalStartTime, string goalEndTime, string goalCILevel)
        {
            return dg.saveGoal(token, objectiveId, activityId, date, success, goalnote, promptType, promptNumber, locationId, locationSecondaryId, goalStartTime, goalEndTime, goalCILevel);
        }

        public string deleteGoal(string token, string activityId)
        {
            return dg.deleteGoal(token, activityId);
        }

        public string getSingleEntry(string token)
        {
            return dg.getSingleEntry(token);
        }

        public string GetData(int value)
        {
            return string.Format("You entered: {0}", value);
        }

        public OutcomesWorker.UserIdsWithGoals[] getUserIdsWithGoalsJSON(string token)
        {
            return outcomesWorker.getUserIdsWithGoalsJSON(token);
        }

        public OutcomesWorker.GoalSpecificLocationInfo[] getGoalSpecificLocationInfoJSON(string token, string activityId)
        {
            return outcomesWorker.getGoalSpecificLocationInfoJSON(token, activityId);
        }

        public OutcomesWorker.UserIdsWithGoalsByDate[] getUserIdsWithGoalsByDateJSON(string token, string goalsCheckDate)
        {
            return outcomesWorker.getUserIdsWithGoalsByDateJSON(token, goalsCheckDate);
        }

        public OutcomesWorker.DaysBackForEditingGoals[] getDaysBackForEditingGoalsJSON(string token, string consumerId)
        {
            return outcomesWorker.getDaysBackForEditingGoalsJSON(token, consumerId);
        }

        public CaseNotesWorker.CaseNotesFilteredSearch[] caseNotesFilteredSearchJSON(string token, string billerId, string consumerId, string serviceStartDate, string serviceEndDate,
            string dateEnteredStart, string dateEnteredEnd, string billingCode, string reviewStatus, string location, string service, string need, string contact, string confidential, string corrected, string billed,
            string attachments, string overlaps, string noteText, string applicationName)
        {
            return caseNotesWorker.caseNotesFilteredSearchJSON(token, billerId, consumerId, serviceStartDate, serviceEndDate, dateEnteredStart, dateEnteredEnd,
                billingCode, reviewStatus, location, service, need, contact, confidential, corrected, billed, attachments, overlaps, noteText, applicationName);
        }

        public AnywhereWorker.DefaultSettings[] getDefaultAnywhereSettingsJSON(string token)
        {
            return anywhereWorker.getDefaultAnywhereSettingsJSON(token);
        }

        public AnywhereWorker.PeopleId[] getConsumerPeopleId(string consumerId)
        {
            return anywhereWorker.getConsumerPeopleId(consumerId);
        }

        public AnywhereWorker.OrganiztionId[] getConsumerOrganizationId(string peopleId)
        {
            return anywhereWorker.getConsumerOrganizationId(peopleId);
        }

        public PlanInformedConsentWorker.InformedConsentSSAs[] getCaseManagersfromOptionsTable(string token)
        {
            return anywhereWorker.getCaseManagersfromOptionsTable(token);
        }

        public PlanInformedConsentWorker.InformedConsentSSAs[] getConsumerswithSaleforceIds(string token)
        {
            return anywhereWorker.getConsumerswithSaleforceIds(token);
        }


        public string updateCaseNotesReviewDays(string token, string updatedReviewDays)
        {
            return dg.updateCaseNotesReviewDays(token, updatedReviewDays);
        }

        public CaseNotesWorker.GetBillers[] getBillersListForDropDownJSON(string token)
        {
            return caseNotesWorker.getBillersListForDropDownJSON(token);
        }

        public CaseNotesWorker.FilterDropdownValues[] getCNPopulateFilterDropdowns(string token, string serviceCodeId)
        {
            return caseNotesWorker.getCNPopulateFilterDropdowns(token, serviceCodeId);
        }

        //case note filter
        public CaseNotesWorker.ConsumersForFilter[] getConsumersForCNFilter(string token, string caseLoadOnly)
        {
            return caseNotesWorker.getConsumersForCNFilter(token, caseLoadOnly);
        }

        public string populateDropdownData(string token)
        {
            return dg.populateDropdownData(token);
        }

        public string saveCaseNote(string token, string noteId, string caseManagerId, string consumerId, string serviceOrBillingCodeId, string locationCode, string serviceCode, string needCode, string serviceDate, string startTime, string endTime, string vendorId, string contactCode, string serviceLocationCode, string caseNote, string reviewRequired, string confidential, string corrected, string casenotemileage, string casenotetraveltime, string documentationTime)
        {
            return dg.saveCaseNote(token, noteId, caseManagerId, consumerId, serviceOrBillingCodeId, locationCode, serviceCode, needCode, serviceDate, startTime, endTime, vendorId, contactCode, serviceLocationCode, caseNote, reviewRequired, confidential, corrected, casenotemileage, casenotetraveltime, documentationTime);
        }

        public string saveGroupCaseNote(string token, string noteId, string groupNoteId, string caseManagerId, string consumerId, string serviceOrBillingCodeId, string locationCode, string serviceCode, string needCode, string serviceDate, string startTime, string endTime, string vendorId, string contactCode, string serviceLocationCode, string caseNote, string reviewRequired, string confidential, string consumerGroupCount, string casenotemileage, string casenotetraveltime, string documentationTime)
        {
            return dg.saveGroupCaseNote(token, noteId, groupNoteId, caseManagerId, consumerId, serviceOrBillingCodeId, locationCode, serviceCode, needCode, serviceDate, startTime, endTime, vendorId, contactCode, serviceLocationCode, caseNote, reviewRequired, confidential, consumerGroupCount, casenotemileage, casenotetraveltime, documentationTime);
        }

        public CaseNotesWorker.CaseNoteEdit[] getCaseNoteEditJSON(string token, string noteId)
        {
            return caseNotesWorker.getCaseNoteEditJSON(token, noteId);
        }

        public OutcomesWorker.GoalIDByPermission[] getViewableGoalIdsByPermissionJSON(string token)
        {
            return outcomesWorker.getViewableGoalIdsByPermissionJSON(token);
        }

        public static byte[] Compress(byte[] raw)
        {
            using (MemoryStream memory = new MemoryStream())
            {
                using (GZipStream gzip = new GZipStream(memory,
                CompressionMode.Compress, true))
                {
                    gzip.Write(raw, 0, raw.Length);
                }
                return memory.ToArray();
            }
        }

        public string addCaseNoteAttachment(string token, string caseNoteId, string description, string attachmentType, string attachment)
        {
            return caseNotesWorker.addCaseNoteAttachment(token, caseNoteId, description, attachmentType, attachment);
        }

        public string deleteCaseNoteAttachment(string token, string caseNoteId, string attachmentId)
        {
            return dg.deleteCaseNoteAttachment(token, caseNoteId, attachmentId);
        }

        public string updatePortrait(string token, string employeeUserName, string imageFile, string id, string portraitPath)
        {
            return dg.updatePortrait(token, employeeUserName, imageFile, id, portraitPath);
        }

        public AnywhereWorker.PermissionObject[] getUserPermissions(string token)

        {
            return anywhereWorker.getUserPermissions(token);
        }

        public string featureLogging(string token, string featureDescription)
        {
            return dg.featureLogging(token, featureDescription);
        }

        public CaseNotesWorker.ConsumerSpecificVendors[] getConsumerSpecificVendorsJSON(string token, string consumerId, string serviceDate)
        {
            return caseNotesWorker.getConsumerSpecificVendorsJSON(token, consumerId, serviceDate);
        }

        public CaseNotesWorker.ServiceLocationData[] getServiceLocationsForCaseNoteDropDown(string token, string serviceDate, string consumerId)
        {
            return caseNotesWorker.getServiceLocationsForCaseNoteDropDown(token, serviceDate, consumerId);
        }

        public string deleteExistingCaseNote(string token, string noteId)
        {
            return dg.deleteExistingCaseNote(token, noteId);
        }

        public CaseNotesWorker.ReviewRequiredData[] getReviewRequiredForCaseManager(string token, string caseManagerId)
        {
            return caseNotesWorker.getReviewRequiredForCaseManager(token, caseManagerId);
        }

        public RosterWorker.ConsumerNotes[] getDemographicsNotesJSON(string token, string consumerId)
        {
            return rosterWorker.getDemographicsNotesJSON(token, consumerId);
        }

        public RosterWorker.ConsumerDemographics[] getConsumerDemographicsJSON(string token, string consumerId)
        {
            return rosterWorker.getConsumerDemographicsJSON(token, consumerId);
        }
        public RosterWorker.DemographicInformation[] GetDemographicInformation(string token)
        {
            return rosterWorker.GetDemographicInformation(token);
        }
        public RosterWorker.DemographicInformation[] GetValidateEmailInformation(string token, string email)
        {
            return rosterWorker.GetValidateEmailInformation(token, email);
        }
        public RosterWorker.MobileCarrierDropdown[] getMobileCarrierDropdown(string token)
        {
            return rosterWorker.getMobileCarrierDropdown(token);
        }
        public RosterWorker.ConsumerRelationships[] getConsumerRelationshipsJSON(string token, string consumerId)
        {
            return rosterWorker.getConsumerRelationshipsJSON(token, consumerId);
        }

        public string updateDemographicInformation(string token, string addressOne, string addressTwo, string city, string state, string zipCode, string mobilePhone, string email, string carrier)
        {
            return dg.updateDemographicInformation(token, addressOne, addressTwo, city, state, zipCode, mobilePhone, email, carrier);
        }

        public string updateDemographicsRecord(string consumerId, string field, string newValue, string applicationName)
        {
            return cdw.updateDemographicsRecord(consumerId, field, newValue, applicationName);
        }

        public string setupPasswordResetEmail(string userName)
        {
            return dg.setupPasswordResetEmail(userName);
        }

        public DashboardWorker.SystemMessagesAndCustomLinks[] getSystemMessagesAndCustomLinksJSON(string token)
        {
            return dashWork.getSystemMessagesAndCustomLinksJSON(token);
        }

        public OutcomesWorker.RemainingDailyGoals[] getRemainingDailyGoalsJSON(string token, string checkDate)
        {
            return outcomesWorker.getRemainingDailyGoalsJSON(token, checkDate);
        }

        public string getCaseLoadRestriction(string token)
        {
            return dg.getCaseLoadRestriction(token);
        }

        public string getGroupNoteId(string token)
        {
            return dg.getGroupNoteId(token);
        }

        public string caseNoteOverlapCheck(string token, string consumerId, string startTime, string endTime, string serviceDate, string caseManagerId, string noteId, string groupNoteId)
        {
            return dg.caseNoteOverlapCheck(token, consumerId, startTime, endTime, serviceDate, caseManagerId, noteId, groupNoteId);
        }

        public string getGroupNoteNames(string token, string groupNoteId)
        {
            return dg.getGroupNoteNames(token, groupNoteId);
        }

        public string updateGroupNoteValues(string token, string groupNoteId, string noteId, string serviceOrBillingCodeId, string serviceDate, string startTime, string endTime)
        {
            return dg.updateGroupNoteValues(token, groupNoteId, noteId, serviceOrBillingCodeId, serviceDate, startTime, endTime);
        }

        public string updateGroupNoteValuesAndDropdowns(string token, string groupNoteId, string noteId, string serviceOrBillingCodeId, string locationCode, string serviceCode, string needCode, string contactCode, string serviceDate, string startTime, string endTime)
        {
            return dg.updateGroupNoteValuesAndDropdowns(token, groupNoteId, noteId, serviceOrBillingCodeId, locationCode, serviceCode, needCode, contactCode, serviceDate, startTime, endTime);
        }

        public string saveAdditionalGroupCaseNote(string token, string noteId, string groupNoteId, string caseManagerId, string consumerId, string serviceOrBillingCodeId, string locationCode, string serviceCode, string needCode, string serviceDate, string startTime, string endTime, string vendorId, string contactCode, string serviceLocationCode, string reviewRequired, string confidential, string caseNote, string casenotemileage, string casenotetraveltime, string documentationTime)
        {
            return dg.saveAdditionalGroupCaseNote(token, noteId, groupNoteId, caseManagerId, consumerId, serviceOrBillingCodeId, locationCode, serviceCode, needCode, serviceDate, startTime, endTime, vendorId, contactCode, serviceLocationCode, reviewRequired, confidential, caseNote, casenotemileage, casenotetraveltime, documentationTime);
        }

        //Single Entry Below
        public string insertSingleEntry(string token, string userId, string updaterId, string personId, string dateOfService, string locationId, string workCodeID, string startTime, string endTime, string checkHours, string consumerId, string transportationUnits, string transportationReimbursable, string numberOfConsumersPresent, string inComments, string odometerStart, string odometerEnd, string destination, string reason, string latitude, string longitude, string endLatitude, string endLongitude, string deviceType, string evvReason, string attest, string licensePlateNumber, string community)
        {
            return dg.insertSingleEntry(token, userId, updaterId, personId, dateOfService, locationId, workCodeID, startTime, endTime, checkHours, consumerId, transportationUnits, transportationReimbursable, numberOfConsumersPresent, inComments, odometerStart, odometerEnd, destination, reason, latitude, longitude, endLatitude, endLongitude, deviceType, evvReason, attest, licensePlateNumber, community);
        }

        public SingleEntryWorker.ConsumerAndLocation[] getSelectedConsumerLocations(string token, string userId, string updaterId, string personId, string dateOfService, string locationId, string workCodeID, string startTime, string endTime, string checkHours, string consumerId, string transportationUnits, string transportationReimbursable, string numberOfConsumersPresent, string inComments, string odometerStart, string odometerEnd, string destination, string reason, string latitude, string longitude, string endLatitude, string endLongitude, string deviceType, string evvReason, string attest, string licensePlateNumber, string community)
        {
            return singleEntryWorker.getSelectedConsumerLocations(token, userId, updaterId, personId, dateOfService, locationId, workCodeID, startTime, endTime, checkHours, consumerId, transportationUnits, transportationReimbursable, numberOfConsumersPresent, inComments, odometerStart, odometerEnd, destination, reason, latitude, longitude, endLatitude, endLongitude, deviceType, evvReason, attest, licensePlateNumber, community);
        }

        public SingleEntryWorker.ConsumerAndLocation[] preInsertSingleEntry(string token, string userId, string updaterId, string personId, string dateOfService, string locationId, string workCodeID, string startTime, string endTime, string checkHours, string consumerId, string transportationUnits, string transportationReimbursable, string numberOfConsumersPresent, string inComments, string odometerStart, string odometerEnd, string destination, string reason, string latitude, string longitude, string endLatitude, string endLongitude, string deviceType, string evvReason, string attest, string licensePlateNumber, string community)
        {
            return singleEntryWorker.preInsertSingleEntry(token, userId, updaterId, personId, dateOfService, locationId, workCodeID, startTime, endTime, checkHours, consumerId, transportationUnits, transportationReimbursable, numberOfConsumersPresent, inComments, odometerStart, odometerEnd, destination, reason, latitude, longitude, endLatitude, endLongitude, deviceType, evvReason, attest, licensePlateNumber, community);
        }

        public string updateSingleEntry(string token, string userId, string dateOfService, string locationId, string workCodeID, string startTime, string endTime, string checkHours, string consumerId, string transportationUnits, string transportationReimbursable, string numberOfConsumersPresent, string singleEntryId, string inComments, string odometerStart, string odometerEnd, string destination, string reason, string endLatitude, string endLongitude, string deviceType, string evvReason, string attest, string licensePlateNumber, string community, string updateEVVReason)
        {
            return dg.updateSingleEntry(token, userId, dateOfService, locationId, workCodeID, startTime, endTime, checkHours, consumerId, transportationUnits, transportationReimbursable, numberOfConsumersPresent, singleEntryId, inComments, odometerStart, odometerEnd, destination, reason, endLatitude, endLongitude, deviceType, evvReason, attest, licensePlateNumber, community, updateEVVReason);
        }

        public SingleEntryWorker.SingleEntryById[] getSingleEntryByIdJSON(string token, string singleEntryId)
        {
            return singleEntryWorker.getSingleEntryByIdJSON(token, singleEntryId);
        }

        public SingleEntryWorker.SingleEntryByDate[] getSingleEntryByDateJSON(string token, string userId, string startDate, string endDate, string locationId, string statusIn)
        {
            return singleEntryWorker.getSingleEntryByDateJSON(token, userId, startDate, endDate, locationId, statusIn);
        }

        public string deleteSingleEntryRecord(string token, string singleEntryId)
        {
            return dg.deleteSingleEntryRecord(token, singleEntryId);
        }

        public string getSingleEntryRequiredFields(string token)
        {
            return dg.getSingleEntryRequiredFields(token);
        }

        public SingleEntryWorker.WorkCodes[] getWorkCodesJSON(string token, string getAllWorkCodes)
        {
            return singleEntryWorker.getWorkCodesJSON(token, getAllWorkCodes);
        }

        public SingleEntryWorker.SingleEntryPayPeriods[] getSingleEntryPayPeriodsJSON(string token)
        {
            return singleEntryWorker.getSingleEntryPayPeriodsJSON(token);
        }

        public string approveSingleEntryRecord(string token, string singleEntryId)
        {
            return dg.approveSingleEntryRecord(token, singleEntryId);
        }

        public SingleEntryWorker.SingleEntryLocations[] getSingleEntryLocationsJSON(string token)
        {
            return singleEntryWorker.getSingleEntryLocationsJSON(token);
        }

        public SingleEntryWorker.SubEmployeeListAndCountInfo[] getSubEmployeeListAndCountInfoJSON(string token, string supervisorId)
        {
            return singleEntryWorker.getSubEmployeeListAndCountInfoJSON(token, supervisorId);
        }

        public SingleEntryWorker.EmployeeListAndCountInfo[] getEmployeeListAndCountInfoJSON(string token, string supervisorId)
        {
            return singleEntryWorker.getEmployeeListAndCountInfoJSON(token, supervisorId);
        }

        public DashboardWorker.MissingPlanSignaturesObj[] getMissingPlanSignatures(string token)
        {
            return dashWork.getMissingPlanSignatures(token);
        }

        public DashboardWorker.SingleEntryCountObj[] getSingleEntryCountInfoJSON(string token)
        {
            return dashWork.getSingleEntryCountInfoJSON(token);
        }

        public string updateSingleEntryStatus(string token, string singleEntryIdString, string newStatus)
        {
            return dg.updateSingleEntryStatus(token, singleEntryIdString, newStatus);
        }

        public string getRemainingGoalsCountForDashboard(string token)
        {
            return dg.getRemainingGoalsCountForDashboard(token);
        }

        public DashboardWorker.AdminApprovalNumbersObj[] getSingleEntryAdminApprovalNumbersJSON(string token)
        {
            return dashWork.getSingleEntryAdminApprovalNumbersJSON(token);
        }

        public DashboardWorker.SingleEntryLocationObj[] getSingleEntryAdminLocations(string token)
        {
            return dashWork.getSingleEntryAdminLocations(token);
        }


        public string getUserSingleEntryLocationsForPayPeriod(string token, string userId, string startDate, string endDate, string locationID, string status)
        {
            return dg.getUserSingleEntryLocationsForPayPeriod(token, userId, startDate, endDate, locationID, status);
        }

        public string getRequiredSingleEntryFields(string token)
        {
            return dg.getRequiredSingleEntryFields(token);
        }

        public SingleEntryWorker.RequiredSingleEntryFields[] getRequiredSingleEntryFieldsJSON(string token)
        {
            return singleEntryWorker.getRequiredSingleEntryFieldsJSON(token);
        }

        public SingleEntryWorker.SingleEntryEvvReasonCodes[] getSingleEntryEvvReasonCodesJSON(string token)
        {
            return singleEntryWorker.getSingleEntryEvvReasonCodesJSON(token);
        }

        public SingleEntryWorker.SingleEntryEvvEligibility[] getSingleEntryEvvEligibilityJSON(string token, string consumerId, string entryDate)
        {
            return singleEntryWorker.getSingleEntryEvvEligibilityJSON(token, consumerId, entryDate);
        }

        public string getClockedInDayServicesAtLocationCounts(string token, string locationId)
        {
            return dg.getClockedInDayServicesAtLocationCounts(token, locationId);
        }

        public string saveDefaultLocationValue(string token, string switchCase, string locationId)
        {
            return dg.saveDefaultLocationValue(token, switchCase, locationId);
        }

        public string saveDefaultLocationName(string token, string switchCase, string locationName)
        {
            return dg.saveDefaultLocationName(token, switchCase, locationName);
        }

        public DashboardWorker.DSClockedInConsumers[] getClockedInConsumerNamesDayServicesJSON(string token, string locationId)
        {
            return dashWork.getClockedInConsumerNamesDayServicesJSON(token, locationId);
        }

        public DashboardWorker.DSClockedInStaff[] getClockedInStaffNamesDayServicesJSON(string token, string locationId)
        {
            return dashWork.getClockedInStaffNamesDayServicesJSON(token, locationId);
        }

        public string getIntellivueCredentials(string token)
        {
            return dg.getIntellivueCredentials(token);
        }

        public string getIntellivueURL(string token)
        {
            return dg.getIntellivueURL(token);
        }

        public string getIntellivueAppIdURL(string token)
        {
            return dg.getIntellivueAppIdURL(token);
        }

        public string getIntellivueDomain(string token)
        {
            return dg.getIntellivueDomain(token);
        }

        public string getConsumerNumberForIntellivue(string token, string consumerId)
        {
            return dg.getConsumerNumberForIntellivue(token, consumerId);
        }

        //SimpleMar
        public string simpleMarLogin(string token)
        {
            return siu.createSimpleMarLoginURL(token);
        }

        public SingleEntryWorker.SingleEntryUsersByLocation[] getSingleEntryUsersByLocationJSON(string token, string locationId, string seDate)
        {
            return singleEntryWorker.getSingleEntryUsersByLocationJSON(token, locationId, seDate);
        }

        public SingleEntryWorker.seOverlapCheck[] singleEntryOverlapCheckJSON(string token, string dateOfService, string startTime, string endTime, string singleEntryId)
        {
            return singleEntryWorker.singleEntryOverlapCheckJSON(token, dateOfService, startTime, endTime, singleEntryId);
        }

        public DashboardWorker.DashDSLocations[] getDashboardDayServicesLocationsJSON(string token)
        {
            return dashWork.getDashboardDayServicesLocationsJSON(token);
        }

        public DayServicesWorker.CIDropdownStaff[] getCIStaffDropdownJSON(string token, string serviceDate, string locationID)
        {
            return dsWorker.getCIStaffDropdownJSON(token, serviceDate, locationID);
        }

        public DayServicesWorker.BatchedBillingId[] getDSIsLocationBatched(string token, string locationId, string serviceDate)
        {
            return dsWorker.getDSIsLocationBatched(token, locationId, serviceDate);
        }

        public DayServicesWorker.EnabledConsumers[] getDayServiceGetEnabledConsumers(string serviceDate, string locationId)
        {
            return dsWorker.getDayServiceGetEnabledConsumers(serviceDate, locationId);
        }

        public string getExistingCIStaffId(string token, string serviceDate, string locationID, string consumerId, string startTime)
        {
            return dg.getExistingCIStaffId(token, serviceDate, locationID, consumerId, startTime);
        }

        public string updateCIStaff(string token, string serviceDate, string locationID, string consumerId, string startTime, string staffId)
        {
            return dg.updateCIStaff(token, serviceDate, locationID, consumerId, startTime, staffId);
        }

        public string deleteCIStaffId(string token, string serviceDate, string locationID, string consumerId, string startTime)
        {
            return dg.deleteCIStaffId(token, serviceDate, locationID, consumerId, startTime);
        }

        public CaseNotesWorker.ConsumersThatCanHaveMileage[] getConsumersThatCanHaveMileageJSON(string token)
        {
            return caseNotesWorker.getConsumersThatCanHaveMileageJSON(token);
        }

        public string updateVersion(string token, string version)
        {
            return dg.updateVersion(token, version);
        }

        public string getGroupNoteMaxMileage(string token, string groupNoteId)
        {
            return dg.getGroupNoteMaxMileage(token, groupNoteId);
        }

        public string getDocTimeEditPermission(string token, string peopleId)
        {
            return dg.getDocTimeEditPermission(token, peopleId);
        }

        public string clearTravelTimeOnChange(string token, string noteId)
        {
            return dg.clearTravelTimeOnChange(token, noteId);
        }


        public SingleEntryWorker.SEFilteredListResults[] singleEntryFilterAdminListJSON(string token, string startDate, string endDate, string supervisorId, string locationId, string employeeId, string status, string workCodeId)
        {
            return singleEntryWorker.singleEntryFilterAdminListJSON(token, startDate, endDate, supervisorId, locationId, employeeId, status, workCodeId);
        }

        public SingleEntryWorker.SingleEntrySupervisors[] getSingleEntrySupervisorsJSON(string token)
        {
            return singleEntryWorker.getSingleEntrySupervisorsJSON(token);
        }

        public SingleEntryWorker.SingleEntryConsumersPresent[] getSingleEntryConsumersPresentJSON(string token, string singleEntryId)
        {
            return singleEntryWorker.getSingleEntryConsumersPresentJSON(token, singleEntryId);
        }

        public OutcomesWorker.CommunityIntegrationLevel[] getGoalsCommunityIntegrationLevelJSON(string token)
        {
            return outcomesWorker.getGoalsCommunityIntegrationLevelJSON(token);
        }

        //New
        public OutcomesWorker.ConsumerGoalsData[] getGoalsByDateNew(string consumerId, string goalDate)
        {
            return outcomesWorker.getGoalsByDateNew(consumerId, goalDate);
        }

        //New
        public OutcomesWorker.ObjectiveActivityData[] getObjectiveActivity(string objectiveActivityId)
        {
            return outcomesWorker.getObjectiveActivity(objectiveActivityId);
        }

        //New
        public OutcomesWorker.PrimaryAndSecondaryLocationData[] getOutcomesPrimaryAndSecondaryLocations(string consumerId, string goalDate)
        {
            return outcomesWorker.getOutcomesPrimaryAndSecondaryLocations(consumerId, goalDate);
        }

        //New
        public OutcomesWorker.PromptsData[] getOutcomesPrompts()
        {
            return outcomesWorker.getOutcomesPrompts();
        }

        //New
        public OutcomesWorker.SuccessTypeData[] getOutcomesSuccessTypes(string goalTypeId)
        {
            return outcomesWorker.getOutcomesSuccessTypes(goalTypeId);
        }

        public SingleEntryWorker.AdminSELocations[] getAdminSingleEntryLocationsJSON(string token)
        {
            return singleEntryWorker.getAdminSingleEntryLocationsJSON(token);
        }


        public string adminUpdateSingleEntryStatus(string token, string singleEntryIdString, string newStatus, string userID, string rejectionReason)
        {
            return singleEntryWorker.adminUpdateSingleEntryStatus(token, singleEntryIdString, newStatus, userID, rejectionReason);
        }

        public string changeFromPSI(string token, string userID)
        {
            return anywhereWorker.changeFromPSI(token, userID);
        }

        //Infal timeclock below
        public string ValidateLogin(string id)
        {
            return infalWorker.ValidateLogin(id);
        }

        public string InfalGetJobs(string id)
        {
            return infalWorker.InfalGetJobs(id);
        }

        public string InfalGetClockInsAndOuts(string id)
        {
            return infalWorker.InfalGetClockInsAndOuts(id);
        }

        public string InfalClockIn(string empIdString, string jobIdString, string latInString, string longInString, string inDate, string StartTime, string StartAMPM)
        {
            return infalWorker.InfalClockIn(empIdString, jobIdString, latInString, longInString, inDate, StartTime, StartAMPM);
        }

        public string InfalClockOut(string empIdString, string jobIdString, string recIdString, string latOutString, string longOutString, string outDate, string EndTime, string EndTimeAMPM, string Memo)
        {
            return infalWorker.InfalClockOut(empIdString, jobIdString, recIdString, latOutString, longOutString, outDate, EndTime, EndTimeAMPM, Memo);
        }

        public string getInfalUserName(string empId)
        {
            return infalWorker.getInfalUserName(empId);
        }

        public string getInfalLoginCredentials(string token)
        {
            return dg.getInfalLoginCredentials(token);
        }

        public string getDateToCheckShowCI(string token)
        {
            return dg.getDateToCheckShowCI(token);
        }

        public OutcomesWorker.CIRequired[] getGoalsCommunityIntegrationRequiredJSON(string token)
        {
            return outcomesWorker.getGoalsCommunityIntegrationRequiredJSON(token);
        }

        public string CheckInfalConnection()
        {
            return infalWorker.CheckInfalConnection();
        }

        public string deleteConsumerNote(string token, string noteId)
        {
            return dg.deleteConsumerNote(token, noteId);
        }

        public string insertConsumerNote(string token, string consumerId, string noteTitle, string note, string locationId, string hideNote)
        {
            return dg.insertConsumerNote(token, consumerId, noteTitle, note, locationId, hideNote);
        }

        public string updateConsumerNoteDateRead(string token, string noteId)
        {
            return dg.updateConsumerNoteDateRead(token, noteId);
        }

        public string selectConsumerNote(string token, string noteId)
        {
            return dg.selectConsumerNote(token, noteId);
        }

        public string updateConsumerNotesDaysBack(string token, string updatedReviewDays)
        {
            return dg.updateConsumerNotesDaysBack(token, updatedReviewDays);
        }

        public string updateConsumerNotesChecklistDaysBack(string token, string updatedChecklistDays)
        {
            return dg.updateConsumerNotesChecklistDaysBack(token, updatedChecklistDays);
        }

        public string updateLocationNoteDateRead(string token, string noteId)
        {
            return dg.updateLocationNoteDateRead(token, noteId);
        }

        public string insertLocationNote(string token, string noteTitle, string note, string locationId)
        {
            return dg.insertLocationNote(token, noteTitle, note, locationId);
        }

        public string deleteLocationNote(string token, string noteId)
        {
            return dg.deleteLocationNote(token, noteId);
        }

        public string selectAllUsersConsumersNotes(string token)
        {
            return dg.selectAllUsersConsumersNotes(token);
        }

        public string selectAllUsersLocationNotes(string token, string daysBackDate)
        {
            return dg.selectAllUsersLocationNotes(token, daysBackDate);
        }

        public string selectNotesByConsumerAndLocation(string token, string consumerId, string locationId)
        {
            return dg.selectNotesByConsumerAndLocation(token, consumerId, locationId);
        }

        public string selectNotesByLocation(string token, string locationId, string daysBackDate)
        {
            return dg.selectNotesByLocation(token, locationId, daysBackDate);
        }

        public string selectNotesByLocationAndPermission(string token, string locationId, string daysBackDate)
        {
            return dg.selectNotesByLocationAndPermission(token, locationId, daysBackDate);
        }

        public string selectLocationNote(string token, string noteId)
        {
            return dg.selectLocationNote(token, noteId);
        }

        public string updateConsumerNote(string token, string noteId, string consumerId, string note)
        {
            return dg.updateConsumerNote(token, noteId, consumerId, note);
        }

        public string updateHideNote(string token, string noteId, string consumerId, string hideNote)
        {
            return dg.updateHideNote(token, noteId, consumerId, hideNote);
        }

        public string updateLocationNote(string token, string noteId, string locationId, string note)
        {
            return dg.updateLocationNote(token, noteId, locationId, note);
        }

        public string getLocationsWithUnreadNotes(string token, string daysBackDate)
        {
            return dg.getLocationsWithUnreadNotes(token, daysBackDate);
        }

        public string getLocationsWithUnreadNotesAndPermission(string token, string daysBackDate)
        {
            return dg.getLocationsWithUnreadNotesAndPermission(token, daysBackDate);
        }

        public string getConsumersWithUnreadNotesByEmployeeAndLocation(string token, string locationId)
        {
            return dg.getConsumersWithUnreadNotesByEmployeeAndLocation(token, locationId);
        }

        public string getConsumersWithUnreadNotesByEmployeeAndLocationPermission(string token, string locationId, string daysBackDate)
        {
            return dg.getConsumersWithUnreadNotesByEmployeeAndLocationPermission(token, locationId, daysBackDate);
        }

        public string checkIfLocationHasUnreadNotes(string token, string locationId, string daysBackDate)
        {
            return dg.checkIfLocationHasUnreadNotes(token, locationId, daysBackDate);
        }

        public string deleteAbsent(string token, string absentId)
        {
            return dg.deleteAbsent(token, absentId);
        }

        public string selectAbsent(string token, string consumerId, string locationId, string statusDate)
        {
            return dg.selectAbsent(token, consumerId, locationId, statusDate);
        }

        public string selectAbsentNotificationTypes(string token)
        {
            return dg.selectAbsentNotificationTypes(token);
        }

        public string selectAbsentReasons(string token)
        {
            return dg.selectAbsentReasons(token);
        }

        public string oneLocationAbsentTableSave(string token, string absentReasonId, string absentNotificationId, string consumerIdString, string absenceDate, string locationId, string reportedBy, string timeReported, string dateReported)
        {
            return anyAbsentWorker.OneLocationAbsentSave(token, absentReasonId, absentNotificationId, consumerIdString, absenceDate, locationId, reportedBy, timeReported, dateReported);
        }

        public List<String> absentPreSave(string token, string consumerIdString, string absentDate, string locationId)
        {
            return anyAbsentWorker.AbsentPreSave(token, consumerIdString, absentDate, locationId);
        }

        public string allLocationSaveAbsent(string token, string absentReasonId, string absentNotificationId, string consumerIdString, string absenceDate, string reportedBy, string timeReported, string dateReported)
        {
            return anyAbsentWorker.AllLocationSaveAbsent(token, absentReasonId, absentNotificationId, consumerIdString, absenceDate, reportedBy, timeReported, dateReported);
        }

        public string getConsumersByLocationAbsent(string token, string absenceDate, string locationId)
        {
            return dg.getConsumersByLocationAbsent(token, absenceDate, locationId);
        }

        public string testCaraSolva()
        {
            return anywhereCaraSolvaWorker.Main();
        }

        public string CaraSolvaURL(string token)
        {
            return anywhereCaraSolvaWorker.Main(token);
        }

        public void CaraSolvaSignIn(System.IO.Stream testInput)
        {
            string token;

            StreamReader reader = new StreamReader(testInput);
            string fullInput = reader.ReadToEnd();
            token = System.Text.RegularExpressions.Regex.Split(System.Text.RegularExpressions.Regex.Split(fullInput, "&")[0], "=")[1];

            var current = System.Web.HttpContext.Current;
            var response = current.Response;


            string URL = anywhereCaraSolvaWorker.Main(token);

            response.ClearContent();
            response.Redirect(URL, true);
            response.Close();
            System.Web.HttpContext.Current.ApplicationInstance.CompleteRequest();
        }

        public AnywhereWorker.DaysAndHours[] getCompanyWorkWeekAndHours(string token)
        {
            return anywhereWorker.GetDatesAndHoursWorked(token);
        }

        public AnywhereWorker.WorkWeek getWorkWeeks(string token)
        {
            return anywhereWorker.GetWorkWeeks(token);
        }

        public AnywhereWorker.SchedulingPeriods[] getSchedulingPeriods(string token)
        {
            return anywhereWorker.GetSchedulingPeriods(token);
        }

        public AnywhereWorker.SchedulingData[] getSchedulingPeriodsDetails(string token, string startDate, string endDate)
        {
            return anywhereWorker.getSchedulingPeriodsDetails(token, startDate, endDate);
        }

        public SingleEntryWorker.SingleEntryUsersWC[] getSingleEntryUsersWCJSON(string token, string seDate)
        {
            return singleEntryWorker.getSingleEntryUsersWCJSON(token, seDate);
        }

        public RosterWorker.CheckForIndividualAbsent[] checkForIndividualAbsentJSON(string token, string locationId, string consumerId, string checkDate)
        {
            return rosterWorker.checkForIndividualAbsentJSON(token, locationId, consumerId, checkDate);
        }

        public OutcomesWorker.OutcomeTypeForFilter[] getOutcomeTypeForFilterJSON(string token, string selectedDate, string consumerId)
        {
            return outcomesWorker.getOutcomeTypeForFilterJSON(token, selectedDate, consumerId);
        }

        public AnywhereWorker.UserOptionList[] getPSIUserOptionListJSON(string token)
        {
            return anywhereWorker.getPSIUserOptionListJSON(token);
        }

        public AnywhereAttachmentWorker.Attachments[] getAllAttachments(string token, string consumerId)
        {
            return anywhereAttachmentWorker.GetAllAttachments(token, consumerId);
        }

        public AnywhereWorkshopWorkerTwo.BatchID[] WorkshopPreBatchLoad(string token, string absenseDate)
        {
            return anywhereWorkshopWorkerTwo.PreBatchLoad(token, absenseDate);
        }

        public AnywhereWorkshopWorkerTwo.Location[] WorkshopLocations(string token, string serviceDate)
        {
            return anywhereWorkshopWorkerTwo.GetLocations(token, serviceDate);
        }

        public string getEnabledConsumersForWorkshop(string token, string selectedDate, string selectedLocation)
        {
            return dg.getEnabledConsumersForWorkshop(token, selectedDate, selectedLocation);
        }

        public AnywhereWorkshopWorkerTwo.Supervisor[] getWorkshopSupervisors(string token, string selectedDate)
        {
            return anywhereWorkshopWorkerTwo.GetSupervisors(token, selectedDate);
        }

        public AnywhereWorkshopWorkerTwo.JobCode[] getWorkshopJobCode(string token, string selectedDate, string location)
        {
            return anywhereWorkshopWorkerTwo.getWorkshopJobCode(token, selectedDate, location);
        }

        public AnywhereWorkshopWorkerTwo.GridData[] getWorkshopFilterListData(string token, string selectedDate, string consumerIds, string locationId, string jobStepId, string application, string batchId)
        {
            return anywhereWorkshopWorkerTwo.getWorkshopFilterListData(token, selectedDate, consumerIds, locationId, jobStepId, application, batchId);
        }

        public List<string> GetWorkshopOverlaps(string token, string selectedDate, string jobString, string jobStepId, string jobActType, string location, string supervisor, string time, string batchId, string consumerids, string startOrEnd)
        {
            return anywhereWorkshopWorkerTwo.GetWorkshopOverlaps(token, selectedDate, jobString, jobStepId, jobActType, location, supervisor, time, batchId, consumerids, startOrEnd);
        }

        public string WorkshopClockOut(string token, string consumerIds, string time, string supervisorId, string selectedDate, string jobStepId)
        {
            return anywhereWorkshopWorkerTwo.WorkshopClockOut(token, consumerIds, time, supervisorId, selectedDate, jobStepId);
        }

        public string UpdateWorkshopClockIn(string token, string jobActivityId, string timeEntered)
        {
            return anywhereWorkshopWorkerTwo.UpdateWorkshopClockIn(token, jobActivityId, timeEntered);
        }

        public string ClockoutWorkshopSingle(string token, string jobActivityId, string timeEntered)
        {
            return anywhereWorkshopWorkerTwo.ClockoutWorkshopSingle(token, jobActivityId, timeEntered);
        }

        public string DeleteWorkshopEntry(string token, string jobActivityId)
        {
            return anywhereWorkshopWorkerTwo.DeleteWorkshopEntry(token, jobActivityId);
        }

        public string UpdateWorkshopQuantity(string token, string quantity, string jobActivityId)
        {
            return anywhereWorkshopWorkerTwo.UpdateWorkshopQuantity(token, quantity, jobActivityId);
        }

        public AnywhereWorker.Location[] getConsumerScheduleLocation(string token, string consumerId)
        {
            return anywhereWorker.getConsumerScheduleLocation(token, consumerId);
        }

        public AnywhereWorker.ConsumerSchedule[] populateConsumerSchedule(string token, string locationId, string consumerId)
        {
            return anywhereWorker.populateConsumerSchedule(token, locationId, consumerId);
        }

        public AnywhereWorker.RemainingServiceWidgetData[] remainingServicesWidgetFilter(string token, string outcomeType, string locationId, string group, string checkDate)
        {
            return anywhereWorker.remainingServicesWidgetFilter(token, outcomeType, locationId, group, checkDate);
        }

        public AnywhereWorker.OutcomeTypesRemainingServiceWidgetData[] populateOutcomeTypesRemainingServicesWidgetFilter(string token)
        {
            return anywhereWorker.populateOutcomeTypesRemainingServicesWidgetFilter(token);
        }

        public AnywhereWorker.LocationsRemainingServiceWidgetData[] populateLocationsRemainingServicesWidgetFilter(string token)
        {
            return anywhereWorker.populateLocationsRemainingServicesWidgetFilter(token);
        }

        public AnywhereWorker.GroupsRemainingServiceWidgetData[] populateGroupsRemainingServicesWidgetFilter(string token, string locationId)
        {
            return anywhereWorker.populateGroupsRemainingServicesWidgetFilter(token, locationId);
        }
        //Start of incident tracking
        public IncidentTrackingWorker.InvolvementTypeData[] getITInvolvementTypeData(string token)
        {
            return iTW.GetITInvolvementTypeData(token);
        }

        public IncidentTrackingWorker.IncidentCategories[] getITIncidentCategories(string token)
        {
            return iTW.GetITIncidentCategories(token);
        }

        public IncidentTrackingWorker.IncidentLocationDetail[] getITIncidentLocationDetail(string token)
        {
            return iTW.GetITIncidentLocationDetail(token);
        }

        public IncidentTrackingWorker.IncidentTrackingConsumerServiceLocations[] getITConsumerServiceLocations(string token, string consumerId)
        {
            return iTW.GetITConsumerServiceLocations(token, consumerId);
        }

        public IncidentTrackingWorker.IncidentWidgetData[] getITDashboardWidgetData(string token, string viewCaseLoad)
        {
            return iTW.GetITDashboardWidgetData(token, viewCaseLoad);
        }

        public IncidentTrackingWorker.IncidentTrackingReviewTableData[] getITReviewTableData(string token, string locationId, string consumerId, string employeeId, string supervisorId, string subcategoryId, string fromDate, string toDate, string viewCaseLoad)
        {
            return iTW.GetITReviewTableData(token, locationId, consumerId, employeeId, supervisorId, subcategoryId, fromDate, toDate, viewCaseLoad);
        }

        public string updateIncidentTrackingDaysBack(string token, string updatedReviewDays)
        {
            return dg.updateIncidentTrackingDaysBack(token, updatedReviewDays);
        }

        public string sendITNotification(string token, string notificationType, string employeeId, string incidentTypeDesc, string incidentDate, string incidentTime, string subcategoryId)
        {
            return iTW.SendITNotification(token, notificationType, employeeId, incidentTypeDesc, incidentDate, incidentTime, subcategoryId);
        }

        public IncidentTrackingWorker.IncidentTrackingReviewLocations[] getLocationsIncidentTrackingReviewPage(string token)
        {
            return iTW.GetLocationsIncidentTrackingReviewPage(token);
        }

        public IncidentTrackingWorker.EmployeesInvolvedEmployeeDropdown[] getEmployeesInvolvedEmployeeDropdown(string token)
        {
            return iTW.GetEmployeesInvolvedEmployeeDropdown(token);
        }

        public IncidentTrackingWorker.IncidentEditReviewDataAllObjects getIncidentEditReviewDataAllObjects(string token, string incidentId)
        {
            return iTW.GetIncidentEditReviewDataAllObjects(token, incidentId);
        }

        public List<string> saveUpdateITIncident(string token, string incidentTypeId, string incidentDate, string incidentTime, string reportedDate, string incidentTypeDesc,
                                    string reportedTime, string subcategoryId, string locationDetailId, string serviceLocationId, string summary, string note, string prevention, string contributingFactor,//end of main table data
                                    string consumerIdString, string includeInCount, string involvementId, string consumerIncidentLocationIdString, string consumerInvolvedIdString, //end of consumers
                                    string employeeIdString, string notifyEmployeeString, string employeeInvolvementIdString, //end of employees
                                    string othersInvolvedNameString, string othersInvolvedCompanyString, string othersInvolvedAddress1String, string othersInvolvedAddress2String, string othersInvolvedCityString, string othersInvolvedStateString,
                                    string othersInvolvedZipCodeString, string othersInvolvedPhoneString, string othersInvolvedInvolvementTypeIdString, string othersInvolvedInvolvementDescriptionString, string updateIncidentId, string saveUpdate)
        {
            return iTW.SaveUpdateITIncident(token, incidentTypeId, incidentDate, incidentTime, reportedDate, incidentTypeDesc,
                                    reportedTime, subcategoryId, locationDetailId, serviceLocationId, summary, note, prevention, contributingFactor,//end of main table data
                                    consumerIdString, includeInCount, involvementId, consumerIncidentLocationIdString, consumerInvolvedIdString, //end of consumers
                                    employeeIdString, notifyEmployeeString, employeeInvolvementIdString,//end of employees
                                    othersInvolvedNameString, othersInvolvedCompanyString, othersInvolvedAddress1String, othersInvolvedAddress2String, othersInvolvedCityString, othersInvolvedStateString,
                                    othersInvolvedZipCodeString, othersInvolvedPhoneString, othersInvolvedInvolvementTypeIdString, othersInvolvedInvolvementDescriptionString, updateIncidentId, saveUpdate);
        }

        public string getITReviewPageEmployeeListAndSubList(string token, string supervisorId)
        {
            return iTW.GetITReviewPageEmployeeListAndSubList(token, supervisorId);
        }

        public string deleteAnywhereITIncident(string token, string incidentId)
        {
            return dg.deleteAnywhereITIncident(token, incidentId);
        }

        public IncidentTrackingWorker.ReportScheduleId[] generateIncidentTrackingReport(string token, string incidentId)
        {
            return iTW.generateIncidentTrackingReport(token, incidentId);
        }

        public string checkIfITReportExists(string token, string reportScheduleId)
        {
            return iTW.checkIfITReportExists(token, reportScheduleId);
        }

        public string sendIncidentTrackingReport(string token, string reportScheduleId, string toAddresses, string ccAddresses, string bccAddresses, string emailSubject, string emailBody)
        {
            return iTW.sendIncidentTrackingReport(token, reportScheduleId, toAddresses, ccAddresses, bccAddresses, emailSubject, emailBody);
        }

        //public AnywhereWorker.ConsumerTableLocation[] getConsumerTableConsumerLocation(string token, string consumerId)
        //{
        //    return anywhereWorker.getConsumerTableConsumerLocation(token, consumerId);
        //}

        //Scheduling
        public AnywhereScheduleWorker.AllScheduleData[] getSchedulesForSchedulingModule(string token, string locationId, string personId)
        {
            return anywhereScheduleWorker.getSchedulesForSchedulingModule(token, locationId, personId);
        }

        public AnywhereScheduleWorker.MainLocationDropDownData[] getLocationDropdownForScheduling(string token)
        {
            return anywhereScheduleWorker.getLocationDropdownForScheduling(token);
        }

        public string saveSchedulingCallOffRequest(string token, string shiftId, string personId, string reasonId, string note, string status, string notifiedEmployeeId)
        {
            return anywhereScheduleWorker.saveSchedulingCallOffRequest(token, shiftId, personId, reasonId, note, status, notifiedEmployeeId);
        }

        public string saveOpenShiftRequestScheduling(string token, string shiftId, string personId, string status, string notifiedEmployeeId)
        {
            return anywhereScheduleWorker.saveOpenShiftRequestScheduling(token, shiftId, personId, status, notifiedEmployeeId);
        }

        public string getOverlapStatusforSelectedShift(string token, string shiftId, string personId)
        {
            return anywhereScheduleWorker.getOverlapStatusforSelectedShift(token, shiftId, personId);
        }

        public string getOverlapDataforSelectedShift(string token, string shiftId, string personId)
        {
            return anywhereScheduleWorker.getOverlapDataforSelectedShift(token, shiftId, personId);
        }

        public string cancelRequestOpenShiftScheduling(string token, string requestShiftId)
        {
            return anywhereScheduleWorker.cancelRequestOpenShiftScheduling(token, requestShiftId);
        }

        public string approveDenyOpenShiftRequestScheduling(string token, string requestedShiftId, string decision)
        {
            return anywhereScheduleWorker.approveDenyOpenShiftRequestScheduling(token, requestedShiftId, decision);
        }

        public string approveDenyCallOffRequestScheduling(string token, string callOffShiftId, string decision)
        {
            return anywhereScheduleWorker.approveDenyCallOffRequestScheduling(token, callOffShiftId, decision);
        }

        public string approveDenyDaysOffRequestScheduling(string token, string daysOffIdString, string decision)
        {
            return anywhereScheduleWorker.approveDenyDaysOffRequestScheduling(token, daysOffIdString, decision);
        }

        public AnywhereScheduleWorker.OverlapData[] requestDaysOffScheduling(string token, string personId, string dates, string fromTime, string toTime, string reasonId, string employeeNotifiedId, string status)
        {
            return anywhereScheduleWorker.requestDaysOffScheduling(token, personId, dates, fromTime, toTime, reasonId, employeeNotifiedId, status);
        }

        public AnywhereScheduleWorker.CallOffReasons[] getCallOffDropdownReasons(string token)
        {
            return anywhereScheduleWorker.getCallOffDropdownReasons(token);
        }

        public AnywhereScheduleWorker.CallOffEmployees[] getCallOffDropdownEmployees(string token, string shiftDate, string locationId)
        {
            return anywhereScheduleWorker.getCallOffDropdownEmployees(token, shiftDate, locationId);
        }

        public AnywhereScheduleWorker.CallOffEmployees[] getRequestTimeOffDropdownEmployees(string token)
        {
            return anywhereScheduleWorker.getRequestTimeOffDropdownEmployees(token);
        }

        public AnywhereScheduleWorker.DayOfWeek[] getDayOfWeekSchedule(string token)
        {
            return anywhereScheduleWorker.getDayOfWeekSchedule(token);
        }

        public AnywhereScheduleWorker.ConsumerAppointmentData[] getScheduleApptInformation(string token, string locationId)
        {
            return anywhereScheduleWorker.getScheduleApptInformation(token, locationId);
        }

        public AnywhereScheduleWorker.MyApprovalData[] getScheduleMyApprovalData(string token, string personId)
        {
            return anywhereScheduleWorker.getScheduleMyApprovalData(token, personId);
        }
        //Single entry note and signature
        public string singleEntrySaveSignatureAndNote(string token, string singleEntryId, string consumerId, string note, string signatureImage)
        {
            return singleEntryWorker.singleEntrySaveSignatureAndNote(token, singleEntryId, consumerId, note, signatureImage);
        }
        public string insertConsumerforSavedSingleEntry(string token, string singleEntryId, string consumerId, string deviceType, string evvReason)
        {
            return singleEntryWorker.insertConsumerforSavedSingleEntry(token, singleEntryId, consumerId, deviceType, evvReason);
        }

        public SingleEntryWorker.SignatureAndNote[] getSpecificConsumerSignatureAndNote(string token, string singleEntryId, string consumerId)
        {
            return singleEntryWorker.getSpecificConsumerSignatureAndNote(token, singleEntryId, consumerId);
        }

        public SingleEntryWorker.ConsumerSignaturesAndNotes[] getConsumersSignaturesAndNotes(string token, string singleEntryId)
        {
            return singleEntryWorker.getConsumersSignaturesAndNotes(token, singleEntryId);
        }

        public OutcomesWorker.SuccessSymbolLookup[] getSuccessSymbolLookup(string token)
        {
            return outcomesWorker.getSuccessSymbolLookup(token);
        }

        public CaseNotesWorker.CustomPhrases[] getCustomPhrases(string token, string showAll)
        {
            return caseNotesWorker.getCustomPhrases(token, showAll);
        }

        public string insertCustomPhrase(string token, string shortcut, string phrase, string makePublic)
        {
            return dg.insertCustomPhrase(token, shortcut, phrase, makePublic);
        }

        public string getlocationsWithConsumersWithUnreadNotes(string token, string daysBackDate)
        {
            return dg.getlocationsWithConsumersWithUnreadNotes(token, daysBackDate);
        }

        public IncidentTrackingWorker.InterventionTypesDropdown[] getInterventionTypesDropdown(string token)
        {
            return iTW.getInterventionTypesDropdown(token);
        }

        public IncidentTrackingWorker.ReviewedByDropdown[] getReviewedByDropdown(string token)
        {
            return iTW.getReviewedByDropdown(token);
        }

        public IncidentTrackingWorker.InjuryLocationsDropdown[] getInjuryLocationsDropdown(string token)
        {
            return iTW.getInjuryLocationsDropdown(token);
        }

        public IncidentTrackingWorker.InjuryTypesDropdown[] getInjuryTypesDropdown(string token)
        {
            return iTW.getInjuryTypesDropdown(token);
        }

        public IncidentTrackingWorker.ConsumerFollowUpTypes[] getitConsumerFollowUpTypes(string token)
        {
            return iTW.getitConsumerFollowUpTypes(token);
        }

        public IncidentTrackingWorker.ConsumerBehaviorTypes[] getitConsumerBehaviorTypes(string token)
        {
            return iTW.getitConsumerBehaviorTypes(token);
        }

        public IncidentTrackingWorker.ReportingCategories[] getitReportingCategories(string token)
        {
            return iTW.getitReportingCategories(token);
        }

        public IncidentTrackingWorker.ConsumerInterventions[] getitConsumerInterventions(string token, string consumerId, string incidentId)
        {
            return iTW.getitConsumerInterventions(token, consumerId, incidentId);
        }

        public IncidentTrackingWorker.ConsumerInjuries[] getitConsumerInjuries(string token, string consumerId, string incidentId)
        {
            return iTW.getitConsumerInjuries(token, consumerId, incidentId);
        }

        public IncidentTrackingWorker.ConsumerReviews[] getitConsumerReviews(string token, string consumerId, string incidentId)
        {
            return iTW.getitConsumerReviews(token, consumerId, incidentId);
        }

        public IncidentTrackingWorker.ConsumerFollowUps[] getitConsumerFollowUps(string token, string consumerId, string incidentId)
        {
            return iTW.getitConsumerFollowUps(token, consumerId, incidentId);
        }

        public IncidentTrackingWorker.ConsumerBehaviors[] getitConsumerBehaviors(string token, string consumerId, string incidentId)
        {
            return iTW.getitConsumerBehaviors(token, consumerId, incidentId);
        }

        public IncidentTrackingWorker.ConsumerReporting[] getitConsumerReporting(string token, string consumerId, string incidentId)
        {
            return iTW.getitConsumerReporting(token, consumerId, incidentId);
        }

        //Incident Tracking Consumer Follow Up specific alters
        public string itDeleteConsumerFollowUp(string token, string itConsumerFollowUpId)
        {
            return iTW.itDeleteConsumerFollowUp(token, itConsumerFollowUpId);
        }

        public string saveUpdateITConsumerFollowUp(string token, List<String> consumerFollowUpIdArray, string consumerInvolvedId, List<String> followUpTypeIdArray, List<String> personResponsibleArray,
                                                    List<String> dueDateArray, List<String> completedDateArray, List<String> notesArray)
        {
            return iTW.saveUpdateITConsumerFollowUp(token, consumerFollowUpIdArray, consumerInvolvedId, followUpTypeIdArray, personResponsibleArray,
                                                     dueDateArray, completedDateArray, notesArray);
        }

        //Incident Tracking Consumer Behavior specific alters
        public string itDeleteConsumerBehavior(string token, string itConsumerBehaviorId)
        {
            return iTW.itDeleteConsumerBehavior(token, itConsumerBehaviorId);
        }

        public string saveUpdateITConsumerBehavior(string token, List<String> consumerBehaviorIdArray, string consumerInvolvedId, List<String> behaviorTypeIdArray, List<String> startTimeArray, List<String> endTimeArray, List<String> occurrencesArray)
        {
            return iTW.saveUpdateITConsumerBehavior(token, consumerBehaviorIdArray, consumerInvolvedId, behaviorTypeIdArray, startTimeArray, endTimeArray, occurrencesArray);
        }

        //Incident Tracking Consumer Reporting specific alters
        public string itDeleteConsumerReporting(string token, string itConsumerReportingId)
        {
            return iTW.itDeleteConsumerReporting(token, itConsumerReportingId);
        }

        public string saveUpdateITConsumerReporting(string token, List<String> consumerReportIdArray, string consumerInvolvedId, List<String> reportDateArray, List<String> reportTimeArray,
                                                                    List<String> reportingCategoryIdArray, List<String> reportToArray, List<String> reportByArray,
                                                                    List<String> reportMethodArray, List<String> notesArray)
        {
            return iTW.saveUpdateITConsumerReporting(token, consumerReportIdArray, consumerInvolvedId, reportDateArray, reportTimeArray, reportingCategoryIdArray, reportToArray,
                                                        reportByArray, reportMethodArray, notesArray);
        }

        //Incident Tracking Consumer Reviews specific alters
        public string itDeleteConsumerReviews(string token, string itConsumerReviewId)
        {
            return iTW.itDeleteConsumerReviews(token, itConsumerReviewId);
        }

        public string saveUpdateITConsumerReviews(string token, List<String> itConsumerReviewIdArray, string consumerInvolvedId, List<String> reviewedByArray, List<String> reviewedDateArray, List<String> noteArray)
        {
            return iTW.saveUpdateITConsumerReviews(token, itConsumerReviewIdArray, consumerInvolvedId, reviewedByArray, reviewedDateArray, noteArray);
        }

        // NEW - Incident Tracking Update Incident View By User
        public string updateIncidentViewByUser(string token, string incidentId, string userId)
        {
            return iTW.updateIncidentViewByUser(token, incidentId, userId);
        }

        //Incident Tracking Consumer Injuries specific alters
        public string itDeleteConsumerInjuries(string token, string itConsumerInjuryId)
        {
            return iTW.itDeleteConsumerInjuries(token, itConsumerInjuryId);
        }

        //Incident Tracking Consumer Interventions specific alters
        public string itDeleteConsumerInterventions(string token, string itConsumerInterventionId)
        {
            return iTW.itDeleteConsumerInterventions(token, itConsumerInterventionId);
        }

        public string saveUpdateITConsumerInjuries(string token, List<String> checkedByNurseArray, List<String> checkedDateArray, List<String> detailsArray, List<String> itConsumerInjuryIdArray,
                                                                    string consumerInvolvedId, List<String> itInjuryLocationIdArray, List<String> itInjuryTypeIdArray, List<String> treatmentArray)
        {
            return iTW.saveUpdateITConsumerInjuries(token, checkedByNurseArray, checkedDateArray, detailsArray, itConsumerInjuryIdArray, consumerInvolvedId, itInjuryLocationIdArray, itInjuryTypeIdArray, treatmentArray);
        }

        public string saveUpdateITConsumerInterventions(string token, List<String> aversiveArray, List<String> itConsumerInterventionIdArray, string consumerInvolvedId, List<String> itConsumerInterventionTypeIdArray,
                                                        List<String> notesArray, List<String> startTimeArray, List<String> stopTimeArray, List<String> timeLengthArray)
        {
            return iTW.saveUpdateITConsumerInterventions(token, aversiveArray, itConsumerInterventionIdArray, consumerInvolvedId, itConsumerInterventionTypeIdArray,
                                                            notesArray, startTimeArray, stopTimeArray, timeLengthArray);
        }

        #region PLAN MODULE
        public AnywherePlanWorker.ConsumerPlans[] getConsumerPlans(string token, string consumerId)
        {
            return aPW.getConsumerPlans(token, consumerId);
        }

        public AnywhereAssessmentWorker.AuthorizationPageData[] authorizationGetPageData(string token)
        {
            return aAW.authorizationGetPageData(token);
        }

        public AnywherePlanWorker.AddAttachment[] addPlanAttachment(string token, long assessmentId, string description, string attachmentType, string attachment, string section, long questionId)
        {
            return aPW.addPlanAttachment(token, assessmentId, description, attachmentType, attachment, section, questionId);
        }

        public string updatePlanSectionApplicable(string token, long planId, long sectionId, string applicable)
        {
            return aPW.updatePlanSectionApplicable(token, planId, sectionId, applicable);
        }

        public string deletePlanAttachment(string token, long planId, string attachmentId)
        {
            return pdg.deletePlanAttachment(token, planId, attachmentId);
        }

        public AnywherePlanWorker.AttachmentList[] getPlanAttachmentsList(string token, long planId, string section)
        {
            return aPW.getPlanAttachmentsList(token, planId, section);
        }

        public AssessmentWorker.ConsumerAssessment[] getConsumerAssessment(string token, string consumerPlanId)
        {
            return pAW.getConsumerAssessment(token, consumerPlanId);
        }

        public AssessmentWorker.ConsumerRelationships[] getConsumerRelationships(string token, string consumerId, string effectiveStartDate, string effectiveEndDate, string areInSalesForce, string planId)
        {
            return pAW.getConsumerRelationships(token, consumerId, effectiveStartDate, effectiveEndDate, areInSalesForce, planId);
        }

        public AssessmentWorker.ConsumerNameInfo[] getConsumerNameInfo(string token, string consumerId)
        {
            return pAW.getConsumerNameInfo(token, consumerId);
        }

        public AssessmentWorker.AssessmentAnswer[] insertAssessmentGridRowAnswers(string token, string consumerPlanId, string assessmentQuestionSetId)
        {
            return pAW.insertAssessmentGridRowAnswers(token, consumerPlanId, assessmentQuestionSetId);
        }

        public AnywhereAssessmentWorker.ServiceAndsSupportData getServiceAndSupportsData(string token, string effectiveStartDate, string effectiveEndDate, long consumerId, string areInSalesForce, string planId)
        {
            return aAW.getServiceAndSupportsData(token, effectiveStartDate, effectiveEndDate, consumerId, areInSalesForce, planId);
        }

        public AnywhereAssessmentWorker.ServiceVendors[] getPaidSupportsVendors(string fundingSourceName, string serviceName, string areInSalesForce)
        {
            return aAW.getPaidSupportsVendors(fundingSourceName, serviceName, areInSalesForce);
        }

        public AnywhereAssessmentWorker.ActiveVendors[] getAllActiveVendors(string token)
        {
            return aAW.getAllActiveVendors(token);
        }


        public string insertPlanReportToBeTranferredToONET(string token, string report, long planId)
        {
            // insert the annaul consumer plan and assessment
            return aAW.insertPlanReportToBeTranferredToONET(token, report, planId);
        }

        public string transferPlanReportToONET(string token, long planId)
        {
            // insert the annaul consumer plan and assessment
            return aAW.transferPlanReportToONET(token, planId);
        }

        public string insertConsumerAssessmentAnswer(string consumerPlanId, string questionId, string answerRow, string answer, string skipped)
        {
            return assDG.insertConsumerAssessmentAnswer(consumerPlanId, questionId, answerRow, answer, skipped);
        }

        public string runReOrderSQL(string token)
        {
            return assDG.runReOrderSQL(token);
        }

        public string downloadPlanFromSalesforce(string token, string consumerId, string userId)
        {
            return aAW.downloadPlanFromSalesforce(token, consumerId, userId);
        }

        public string insertConsumerPlanAnnual(string token, string consumerId, string planYearStart, string reviewDate, string salesForceCaseManagerId)
        {
            // insert the annaul consumer plan and assessment
            return aPW.insertConsumerPlanAnnual(token, consumerId, planYearStart, reviewDate, salesForceCaseManagerId);
        }

        public string switchPlanType(string token, string consumerPlanId, string planType, string revisionNumber, string planYearStart, string planYearEnd, string effectiveStartDate, string effectiveEndDate, string reviewDate, string prevPlanId)
        {
            return aAW.switchPlanType(token, consumerPlanId, planType, revisionNumber, planYearStart, planYearEnd, effectiveStartDate, effectiveEndDate, reviewDate, prevPlanId);
        }

        public int updateConsumerNameInfo(string token, string consumerId, string firstName, string lastName, string middleName, string nickName)
        {
            // insert the annaul consumer plan and assessment
            return pAW.updateConsumerNameInfo(token, consumerId, firstName, lastName, middleName, nickName);
        }

        public string insertConsumerPlanRevision(string token, string priorConsumerPlanId, string effectiveStart, string effectiveEnd, string reviewDate, Boolean useLatestAssessmentVersion, string salesForceCaseManagerId)
        {
            // insert the revised consumer plan and assessment
            return aPW.insertConsumerPlanRevision(token, priorConsumerPlanId, effectiveStart, effectiveEnd, reviewDate, useLatestAssessmentVersion, salesForceCaseManagerId);
        }

        public int updateAssessmentAnswers(string token, AssessmentWorker.AssessmentAnswer[] answers)
        {
            return pAW.updateAssessmentAnswers(token, answers);
        }

        public int updateConsumerPlanReactivate(string token, string consumerPlanId)
        {
            return aPW.updateConsumerPlanReactivate(token, consumerPlanId);
        }

        public string updateConsumerPlanReviewDate(string token, string reviewDate, long planId)
        {
            return aPW.updateConsumerPlanReviewDate(token, reviewDate, planId);
        }

        public int updateConsumerPlanSetAnnualDates(string token, string consumerPlanId, string newPlanYearStart)
        {
            return aPW.updateConsumerPlanSetAnnualDates(token, consumerPlanId, newPlanYearStart);
        }

        public int updateConsumerPlanSetRevisionEffectiveDates(string token, string consumerPlanId, string newEffectiveStart, string newEffectiveEnd)
        {
            return aPW.updateConsumerPlanSetRevisionEffectiveDates(token, consumerPlanId, newEffectiveStart, newEffectiveEnd);
        }

        public int updateConsumerPlanSetStatus(string token, string consumerPlanId, string status)
        {
            return aPW.updateConsumerPlanSetStatus(token, consumerPlanId, status);
        }

        public string deleteAssessmentGridRowAnswers(string token, string consumerPlanId, string assessmentQuestionSetId, string[] rowsToDelete)
        {
            return pAW.deleteAssessmentGridRowAnswers(token, consumerPlanId, assessmentQuestionSetId, rowsToDelete);
        }

        public string deleteConsumerPlan(string token, string consumerPlanId)
        {
            return aPW.deleteConsumerPlan(token, consumerPlanId);
        }
        public RosterWorker.ConsumerPlanYearInfo getConsumerPlanYearInfo(string token, string consumerId)
        {
            return rosterWorker.getConsumerPlanYearInfo(token, consumerId);
        }
        #endregion

        #region WORKFLOW MODULE
        public string deleteWorkflowStep(string token, string stepId)
        {
            return wfw.deleteWorkflowStep(token, stepId);
        }
        public string deleteWorkflowStepDocument(string token, string documentId)
        {
            return wfw.deleteWorkflowStepDocument(token, documentId);
        }

        public string deleteWorkflow(string token, string workflowId)
        {
            return wfw.deleteWorkflow(token, workflowId);
        }

        public WorkflowWorker.PeopleName[] getPeopleNames(string token, string peopleId, string TypeId)
        {
            return wfw.getPeopleNames(token, peopleId, TypeId);
        }

        public WorkflowWorker.ResponsiblePartyRelationship[] getWFResponsiblePartyRelationships(string token, string workflowId)
        {
            return wfw.getWFResponsibleParties(token, workflowId);
        }

        public WorkflowWorker.ResponsiblePartyRelationship[] getWFResponsibleParties(string token, string workflowId)
        {
            return wfw.getWFResponsibleParties(token, workflowId);
        }

        public WorkflowWorker.Workflow[] getWFwithMissingResponsibleParties(string token, string workflowIds)
        {
            return wfw.getWFwithMissingResponsibleParties(token, workflowIds);
        }

        public WorkflowWorker.WorkflowStep[] getResponsiblePartyIdforThisEditStep(string token, string stepId)
        {
            return wfw.getResponsiblePartyIdforThisEditStep(token, stepId);
        }

        public WorkflowWorker.ResponsiblePartyClassification[] getResponsiblePartyClassification(string token)
        {
            return wfw.getResponsiblePartyClassification(token);
        }

        public FormWorker.FormTemplate[] getFormTemplates(string token)
        {
            return fw.getFormTemplates(token);
        }

        public FormWorker.FormTemplate[] getUserFormTemplates(string token, string userId, string hasAssignedFormTypes)
        {
            return fw.getUserFormTemplates(token, userId, hasAssignedFormTypes);
        }


        public WorkflowWorker.PlanWorkflowWidgetData[] getPlanWorkflowWidgetData(string token, string responsiblePartyId)
        {
            return wfw.getPlanWorkflowWidgetData(token, responsiblePartyId);
        }
        public WorkflowWorker.WorkflowProcess[] getWorkflowProcesses(string token)
        {
            return wfw.getWorkflowProcesses(token);
        }
        public WorkflowWorker.Workflow[] getWorkflows(string token, string processId, string referenceId)
        {
            return wfw.getWorkflows(token, processId, referenceId);
        }

        public WorkflowWorker.ManualWorkflowList[] getManualWorkflowList(string token, string processId, string planId)
        {
            return wfw.getManualWorkflowList(token, processId, planId);
        }

        public WorkflowWorker.WorkflowTemplateStepDocument[] getWorkFlowFormsfromPreviousPlan(string token, string selectedWFTemplateIds, string previousPlanId)
        {
            return wfw.getWorkFlowFormsfromPreviousPlan(token, selectedWFTemplateIds, previousPlanId);
        }

        public string insertAutomatedWorkflows(string token, string processId, string peopleId, string referenceId, string priorConsumerPlanId)
        {
            return wfw.insertAutomatedWorkflows(token, processId, peopleId, referenceId, priorConsumerPlanId);
        }

        public string isWorkflowAutoCreated(string token, string workflowName)
        {
            return wfw.isWorkflowAutoCreated(token, workflowName);
        }

        public string insertWorkflow(string token, string templateId, string peopleId, string referenceId, string wantedFormAttachmentIds)
        {
            return wfw.insertWorkflow(token, templateId, peopleId, referenceId, wantedFormAttachmentIds);
        }
        public string insertWorkflowStep(string token, WorkflowWorker.WorkflowStep step)
        {
            return wfw.insertWorkflowStep(token, step);
        }
        public WorkflowWorker.DocumentAttachment insertWorkflowStepDocument(string token, string stepId, string docOrder, string description, string attachmentType, string attachment, string documentEdited)
        {
            return wfw.insertWorkflowStepDocument(token, stepId, docOrder, description, attachmentType, attachment, documentEdited);
        }

        public WorkflowWorker.DocumentAttachment updateWorkflowStepDocument(string token, string documentId, string attachmentType, string attachment, string documentEdited)
        {
            return wfw.updateWorkflowStepDocument(token, documentId, attachmentType, attachment, documentEdited);
        }
        public string setWorkflowStatus(string token, string workflowId, string statusId)
        {
            return wfw.setWorkflowStatus(token, workflowId, statusId);
        }
        public string setWorkflowStepDoneDate(string token, string stepId, string doneDate)
        {
            return wfw.setWorkflowStepDoneDate(token, stepId, doneDate);
        }
        public string setWorkflowStepDueDate(string token, string stepId, string dueDate)
        {
            return wfw.setWorkflowStepDueDate(token, stepId, dueDate);
        }
        public string setWorkflowStepDocumentOrder(string token, WorkflowWorker.OrderObject[] orderArray)
        {
            return wfw.setWorkflowStepDocumentOrder(token, orderArray);
        }
        public string setWorkflowStepOrder(string token, WorkflowWorker.OrderObject[] orderArray)
        {
            return wfw.setWorkflowStepOrder(token, orderArray);
        }
        public string updateWorkflowStep(string token, WorkflowWorker.WorkflowStep step)
        {
            return wfw.updateWorkflowStep(token, step);
        }

        public string updateRelationshipResponsiblePartyID(string token, string peopleId, string WFID, string responsiblePartyType)
        {
            return wfw.updateRelationshipResponsiblePartyID(token, peopleId, WFID, responsiblePartyType);
        }

        public string processWorkflowStepEvent(string token, WorkflowWorker.WorkflowEditedStepStatus thisEvent)
        {
            return wfw.processWorkflowStepEvent(token, thisEvent);
        }

        public string copyWorkflowtemplateToRecord(string token, string templateId, string peopleId, string referenceId, string wantedFormAttachmentIds, string priorConsumerPlanId)
        //public string copyWorkflowtemplateToRecord(string token, string templateId, string peopleId, string referenceId)

        {
            return wfw.preInsertWorkflowFromTemplate(token, templateId, peopleId, referenceId, wantedFormAttachmentIds, priorConsumerPlanId);
            // return wfw.preInsertWorkflowFromTemplate(token, templateId, peopleId, referenceId);
        }
        #endregion

        public DashboardWorker.ProductivityWidget[] getDashboardCaseNoteProductivity(string token, string daysBack)
        {
            return dashWork.getDashboardCaseNoteProductivity(token, daysBack);
        }

        public DashboardWorker.RejectedWidget[] getDashboardCaseNotesRejected(string token, string daysBack)
        {
            return dashWork.getDashboardCaseNotesRejected(token, daysBack);
        }

        public DashboardWorker.RejectedWidget[] getDashboardGroupCaseNoteConsumerNames(string token, string groupNoteIds)
        {
            return dashWork.getDashboardGroupCaseNoteConsumerNames(token, groupNoteIds);
        }

        public DashboardWorker.UserWidgetSettings[] getUserWidgetSettings(string token)
        {
            return dashWork.getUserWidgetSettings(token);
        }

        public string updateUserWidgetSettings(string token, string widgetId, string showHide, string widgetConfig)
        {
            return dashWork.updateUserWidgetSettings(token, widgetId, showHide, widgetConfig);
        }

        public void getIndividualAttachment(System.IO.Stream testInput)
        {
            string token;
            string attachmentId;

            StreamReader reader = new StreamReader(testInput);
            string fullInput = reader.ReadToEnd();
            token = System.Text.RegularExpressions.Regex.Split(System.Text.RegularExpressions.Regex.Split(fullInput, "&")[0], "=")[1];
            attachmentId = System.Text.RegularExpressions.Regex.Split(System.Text.RegularExpressions.Regex.Split(fullInput, "&")[1], "=")[1];
            anywhereAttachmentWorker.getIndividualAttachment(token, attachmentId);
        }

        public void getAttachment(System.IO.Stream testInput)
        {
            string token;
            string attachmentId;
            string filename;
            StreamReader reader = new StreamReader(testInput);
            string fullInput = reader.ReadToEnd();
            token = System.Text.RegularExpressions.Regex.Split(System.Text.RegularExpressions.Regex.Split(fullInput, "&")[0], "=")[1];
            attachmentId = System.Text.RegularExpressions.Regex.Split(System.Text.RegularExpressions.Regex.Split(fullInput, "&")[1], "=")[1];
            filename = System.Text.RegularExpressions.Regex.Split(System.Text.RegularExpressions.Regex.Split(fullInput, "&")[2], "=")[1];
            anywhereAttachmentWorker.getAttachment(token, attachmentId, filename);
        }

        public void viewCaseNoteAttachment(System.IO.Stream testInput)
        {
            string token;
            string attachmentId;

            StreamReader reader = new StreamReader(testInput);
            string fullInput = reader.ReadToEnd();
            token = System.Text.RegularExpressions.Regex.Split(System.Text.RegularExpressions.Regex.Split(fullInput, "&")[0], "=")[1];
            attachmentId = System.Text.RegularExpressions.Regex.Split(System.Text.RegularExpressions.Regex.Split(fullInput, "&")[1], "=")[1];
            anywhereAttachmentWorker.viewCaseNoteAttachment(token, attachmentId);
        }

        public void viewWaitingListAttachment(System.IO.Stream testInput)
        {
            string token;
            string attachmentId;

            StreamReader reader = new StreamReader(testInput);
            string fullInput = reader.ReadToEnd();
            token = System.Text.RegularExpressions.Regex.Split(System.Text.RegularExpressions.Regex.Split(fullInput, "&")[0], "=")[1];
            attachmentId = System.Text.RegularExpressions.Regex.Split(System.Text.RegularExpressions.Regex.Split(fullInput, "&")[1], "=")[1];
            anywhereAttachmentWorker.viewWaitingListAttachment(token, attachmentId);
        }

        //public void viewISPReportAndAttachments(string token, string userId, string assessmentID, string versionID, string extraSpace, bool isp)
        //{
        //    dpra.viewISPReportAndAttachments(token, userId, assessmentID, versionID, extraSpace, isp);
        //}

        public void viewPlanAttachment(System.IO.Stream testInput)
        {
            string token;
            string attachmentId;
            string section;

            StreamReader reader = new StreamReader(testInput);
            string fullInput = reader.ReadToEnd();
            token = System.Text.RegularExpressions.Regex.Split(System.Text.RegularExpressions.Regex.Split(fullInput, "&")[0], "=")[1];
            attachmentId = System.Text.RegularExpressions.Regex.Split(System.Text.RegularExpressions.Regex.Split(fullInput, "&")[1], "=")[1];
            section = System.Text.RegularExpressions.Regex.Split(System.Text.RegularExpressions.Regex.Split(fullInput, "&")[2], "=")[1];
            anywhereAttachmentWorker.viewPlanAttachment(token, attachmentId, section);
        }

        public CaseNotesWorker.AttachmentList[] getCaseNoteAttachmentsList(string token, string caseNoteId)
        {
            return caseNotesWorker.getCaseNoteAttachmentsList(token, caseNoteId);
        }

        public CaseNotesWorker.AttachmentListForGroup[] getCaseNoteAttachmentsListForGroupNote(string caseNoteId)
        {
            return caseNotesWorker.getCaseNoteAttachmentsListForGroupNote(caseNoteId);
        }

        public string setTestValue(string val)
        {
            var current = System.Web.HttpContext.Current;
            current.Session["TestVal"] = val;
            return val;
        }


        public string getTestValue()
        {
            var current = System.Web.HttpContext.Current;
            //var response = current.Response;
            string val = (string)current.Session["TestVal"];
            return val;
        }

        public string getAbsentWidgetFilterData(string token, string absentDate, string absentLocationId, string absentGroupCode, string custGroupId)
        {
            return dg.getAbsentWidgetFilterData(token, absentDate, absentLocationId, absentGroupCode, custGroupId);
        }

        public string checkLoginType()
        {
            return dg.checkLoginType();
        }

        //Authenticator below
        public string generateAuthentication(string userId, string password)
        {
            return aAuth.generateAuthentication(userId, password);
        }

        public string authenticatedLogin(string userId, string key)
        {
            return aAuth.authenticatedLogin(userId, key);
        }

        //Below is where we will call connections to theIntelliviewdataGetter
        //So they stay separate from original DataGetter calls 
        public string intellivueLogInUser(string token, string userId, string appId, string consumerNumber, string domain)
        {
            return idg.intellivueLogInUser(token, userId, appId, consumerNumber, domain);
        }

        public string getIntellivueAppId(string token, string consumerId, string userId, string applicationName)
        {
            return idg.getIntellivueAppId(token, consumerId, userId, applicationName);
        }

        public string getApplicationListHostedWithUser(string token, string userId)
        {
            return idg.getApplicationListHostedWithUser(token, userId);
        }

        public string getIntellivueViewURL(string token, string consumerId, string userId, string appName, string applicationName)
        {
            return idg.getIntellivueViewURL(token, consumerId, userId, appName, applicationName);
        }

        //Covid-19
        public string insertUpdateCovidAssessment(string token, string assesmentDate, string assessmentTime, string cough, string diarrhea,
           string fever, string locationId, string malaise, string nasalCong, string nausea, string tasteAndSmell, string notes, string peopleId, string settingType, string shortnessBreath, string soreThroat, string assessmentId, string isConsumer)
        {
            return cw.insertUpdateCovidAssessment(token, assesmentDate, assessmentTime, cough, diarrhea, fever, locationId, malaise, nasalCong, nausea, tasteAndSmell, notes, peopleId, settingType, shortnessBreath, soreThroat, assessmentId, isConsumer);
        }

        public CovidWorker.CovidDetails[] getIndividualsCovidDetails(string token, string peopleId, string assessmentDate, string isConsumer)
        {
            return cw.getIndividualsCovidDetails(token, peopleId, assessmentDate, isConsumer);
        }

        public string deleteCovidAssessment(string token, string assessmentId)
        {
            return cw.deleteCovidAssessment(token, assessmentId);
        }

        //SSA
        public CaseNoteSSAWorker.ServiceOptions[] getSSAServiceOptionsDropdown(string token, string serviceDate, string consumerId)
        {
            return cnSSA.getSSAServiceOptionsDropdown(token, serviceDate, consumerId);
        }

        public CaseNoteSSAWorker.BillingCodes[] getSSABillCodesFromService(string token, string serviceName, string personApproved)
        {
            return cnSSA.getSSABillCodesFromService(token, serviceName, personApproved);
        }

        //Transportation
        public TransportationWorker.InsertTripCompleted[] insertTripCompleted(string token, string tripName, string driverId, string otherRider, string dateOfService, string billingType, string vehicleInformationId, string locationId)
        {
            return trW.insertTripCompleted(token, tripName, driverId, otherRider, dateOfService, billingType, vehicleInformationId, locationId);
        }

        public string insertVehicleInformation(string token)
        {
            return trW.insertVehicleInformation(token);
        }

        public string updateVehicleInformation(string token)
        {
            return trW.updateVehicleInformation(token);
        }

        public TransportationWorker.VehicleInformation[] getVehicleInformation(string token, string informationId)
        {
            return trW.getVehicleInformation(token, informationId);
        }

        public string deleteVehicleInspection(string token, string vehicleInspectionId)
        {
            return trW.deleteVehicleInspection(token, vehicleInspectionId);
        }

        public TransportationWorker.InsertVehicleInspection[] insertVehicleInspection(string token, string vehicleInformationId, string tripCompletedId, string inspectionDate, string inspectionTime, string notes)
        {
            return trW.insertVehicleInspection(token, vehicleInformationId, tripCompletedId, inspectionDate, inspectionTime, notes);
        }

        public TransportationWorker.CompletedVehicleInspections[] getCompletedInspections(string token, string fromDate, string toDate, string vehicleInfoId, string userId)
        {
            return trW.getCompletedInspections(token, fromDate, toDate, vehicleInfoId, userId);
        }

        public string updateVehicleInspection(string token, string vehicleInspectionId, string vehicleInformationId, string tripCompletedId, string inspectionDate, string inspectionTime, string notes)
        {
            return trW.updateVehicleInspection(token, vehicleInspectionId, vehicleInformationId, tripCompletedId, inspectionDate, inspectionTime, notes);
        }

        public TransportationWorker.VehicleDropdown[] getVehicleDropdown(string token)
        {
            return trW.getVehicleDropdown(token);
        }

        public TransportationWorker.VehicleInspectionCategories[] getInspectionCategories(string token)
        {
            return trW.getInspectionCategories(token);
        }

        public TransportationWorker.AlternateAddresses[] getAlternateAddresses(string token, string consumerId)
        {
            return trW.getAlternateAddresses(token, consumerId);
        }

        public List<string> insertVehicleInspectionDetails(string token, string vehicleInspectionId, string inspectionCatString, string inspectionStatusString)
        {
            return trW.insertVehicleInspectionDetails(token, vehicleInspectionId, inspectionCatString, inspectionStatusString);
        }

        public List<string> massUpdateDriverVehicle(string token, string method, string routeIdString, string updateVal)
        {
            return trW.massUpdateDriverVehicle(token, method, routeIdString, updateVal);
        }

        public TransportationWorker.VehicleInspection[] getVehicleInspectionDetails(string token, string vehicleInspectionId)
        {
            return trW.getVehicleInspectionDetails(token, vehicleInspectionId);
        }
        public TransportationWorker.Trips[] getTrips(string token, string serviceDateStart, string serviceDateStop, string personId, string locationId, string vehicleId)
        {
            return trW.getTrips(token, serviceDateStart, serviceDateStop, personId, locationId, vehicleId);
        }
        public TransportationWorker.TripConsumers[] getTripConsumers(string token, string tripsCompletedId)
        {
            return trW.getTripConsumers(token, tripsCompletedId);
        }
        public TransportationWorker.TripInformation[] getTripInformation(string token, string tripsCompletedId)
        {
            return trW.getTripInformation(token, tripsCompletedId);
        }
        public TransportationWorker.Drivers[] getDrivers(string token)
        {
            return trW.getDrivers(token);
        }
        public string deleteTrip(string token, string tripsCompletedId)
        {
            return trW.deleteTrip(token, tripsCompletedId);
        }
        public TransportationWorker.ConsumerDetail[] getConsumerDetails(string token, string consumerId)
        {
            return trW.getConsumerDetails(token, consumerId);
        }
        public string updateTripDetails(string token, string tripsCompletedId, string odometerStart, string odometerStop, string startTime, string endTime)
        {
            return trW.updateTripDetails(token, tripsCompletedId, odometerStart, odometerStop, startTime, endTime);
        }
        public string updateManageTripDetails(string token, string tripsCompletedId, string odometerStart, string odometerStop, string startTime, string endTime, string driverId, string otherRiderId, string vehicleId, string locationId, string billingType, string tripName)
        {
            return trW.updateManageTripDetails(token, tripsCompletedId, odometerStart, odometerStop, startTime, endTime, driverId, otherRiderId, vehicleId, locationId, billingType, tripName);
        }
        public string insertUpdateTripConsumers(string token, string tripDetailId, string tripsCompletedId, string consumerId, string alternateAddress, string scheduledTime,
            string totalTravelTime, string riderStatus, string specialInstructions, string directions, string pickupOrder, string notes)
        {
            return trW.insertUpdateTripConsumers(token, tripDetailId, tripsCompletedId, consumerId, alternateAddress, scheduledTime, totalTravelTime, riderStatus, specialInstructions, directions, pickupOrder, notes);
        }

        public string deleteConsumerFromTrip(string tripsCompletedId, string consumerId)
        {
            return trW.deleteConsumerFromTrip(tripsCompletedId, consumerId);
        }

        //Plan Outcomes
        public PlanOutcomesWorker.PlanTotalOutcome getPlanSpecificOutcomes(string token, string assessmentId, int targetAssessmentVersionId)
        {
            return poW.getPlanSpecificOutcomes(token, assessmentId, targetAssessmentVersionId);
        }

        public AnywhereAssessmentWorker.ServiceVendors[] getPlanOutcomesPaidSupportProviders(string assessmentId)
        {
            return poW.getPlanOutcomesPaidSupportProviders(assessmentId);
        }


        public string insertPlanOutcomeProgressSummary(string token, long planId, string progressSummary)
        {
            return poW.insertPlanOutcomeProgressSummary(token, planId, progressSummary);
        }

        //Final
        public FinalizationButtonWorker.Emails[] getDefaultEmailsForFinalization()
        {
            return fbw.getDefaultEmailsForFinalization();
        }

        public string[] finalizationActions(string token, string[] planAttachmentIds, string[] wfAttachmentIds, string[] sigAttachmentIds, string userId, string assessmentID, string versionID, string extraSpace, bool toONET, bool isp, bool oneSpan, bool signatureOnly, string include, string planId, string consumerId, string[] emailAddresses)
        {
            return fbw.finalizationActions(token, planAttachmentIds, wfAttachmentIds, sigAttachmentIds, userId, assessmentID, versionID, extraSpace, toONET, isp, oneSpan, signatureOnly, include, planId, consumerId, emailAddresses);
        }

            public string updatePlanOutcomeProgressSummary(string token, long progressSummaryId, string progressSummary)
        {
            return poW.updatePlanOutcomeProgressSummary(token, progressSummaryId, progressSummary);
        }

        public string deletePlanOutcomeProgressSummary(string token, long progressSummaryId)
        {
            return poW.deletePlanOutcomeProgressSummary(token, progressSummaryId);
        }

        public string deletePlanOutcomeExperienceResponsibility(string token, long responsibilityId)
        {
            return poW.deletePlanOutcomeExperienceResponsibility(token, responsibilityId);
        }

        public string insertPlanOutcome(string token, string assessmentId, string outcome, string details, string history, string sectionId, string outcomeOrder, string summaryOfProgress, int status, string carryOverReason)
        {
            return poW.insertPlanOutcome(token, assessmentId, outcome, details, history, sectionId, outcomeOrder, summaryOfProgress, status, carryOverReason);
        }

        public string insertPlanOutcomesExperience(string outcomeId, string[] howHappened, string[] whatHappened, int[] responsibleContact, int[] responsibleProvider, string[] whenHowOftenValue, int[] whenHowOftenFrequency, string[] whenHowOftenText, string[] experienceOrder)
        {
            return poW.insertPlanOutcomesExperience(outcomeId, howHappened, whatHappened, responsibleContact, responsibleProvider, whenHowOftenValue, whenHowOftenFrequency, whenHowOftenText, experienceOrder);
        }

        public List<string> insertPlanOutcomeExperienceResponsibility(string experienceId, int[] responsibleContact, int[] responsibleProvider, string[] whenHowOftenValue, int[] whenHowOftenFrequency, string[] whenHowOftenText, bool[] isSalesforceLocation)
        {
            return poW.insertPlanOutcomeExperienceResponsibility(experienceId, responsibleContact, responsibleProvider, whenHowOftenValue, whenHowOftenFrequency, whenHowOftenText, isSalesforceLocation);
        }

        public string updatePlanOutcomeExperienceResponsibility(long[] responsibilityIds, int[] responsibleContact, int[] responsibleProvider, string[] whenHowOftenValue, int[] whenHowOftenFrequency, string[] whenHowOftenText, bool[] isSalesforceLocation)
        {
            return poW.updatePlanOutcomeExperienceResponsibility(responsibilityIds, responsibleContact, responsibleProvider, whenHowOftenValue, whenHowOftenFrequency, whenHowOftenText, isSalesforceLocation);
        }

        public string insertPlanOutcomesReview(long outcomeId, string[] whatWillHappen, string[] whenToCheckIn, string[] whoReview, string[] reviewOrder, string[] contactId)
        {
            return poW.insertPlanOutcomesReview(outcomeId, whatWillHappen, whenToCheckIn, whoReview, reviewOrder, contactId);
        }

        public string updatePlanOutcome(string token, string assessmentId, string outcomeId, string outcome, string details, string history, string sectionId, string summaryOfProgress, int status, string carryOverReason)
        {
            return poW.updatePlanOutcome(token, assessmentId, outcomeId, outcome, details, history, sectionId, summaryOfProgress, status, carryOverReason);
        }

        public string updatePlanOutcomesExperience(string outcomeId, string[] experienceIds, string[] howHappened, string[] whatHappened, long[] responsibilityIds, int[] responsibleContact, int[] responsibleProvider, string[] whenHowOftenValue, int[] whenHowOftenFrequency, string[] whenHowOftenText, bool[] isSalesforceLocation)
        {
            return poW.updatePlanOutcomesExperience(outcomeId, experienceIds, howHappened, whatHappened, responsibilityIds, responsibleContact, responsibleProvider, whenHowOftenValue, whenHowOftenFrequency, whenHowOftenText, isSalesforceLocation);
        }

        public string updatePlanOutcomesReview(long outcomeId, string[] reviewIds, string[] whatWillHappen, string[] whenToCheckIn, string[] whoReview, string[] contactId)
        {
            return poW.updatePlanOutcomesReview(outcomeId, reviewIds, whatWillHappen, whenToCheckIn, whoReview, contactId);
        }

        public string updatePlanOutcomesExperienceOrder(string token, long outcomeId, long experienceId, int newPos, int oldPos)
        {
            return poW.updatePlanOutcomesExperienceOrder(token, outcomeId, experienceId, newPos, oldPos);
        }

        public string updatePlanOutcomesOrder(string token, long planId, long outcomeId, int newPos, int oldPos)
        {
            return poW.updatePlanOutcomesOrder(token, planId, outcomeId, newPos, oldPos);
        }

        public string updatePlanOutcomesReviewOrder(string token, long outcomeId, long reviewId, int newPos, int oldPos)
        {
            return poW.updatePlanOutcomesReviewOrder(token, outcomeId, reviewId, newPos, oldPos);
        }

        public string deletePlanOutcome(string token, string outcomeId)
        {
            return poW.deletePlanOutcome(token, outcomeId);
        }

        public string deletePlanOutcomeExperience(string token, string outcomeId, string experienceId)
        {
            return poW.deletePlanOutcomeExperience(token, outcomeId, experienceId);
        }

        public string deletePlanOutcomeReview(string token, string outcomeId, string reviewId)
        {
            return poW.deletePlanOutcomeReview(token, outcomeId, reviewId);
        }

        //Authorization
        public AuthorizationWorker.AuthorizationPopup getAuthorizationFilterData(string token)
        {
            return authWorker.getAuthorizationFilterData(token);
        }

        public AuthorizationWorker.PageData getAuthorizationPageData(string code, string matchSource, string vendorId, string planType, string planYearStartStart, string planYearStartEnd,
                                string planYearEndStart, string planYearEndEnd, string completedDateStart, string completedDateEnd, string selectedConsumerId)
        {
            return authWorker.getAuthorizationPageData(code, matchSource, vendorId, planType, planYearStartStart, planYearStartEnd,
                                planYearEndStart, planYearEndEnd, completedDateStart, completedDateEnd, selectedConsumerId);
        }
        //Plan Services And Supports
        public ServicesAndSupportsWorker.ServicesAndSupports getServicesAndSupports(string token, long anywAssessmentId, int consumerId)
        {
            return ssw.getServicesAndSupports(token, anywAssessmentId, consumerId);
        }

        public string deleteProfessionalReferral(string token, long professionalReferralId)
        {
            return ssw.deleteProfessionalReferral(token, professionalReferralId);
        }

        public string updateProfessionalReferral(string token, long professionalReferralId, long anywAssessmentId, int assessmentAreaId, char newOrExisting, string whoSupports, string reasonForReferral)
        {
            return ssw.updateProfessionalReferral(token, professionalReferralId, anywAssessmentId, assessmentAreaId, newOrExisting, whoSupports, reasonForReferral);
        }

        public string insertProfessionalReferral(string token, long anywAssessmentId, int assessmentAreaId, char newOrExisting, string whoSupports, string reasonForReferral, int rowOrder)
        {
            return ssw.insertProfessionalReferral(token, anywAssessmentId, assessmentAreaId, newOrExisting, whoSupports, reasonForReferral, rowOrder);
        }

        public string deleteAdditionalSupports(string token, long additionalSupportsId)
        {
            return ssw.deleteAdditionalSupports(token, additionalSupportsId);
        }

        public string updateAdditionalSupports(string token, long additionalSupportsId, long anywAssessmentId, int assessmentAreaId, string whoSupports, string whatSupportLooksLike, string howOftenValue, int howOftenFrequency, string howOftenText)
        {
            return ssw.updateAdditionalSupports(token, additionalSupportsId, anywAssessmentId, assessmentAreaId, whoSupports, whatSupportLooksLike, howOftenValue, howOftenFrequency, howOftenText);
        }

        public string insertAdditionalSupports(string token, long anywAssessmentId, int assessmentAreaId, string whoSupports, string whatSupportLooksLike, string howOftenValue, int howOftenFrequency, string howOftenText, int rowOrder)
        {
            return ssw.insertAdditionalSupports(token, anywAssessmentId, assessmentAreaId, whoSupports, whatSupportLooksLike, howOftenValue, howOftenFrequency, howOftenText, rowOrder);
        }

        public string deleteSSModifications(string token, long modificationsId)
        {
            return ssw.deleteSSModifications(token, modificationsId);
        }

        public string updateSSModifications(string token, long modificationsId, long anywAssessmentId, char medicalRate, char behaviorRate, char icfRate, char complexRate, char developmentalRate, char childIntensiveRate)
        {
            return ssw.updateSSModifications(token, modificationsId, anywAssessmentId, medicalRate, behaviorRate, icfRate, complexRate, developmentalRate, childIntensiveRate);
        }

        public string insertSSModifications(string token, long anywAssessmentId, char medicalRate, char behaviorRate, char icfRate, char complexRate, char developmentalRate, char childIntensiveRate)
        {
            return ssw.insertSSModifications(token, anywAssessmentId, medicalRate, behaviorRate, icfRate, complexRate, developmentalRate, childIntensiveRate);
        }

        public string deletePaidSupports(string token, long paidSupportsId)
        {
            return ssw.deletePaidSupports(token, paidSupportsId);
        }

        public string updatePaidSupports(string token, long paidSupportsId, long anywAssessmentId, string providerId, int assessmentAreaId, int serviceNameId, string scopeOfService, string howOftenValue, int howOftenFrequency, string howOftenText, string beginDate, string endDate, int fundingSource, string fundingSourceText, string serviceNameOther)
        {
            return ssw.updatePaidSupports(token, paidSupportsId, anywAssessmentId, providerId, assessmentAreaId, serviceNameId, scopeOfService, howOftenValue, howOftenFrequency, howOftenText, beginDate, endDate, fundingSource, fundingSourceText, serviceNameOther);
        }
        public string updateMultiPaidSupports(string token, string paidSupportsId, string providerId, string beginDate, string endDate)
        {
            return ssw.updateMultiPaidSupports(token, paidSupportsId, providerId, beginDate, endDate);
        }

        public string insertPaidSupports(string token, long anywAssessmentId, string providerId, int assessmentAreaId, int serviceNameId, string scopeOfService, string howOftenValue, int howOftenFrequency, string howOftenText, string beginDate, string endDate, int fundingSource, string fundingSourceText, int rowOrder, string serviceNameOther)
        {
            return ssw.insertPaidSupports(token, anywAssessmentId, providerId, assessmentAreaId, serviceNameId, scopeOfService, howOftenValue, howOftenFrequency, howOftenText, beginDate, endDate, fundingSource, fundingSourceText, rowOrder, serviceNameOther);
        }

        public string updatePaidSupportsRowOrder(string token, long assessmentId, long supportId, int newPos, int oldPos)
        {
            return ssw.updatePaidSupportsRowOrder(token, assessmentId, supportId, newPos, oldPos);
        }

        public string updateModificationRowOrder(string token, long assessmentId, long modificationId, int newPos, int oldPos)
        {
            return ssw.updateModificationRowOrder(token, assessmentId, modificationId, newPos, oldPos);
        }

        public string updateServiceReferralRowOrder(string token, long assessmentId, long referralId, int newPos, int oldPos)
        {
            return ssw.updateServiceReferralRowOrder(token, assessmentId, referralId, newPos, oldPos);
        }

        public string updateAdditionalSupportsRowOrder(string token, long assessmentId, long addSupportId, int newPos, int oldPos)
        {
            return ssw.updateAdditionalSupportsRowOrder(token, assessmentId, addSupportId, newPos, oldPos);
        }

        public string updateAssessmentAnswerRowOrder(string token, string answerIds, long assessmentId, long questionSetId, int newPos, int oldPos)
        {
            return arorw.updateAssessmentAnswerRowOrder(token, answerIds, assessmentId, questionSetId, newPos, oldPos);
        }

        //Plan Informed Consent
        public PlanInformedConsentWorker.InformedConsent[] getPlanRestrictiveMeasures(string token, string assessmentId)
        {
            return picw.getPlanRestrictiveMeasures(token, assessmentId);
        }

        public PlanInformedConsentWorker.InformedConsentSSAs[] getPlanInformedConsentSSAs(string token)
        {
            return picw.getPlanInformedConsentSSAs(token);
        }

        public PlanInformedConsentWorker.InformedConsentVendors[] getPlanInformedConsentVendors(string token, string peopleid)
        {
            return picw.getPlanInformedConsentVendors(token, peopleid);
        }

        public PlanInformedConsentWorker.InsertInformedConsent[] insertPlanRestrictiveMeasures(string token, string assessmentId)
        {
            return picw.insertPlanRestrictiveMeasures(token, assessmentId);
        }

        public string updatePlanRestrictiveMeasures(string token, string informedConsentId, string rmIdentified, string rmHRCDate, string rmKeepSelfSafe, string rmFadeRestriction, string rmOtherWayHelpGood, string rmOtherWayHelpBad, string rmWhatCouldHappenGood, string rmWhatCouldHappenBad)
        {
            return picw.updatePlanRestrictiveMeasures(token, informedConsentId, rmIdentified, rmHRCDate, rmKeepSelfSafe, rmFadeRestriction, rmOtherWayHelpGood, rmOtherWayHelpBad, rmWhatCouldHappenGood, rmWhatCouldHappenBad);
        }

        public string deletePlanRestrictiveMeasures(string token, string informedConsentId)
        {
            return picw.deletePlanRestrictiveMeasures(token, informedConsentId);
        }

        public string updatePlanConsentStatements(string token, string signatureId, string csChangeMind, string csChangeMindSSAPeopleId, string csContact, string csContactProviderVendorId, string csContactInput, string csRightsReviewed, string csAgreeToPlan, string csFCOPExplained, string csDueProcess, string csResidentialOptions, string csSupportsHealthNeeds, string csTechnology)
        {
            return picw.updatePlanConsentStatements(token, signatureId, csChangeMind, csChangeMindSSAPeopleId, csContact, csContactProviderVendorId, csContactInput, csRightsReviewed, csAgreeToPlan, csFCOPExplained, csDueProcess, csResidentialOptions, csSupportsHealthNeeds, csTechnology);
        }



        //Plan Signatures
        public PlanSignatureWorker.PlanSignatures[] getSignatures(string token, long assessmentId)
        {
            return psw.getSignatures(token, assessmentId);
        }

        public PlanSignatureWorker.PlanSignatures[] getTeamMemberBySalesForceId(string salesForceId)
        {
            return psw.getTeamMemberBySalesForceId(salesForceId);
        }

        public PlanSignatureWorker.Locations[] getLocationswithSalesforceId(string token)
        {
            return psw.getLocationswithSalesforceId(token);
        }


        public PlanSignatureWorker.TeamMemberFromState[] getTeamMemberListFromState(long peopleId)
        {
            return psw.getTeamMemberListFromState(peopleId);
        }

        public PlanSignatureWorker.TeamMemberFromState[] getStateGuardiansforConsumer(long peopleId)
        {
            return psw.getStateGuardiansforConsumer(peopleId);
        }

        public string getStateCaseManagerforConsumer(long peopleId)
        {
            return psw.getStateCaseManagerforConsumer(peopleId);
        }


        public string assignStateCaseManagertoConsumers(string caseManagerId, PlanSignatureWorker.AssignStateConsumer[] consumers)
        {
            return psw.assignStateCaseManagertoConsumers(caseManagerId, consumers);
        }

        public string setSalesForceIdForTeamMemberUpdate(string peopleId, string salesForceId)
        {
            return psw.setSalesForceIdForTeamMemberUpdate(peopleId, salesForceId);
        }

        public bool validateConsumerForSalesForceId(string consumerId)
        {
            return psw.validateConsumerForSalesForceId(consumerId);
        }


        public string checkForSalesForce()
        {
            string dirPath = System.IO.Path.GetDirectoryName(
                        System.Reflection.Assembly.GetExecutingAssembly().GetName().CodeBase);
            dirPath = dirPath.Substring(6);
            string inSalesForce = "false";
            if (Directory.GetFiles(dirPath, "*.pfx").Length != 0)
            {
                psw.setVendorSalesForceId();
                inSalesForce = "true";
            }

            return inSalesForce;
        }

        public string GetSalesForceId(long consumerId, long peopleId)
        {
            return psw.GetSalesForceId(consumerId, peopleId);
        }

        public string[] uploadPlanToDODD(string consumerId, string planId)
        {
            return psw.uploadPlanToDODD(consumerId, planId);
        }

        public PlanSignatureWorker.SigId[] insertPlanTeamMember(string token, string assessmentId, string teamMember, string name, string lastName, string participated, string signature, string contactId, string planYearStart, string planYearEnd, string dissentAreaDisagree, string dissentHowToAddress,
               string csChangeMind, string csChangeMindSSAPeopleId, string csContact, string csContactProviderVendorId, string csContactInput, string csRightsReviewed, string csAgreeToPlan, string csFCOPExplained, string csDueProcess,
               string csResidentialOptions, string csSupportsHealthNeeds, string csTechnology, string buildingNumber, string dateOfBirth, string peopleId, string useExisting, string relationshipImport, string consumerId, string createRelationship, string salesforceId,
               bool hasWetSignature, string description, string attachmentType, string attachment, string section, string questionId, string signatureType, string vendorId, string relationship, string email, string parentOfMinor)
        {
            return psw.insertPlanTeamMember(token, assessmentId, teamMember, name, lastName, participated, signature, contactId, planYearStart, planYearEnd, dissentAreaDisagree, dissentHowToAddress, csChangeMind, csChangeMindSSAPeopleId, csContact,
                                csContactProviderVendorId, csContactInput, csRightsReviewed, csAgreeToPlan, csFCOPExplained, csDueProcess,
                                csResidentialOptions, csSupportsHealthNeeds, csTechnology, buildingNumber, dateOfBirth, peopleId, useExisting, relationshipImport, consumerId, createRelationship, salesforceId,
                                hasWetSignature, description, attachmentType, attachment, section, questionId, signatureType, vendorId, relationship, email, parentOfMinor);
        }
        public string updatePlanTeamMember(string token, string signatureId, string teamMember, string name, string lastName, string participated, string dissentAreaDisagree, string dissentHowToAddress, string signature, string contactId, string peopleId, string buildingNumber, string dateOfBirth, string salesForceId, string consumerId,
                                            bool hasWetSignature, string description, string attachmentType, string attachment, string section, string questionId, string assessmentId, string signatureType, string dateSigned, string vendorId, string clear, string email)
        {
            return psw.updateTeamMember(token, signatureId, teamMember, name, lastName, participated, dissentAreaDisagree, dissentHowToAddress, signature, contactId, peopleId, buildingNumber, dateOfBirth, salesForceId, consumerId,
                                         hasWetSignature, description, attachmentType, attachment, section, questionId, assessmentId, signatureType, dateSigned, vendorId, clear, email);
        }
        public string updatePlanSignatureOrder(long assessmentId, long signatureId, int newPos)
        {
            return psw.updatePlanSignatureOrder(assessmentId, signatureId, newPos);
        }
        public string deletePlanSignature(string token, string signatureId)
        {
            return psw.deletePlanSignature(token, signatureId);
        }

        //Plan Contact Information
        public PlanContactInformationWorker.ContactInformation[] getPlanContact(string token, string assessmentId)
        {
            return pciw.getPlanContact(token, assessmentId);
        }
        public PlanContactInformationWorker.ContactImport[] importExistingContactInfo(string token, string peopleId)
        {
            return pciw.importExistingContactInfo(token, peopleId);
        }
        public PlanContactInformationWorker.ConsumerRelationships[] getConsumerRelationshipsCI(string token, string consumerId, string effectiveStartDate, string effectiveEndDate, string areInSalesForce, string planId)
        {
            return pciw.getConsumerRelationships(token, consumerId, effectiveStartDate, effectiveEndDate, areInSalesForce, planId);
        }
        public PlanContactInformationWorker.ImportantPeople[] getPlanContactImportantPeople(string token, string contactId)
        {
            return pciw.getPlanContactImportantPeople(token, contactId);
        }
        public PlanContactInformationWorker.ImportantPlaces[] getPlanContactImportantPlaces(string token, string contactId)
        {
            return pciw.getPlanContactImportantPlaces(token, contactId);
        }
        public PlanContactInformationWorker.ImportantGroups[] getPlanContactImportantGroups(string token, string contactId)
        {
            return pciw.getPlanContactImportantGroups(token, contactId);
        }

        public PlanContactInformationWorker.FundingSource[] getPlanContactFundingSources(long assessmentId)
        {
            return pciw.getPlanContactFundingSources(assessmentId);
        }

        public string insertPlanContactImportantPeople(string token, string contactId, string type, string name, string relationship, string address, string phone, string email, string phone2, string phoneExt, string phone2Ext, string typeOther)
        {
            return pciw.insertPlanContactImportantPeople(token, contactId, type, name, relationship, address, phone, email, phone2, phoneExt, phone2Ext, typeOther);
        }

        public string insertPlanContactImportantGroup(string token, string contactId, string status, string name, string address, string phone, string meetingInfo, string whoHelps)
        {
            return pciw.insertPlanContactImportantGroup(token, contactId, status, name, address, phone, meetingInfo, whoHelps);
        }

        public string insertPlanContactImportantPlaces(string token, string contactId, string type, string name, string address, string phone, string schedule, string acuity, string typeOther)
        {
            return pciw.insertPlanContactImportantPlaces(token, contactId, type, name, address, phone, schedule, acuity, typeOther);
        }
        public string updatePlanContactImportantPeople(string token, string importantPersonId, string type, string name, string relationship, string address, string phone, string email, string phone2, string phoneExt, string phone2Ext, string typeOther)
        {
            return pciw.updatePlanContactImportantPeople(token, importantPersonId, type, name, relationship, address, phone, email, phone2, phoneExt, phone2Ext, typeOther);
        }

        public string updatePlanContactImportantGroup(string token, string importantGroupId, string status, string name, string address, string phone, string meetingInfo, string whoHelps)
        {
            return pciw.updatePlanContactImportantGroup(token, importantGroupId, status, name, address, phone, meetingInfo, whoHelps);
        }

        public string updatePlanContactImportantPlaces(string token, string importantPlacesId, string type, string name, string address, string phone, string schedule, string acuity, string typeOther)
        {
            return pciw.updatePlanContactImportantPlaces(token, importantPlacesId, type, name, address, phone, schedule, acuity, typeOther);
        }
        public string updatePlanContact(string token, string contactId, string ohiInfo, string ohiPhone, string ohiPolicy)
        {
            return pciw.updatePlanContact(token, contactId, ohiInfo, ohiPhone, ohiPolicy);
        }
        public string updatePlanContactImportantOrder(long contactId, long importantId, int newPos, int oldPos, int type)
        {
            return pciw.updatePlanContactImportantOrder(contactId, importantId, newPos, oldPos, type);
        }
        public string deletePlanContactImportant(string token, string importantId, string type)
        {
            return pciw.deletePlanContactImportant(token, importantId, type);
        }

        // Plan Introduction

        public PlanIntroductionWorker.PlanIntroduction getPlanIntroduction(string token, string planId, string consumerId)
        {
            return piw.getPlanIntroduction(token, planId, consumerId);
        }

        public string updatePlanIntroduction(string token, string planId, string consumerId, string likeAdmire, string thingsImportantTo, string thingsImportantFor, string howToSupport, int usePlanImage, string consumerImage)
        {
            return piw.updatePlanIntroduction(token, planId, consumerId, likeAdmire, thingsImportantTo, thingsImportantFor, howToSupport, usePlanImage, consumerImage);
        }

        //Plan Assessment Summary 
        public PlanDiscoverySummaryWorker.AssessmentSummaryQuestions[] getAssessmentSummaryQuestions(string token, long anywAssessmentId)
        {
            return pdsw.getAssessmentSummaryQuestions(token, anywAssessmentId);
        }
        public PlanDiscoverySummaryWorker.AdditionalAssessmentSummaryQuestions[] getAdditionalAssessmentSummaryQuestions(long anywAssessmentId)
        {
            return pdsw.getAdditionalAssessmentSummaryQuestions(anywAssessmentId);
        }

        public PlanDiscoverySummaryWorker.SummarySavedAnswerIds insertAssessmentSummaryAnswers(string token, long anywAssessmentId, long[] anywQuestionIds, int[] answerRow, string[] answers, string userId, string skipped)
        {
            return pdsw.insertAssessmentSummaryAnswers(token, anywAssessmentId, anywQuestionIds, answerRow, answers, userId, skipped);
        }

        public string updateAssessmentSummaryAnswers(string token, long anywAssessmentId, long[] anywAnswerIds, string[] answers, string userId)
        {
            return pdsw.updateAssessmentSummaryAnswers(token, anywAssessmentId, anywAnswerIds, answers, userId);
        }
        public string updateAdditionalAssessmentSummaryAnswer(long anywAssessmentId, string aloneTimeAmount, string providerBackUp)
        {
            return pdsw.updateAdditionalAssessmentSummaryAnswer(anywAssessmentId, aloneTimeAmount, providerBackUp);
        }
        public string updateBestWayToConnect(string token, long anywAssessmentId, int bestWayId)
        {
            return pdsw.updateBestWayToConnect(token, anywAssessmentId, bestWayId);
        }

        public string updatePlaceOnPath(string token, long anywAssessmentId, int placeId)
        {
            return pdsw.updatePlaceOnPath(token, anywAssessmentId, placeId);
        }

        public string updateMoreDetail(string token, long anywAssessmentId, string detail)
        {
            return pdsw.updateMoreDetail(token, anywAssessmentId, detail);
        }
        //Forms
        public string openEditor(string templateId, string consumerId)
        {
            long lngconsumerId = long.Parse(consumerId);

            return fw.OpenEditor(templateId, lngconsumerId);
        }

        public string openPDFEditor(string documentId, string documentEdited, string consumerId, bool isRefresh)
        {
            long lngconsumerId = long.Parse(consumerId);

            return fw.OpenPDFEditor(documentId, documentEdited, lngconsumerId, isRefresh);
        }

        public string openFormEditor(string formId, string documentEdited, string consumerId, bool isRefresh, string isTemplate, string applicationName)
        {
            long lngconsumerId = long.Parse(consumerId);

            return fw.openFormEditor(formId, documentEdited, lngconsumerId, isRefresh, isTemplate, applicationName);
        }

        public Anywhere.service.Data.FormWorker.consumerForm insertConsumerForm(string token, string userId, string consumerId, string formtemplateid, string formdata, string formCompleteDate)
        {
            return fw.insertConsumerForm(token, userId, consumerId, formtemplateid, formdata, formCompleteDate);
        }

        public Anywhere.service.Data.FormWorker.consumerForm updateConsumerForm(string token, string formId, string formdata, string documentEdited)
        {
            return fw.UpdateConsumerForm(token, formId, formdata, documentEdited);
        }

        public Anywhere.service.Data.FormWorker.consumerForm updateConsumerFormCompletionDate(string token, string formId, string formCompletionDate)
        {
            return fw.UpdateConsumerFormCompletionDate(token, formId, formCompletionDate);
        }

        public string deleteConsumerForm(string token, string formId)
        {
            return fw.deleteConsumerForm(token, formId);
        }


        public Anywhere.service.Data.FormWorker.consumerForm[] getconsumerForms(string token, string userId, string consumerId, string hasAssignedFormTypes)
        {
            return fw.getConsumerForms(token, userId, consumerId, hasAssignedFormTypes);
        }

        public string checkFormsLock(string formId, string userId)
        {
            return fw.checkFormsLock(formId, userId);
        }

        public void removeFormsLock(string formId, string userId)
        {
            fw.removeFormsLock(formId, userId);
        }

        //Waiting List Module
        public string deleteFromWaitingList(string[] properties)
        {
            return wlw.deleteFromWaitingList(properties);
        }

        public string deleteWaitingListParticipant(string token, int participantId)
        {
            return wlw.deleteWaitingListParticipant(token, participantId);
        }

        public LandingPageInfo[] getLandingPageForConsumer(string token, double consumerId)
        {
            return wlw.getLandingPageForConsumer(token, consumerId);
        }

        public FundingSources[] getWaitingListFundingSources()
        {
            return wlw.getWaitingListFundingSources();
        }

        public WaitingList[] getWaitingListAssessment(int waitingListAssessmentId)
        {
            return wlw.getWaitingListAssessment(waitingListAssessmentId);
        }

        public string insertUpdateWaitingListValue(int id, int linkId, string propertyName, string value, string valueTwo, char insertOrUpdate)
        {
            return wlw.insertUpdateWaitingListValue(id, linkId, propertyName, value, valueTwo, insertOrUpdate);
        }

        public SupportingDocument[] addWLSupportingDocument(string token, long waitingListInformationId, string description, char includeOnEmail, string attachmentType, string attachment)
        {
            return wlw.addWLSupportingDocument(token, waitingListInformationId, description, includeOnEmail, attachmentType, attachment);
        }

        public SupportingDocumentList[] getWLSupportingDocumentList(string token, long waitingListInformationId)
        {
            return wlw.getWLSupportingDocumentList(token, waitingListInformationId);
        }

        public string deleteSupportingDocument(string token, string attachmentId)
        {
            return wlw.deleteSupportingDocument(token, attachmentId);
        }

        public MemoryStream viewSupportingDocInBrowser(string token, string supportingDocumentId)
        {
            return wlw.viewSupportingDocInBrowser(token, supportingDocumentId);
        }

        public string generateWaitingListAssessmentReport(string token, string waitingListId)
        {
            return rbw.generateWaitingListAssessmentReport(token, waitingListId);
        }

        public string sendWaitingListAssessmentReport(string token, string reportScheduleId, string header, string body, string waitingListId)
        {
            return rbw.sendWaitingListAssessmentReport(token, reportScheduleId, header, body, waitingListId);
        }

        //OOD Module

        public string generateForm4(System.IO.Stream testInput)
        {
            //(string token, string consumerIds, string serviceStartDate, string serviceEndDate, string userId, string serviceCode, string referenceNumber
            string token;
            string referenceNumber;
            string peopleId;
            string serviceCodeId;
            string startDate;
            string endDate;
            string userId;

            StreamReader reader = new StreamReader(testInput);
            string fullInput = reader.ReadToEnd();
            token = System.Text.RegularExpressions.Regex.Split(System.Text.RegularExpressions.Regex.Split(fullInput, "&")[0], "=")[1];
            userId = System.Text.RegularExpressions.Regex.Split(System.Text.RegularExpressions.Regex.Split(fullInput, "&")[1], "=")[1];
            referenceNumber = System.Text.RegularExpressions.Regex.Split(System.Text.RegularExpressions.Regex.Split(fullInput, "&")[2], "=")[1];
            peopleId = System.Text.RegularExpressions.Regex.Split(System.Text.RegularExpressions.Regex.Split(fullInput, "&")[3], "=")[1];
            serviceCodeId = System.Text.RegularExpressions.Regex.Split(System.Text.RegularExpressions.Regex.Split(fullInput, "&")[4], "=")[1];
            startDate = System.Text.RegularExpressions.Regex.Split(System.Text.RegularExpressions.Regex.Split(fullInput, "&")[5], "=")[1];
            endDate = System.Text.RegularExpressions.Regex.Split(System.Text.RegularExpressions.Regex.Split(fullInput, "&")[6], "=")[1];

            if (serviceCodeId == "%25")
            {
                serviceCodeId = "%";
            }

            if (referenceNumber == "%25")
            {
                referenceNumber = "%";
            }

            return OODfw.generateForm4(token, referenceNumber, peopleId, startDate, endDate, serviceCodeId, userId);
        }

        public string generateForm8(System.IO.Stream testInput)
        {
            string token;
            string referenceNumber;
            string peopleId;
            string serviceCodeId;
            string startDate;
            string endDate;
            string userId;

            StreamReader reader = new StreamReader(testInput);
            string fullInput = reader.ReadToEnd();
            token = System.Text.RegularExpressions.Regex.Split(System.Text.RegularExpressions.Regex.Split(fullInput, "&")[0], "=")[1];
            userId = System.Text.RegularExpressions.Regex.Split(System.Text.RegularExpressions.Regex.Split(fullInput, "&")[1], "=")[1];
            referenceNumber = System.Text.RegularExpressions.Regex.Split(System.Text.RegularExpressions.Regex.Split(fullInput, "&")[2], "=")[1];
            peopleId = System.Text.RegularExpressions.Regex.Split(System.Text.RegularExpressions.Regex.Split(fullInput, "&")[3], "=")[1];
            serviceCodeId = System.Text.RegularExpressions.Regex.Split(System.Text.RegularExpressions.Regex.Split(fullInput, "&")[4], "=")[1];
            startDate = System.Text.RegularExpressions.Regex.Split(System.Text.RegularExpressions.Regex.Split(fullInput, "&")[5], "=")[1];
            endDate = System.Text.RegularExpressions.Regex.Split(System.Text.RegularExpressions.Regex.Split(fullInput, "&")[6], "=")[1];

            if ( serviceCodeId == "%25")
            {
                serviceCodeId = "All";
            }

            if (referenceNumber == "%25")
            {
                referenceNumber = "All";
            }

            return OODfw.generateForm8(token, referenceNumber, peopleId, startDate, endDate, serviceCodeId, userId);
        }

        public string generateForm10(System.IO.Stream testInput)
        {

            string token;
            string referenceNumber;
            string peopleId;
            string serviceCodeId;
            string startDate;
            string endDate;
            string userId;

            StreamReader reader = new StreamReader(testInput);
            string fullInput = reader.ReadToEnd();
            token = System.Text.RegularExpressions.Regex.Split(System.Text.RegularExpressions.Regex.Split(fullInput, "&")[0], "=")[1];
            userId = System.Text.RegularExpressions.Regex.Split(System.Text.RegularExpressions.Regex.Split(fullInput, "&")[1], "=")[1];
            referenceNumber = System.Text.RegularExpressions.Regex.Split(System.Text.RegularExpressions.Regex.Split(fullInput, "&")[2], "=")[1];
            peopleId = System.Text.RegularExpressions.Regex.Split(System.Text.RegularExpressions.Regex.Split(fullInput, "&")[3], "=")[1];
            serviceCodeId = System.Text.RegularExpressions.Regex.Split(System.Text.RegularExpressions.Regex.Split(fullInput, "&")[4], "=")[1];
            startDate = System.Text.RegularExpressions.Regex.Split(System.Text.RegularExpressions.Regex.Split(fullInput, "&")[5], "=")[1];
            endDate = System.Text.RegularExpressions.Regex.Split(System.Text.RegularExpressions.Regex.Split(fullInput, "&")[6], "=")[1];

            return OODfw.generateForm10(token, referenceNumber, 22, peopleId, startDate, endDate, userId);

        }

        public string generateForm16(System.IO.Stream testInput)
        {
            string token;
            string referenceNumber;
            string peopleId;
            string serviceCodeId;
            string startDate;
            string endDate;
            string userId;

            StreamReader reader = new StreamReader(testInput);
            string fullInput = reader.ReadToEnd();
            token = System.Text.RegularExpressions.Regex.Split(System.Text.RegularExpressions.Regex.Split(fullInput, "&")[0], "=")[1];
            userId = System.Text.RegularExpressions.Regex.Split(System.Text.RegularExpressions.Regex.Split(fullInput, "&")[1], "=")[1];
            referenceNumber = System.Text.RegularExpressions.Regex.Split(System.Text.RegularExpressions.Regex.Split(fullInput, "&")[2], "=")[1];
            peopleId = System.Text.RegularExpressions.Regex.Split(System.Text.RegularExpressions.Regex.Split(fullInput, "&")[3], "=")[1];
            serviceCodeId = System.Text.RegularExpressions.Regex.Split(System.Text.RegularExpressions.Regex.Split(fullInput, "&")[4], "=")[1];
            startDate = System.Text.RegularExpressions.Regex.Split(System.Text.RegularExpressions.Regex.Split(fullInput, "&")[5], "=")[1];
            endDate = System.Text.RegularExpressions.Regex.Split(System.Text.RegularExpressions.Regex.Split(fullInput, "&")[6], "=")[1];

            if (serviceCodeId == "%25")
            {
                serviceCodeId = "All";
            }

            if (referenceNumber == "%25")
            {
                referenceNumber = "All";
            }

            return OODfw.generateForm16(token, referenceNumber, peopleId, startDate, endDate, serviceCodeId, userId);
        }

        public Anywhere.service.Data.OODWorker.OODEntry[] getOODEntries(string token, string consumerIds, string serviceStartDate, string serviceEndDate, string userId, string serviceCode, string referenceNumber)
        {
            return Ow.getOODEntries(token, consumerIds, serviceStartDate, serviceEndDate, userId, serviceCode, referenceNumber);
        }

        public OODWorker.ActiveEmployee[] getActiveEmployees(string token)
        {
            return Ow.getActiveEmployees(token);
        }

        public OODWorker.ActiveEmployer[] getConsumerEmployers(string consumerId, string token)
        {
            return Ow.getConsumerEmployers(consumerId, token);
        }

        public OODWorker.ActiveEmployer[] getActiveEmployers(string token)
        {
            return Ow.getActiveEmployers(token);
        }

        public string deleteEmployer(string token, string employerId)
        {
            return Ow.deleteEmployer(token, employerId);
        }

        public Anywhere.service.Data.OODWorker.ActiveEmployer insertEmployer(string token, string employerName, string address1, string address2, string city, string state, string zipcode, string userId)
        {
            return Ow.insertEmployer(token, employerName, address1, address2, city, state, zipcode, userId);
        }

        public Anywhere.service.Data.OODWorker.ActiveEmployer updateEmployer(string token, string employerId, string employerName, string address1, string address2, string city, string state, string zipcode, string userId)
        {
            return Ow.UpdateEmployer(token, employerId, employerName, address1, address2, city, state, zipcode, userId);
        }

        public OODWorker.ActiveEmployer[] getEmployerJSON(string token, string employerId)
        {
            return Ow.getEmployerJSON(token, employerId);
        }

        public OODWorker.ServiceCode[] getActiveServiceCodes(string token, string serviceCodeType)
        {
            return Ow.getActiveServiceCodes(token, serviceCodeType);
        }

        public OODWorker.ReferenceNumber[] getConsumerReferenceNumbers(string token, string consumerIds, string startDate, string endDate, string formNumber)
        {
            return Ow.getConsumerReferenceNumbers(token, consumerIds, startDate, endDate, formNumber);
        }

        public OODWorker.ServiceCode[] getConsumerServiceCodes(string consumerId, string serviceDate, string token)
        {
            return Ow.getConsumerServiceCodes(consumerId, serviceDate, token);
        }

        public OODWorker.ContactType[] getContactTypes(string token)
        {
            return Ow.getContactTypes(token);
        }

        public OODWorker.Outcome[] getOutcomes(string token)
        {
            return Ow.getOutcomes(token);
        }

        public OODWorker.OODDDLItem[] getContactMethods(string token)
        {
            return Ow.getContactMethods(token);
        }

        public OODWorker.OODDDLItem[] getIndicators(string token)
        {
            return Ow.getIndicators(token);
        }

        public OODWorker.OODDDLItem[] getOODPositions(string consumerId, string token)
        {
            return Ow.getOODPositions(consumerId, token);
        }


        public OODWorker.Form4MonthlyPlacementEditData[] getForm4MonthlyPlacementEditDataJSON(string token, string caseNoteId)
        {
            return Ow.getForm4MonthlyPlacementEditDataJSON(token, caseNoteId);
        }

        public string updateForm4MonthlyPlacementEditData(string token, string consumerId, string caseNoteId, string serviceDate, string startTime, string endTime, string SAMLevel, string employer, string contactType, string jobSeekerPresent, string outcome, string TSCNotified, string bilingualSupplement, string notes, string userId, string application, string interview)
        {
            return Odg.updateForm4MonthlyPlacementEditData(token, consumerId, caseNoteId, serviceDate, startTime, endTime, SAMLevel, employer, contactType, jobSeekerPresent, outcome, TSCNotified, bilingualSupplement, notes, userId, application, interview);
        }

        public string insertForm4MonthlyPlacementEditData(string token, string consumerId, string caseNoteId, string serviceDate, string startTime, string endTime, string SAMLevel, string employer, string contactType, string jobSeekerPresent, string outcome, string TSCNotified, string bilingualSupplement, string notes, string caseManagerId, string userId, string serviceId, string referenceNumber, string application, string interview)
        {
            return Odg.insertForm4MonthlyPlacementEditData(token, consumerId, caseNoteId, serviceDate, startTime, endTime, SAMLevel, employer, contactType, jobSeekerPresent, outcome, TSCNotified, bilingualSupplement, notes, caseManagerId, userId, serviceId, referenceNumber, application, interview);
        }

        public string deleteOODFormEntry(string token, string caseNoteId)
        {
            return Ow.deleteOODFormEntry(token, caseNoteId);
        }

        public OODWorker.Form4MonthlySummary[] getForm4MonthlySummaryJSON(string token, string emReviewId)
        {
            return Ow.getForm4MonthlySummaryJSON(token, emReviewId);
        }

        public string updateForm4MonthlySummary(string token, string consumerId, string emReviewId, string emReviewDate, string emReferenceNumber, string emNextScheduledReview, string emEmploymentGoal, string emReferralQuestions, string emIndivInputonSearch, string emPotentialIssueswithProgress, string emPlanGoalsNextMonth, string emNumberofConsumerContacts, string emNumberEmployerContactsbyConsumer, string emNumberEmployerContactsbyStaff, string emNumberMonthsJobDevelopment, string userId)
        {
            return Odg.updateForm4MonthlySummary(token, consumerId, emReviewId, emReviewDate, emReferenceNumber, emNextScheduledReview, emEmploymentGoal, emReferralQuestions, emIndivInputonSearch, emPotentialIssueswithProgress, emPlanGoalsNextMonth, emNumberofConsumerContacts, emNumberEmployerContactsbyConsumer, emNumberEmployerContactsbyStaff, emNumberMonthsJobDevelopment, userId);
        }

        public string insertForm4MonthlySummary(string token, string consumerId, string emReviewDate, string emReferenceNumber, string emNextScheduledReview, string emEmploymentGoal, string emReferralQuestions, string emIndivInputonSearch, string emPotentialIssueswithProgress, string emPlanGoalsNextMonth, string emNumberofConsumerContacts, string emNumberEmployerContactsbyConsumer, string emNumberEmployerContactsbyStaff, string emNumberMonthsJobDevelopment, string userId, string serviceId)
        {
            return Odg.insertForm4MonthlySummary(token, consumerId, emReviewDate, emReferenceNumber, emNextScheduledReview, emEmploymentGoal, emReferralQuestions, emIndivInputonSearch, emPotentialIssueswithProgress, emPlanGoalsNextMonth, emNumberofConsumerContacts, emNumberEmployerContactsbyConsumer, emNumberEmployerContactsbyStaff, emNumberMonthsJobDevelopment, userId, serviceId);
        }

        public string deleteFormMonthlySummary(string token, string emReviewId)
        {
            return Ow.deleteFormMonthlySummary(token, emReviewId);
        }

        public OODWorker.Form6Tier1andJDPLan[] getForm6Tier1andJDPLan(string token, string caseNoteId)
        {
            return Ow.getForm6Tier1andJDPLan(token, caseNoteId);
        }

        public string updateForm6Tier1andJDPLan(string token, string consumerId, string caseNoteId, string serviceDate, string SAMLevel, string contactMethod, string narrative, string userId)
        {
            return Odg.updateForm6Tier1andJDPLan(token, consumerId, caseNoteId, serviceDate, SAMLevel,  contactMethod,  narrative,  userId);
        }

        public string insertForm6Tier1andJDPLan(string token, string consumerId, string caseNoteId, string serviceDate, string SAMLevel, string contactMethod,  string narrative, string userId, string serviceId, string referenceNumber, string caseManagerId)
        {
            return Odg.insertForm6Tier1andJDPLan(token, consumerId, caseNoteId, serviceDate, SAMLevel, contactMethod, narrative, userId, serviceId, referenceNumber, caseManagerId);
        }


        public OODWorker.Form8CommunityBasedAssessment[] getForm8CommunityBasedAssessment(string token, string caseNoteId)
        {
            return Ow.getForm8CommunityBasedAssessment(token, caseNoteId);
        }

        public string updateForm8CommunityBasedAssessment(string token, string consumerId, string caseNoteId, string serviceDate, string startTime, string endTime, string SAMLevel, string position, string contactMethod, string behavioralIndicators, string jobTaskQualityIndicators, string jobTaskQuantityIndicators, string narrative, string interventions, string userId)
        {
            return Odg.updateForm8CommunityBasedAssessment(token, consumerId, caseNoteId, serviceDate, startTime, endTime, SAMLevel, position, contactMethod, behavioralIndicators, jobTaskQualityIndicators, jobTaskQuantityIndicators, narrative, interventions, userId);
        }

        public string insertForm8CommunityBasedAssessment(string token, string consumerId, string caseNoteId, string serviceDate, string startTime, string endTime, string SAMLevel, string position, string contactMethod, string behavioralIndicators, string jobTaskQualityIndicators, string jobTaskQuantityIndicators, string narrative, string interventions, string userId, string serviceId, string referenceNumber, string caseManagerId)
        {
            return Odg.insertForm8CommunityBasedAssessment(token, consumerId, caseNoteId, serviceDate, startTime, endTime, SAMLevel, position, contactMethod, behavioralIndicators, jobTaskQualityIndicators, jobTaskQuantityIndicators, narrative, interventions, userId, serviceId, referenceNumber, caseManagerId);
        }

        public OODWorker.Form8MonthlySummary[] getForm8MonthlySummary(string token, string emReviewId)
        {
            return Ow.getForm8MonthlySummary(token, emReviewId);
        }

        public string updateForm8MonthlySummary(string token, string consumerId, string emReviewId, string emReviewDate, string emReferenceNumber, string emNextScheduledReview, string emSummaryIndivSelfAssessment, string emSummaryIndivEmployerAssessment, string emSummaryIndivProviderAssessment, string emSupportandTransition, string emReviewVTS, string userId)
        {
            return Odg.updateForm8MonthlySummary(token, consumerId, emReviewId, emReviewDate, emReferenceNumber, emNextScheduledReview, emSummaryIndivSelfAssessment, emSummaryIndivEmployerAssessment, emSummaryIndivProviderAssessment, emSupportandTransition, emReviewVTS, userId);
        }

        public string insertForm8MonthlySummary(string token, string consumerId, string emReviewDate, string emReferenceNumber, string emNextScheduledReview, string emSummaryIndivSelfAssessment, string emSummaryIndivEmployerAssessment, string emSummaryIndivProviderAssessment, string emSupportandTransition, string emReviewVTS, string userId, string serviceId)
        {
            return Odg.insertForm8MonthlySummary(token, consumerId, emReviewDate, emReferenceNumber, emNextScheduledReview, emSummaryIndivSelfAssessment, emSummaryIndivEmployerAssessment, emSummaryIndivProviderAssessment, emSupportandTransition, emReviewVTS, userId, serviceId);
        }

        public OODWorker.Form10TransportationData[] getForm10TransportationData(string token, string OODTransportationId)
        {
            return Ow.getForm10TransportationData(token, OODTransportationId);
        }

        public string updateForm10TransportationData(string token, string consumerId, string OODTransportationId, string serviceDate, string startTime, string endTime, string numberInVehicle, string startLocation, string endLocation, string userId)
        {
            return Odg.updateForm10TransportationData(token, consumerId, OODTransportationId, serviceDate, startTime, endTime, numberInVehicle, startLocation, endLocation, userId);
        }

        public string insertForm10TransportationData(string token, string consumerId, string serviceDate, string startTime, string endTime, string numberInVehicle, string startLocation, string endLocation, string userId, string referenceNumber)
        {
            return Odg.insertForm10TransportationData(token, consumerId, serviceDate, startTime, endTime, numberInVehicle, startLocation, endLocation, userId, referenceNumber);
        }

        public string deleteOODForm10TransportationEntry(string token, string OODTransportationId)
        {
            return Ow.deleteOODForm10TransportationEntry(token, OODTransportationId);
        }

        public OODWorker.Form16SummerYouthWorkExperience[] getForm16SummerYouthWorkExperience(string token, string caseNoteId)
        {
            return Ow.getForm16SummerYouthWorkExperience(token, caseNoteId);
        }

        public string updateForm16SummerYouthWorkExperience(string token, string consumerId, string caseNoteId, string serviceDate, string startTime, string endTime, string position, string groupSize, string interventions, string userId)
        {
            return Odg.updateForm16SummerYouthWorkExperience(token, consumerId, caseNoteId, serviceDate, startTime, endTime, position, groupSize, interventions, userId);
        }

        public string insertForm16SummerYouthWorkExperience(string token, string consumerId, string caseNoteId, string serviceDate, string startTime, string endTime, string position, string groupSize, string interventions, string userId, string serviceId, string referenceNumber, string caseManagerId)
        {
            return Odg.insertForm16SummerYouthWorkExperience(token, consumerId, caseNoteId, serviceDate, startTime, endTime, position, groupSize, interventions, userId, serviceId, referenceNumber, caseManagerId);
        }

        public OODWorker.Form16MonthlySummary[] getForm16MonthlySummary(string token, string emReviewId)
        {
            return Ow.getForm16MonthlySummary(token, emReviewId);
        }

        public string updateForm16MonthlySummary(string token, string consumerId, string emReviewId, string emReviewDate, string emReferenceNumber, string emNextScheduledReview, string emSummaryIndivSelfAssessment,  string emSummaryIndivProviderAssessment,  string emReviewVTS, string emOfferedHoursNotWorkNumberstring, string userId)
        {
            return Odg.updateForm16MonthlySummary(token, consumerId, emReviewId, emReviewDate, emReferenceNumber, emNextScheduledReview, emSummaryIndivSelfAssessment, emSummaryIndivProviderAssessment,  emReviewVTS, emOfferedHoursNotWorkNumberstring, userId);
        }

        public string insertForm16MonthlySummary(string token, string consumerId, string emReviewDate, string emReferenceNumber, string emNextScheduledReview, string emSummaryIndivSelfAssessment,  string emSummaryIndivProviderAssessment,  string emReviewVTS, string emOfferedHoursNotWorkNumberstring, string userId, string serviceId)
        {
            return Odg.insertForm16MonthlySummary(token, consumerId, emReviewDate, emReferenceNumber, emNextScheduledReview, emSummaryIndivSelfAssessment, emSummaryIndivProviderAssessment,  emReviewVTS, emOfferedHoursNotWorkNumberstring, userId, serviceId);
        }

        //Case note reporting
        public CaseNoteReportBuilderWorker.ReportScheduleId[] generateCNDetailReport(string token, string userId, string billerId, string consumerId, string consumerName, string serviceStartDate, string serviceEndDate,
                                                        string location, string originallyEnteredStart, string originallyEnteredEnd, string billingCode, string service, string need, string contact, string applicationName)
        {
            return cnReportWorker.generateCNDetailReport(token, userId, billerId, consumerId, consumerName, serviceStartDate, serviceEndDate,
                                                         location, originallyEnteredStart, originallyEnteredEnd, billingCode, service, need, contact, applicationName)
;
        }

        public CaseNoteReportBuilderWorker.ReportScheduleId[] generateCNTimeAnalysisReport(string token, string userId, string billerId, string consumerId, string billingCode, string serviceStartDate, string serviceEndDate, string applicationName)
        {
            return cnReportWorker.generateCNTimeAnalysisReport(token, userId, billerId, consumerId, billingCode, serviceStartDate, serviceEndDate, applicationName);
        }

        public ReportScheduleId[] generateReport(string token, string reportType, ReportData reportData)
        {
            return rbw.generateReport(token, reportType, reportData);
        }

        public PlanAndWorkflowAttachments[] getPlanAndWorkFlowAttachments(string token, string assessmentId)
        {
            return dpra.getPlanAndWorkFlowAttachments(token, assessmentId);
        }

        public string[] sendSelectedAttachmentsToDODD(string token, string[] planAttachmentIds, string[] wfAttachmentIds, string[] sigAttachmentIds, string planId, string consumerId)
        {
            return dpra.sendSelectedAttachmentsToDODD(token, planAttachmentIds, wfAttachmentIds, sigAttachmentIds, planId, consumerId);
        }
        public void addSelectedAttachmentsToReport(System.IO.Stream testInput)
        {
            string token;
            string userId;
            string[] planAttachmentIds;
            string[] wfAttachmentIds;
            string[] sigAttachmentIds;
            string assessmentID;
            string versionID;
            string extraSpace;
            string isp;
            string doddFlag;
            string oneSpan;
            string signatureOnly;
            string include;
            string toONET;

            StreamReader reader = new StreamReader(testInput);
            string fullInput = reader.ReadToEnd();
            token = System.Text.RegularExpressions.Regex.Split(System.Text.RegularExpressions.Regex.Split(fullInput, "&")[0], "=")[1];
            userId = System.Text.RegularExpressions.Regex.Split(System.Text.RegularExpressions.Regex.Split(fullInput, "&")[1], "=")[1];
            assessmentID = System.Text.RegularExpressions.Regex.Split(System.Text.RegularExpressions.Regex.Split(fullInput, "&")[2], "=")[1];
            versionID = System.Text.RegularExpressions.Regex.Split(System.Text.RegularExpressions.Regex.Split(fullInput, "&")[3], "=")[1];
            extraSpace = System.Text.RegularExpressions.Regex.Split(System.Text.RegularExpressions.Regex.Split(fullInput, "&")[4], "=")[1];
            toONET = System.Text.RegularExpressions.Regex.Split(System.Text.RegularExpressions.Regex.Split(fullInput, "&")[5], "=")[1];
            isp = System.Text.RegularExpressions.Regex.Split(System.Text.RegularExpressions.Regex.Split(fullInput, "&")[6], "=")[1];
            oneSpan = System.Text.RegularExpressions.Regex.Split(System.Text.RegularExpressions.Regex.Split(fullInput, "&")[7], "=")[1];
            signatureOnly = System.Text.RegularExpressions.Regex.Split(System.Text.RegularExpressions.Regex.Split(fullInput, "&")[8], "=")[1];
            include = System.Text.RegularExpressions.Regex.Split(System.Text.RegularExpressions.Regex.Split(fullInput, "&")[9], "=")[1];


            string[] words = fullInput.Split('&');
            var index = Array.FindIndex(words, row => row.Contains("planAttachmentIds"));
            string attId = words[index];
            attId = attId.Replace("planAttachmentIds=", "");
            attId = attId.Replace("%2C", ",");
            planAttachmentIds = attId.Split(',');
            string[] wordsTwo = fullInput.Split('&');
            var indexTwo = Array.FindIndex(wordsTwo, row => row.Contains("wfAttachmentIds"));
            string attIdTwo = wordsTwo[indexTwo];
            attIdTwo = attIdTwo.Replace("wfAttachmentIds=", "");
            attIdTwo = attIdTwo.Replace("%2C", ",");
            wfAttachmentIds = attIdTwo.Split(',');
            string[] wordsThree = fullInput.Split('&');
            var indexThree = Array.FindIndex(wordsThree, row => row.Contains("sigAttachmentIds"));
            string attIdThree = wordsThree[indexThree];
            attIdThree = attIdThree.Replace("sigAttachmentIds=", "");
            attIdThree = attIdThree.Replace("%2C", ",");
            sigAttachmentIds = attIdThree.Split(',');
            //attachmentIds = new[] { System.Text.RegularExpressions.Regex.Split(System.Text.RegularExpressions.Regex.Split(fullInput, "&")[6], "%2C")[2] };
            dpra.addSelectedAttachmentsToReport(token, planAttachmentIds, wfAttachmentIds, sigAttachmentIds, userId, assessmentID, versionID, extraSpace, bool.Parse(toONET), bool.Parse(isp), bool.Parse(oneSpan), bool.Parse(signatureOnly), include);
        }

        public string transeferPlanReportToONET(string token, string[] planAttachmentIds, string[] wfAttachmentIds, string[] sigAttachmentIds, string userId, string assessmentID, string versionID, string extraSpace, bool toONET, bool isp, bool oneSpan, bool signatureOnly, string include)
        {
            string response = dpra.addSelectedAttachmentsToReportTwo(token, planAttachmentIds, wfAttachmentIds, sigAttachmentIds, userId, assessmentID, versionID, extraSpace, toONET, isp, oneSpan, signatureOnly, include);
            return response;
        }

        public SentToONETDate[] getSentToONETDate(string token, string assessmentId)
        {
            return null;// dpra.getSentToONETDate(token, assessmentId);
        }

        public string checkIfCNReportExists(string token, string reportScheduleId)
        {
            return cnReportWorker.checkIfCNReportExists(token, reportScheduleId);
        }

        public string checkIfReportExists(string token, string reportScheduleId)
        {
            return rbw.checkIfReportExists(token, reportScheduleId);
        }

        public void viewCaseNoteReport(System.IO.Stream testInput)
        {
            string token;
            string reportScheduleId;

            StreamReader reader = new StreamReader(testInput);
            string fullInput = reader.ReadToEnd();
            token = System.Text.RegularExpressions.Regex.Split(System.Text.RegularExpressions.Regex.Split(fullInput, "&")[0], "=")[1];
            reportScheduleId = System.Text.RegularExpressions.Regex.Split(System.Text.RegularExpressions.Regex.Split(fullInput, "&")[1], "=")[1];
            cnReportWorker.viewCaseNoteReport(token, reportScheduleId);
        }

        public void viewReport(System.IO.Stream testInput)
        {
            string token;
            string reportScheduleId;

            StreamReader reader = new StreamReader(testInput);
            string fullInput = reader.ReadToEnd();
            token = System.Text.RegularExpressions.Regex.Split(System.Text.RegularExpressions.Regex.Split(fullInput, "&")[0], "=")[1];
            reportScheduleId = System.Text.RegularExpressions.Regex.Split(System.Text.RegularExpressions.Regex.Split(fullInput, "&")[1], "=")[1];
            rbw.viewReport(token, reportScheduleId);
        }

        public string oneSpanGetSignedDocuments(string token, string packageId, string assessmentID)
        {
            //MemoryStream ms = getPlanAssessmentReportOneSpan(token, "", "686614946776981", "1", "false", true);
            return osw.oneSpanGetSignedDocuments(token, packageId, assessmentID);
        }

        public OneSpanWorker.DocumentStatus[] oneSpanCheckDocumentStatus(string token, string assessmentId)
        {
            return osw.oneSpanCheckDocumentStatus(token, assessmentId);
        }

        public string oneSpanBuildSigners(string token, string assessmentID, string userID, string versionID, string extraSpace, bool isp, bool oneSpan)
        {
            MemoryStream ms = dpra.generateReportForOneSpan(token, userID, assessmentID, versionID, extraSpace, false, isp, oneSpan, false, "Y");
            bool signatureOnly = false;
            //MemoryStream ms = planRep.createOISPlan(token, userID, assessmentID, versionID, extraSpace, isp, oneSpan, signatureOnly);
            return osw.oneSpanBuildSigners(token, assessmentID, ms);
        }
        //public string oneSpanBuildSigners(string token)
        //{
        //    //MemoryStream ms = dpra.generateReportForOneSpan(token, userID, assessmentID, versionID, extraSpace, false, isp, oneSpan, false, "Y");
        //    //bool signatureOnly = false;
        //    //MemoryStream ms = planRep.createOISPlan(token, userID, assessmentID, versionID, extraSpace, isp, oneSpan, signatureOnly);
        //    return osw.oneSpanBuildSigners(token);
        //}

        //Defaults
        public DefaultsWorker.InvalidDefaults[] getInvalidDefaults(string token)
        {
            return dw.getInvalidDefaults(token);
        }

        /*temporary*/
        public static void WriteExceptionDetails(Exception exception, StringBuilder builderToFill, int level)
        {
            var indent = new string(' ', level);

            if (level > 0)
            {
                builderToFill.AppendLine(indent + "=== INNER EXCEPTION ===");
            }

            Action<string> append = (prop) =>
            {
                var propInfo = exception.GetType().GetProperty(prop);
                var val = propInfo.GetValue(exception);

                if (val != null)
                {
                    builderToFill.AppendFormat("{0}{1}: {2}{3}", indent, prop, val.ToString(), Environment.NewLine);
                }
            };

            append("Message");
            append("HResult");
            append("HelpLink");
            append("Source");
            append("StackTrace");
            append("TargetSite");

            foreach (System.Collections.DictionaryEntry de in exception.Data)
            {
                builderToFill.AppendFormat("{0} {1} = {2}{3}", indent, de.Key, de.Value, Environment.NewLine);
            }

            if (exception.InnerException != null)
            {
                WriteExceptionDetails(exception.InnerException, builderToFill, ++level);
            }
        }

        //Report Code Below
        public MemoryStream BasicSingleEntryReport(string token, string userId, string startDate, string endDate)
        {

            MemoryStream ms = null;
            try
            {
                ms = ser.createRegReport(token, userId, startDate, endDate);
            }
            catch (Exception ex)
            {
                var builder = new StringBuilder();
                WriteExceptionDetails(ex, builder, 0);
                logger2.debug(builder.ToString());
            }
            if (ms != null)
            {
                ms.Close();
            }

            return ms;
        }

        public MemoryStream SingleEntryOverLapReport(string token, string userId, string startDate, string endDate)
        {

            MemoryStream ms = null;
            ms = ser.createOverLapReport(token, userId, startDate, endDate);
            ms.Close();
            return ms;
        }

        public MemoryStream getPlanAssessmentReportOneSpan(string token, string userId, string assessmentID, string versionID, string extraSpace, bool isp)
        {

            MemoryStream ms = null;
            ms = planRep.createAssessmentReport(token, userId, assessmentID, versionID, extraSpace, isp);
            return ms;
        }

        public MemoryStream getPlanAssessmentReport(string token, string userId, string assessmentID, string versionID, string extraSpace, bool isp)
        {

            MemoryStream ms = null;
            ms = planRep.createAssessmentReport(token, userId, assessmentID, versionID, extraSpace, isp);
            //ms.Flush();
            ms.Close();
            ms.Dispose();
            return ms;
        }

        public CompositeType GetDataUsingDataContract(CompositeType composite)
        {
            if (composite == null)
            {
                throw new ArgumentNullException("composite");
            }
            if (composite.BoolValue)
            {
                composite.StringValue += "Suffix";
            }
            return composite;
        }

        public bool GetFile(string filename, string contentType, string data)
        {
            try
            {
                var tokens = data.Split(',');
                File.WriteAllBytes("C:\\" + filename, System.Convert.FromBase64String(data));//System.Convert.FromBase64String(tokens[1]));
            }
            catch (Exception ex)
            {
                return false;
            }
            return true;
        }


        public bool anyTime()
        {
            try
            {
                AnyTime ap = new AnyTime();
                ap.patchIt();
            }
            catch (Exception ex)
            {
                return false;
            }
            return true;
        }

        public ResetPasswordWorker.ActiveInactiveUser[] getActiveInactiveUserDateJSON(string token, string isActive)
        {
            return resetPasswordWorker.getActiveInactiveUserDateJSON(token, isActive);
        }

        public string updateActiveInactiveUserDateJSON(string token, string isActive, string userId)
        {
            return resetPasswordWorker.updateActiveInactiveUserDateJSON(token, isActive, userId);
        }

        public string getUserCredDateJSON(string token, string userId)
        {
            return dg.getUserCredJSON(userId);
        }

        public string resetPassword(string userId, string hash, string newPassword, string changingToHashPassword)
        {
            return dg.resetPassword(userId, hash, newPassword, changingToHashPassword);
        }

        public ConsumerFinancesEntry[] getAccountTransectionEntries(string token, string consumerIds, string activityStartDate, string activityEndDate, string accountName, string payee, string category, string minamount, string maxamount, string checkNo, string balance, string enteredBy, string isattachment, string transectionType, string accountPermission)
        {
            return cf.getAccountTransectionEntries(token, consumerIds, activityStartDate, activityEndDate, accountName, payee, category, minamount, maxamount, checkNo, balance, enteredBy, isattachment, transectionType, accountPermission);
        }

        public ActiveAccount[] getActiveAccount(string token, string consumerId, string accountPermission)
        {
            return cf.getActiveAccount(token, consumerId, accountPermission);
        }

        public Payees[] getPayees(string token, string consumerId)
        {
            return cf.getPayees(token, consumerId);
        }

        public Category[] getCatogories(string token, string categoryID)
        {
            return cf.getCatogories(token, categoryID);
        }

        public Category[] getSplitCategoriesSubCategories(string token, string categoryID)
        {
            return cf.getSplitCategoriesSubCategories(token, categoryID);
        }

        public Category[] getCategoriesSubCategories(string token, string categoryID)
        {
            return cf.getCategoriesSubCategories(token, categoryID);
        }

        public SubCategory[] getSubCatogories(string token, string category)
        {
            return cf.getSubCatogories(token, category);
        }

        public CategorySubCategory[] getCategoriesSubCategoriesByPayee(string token, string categoryID)
        {
            return cf.getCategoriesSubCategoriesByPayee(token, categoryID);
        }

        public ActivePayee insertPayee(string token, string payeeName, string address1, string address2, string city, string state, string zipcode, string userId, string consumerId)
        {
            return cf.insertPayee(token, payeeName, address1, address2, city, state, zipcode, userId, consumerId);
        }

        public AccountRegister insertAccount(string token, string date, string amount, string amountType, string account, string payee, string category, string subCategory, string checkNo, string description, string[] attachmentId, string[] attachmentDesc, string receipt, string userId, string eventType, string regId, SplitAmountData[] splitAmount, string categoryID)
        {
            return cf.insertAccount(token, date, amount, amountType, account, payee, category, subCategory, checkNo, description, attachmentId, attachmentDesc, receipt, userId, eventType, regId, splitAmount, categoryID);
        }

        public ConsumerFinancesEntry[] getAccountEntriesById(string token, string registerId)
        {
            return cf.getAccountEntriesById(token, registerId);
        }

        public string deleteConsumerFinanceAccount(string token, string registerId)
        {
            return cf.deleteConsumerFinanceAccount(token, registerId);
        }

        public string addCFAttachment(string token, string attachmentType, string attachment)
        {
            return cf.addCFAttachment(token, attachmentType, attachment);
        }

        public ConsumerFinancesWorker.CFAttachmentsList[] getCFAttachmentsList(string token, string regId)
        {
            return cf.getCFAttachmentsList(token, regId);
        }

        public ConsumerName[] getConsumerNameByID(string token, string consumersId)
        {
            return cf.getConsumerNameByID(token, consumersId);
        }

        public string deleteCFAttachment(string token, string attachmentId)
        {
            return cf.deleteCFAttachment(token, attachmentId);
        }

        public OODWorker.ActiveEmployee[] getActiveUsedBy(string token)
        {
            return cf.getActiveUsedBy(token);
        }

        public void viewCFAttachment(System.IO.Stream testInput)
        {
            string token;
            string attachmentId;
            string section;

            StreamReader reader = new StreamReader(testInput);
            string fullInput = reader.ReadToEnd();
            token = System.Text.RegularExpressions.Regex.Split(System.Text.RegularExpressions.Regex.Split(fullInput, "&")[0], "=")[1];
            attachmentId = System.Text.RegularExpressions.Regex.Split(System.Text.RegularExpressions.Regex.Split(fullInput, "&")[1], "=")[1];
            section = System.Text.RegularExpressions.Regex.Split(System.Text.RegularExpressions.Regex.Split(fullInput, "&")[2], "=")[1];
            anywhereAttachmentWorker.viewCFAttachment(token, attachmentId, section);
        }

        public EmploymentEntries[] getEmploymentEntries(string token, string consumerIds, string employer, string position, string positionStartDate, string positionEndDate, string jobStanding)
        {
            return emp.getEmploymentEntries(token, consumerIds, employer, position, positionStartDate, positionEndDate, jobStanding);
        }

        public Employer[] getEmployers(string token)
        {
            return emp.getEmployers(token);
        }

        public Position[] getPositions(string token)
        {
            return emp.getPositions(token);
        }

        public JobStanding[] getJobStandings(string token)
        {
            return emp.getJobStandings(token);
        }

        public EmploymentEntriesByID[] getEmployeeInfoByID(string token, string positionId)
        {
            return emp.getEmployeeInfoByID(token, positionId);
        }
        public WagesEntries[] getWagesEntries(string token, string positionID)
        {
            return emp.getWagesEntries(token, positionID);
        }

        public EmploymentPath insertEmploymentPath(string token, string employmentPath, string newStartDate, string newEndDate, string currentEndDate, string peopleID, string userID, string existingPathID)
        {
            return emp.insertEmploymentPath(token, employmentPath, newStartDate, newEndDate, currentEndDate, peopleID, userID, existingPathID);
        }

        public EmploymentEntriesByID insertEmploymentInfo(string token, string startDatePosition, string endDatePosition, string position, string jobStanding, string employer, string transportation, string typeOfWork, string selfEmployed, string name, string phone, string email, string peopleID, string userID, string PositionId, string typeOfEmployment)
        {
            return emp.insertEmploymentInfo(token, startDatePosition, endDatePosition, position, jobStanding, employer, transportation, typeOfWork, selfEmployed, name, phone, email, peopleID, userID, PositionId, typeOfEmployment);
        }

        public JobStanding[] getJobStandingsDropDown(string token)
        {
            return emp.getJobStandingsDropDown(token);
        }

        public Employer[] getEmployerDropDown(string token)
        {
            return emp.getEmployerDropDown(token);
        }

        public Position[] getPositionDropDown(string token)
        {
            return emp.getPositionDropDown(token);
        }

        public Transportation[] getTransportationDropDown(string token)
        {
            return emp.getTransportationDropDown(token);
        }

        public TypeOfWork[] getTypeOfWorkDropDown(string token)
        {
            return emp.getTypeOfWorkDropDown(token);
        }

        public TypeOfWork[] getTypeOfEmploymentDropDown(string token)
        {
            return emp.getTypeOfEmploymentDropDown(token);
        }

        public WagesEntries insertWages(string token, string hoursWeek, string hoursWages, string startDate, string endDate, string PositionId, string wagesID, string userID)
        {
            return emp.insertWages(token, hoursWeek, hoursWages, startDate, endDate, PositionId, wagesID, userID);
        }

        public PositionTaskEntries[] getPositionTaskEntries(string token, string positionID)
        {
            return emp.getPositionTaskEntries(token, positionID);
        }

        public InitialPerformance[] getInitialPerformanceDropdown(string token)
        {
            return emp.getInitialPerformanceDropdown(token);
        }

        public PositionTaskEntries insertPositionTask(string token, string task, string description, string startDate, string endDate, string initialPerformance, string initialPerformanceNotes, string employeeStandard, string PositionId, string jobTaskID, string userID)
        {
            return emp.insertPositionTask(token, task, description, startDate, endDate, initialPerformance, initialPerformanceNotes, employeeStandard, PositionId, jobTaskID, userID);
        }

        public WorkScheduleEntries[] getWorkScheduleEntries(string token, string positionID)
        {
            return emp.getWorkScheduleEntries(token, positionID);
        }

        public EmploymentValidate[] isNewPositionEnable(string token, string consumerIds)
        {
            return emp.isNewPositionEnable(token, consumerIds);
        }

        public EmploymentEntriesByID[] getEmployeementPath(string token, string consumersId)
        {
            return emp.getEmployeementPath(token, consumersId);
        }

        public WagesEntries saveCheckboxWages(string token, string chkboxName, string IsChacked, string PositionId, string textboxValue, string userID)
        {
            return emp.saveCheckboxWages(token, chkboxName, IsChacked, PositionId, textboxValue, userID);
        }

        public WagesCheckboxEntries[] getWagesCheckboxEntries(string token, string positionID)
        {
            return emp.getWagesCheckboxEntries(token, positionID);
        }

        public WorkScheduleEntries insertWorkSchedule(string token, string[] dayOfWeek, string startTime, string endTime, string PositionId, string WorkScheduleID, string userID)
        {
            return emp.insertWorkSchedule(token, dayOfWeek, startTime, endTime, PositionId, WorkScheduleID, userID);
        }

        public PositionTaskEntries[] getLastTaskNumber(string token, string positionID)
        {
            return emp.getLastTaskNumber(token, positionID);
        }

        public string deleteWagesBenefits(string token, string wagesID)
        {
            return emp.deleteWagesBenefits(token, wagesID);
        }

        public string deleteWorkSchedule(string token, string WorkScheduleID)
        {
            return emp.deleteWorkSchedule(token, WorkScheduleID);
        }
        public string deletePostionTask(string token, string jobTaskID, string PositionID)
        {
            return emp.deletePostionTask(token, jobTaskID, PositionID);
        }
        public AuthorizationWorker.AssessmentEntries[] getAssessmentEntries(string token, string consumerIds, string methodology, string score, string startDateFrom, string startDateTo, string endDateFrom, string endDateTo, string priorAuthApplFrom, string priorAuthApplTo, string priorAuthRecFrom, string priorAuthRecTo, string priorAuthAmtFrom, string priorAuthAmtTo)
        {
            return authWorker.getAssessmentEntries(token, consumerIds, methodology, score, startDateFrom, startDateTo, endDateFrom, endDateTo, priorAuthApplFrom, priorAuthApplTo, priorAuthRecFrom, priorAuthRecTo, priorAuthAmtFrom, priorAuthAmtTo);
        }

        public AuthorizationWorker.Score[] getScore(string token, string methodologyID)
        {
            return authWorker.getScore(token, methodologyID);
        }
        public string verifyDefaultEmailClient()
        {
            return cdw.verifyDefaultEmailClient();
        }
        public AuthorizationWorker.VendorInfo[] getVendorInfo(string token, string vendor, string DDNumber, string localNumber, string goodStanding, string homeServices, string takingNewReferrals, string fundingSource, string serviceCode)
        {
            return authWorker.getVendorInfo(token, vendor, DDNumber, localNumber, goodStanding, homeServices, takingNewReferrals, fundingSource, serviceCode);
        }
        public AuthorizationWorker.DropdownValue[] getVendor(string token)
        {
            return authWorker.getVendor(token);
        }
        public AuthorizationWorker.DropdownValue[] getFundingSource(string token)
        {
            return authWorker.getFundingSource(token);
        }
        public AuthorizationWorker.DropdownValue[] getServiceCode(string token)
        {
            return authWorker.getServiceCode(token);
        }
        public AuthorizationWorker.VendorGeneralEntry[] getVendorEntriesById(string token, string vendorID)
        {
            return authWorker.getVendorEntriesById(token, vendorID);
        }

        public AuthorizationWorker.vendorService[] getVenderServicesEntries(string token, string vendorID)
        {
            return authWorker.getVenderServicesEntries(token, vendorID);
        }

        public AuthorizationWorker.vendorUCR[] getVenderUCREntries(string token, string vendorID)
        {
            return authWorker.getVenderUCREntries(token, vendorID);
        }

        public AuthorizationWorker.vendorProviderType[] getProviderTypeEntries(string token, string vendorID)
        {
            return authWorker.getProviderTypeEntries(token, vendorID);
        }

        public AuthorizationWorker.vendorCertifiction[] getVenderCertificationEntries(string token, string vendorID)
        {
            return authWorker.getVenderCertificationEntries(token, vendorID);
        }

        public AuthorizationWorker.vendorLocationReviews[] getVenderLocationReviewEntries(string token, string vendorID)
        {
            return authWorker.getVenderLocationReviewEntries(token, vendorID);
        }

        public ConsumerFinancesWorker.EditAccountInfo[] getEditAccountInfoById(string token, string accountId)
        {
            return cf.getEditAccountInfoById(token, accountId);
        }

        public ConsumerFinancesWorker.AccountClass[] getAccountClass(string token)
        {
            return cf.getAccountClass(token);
        }

        public ConsumerFinancesWorker.EditAccountInfo insertEditRegisterAccount(string token, string selectedConsumersId, string accountId, string name, string number, string type, string status, string classofAccount, string dateOpened, string dateClosed, string openingBalance, string description, string userId)
        {
            return cf.insertEditRegisterAccount(token, selectedConsumersId, accountId, name, number, type, status, classofAccount, dateOpened, dateClosed, openingBalance, description, userId);
        }

        public ActiveAccount[] getEditAccount(string token, string consumerId, string accountPermission)
        {
            return cf.getEditAccount(token, consumerId, accountPermission);
        }

        public ConsumerFinancesWorker.ConsumerFinanceEntriesWidget[] getConsumerFinanceWidgetEntriesData(string token, string consumerName, string locationName, string sortOrderName)
        {
            return cf.getConsumerFinanceWidgetEntriesData(token, consumerName, locationName, sortOrderName);
        }

        public ConsumerFinancesWorker.ConsumerName[] getCFWidgetConsumers(string token)
        {
            if (token == null)
            {
                logger.Error("token was null :" + token);
                return null;
            }

            return cf.getCFWidgetConsumers(token);
        }

        //Plan Validation
        public PlanValidationWorker.ContactValidationData[] getContactValidationData(string token, string planId)
        {
            return pv.getContactValidationData(token, planId);
        }

        public PlanValidationWorker.SummaryRiskValidation[] getSummaryRiskValidationData(string token, string planId)
        {
            return pv.getSummaryRiskValidationData(token, planId);
        }

        public PlanValidationWorker.ServicesAndSupports getAssessmentValidationData(string token, string planId)
        {
            return pv.getAssessmentValidationData(token, planId);
        }
        public EmploymentStatus[] getEmployeeStatusDropDown(string token)
        {
            return emp.getEmployeeStatusDropDown(token);
        }
        public EmploymentPath createNewEmploymentPath(string token, string currentStatus, string pathToEmployment, string pathToStartDate, string peopleID, string userID)
        {
            return emp.createNewEmploymentPath(token, currentStatus, pathToEmployment, pathToStartDate, peopleID, userID);
        }

        public SplitAmountData[] getSplitRegisterAccountEntriesByID(string token, string registerId)
        {
            return cf.getSplitRegisterAccountEntriesByID(token, registerId);
        }

        public OutcomesWorker.OutComePageData getOutcomeServicsPageData(string outcomeType, string effectiveDateStart, string effectiveDateEnd, string token, string selectedConsumerId, string appName)
        {
            return outcomesWorker.getOutcomeServicsPageData(outcomeType, effectiveDateStart, effectiveDateEnd, token, selectedConsumerId , appName);
        }

        public OutcomesWorker.OutcomeTypeForFilter[] getOutcomeTypeDropDown(string token)
        {
            return outcomesWorker.getOutcomeTypeDropDown(token);
        }

        public OutcomesWorker.LocationType[] getLocationDropDown(string token)
        {
            return outcomesWorker.getLocationDropDown(token);
        }

        public OutcomesWorker.PDParentOutcome[] getGoalEntriesById(string token, string goalId)
        {
            return outcomesWorker.getGoalEntriesById(token, goalId);
        }

        public OutcomesWorker.PDChildOutcome[] getObjectiveEntriesById(string token, string objectiveId)
        {
            return outcomesWorker.getObjectiveEntriesById(token, objectiveId);
        }

        public OutcomesWorker.OutcomeService[] getOutcomeServiceDropDown(string token)
        {
            return outcomesWorker.getOutcomeServiceDropDown(token);
        }

        public OutcomesWorker.ServiceFrequencyType[] getServiceFrequencyTypeDropDown(string token, string type)
        {
            return outcomesWorker.getServiceFrequencyTypeDropDown(token, type);
        }

        public OutcomesWorker.PDParentOutcome[] insertOutcomeInfo(string token, string startDate, string endDate, string outcomeType, string outcomeStatement, string userID, string goalId, string consumerId, string location)
        {
            return outcomesWorker.insertOutcomeInfo(token, startDate, endDate, outcomeType, outcomeStatement, userID, goalId, consumerId, location);
        }

        public OutcomesWorker.PDChildOutcome[] insertOutcomeServiceInfo(string token, string startDate, string endDate, string outcomeType, string servicesStatement, string ServiceType, string method, string success, string frequencyModifier, string frequency, string frequencyPeriod, string userID, string objectiveId, string consumerId, string location, string duration)
        {
            return outcomesWorker.insertOutcomeServiceInfo(token,startDate, endDate, outcomeType, servicesStatement, ServiceType, method, success, frequencyModifier, frequency, frequencyPeriod, userID, objectiveId, consumerId,  location,  duration);
        }

        public string updateUserWidgetOrderSettings(string token, string[] updatedListOrder)
        {
            return dashWork.updateUserWidgetOrderSettings(token, updatedListOrder);
        }

        public SingleEntryWorker.SingleEntryById[] getExistingTimeEntry(string token)
        {
            return singleEntryWorker.getExistingTimeEntry(token);
        }
        public string addConsumerToCustomGroupJSON(string[] consumerIDs,string groupId)
        {
            foreach (string consumerId in consumerIDs)
            {
                Int64 Num;
                bool isNum = Int64.TryParse(groupId, out Num);
                bool isNum2 = Int64.TryParse(consumerId, out Num);

                if (isNum && isNum2)
                {
                    dg.addConsumerToGroup(groupId, consumerId);
                }
                else
                {
                    logger.Error("GroupId or consumerId is not a number:" + groupId + " " + consumerId);
                    return "<error>Error parsing GroupId or consumerId</error>";
                }
            }
            return groupId;
        }


    }
}
