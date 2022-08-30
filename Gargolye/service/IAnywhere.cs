using Anywhere.Data;
using Anywhere.service.Data;
using Anywhere.service.Data.Covid;
using Anywhere.service.Data.Plan;
using Anywhere.service.Data.CaseNoteSSA;
using Anywhere.service.Data.Transportation;
using Anywhere.service.Data.Plan.Assessment;
using Anywhere.service.Data.PlanOutcomes;
using Anywhere.service.Data.PlanServicesAndSupports;
using Anywhere.service.Data.PlanInformedConsent;
using Anywhere.service.Data.PlanSignature;
using Anywhere.service.Data.PlanContactInformation;
using Anywhere.service.Data.PlanIntroduction;
using Anywhere.service.Data.PlanDiscoveryAssessmentSummary;
using Anywhere.service.Data.Defaults;
using Anywhere.service.Data.AssessmentReOrderRows;
using System;
using System.Collections.Generic;
using System.Drawing;
using System.Linq;
using System.Runtime.Serialization;
using System.ServiceModel;
using System.ServiceModel.Web;
using System.Text;
using System.Data;
using Newtonsoft.Json.Linq;
using Anywhere.service.Data.CaseNoteReportBuilder;
using Anywhere.service.Data.DocumentConversion;

namespace Anywhere
{
    [ServiceContract]
    public interface IAnywhere
    {
        [OperationContract]
        [WebInvoke(Method = "POST",
             BodyStyle = WebMessageBodyStyle.Wrapped,
             ResponseFormat = WebMessageFormat.Json,
             RequestFormat = WebMessageFormat.Json,
             UriTemplate = "/getLocations/")]
        string getLocations(string token);//MAT need to see if I can remove

        [OperationContract]
        [WebInvoke(Method = "POST",
                 BodyStyle = WebMessageBodyStyle.Wrapped,
                 ResponseFormat = WebMessageFormat.Json,
                 RequestFormat = WebMessageFormat.Json,
                 UriTemplate = "/getLocationsAndResidencesJSON/")]
        SingleEntryWorker.LocationsAndResidences[] getLocationsAndResidencesJSON(string token);//MAT need to see if I can remove

    //New form of above
    [OperationContract]
        [WebInvoke(Method = "POST",
             BodyStyle = WebMessageBodyStyle.Wrapped,
             ResponseFormat = WebMessageFormat.Json,
             RequestFormat = WebMessageFormat.Json,
             UriTemplate = "/getLocationsJSON/")]
        AnywhereWorker.RosterLocations[] getLocationsJSON(string token);

        [OperationContract]
        [WebInvoke(Method = "POST",
             BodyStyle = WebMessageBodyStyle.Wrapped,
             ResponseFormat = WebMessageFormat.Json,
             RequestFormat = WebMessageFormat.Json,
             UriTemplate = "/getDayServiceLocationsJSON/")]
        DayServicesWorker.DayServiceLocations[] getDayServiceLocationsJSON(string token, string serviceDate);

        [OperationContract]
        [WebInvoke(Method = "POST",
             BodyStyle = WebMessageBodyStyle.Wrapped,
             ResponseFormat = WebMessageFormat.Json,
             RequestFormat = WebMessageFormat.Json,
             UriTemplate = "/getDayServiceGroups/")]
        DayServicesWorker.DayServiceGroups[] getDayServiceGroups(string token, string locationId);

        [OperationContract]
        [WebInvoke(Method = "POST",
             BodyStyle = WebMessageBodyStyle.Wrapped,
             ResponseFormat = WebMessageFormat.Json,
             RequestFormat = WebMessageFormat.Json,
             UriTemplate = "/getDayServiceGetEnabledConsumers/")]
        DayServicesWorker.EnabledConsumers[] getDayServiceGetEnabledConsumers(string serviceDate, string locationId);

        [OperationContract]
        [WebInvoke(Method = "POST",
             BodyStyle = WebMessageBodyStyle.Wrapped,
             ResponseFormat = WebMessageFormat.Json,
             RequestFormat = WebMessageFormat.Json,
             UriTemplate = "/getDSIsLocationBatched/")]
        DayServicesWorker.BatchedBillingId[] getDSIsLocationBatched(string token, string locationId, string serviceDate);

        [OperationContract]
        [WebInvoke(Method = "POST",
             BodyStyle = WebMessageBodyStyle.Wrapped,
             ResponseFormat = WebMessageFormat.Json,
             RequestFormat = WebMessageFormat.Json,
             UriTemplate = "/getConsumerGroups/")]
        string GetConsumerGroups(string locationId, string token);

        //MAT Delete above when finsihed
        [OperationContract]
        [WebInvoke(Method = "POST",
             BodyStyle = WebMessageBodyStyle.Wrapped,
             ResponseFormat = WebMessageFormat.Json,
             RequestFormat = WebMessageFormat.Json,
             UriTemplate = "/getConsumerGroupsJSON/")]
        AnywhereWorker.ConsumerGroups[] getConsumerGroupsJSON(string locationId, string token);

        [OperationContract]
        [WebInvoke(Method = "POST",
             BodyStyle = WebMessageBodyStyle.Wrapped,
             ResponseFormat = WebMessageFormat.Json,
             RequestFormat = WebMessageFormat.Json,
             UriTemplate = "/getConsumersByGroup/")]
        string getConsumersByGroup(string groupCode, string retrieveId, string token, string serviceDate, string daysBackDate);

        [OperationContract]
        [WebInvoke(Method = "POST",
             BodyStyle = WebMessageBodyStyle.Wrapped,
             ResponseFormat = WebMessageFormat.Json,
             RequestFormat = WebMessageFormat.Json,
             UriTemplate = "/getConsumersByGroupJSON/")]
        AnywhereWorker.ConsumersByGroup[] getConsumersByGroupJSON(string groupCode, string retrieveId, string token, string serviceDate, string daysBackDate);

        [OperationContract]
        [WebInvoke(Method = "POST",
             BodyStyle = WebMessageBodyStyle.Wrapped,
             ResponseFormat = WebMessageFormat.Json,
             RequestFormat = WebMessageFormat.Json,
             UriTemplate = "/addConsumerToGroup/")]             
        string addConsumerToGroup(string groupId, string consumerId);

        [OperationContract]
        [WebInvoke(Method = "POST",
             BodyStyle = WebMessageBodyStyle.Wrapped,
             ResponseFormat = WebMessageFormat.Json,
             RequestFormat = WebMessageFormat.Json,
             UriTemplate = "/removeConsumerFromGroup/")]
        string removeConsumerFromGroup(string groupId, string consumerId);

        [OperationContract]
        [WebInvoke(Method = "POST",
             BodyStyle = WebMessageBodyStyle.Wrapped,
             ResponseFormat = WebMessageFormat.Json,
             RequestFormat = WebMessageFormat.Json,
             UriTemplate = "/addCustomGroupJSON/")]
          RosterWorker.AddCustomGroup[] addCustomGroupJSON(string groupName, string locationId, string token);

        [OperationContract]
        [WebInvoke(Method = "POST",
             BodyStyle = WebMessageBodyStyle.Wrapped,
             ResponseFormat = WebMessageFormat.Json,
             RequestFormat = WebMessageFormat.Json,
             UriTemplate = "/removeCustomGroup/")]
        string removeCustomGroup(string groupId);

        [OperationContract]
        [WebInvoke(Method = "POST",
             BodyStyle = WebMessageBodyStyle.Wrapped,
             ResponseFormat = WebMessageFormat.Json,
             RequestFormat = WebMessageFormat.Json,
             UriTemplate = "/getConsumerDayServiceActivityJSON/")]
        DayServicesWorker.DSConsumerActivityObject[] getConsumerDayServiceActivityJSON(string token, string peopleList, string serviceDate, string locationId, string groupCode, string retrieveId);

        [OperationContract]
        [WebInvoke(Method = "POST",
             BodyStyle = WebMessageBodyStyle.Wrapped,
             ResponseFormat = WebMessageFormat.Json,
             RequestFormat = WebMessageFormat.Json,
             UriTemplate = "/addDayServiceActivityMassClockInConsumer/")]
        string addDayServiceActivityMassClockInConsumer(string token, string consumerIds, string serviceDate, string locationId, string startTime);

        [OperationContract]
        [WebInvoke(Method = "POST",
             BodyStyle = WebMessageBodyStyle.Wrapped,
             ResponseFormat = WebMessageFormat.Json,
             RequestFormat = WebMessageFormat.Json,
             UriTemplate = "/massUserCheckByDate/")]
        string massUserCheckByDate(string consumerIds, string serviceDate, string locationId);

        [OperationContract]
        [WebInvoke(Method = "POST",
             BodyStyle = WebMessageBodyStyle.Wrapped,
             ResponseFormat = WebMessageFormat.Json,
             RequestFormat = WebMessageFormat.Json,
             UriTemplate = "/addDayServiceActivityMassClockOutConsumer/")]
        string addDayServiceActivityMassClockOutConsumer(string token, string consumerIds, string serviceDate, string locationId, string stopTime);

        [OperationContract]
        [WebInvoke(Method = "POST",
             BodyStyle = WebMessageBodyStyle.Wrapped,
             ResponseFormat = WebMessageFormat.Json,
             RequestFormat = WebMessageFormat.Json,
             UriTemplate = "/updateDayServiceActivity/")]
        string updateDayServiceActivity(string token, string consumerIds, string serviceDate, string locationId, string inputType, string inputTime, string dayServiceType, string selectedGroupId);

        [OperationContract]
        [WebInvoke(Method = "POST",
             BodyStyle = WebMessageBodyStyle.Wrapped,
             ResponseFormat = WebMessageFormat.Json,
             RequestFormat = WebMessageFormat.Json,
             UriTemplate = "/deleteDayServiceMassDeleteConsumerActivity/")]
        string deleteDayServiceMassDeleteConsumerActivity(string consumerIds, string serviceDate, string locationID);

        [OperationContract]
        [WebInvoke(Method = "POST",
             BodyStyle = WebMessageBodyStyle.Wrapped,
             ResponseFormat = WebMessageFormat.Json,
             RequestFormat = WebMessageFormat.Json,
             UriTemplate = "/getLogIn/")]
        string getLogIn(string userId, string hash, string deviceId);

        [OperationContract]
        [WebInvoke(Method = "POST",
             BodyStyle = WebMessageBodyStyle.Wrapped,
             ResponseFormat = WebMessageFormat.Json,
             RequestFormat = WebMessageFormat.Json,
             UriTemplate = "/changeLogIn/")]
        string changeLogIn(string userId, string hash, string newPassword, string changingToHashPassword);

        [OperationContract]
        [WebInvoke(Method = "POST",
             BodyStyle = WebMessageBodyStyle.Wrapped,
             ResponseFormat = WebMessageFormat.Json,
             RequestFormat = WebMessageFormat.Json,
             UriTemplate = "/tokenCheck/")]
        string tokenCheck(string token);

        [OperationContract]
        [WebInvoke(Method = "POST",
             BodyStyle = WebMessageBodyStyle.Wrapped,
             ResponseFormat = WebMessageFormat.Json,
             RequestFormat = WebMessageFormat.Json,
             UriTemplate = "/clockInStaff/")]
        string clockInStaff(string token, string locationId, string createTimeEntries);

        [OperationContract]
        [WebInvoke(Method = "POST",
             BodyStyle = WebMessageBodyStyle.Wrapped,
             ResponseFormat = WebMessageFormat.Json,
             RequestFormat = WebMessageFormat.Json,
             UriTemplate = "/clockOutStaff/")]
        string clockOutStaff(string token);

        [OperationContract]
        [WebInvoke(Method = "POST",
             BodyStyle = WebMessageBodyStyle.Wrapped,
             ResponseFormat = WebMessageFormat.Json,
             RequestFormat = WebMessageFormat.Json,
             UriTemplate = "/getStaffActivityJSON/")]
        DashboardWorker.StaffActivityObj[] getStaffActivityJSON(string token, string serviceDate);

        [OperationContract]
        [WebInvoke(Method = "POST",
             BodyStyle = WebMessageBodyStyle.Wrapped,
             ResponseFormat = WebMessageFormat.Json,
             RequestFormat = WebMessageFormat.Json,
             UriTemplate = "/updateStaffClockTime/")]
        string updateStaffClockTime(string token, string serviceDate, string orginalTime, string newTime, string isClockIn, string checkedAgainstTime, string location);


        [OperationContract]
        [WebInvoke(Method = "POST",
             BodyStyle = WebMessageBodyStyle.Wrapped,
             ResponseFormat = WebMessageFormat.Json,
             RequestFormat = WebMessageFormat.Json,
             UriTemplate = "/setDefaultSettings/")]
        string setDefaultSettings(string token, string settingKey, string settingValue);


        [OperationContract]
        [WebInvoke(Method = "POST",
             BodyStyle = WebMessageBodyStyle.Wrapped,
             ResponseFormat = WebMessageFormat.Json,
             RequestFormat = WebMessageFormat.Json,
             UriTemplate = "/saveGoal/")]
        string saveGoal(string token, string objectiveId, string activityId, string date, string success, string goalnote, string promptType, string promptNumber, string locationId, string locationSecondaryId, string goalStartTime, string goalEndTime, string goalCILevel);

        [OperationContract]
        [WebInvoke(Method = "POST",
             BodyStyle = WebMessageBodyStyle.Wrapped,
             ResponseFormat = WebMessageFormat.Json,
             RequestFormat = WebMessageFormat.Json,
             UriTemplate = "/deleteGoal/")]
        string deleteGoal(string token, string activityId);

        [OperationContract]
        [WebInvoke(Method = "POST",
             BodyStyle = WebMessageBodyStyle.Wrapped,
             ResponseFormat = WebMessageFormat.Json,
             RequestFormat = WebMessageFormat.Json,
             UriTemplate = "/getSingleEntry/")]
        string getSingleEntry(string token);


        [OperationContract]
        string GetData(int value);

        [OperationContract]
        CompositeType GetDataUsingDataContract(CompositeType composite);


        [OperationContract]
        [WebInvoke(Method = "POST",
            RequestFormat = WebMessageFormat.Json,
            ResponseFormat = WebMessageFormat.Json,
            BodyStyle = WebMessageBodyStyle.WrappedRequest,
            UriTemplate = "/anyTime/")]
        bool anyTime();


        [OperationContract]
        [WebInvoke(Method = "POST",
            RequestFormat = WebMessageFormat.Json,
            ResponseFormat = WebMessageFormat.Json,
            BodyStyle = WebMessageBodyStyle.WrappedRequest,
            UriTemplate = "/sendFile/")]
        bool GetFile(string filename, string contentType, string data);

        [OperationContract]
        [WebInvoke(Method = "POST",
             BodyStyle = WebMessageBodyStyle.Wrapped,
             ResponseFormat = WebMessageFormat.Json,
             RequestFormat = WebMessageFormat.Json,
             UriTemplate = "/getStrongPassword/")]
        string getStrongPassword();

        [OperationContract]
        [WebInvoke(Method = "POST",
             BodyStyle = WebMessageBodyStyle.Wrapped,
             ResponseFormat = WebMessageFormat.Json,
             RequestFormat = WebMessageFormat.Json,
             UriTemplate = "/getCustomTextAndAnywhereVersion/")]
        string getCustomTextAndAnywhereVersion();

        [OperationContract]
        [WebInvoke(Method = "POST",
             BodyStyle = WebMessageBodyStyle.Wrapped,
             ResponseFormat = WebMessageFormat.Json,
             RequestFormat = WebMessageFormat.Json,
             UriTemplate = "/getUserIdsWithGoalsJSON/")]
        OutcomesWorker.UserIdsWithGoals[] getUserIdsWithGoalsJSON(string token);

        [OperationContract]
        [WebInvoke(Method = "POST",
             BodyStyle = WebMessageBodyStyle.Wrapped,
             ResponseFormat = WebMessageFormat.Json,
             RequestFormat = WebMessageFormat.Json,
             UriTemplate = "/getGoalSpecificLocationInfoJSON/")]
        OutcomesWorker.GoalSpecificLocationInfo[] getGoalSpecificLocationInfoJSON(string token, string activityId);

        [OperationContract]
        [WebInvoke(Method = "POST",
             BodyStyle = WebMessageBodyStyle.Wrapped,
             ResponseFormat = WebMessageFormat.Json,
             RequestFormat = WebMessageFormat.Json,
             UriTemplate = "/getUserIdsWithGoalsByDateJSON/")]
        OutcomesWorker.UserIdsWithGoalsByDate[] getUserIdsWithGoalsByDateJSON(string token, string goalsCheckDate);

        [OperationContract]
        [WebInvoke(Method = "POST",
             BodyStyle = WebMessageBodyStyle.Wrapped,
             ResponseFormat = WebMessageFormat.Json,
             RequestFormat = WebMessageFormat.Json,
             UriTemplate = "/getDaysBackForEditingGoalsJSON/")]
          OutcomesWorker.DaysBackForEditingGoals[] getDaysBackForEditingGoalsJSON(string token, string consumerId);

        [OperationContract]
        [WebInvoke(Method = "POST",
             BodyStyle = WebMessageBodyStyle.Wrapped,
             ResponseFormat = WebMessageFormat.Json,
             RequestFormat = WebMessageFormat.Json,
             UriTemplate = "/caseNotesFilteredSearchJSON/")]
          CaseNotesWorker.CaseNotesFilteredSearch[] caseNotesFilteredSearchJSON(string token, string billerId, string consumerId, string serviceStartDate, string serviceEndDate,
            string dateEnteredStart, string dateEnteredEnd, string billingCode, string reviewStatus, string location, string service, string need, string contact, string confidential, string corrected, string billed,
            string attachments, string overlaps, string noteText, string applicationName);

        [OperationContract]
        [WebInvoke(Method = "POST",
             BodyStyle = WebMessageBodyStyle.Wrapped,
             ResponseFormat = WebMessageFormat.Json,
             RequestFormat = WebMessageFormat.Json,
             UriTemplate = "/getDefaultAnywhereSettingsJSON/")]
        AnywhereWorker.DefaultSettings[] getDefaultAnywhereSettingsJSON(string token);

        [OperationContract]
        [WebInvoke(Method = "POST",
             BodyStyle = WebMessageBodyStyle.Wrapped,
             ResponseFormat = WebMessageFormat.Json,
             RequestFormat = WebMessageFormat.Json,
             UriTemplate = "/updateCaseNotesReviewDays/")]
        string updateCaseNotesReviewDays(string token, string updatedReviewDays);

        [OperationContract]
        [WebInvoke(Method = "POST",
             BodyStyle = WebMessageBodyStyle.Wrapped,
             ResponseFormat = WebMessageFormat.Json,
             RequestFormat = WebMessageFormat.Json,
             UriTemplate = "/getBillersListForDropDownJSON/")]
          CaseNotesWorker.GetBillers[] getBillersListForDropDownJSON(string token);

        [OperationContract]
        [WebInvoke(Method = "POST",
             BodyStyle = WebMessageBodyStyle.Wrapped,
             ResponseFormat = WebMessageFormat.Json,
             RequestFormat = WebMessageFormat.Json,
             UriTemplate = "/populateDropdownData/")]
        string populateDropdownData(string token);

        [OperationContract]
        [WebInvoke(Method = "POST",
             BodyStyle = WebMessageBodyStyle.Wrapped,
             ResponseFormat = WebMessageFormat.Json,
             RequestFormat = WebMessageFormat.Json,
             UriTemplate = "/saveCaseNote/")]
        string saveCaseNote(string token, string noteId, string caseManagerId, string consumerId, string serviceOrBillingCodeId, string locationCode, string serviceCode, string needCode, string serviceDate, string startTime, string endTime, string vendorId, string contactCode, string serviceLocationCode, string caseNote, string reviewRequired, string confidential, string corrected, string casenotemileage, string casenotetraveltime, string documentationTime);

        [OperationContract]
        [WebInvoke(Method = "POST",
             BodyStyle = WebMessageBodyStyle.Wrapped,
             ResponseFormat = WebMessageFormat.Json,
             RequestFormat = WebMessageFormat.Json,
             UriTemplate = "/getCaseNoteEditJSON/")]
        CaseNotesWorker.CaseNoteEdit[] getCaseNoteEditJSON(string token, string noteId);

        [OperationContract]
        [WebInvoke(Method = "POST",
             BodyStyle = WebMessageBodyStyle.Wrapped,
             ResponseFormat = WebMessageFormat.Json,
             RequestFormat = WebMessageFormat.Json,
             UriTemplate = "/getViewableGoalIdsByPermissionJSON/")]
        OutcomesWorker.GoalIDByPermission[] getViewableGoalIdsByPermissionJSON(string token);

        [OperationContract]
        [WebInvoke(Method = "POST",
             BodyStyle = WebMessageBodyStyle.Wrapped,
             ResponseFormat = WebMessageFormat.Json,
             RequestFormat = WebMessageFormat.Json,
             UriTemplate = "/updatePortrait/")]
        string updatePortrait(string token, string employeeUserName, string imageFile, string id, string portraitPath);

        [OperationContract]
        [WebInvoke(Method = "POST",
             BodyStyle = WebMessageBodyStyle.Wrapped,
             ResponseFormat = WebMessageFormat.Json,
             RequestFormat = WebMessageFormat.Json,
             UriTemplate = "/addCaseNoteAttachment/")]
        string addCaseNoteAttachment(string token, string caseNoteId, string description, string attachmentType, string attachment);

        [OperationContract]
        [WebInvoke(Method = "POST",
                BodyStyle = WebMessageBodyStyle.Wrapped,
                ResponseFormat = WebMessageFormat.Json,
                RequestFormat = WebMessageFormat.Json,
                UriTemplate = "/getCaseNoteAttachmentsList/")]
        CaseNotesWorker.AttachmentList[] getCaseNoteAttachmentsList(string token, string caseNoteId);

        [OperationContract]
        [WebInvoke(Method = "POST",
             BodyStyle = WebMessageBodyStyle.Bare,
             UriTemplate = "/viewCaseNoteAttachment/")]
        //void viewCaseNoteAttachment(string attachmentId);
        void viewCaseNoteAttachment(System.IO.Stream testInput);

        [OperationContract]
        [WebInvoke(Method = "POST",
             BodyStyle = WebMessageBodyStyle.Wrapped,
             ResponseFormat = WebMessageFormat.Json,
             RequestFormat = WebMessageFormat.Json,
             UriTemplate = "/viewISPReportAndAttachmenst/")]
        //void viewCaseNoteAttachment(string attachmentId);
        void viewISPReportAndAttachments(string token, string userId, string assessmentID, string versionID, string extraSpace, bool isp);

        [OperationContract]
        [WebInvoke(Method = "POST",
             BodyStyle = WebMessageBodyStyle.Bare,
             UriTemplate = "/viewPlanAttachment/")]
        //void viewCaseNoteAttachment(string attachmentId);
        void viewPlanAttachment(System.IO.Stream testInput);

        [OperationContract]
        [WebInvoke(Method = "POST",
            BodyStyle = WebMessageBodyStyle.Wrapped,
            ResponseFormat = WebMessageFormat.Json,
            RequestFormat = WebMessageFormat.Json,
            UriTemplate = "/deleteCaseNoteAttachment/")]
        string deleteCaseNoteAttachment(string token, string caseNoteId, string attachmentId);

        [OperationContract]
        [WebInvoke(Method = "POST",
             BodyStyle = WebMessageBodyStyle.Wrapped,
             ResponseFormat = WebMessageFormat.Json,
             RequestFormat = WebMessageFormat.Json,
             UriTemplate = "/getUserPermissions/")]
        string getUserPermissions(string token);

        [OperationContract]
        [WebInvoke(Method = "POST",
             BodyStyle = WebMessageBodyStyle.Wrapped,
             ResponseFormat = WebMessageFormat.Json,
             RequestFormat = WebMessageFormat.Json,
             UriTemplate = "/featureLogging/")]
        string featureLogging(string token, string featureDescription);

        [OperationContract]
        [WebInvoke(Method = "POST",
             BodyStyle = WebMessageBodyStyle.Wrapped,
             ResponseFormat = WebMessageFormat.Json,
             RequestFormat = WebMessageFormat.Json,
             UriTemplate = "/getConsumerSpecificVendorsJSON/")]
          CaseNotesWorker.ConsumerSpecificVendors[] getConsumerSpecificVendorsJSON(string token, string consumerId, string serviceDate);

        [OperationContract]
        [WebInvoke(Method = "POST",
             BodyStyle = WebMessageBodyStyle.Wrapped,
             ResponseFormat = WebMessageFormat.Json,
             RequestFormat = WebMessageFormat.Json,
             UriTemplate = "/getServiceLocationsForCaseNoteDropDown/")]
        CaseNotesWorker.ServiceLocationData[] getServiceLocationsForCaseNoteDropDown(string token, string serviceDate, string consumerId);

        [OperationContract]
        [WebInvoke(Method = "POST",
             BodyStyle = WebMessageBodyStyle.Wrapped,
             ResponseFormat = WebMessageFormat.Json,
             RequestFormat = WebMessageFormat.Json,
             UriTemplate = "/saveGroupCaseNote/")]
        string saveGroupCaseNote(string token, string noteId, string groupNoteId, string caseManagerId, string consumerId, string serviceOrBillingCodeId, string locationCode, string serviceCode, string needCode, string serviceDate, string startTime, string endTime, string vendorId, string contactCode, string serviceLocationCode, string caseNote, string reviewRequired, string confidential, string consumerGroupCount, string casenotemileage, string casenotetraveltime, string documentationTime);

        [OperationContract]
        [WebInvoke(Method = "POST",
             BodyStyle = WebMessageBodyStyle.Wrapped,
             ResponseFormat = WebMessageFormat.Json,
             RequestFormat = WebMessageFormat.Json,
             UriTemplate = "/saveAdditionalGroupCaseNote/")]
        string saveAdditionalGroupCaseNote(string token, string noteId, string groupNoteId, string caseManagerId, string consumerId, string serviceOrBillingCodeId, string locationCode, string serviceCode, string needCode, string serviceDate, string startTime, string endTime, string vendorId, string contactCode, string serviceLocationCode, string reviewRequired, string confidential, string caseNote, string casenotemileage, string casenotetraveltime, string documentationTime);


        [OperationContract]
        [WebInvoke(Method = "POST",
             BodyStyle = WebMessageBodyStyle.Wrapped,
             ResponseFormat = WebMessageFormat.Json,
             RequestFormat = WebMessageFormat.Json,
             UriTemplate = "/deleteExistingCaseNote/")]
        string deleteExistingCaseNote(string token, string noteId);

        [OperationContract]
        [WebInvoke(Method = "POST",
             BodyStyle = WebMessageBodyStyle.Wrapped,
             ResponseFormat = WebMessageFormat.Json,
             RequestFormat = WebMessageFormat.Json,
             UriTemplate = "/getReviewRequiredForCaseManager/")]
        CaseNotesWorker.ReviewRequiredData[] getReviewRequiredForCaseManager(string token, string caseManagerId);

        [OperationContract]//
        [WebInvoke(Method = "POST",
                     BodyStyle = WebMessageBodyStyle.Wrapped,
                     ResponseFormat = WebMessageFormat.Json,
                     RequestFormat = WebMessageFormat.Json,
                     UriTemplate = "/getCNPopulateFilterDropdowns/")]
        CaseNotesWorker.FilterDropdownValues[] getCNPopulateFilterDropdowns(string token, string serviceCodeId);

        [OperationContract]
        [WebInvoke(Method = "POST",
             BodyStyle = WebMessageBodyStyle.Wrapped,
             ResponseFormat = WebMessageFormat.Json,
             RequestFormat = WebMessageFormat.Json,
             UriTemplate = "/getDemographicsNotesJSON/")]
        RosterWorker.ConsumerNotes[] getDemographicsNotesJSON(string token, string consumerId);

        [OperationContract]
        [WebInvoke(Method = "POST",
             BodyStyle = WebMessageBodyStyle.Wrapped,
             ResponseFormat = WebMessageFormat.Json,
             RequestFormat = WebMessageFormat.Json,
             UriTemplate = "/getConsumerDemographicsJSON/")]
        RosterWorker.ConsumerDemographics[] getConsumerDemographicsJSON(string token, string consumerId);
        [OperationContract]
        [WebInvoke(Method = "POST",
             BodyStyle = WebMessageBodyStyle.Wrapped,
             ResponseFormat = WebMessageFormat.Json,
             RequestFormat = WebMessageFormat.Json,
             UriTemplate = "/GetConsumerRelationshipsJSON/")]
        RosterWorker.ConsumerRelationships[] getConsumerRelationshipsJSON(string token, string consumerId);

        [OperationContract]
        [WebInvoke(Method = "POST",
             BodyStyle = WebMessageBodyStyle.Wrapped,
             ResponseFormat = WebMessageFormat.Json,
             RequestFormat = WebMessageFormat.Json,
             UriTemplate = "/setupPasswordResetEmail/")]
        string setupPasswordResetEmail(string userName);

        [OperationContract]
        [WebInvoke(Method = "POST",
             BodyStyle = WebMessageBodyStyle.Wrapped,
             ResponseFormat = WebMessageFormat.Json,
             RequestFormat = WebMessageFormat.Json,
             UriTemplate = "/getSystemMessagesAndCustomLinksJSON/")]
        DashboardWorker.SystemMessagesAndCustomLinks[] getSystemMessagesAndCustomLinksJSON(string token);

        [OperationContract]
        [WebInvoke(Method = "POST",
             BodyStyle = WebMessageBodyStyle.Wrapped,
             ResponseFormat = WebMessageFormat.Json,
             RequestFormat = WebMessageFormat.Json,
             UriTemplate = "/getRemainingDailyGoalsJSON/")]
        OutcomesWorker.RemainingDailyGoals[] getRemainingDailyGoalsJSON(string token, string checkDate);

        [OperationContract]
        [WebInvoke(Method = "POST",
             BodyStyle = WebMessageBodyStyle.Wrapped,
             ResponseFormat = WebMessageFormat.Json,
             RequestFormat = WebMessageFormat.Json,
             UriTemplate = "/getCaseLoadRestriction/")]
        string getCaseLoadRestriction(string token);

        [OperationContract]
        [WebInvoke(Method = "POST",
             BodyStyle = WebMessageBodyStyle.Wrapped,
             ResponseFormat = WebMessageFormat.Json,
             RequestFormat = WebMessageFormat.Json,
             UriTemplate = "/getGroupNoteId/")]
        string getGroupNoteId(string token);

        [OperationContract]
        [WebInvoke(Method = "POST",
             BodyStyle = WebMessageBodyStyle.Wrapped,
             ResponseFormat = WebMessageFormat.Json,
             RequestFormat = WebMessageFormat.Json,
             UriTemplate = "/caseNoteOverlapCheck/")]
        string caseNoteOverlapCheck(string token, string consumerId, string startTime, string endTime, string serviceDate, string caseManagerId, string noteId, string groupNoteId);

        [OperationContract]
        [WebInvoke(Method = "POST",
             BodyStyle = WebMessageBodyStyle.Wrapped,
             ResponseFormat = WebMessageFormat.Json,
             RequestFormat = WebMessageFormat.Json,
             UriTemplate = "/getGroupNoteNames/")]
        string getGroupNoteNames(string token, string groupNoteId);

        [OperationContract]
        [WebInvoke(Method = "POST",
             BodyStyle = WebMessageBodyStyle.Wrapped,
             ResponseFormat = WebMessageFormat.Json,
             RequestFormat = WebMessageFormat.Json,
             UriTemplate = "/updateGroupNoteValues/")]
        string updateGroupNoteValues(string token, string groupNoteId, string noteId, string serviceOrBillingCodeId, string serviceDate, string startTime, string endTime);

        [OperationContract]
        [WebInvoke(Method = "POST",
             BodyStyle = WebMessageBodyStyle.Wrapped,
             ResponseFormat = WebMessageFormat.Json,
             RequestFormat = WebMessageFormat.Json,
             UriTemplate = "/updateGroupNoteValuesAndDropdowns/")]
        string updateGroupNoteValuesAndDropdowns(string token, string groupNoteId, string noteId, string serviceOrBillingCodeId, string locationCode, string serviceCode, string needCode, string contactCode, string serviceDate, string startTime, string endTime);

        [OperationContract]
        [WebInvoke(Method = "POST",
             BodyStyle = WebMessageBodyStyle.Wrapped,
             ResponseFormat = WebMessageFormat.Json,
             RequestFormat = WebMessageFormat.Json,
             UriTemplate = "/insertSingleEntry/")]
        string insertSingleEntry(string token, string userId, string updaterId, string personId, string dateOfService, string locationId, string workCodeID, string startTime, string endTime, string checkHours, string consumerId, string transportationUnits, string transportationReimbursable, string numberOfConsumersPresent, string inComments, string odometerStart, string odometerEnd, string destination, string reason, string latitude, string longitude, string endLatitude, string endLongitude, string deviceType, string evvReason, string attest, string licensePlateNumber, string community);

        [OperationContract]
        [WebInvoke(Method = "POST",
             BodyStyle = WebMessageBodyStyle.Wrapped,
             ResponseFormat = WebMessageFormat.Json,
             RequestFormat = WebMessageFormat.Json,
             UriTemplate = "/preInsertSingleEntry/")]
        SingleEntryWorker.ConsumerAndLocation[] preInsertSingleEntry(string token, string userId, string updaterId, string personId, string dateOfService, string locationId, string workCodeID, string startTime, string endTime, string checkHours, string consumerId, string transportationUnits, string transportationReimbursable, string numberOfConsumersPresent, string inComments, string odometerStart, string odometerEnd, string destination, string reason, string latitude, string longitude, string endLatitude, string endLongitude, string deviceType, string evvReason, string attest, string licensePlateNumber, string community);

        [OperationContract]
        [WebInvoke(Method = "POST",
             BodyStyle = WebMessageBodyStyle.Wrapped,
             ResponseFormat = WebMessageFormat.Json,
             RequestFormat = WebMessageFormat.Json,
             UriTemplate = "/updateSingleEntry/")]
        string updateSingleEntry(string token, string userId, string dateOfService, string locationId, string workCodeID, string startTime, string endTime, string checkHours, string consumerId, string transportationUnits, string transportationReimbursable, string numberOfConsumersPresent, string singleEntryId, string inComments, string odometerStart, string odometerEnd, string destination, string reason, string endLatitude, string endLongitude, string deviceType, string evvReason, string attest, string licensePlateNumber, string community, string updateEVVReason);

        [OperationContract]
        [WebInvoke(Method = "POST",
             BodyStyle = WebMessageBodyStyle.Wrapped,
             ResponseFormat = WebMessageFormat.Json,
             RequestFormat = WebMessageFormat.Json,
             UriTemplate = "/getSingleEntryByIdJSON/")]
          SingleEntryWorker.SingleEntryById[] getSingleEntryByIdJSON(string token, string singleEntryId);
        //string getSingleEntryById(string token, string singleEntryId);

        [OperationContract]
        [WebInvoke(Method = "POST",
             BodyStyle = WebMessageBodyStyle.Wrapped,
             ResponseFormat = WebMessageFormat.Json,
             RequestFormat = WebMessageFormat.Json,
             UriTemplate = "/getSingleEntryByDateJSON/")]
          SingleEntryWorker.SingleEntryByDate[] getSingleEntryByDateJSON(string token, string userId, string startDate, string endDate, string locationId, string statusIn);

        [OperationContract]
        [WebInvoke(Method = "POST",
             BodyStyle = WebMessageBodyStyle.Wrapped,
             ResponseFormat = WebMessageFormat.Json,
             RequestFormat = WebMessageFormat.Json,
             UriTemplate = "/deleteSingleEntryRecord/")]
        string deleteSingleEntryRecord(string token, string singleEntryId);

        [OperationContract]
        [WebInvoke(Method = "POST",
             BodyStyle = WebMessageBodyStyle.Wrapped,
             ResponseFormat = WebMessageFormat.Json,
             RequestFormat = WebMessageFormat.Json,
             UriTemplate = "/getSingleEntryRequiredFields/")]
        string getSingleEntryRequiredFields(string token);

        [OperationContract]
        [WebInvoke(Method = "POST",
             BodyStyle = WebMessageBodyStyle.Wrapped,
             ResponseFormat = WebMessageFormat.Json,
             RequestFormat = WebMessageFormat.Json,
             UriTemplate = "/getWorkCodesJSON/")]
        SingleEntryWorker.WorkCodes[] getWorkCodesJSON(string token);
        //string getWorkCodes(string token);

        [OperationContract]
        [WebInvoke(Method = "POST",
             BodyStyle = WebMessageBodyStyle.Wrapped,
             ResponseFormat = WebMessageFormat.Json,
             RequestFormat = WebMessageFormat.Json,
             UriTemplate = "/getSingleEntryPayPeriodsJSON/")]
        SingleEntryWorker.SingleEntryPayPeriods[] getSingleEntryPayPeriodsJSON(string token);
        //string getSingleEntryPayPeriods(string token);

        [OperationContract]
        [WebInvoke(Method = "POST",
             BodyStyle = WebMessageBodyStyle.Wrapped,
             ResponseFormat = WebMessageFormat.Json,
             RequestFormat = WebMessageFormat.Json,
             UriTemplate = "/approveSingleEntryRecord/")]
        string approveSingleEntryRecord(string token, string singleEntryId);

        [OperationContract]
        [WebInvoke(Method = "POST",
             BodyStyle = WebMessageBodyStyle.Wrapped,
             ResponseFormat = WebMessageFormat.Json,
             RequestFormat = WebMessageFormat.Json,
             UriTemplate = "/getSingleEntryLocationsJSON/")]
        SingleEntryWorker.SingleEntryLocations[] getSingleEntryLocationsJSON(string token);

        [OperationContract]
        [WebInvoke(Method = "POST",
             BodyStyle = WebMessageBodyStyle.Wrapped,
             ResponseFormat = WebMessageFormat.Json,
             RequestFormat = WebMessageFormat.Json,
             UriTemplate = "/getEmployeeListAndCountInfoJSON/")]
        SingleEntryWorker.EmployeeListAndCountInfo[] getEmployeeListAndCountInfoJSON(string token, string supervisorId);

        [OperationContract]
        [WebInvoke(Method = "POST",
        BodyStyle = WebMessageBodyStyle.Wrapped,
        ResponseFormat = WebMessageFormat.Json,
        RequestFormat = WebMessageFormat.Json,
        UriTemplate = "/getSubEmployeeListAndCountInfoJSON/")]
        SingleEntryWorker.SubEmployeeListAndCountInfo[] getSubEmployeeListAndCountInfoJSON(string token, string supervisorId);

        [OperationContract]
        [WebInvoke(Method = "POST",
            BodyStyle = WebMessageBodyStyle.Wrapped,
            ResponseFormat = WebMessageFormat.Json,
            RequestFormat = WebMessageFormat.Json,
            UriTemplate = "/getSingleEntryEvvReasonCodesJSON/")]
        SingleEntryWorker.SingleEntryEvvReasonCodes[] getSingleEntryEvvReasonCodesJSON(string token);

        [OperationContract]
        [WebInvoke(Method = "POST",
            BodyStyle = WebMessageBodyStyle.Wrapped,
            ResponseFormat = WebMessageFormat.Json,
            RequestFormat = WebMessageFormat.Json,
            UriTemplate = "/getSingleEntryEvvEligibilityJSON/")]
        SingleEntryWorker.SingleEntryEvvEligibility[] getSingleEntryEvvEligibilityJSON(string token, string consumerId, string entryDate);

        [OperationContract]
        [WebInvoke(Method = "POST",
             BodyStyle = WebMessageBodyStyle.Wrapped,
             ResponseFormat = WebMessageFormat.Json,
             RequestFormat = WebMessageFormat.Json,
             UriTemplate = "/getSingleEntryCountInfoJSON/")]
        DashboardWorker.SingleEntryCountObj[] getSingleEntryCountInfoJSON(string token);

        [OperationContract]
        [WebInvoke(Method = "POST",
             BodyStyle = WebMessageBodyStyle.Wrapped,
             ResponseFormat = WebMessageFormat.Json,
             RequestFormat = WebMessageFormat.Json,
             UriTemplate = "/updateSingleEntryStatus/")]
        string updateSingleEntryStatus(string token, string singleEntryIdString, string newStatus);

        [OperationContract]
        [WebInvoke(Method = "POST",
             BodyStyle = WebMessageBodyStyle.Wrapped,
             ResponseFormat = WebMessageFormat.Json,
             RequestFormat = WebMessageFormat.Json,
             UriTemplate = "/getRemainingGoalsCountForDashboard/")]
        string getRemainingGoalsCountForDashboard(string token);

        [OperationContract]
        [WebInvoke(Method = "POST",
             BodyStyle = WebMessageBodyStyle.Wrapped,
             ResponseFormat = WebMessageFormat.Json,
             RequestFormat = WebMessageFormat.Json,
             UriTemplate = "/getSingleEntryAdminApprovalNumbersJSON/")]
        DashboardWorker.AdminApprovalNumbersObj[] getSingleEntryAdminApprovalNumbersJSON(string token);

        [OperationContract]
        [WebInvoke(Method = "POST",
             BodyStyle = WebMessageBodyStyle.Wrapped,
             ResponseFormat = WebMessageFormat.Json,
             RequestFormat = WebMessageFormat.Json,
             UriTemplate = "/getSingleEntryAdminLocations/")]
        DashboardWorker.SingleEntryLocationObj[] getSingleEntryAdminLocations(string token);

        [OperationContract]
        [WebInvoke(Method = "POST",
             BodyStyle = WebMessageBodyStyle.Wrapped,
             ResponseFormat = WebMessageFormat.Json,
             RequestFormat = WebMessageFormat.Json,
             UriTemplate = "/getUserSingleEntryLocationsForPayPeriod/")]
        string getUserSingleEntryLocationsForPayPeriod(string token, string userId, string startDate, string endDate, string locationID, string status);

        [OperationContract]
        [WebInvoke(Method = "POST",
             BodyStyle = WebMessageBodyStyle.Wrapped,
             ResponseFormat = WebMessageFormat.Json,
             RequestFormat = WebMessageFormat.Json,
             UriTemplate = "/getRequiredSingleEntryFields/")]
        string getRequiredSingleEntryFields(string token);

        [OperationContract]
        [WebInvoke(Method = "POST",
             BodyStyle = WebMessageBodyStyle.Wrapped,
             ResponseFormat = WebMessageFormat.Json,
             RequestFormat = WebMessageFormat.Json,
             UriTemplate = "/getRequiredSingleEntryFieldsJSON/")]
        SingleEntryWorker.RequiredSingleEntryFields[] getRequiredSingleEntryFieldsJSON(string token);

        [OperationContract]
        [WebInvoke(Method = "POST",
             BodyStyle = WebMessageBodyStyle.Wrapped,
             ResponseFormat = WebMessageFormat.Json,
             RequestFormat = WebMessageFormat.Json,
             UriTemplate = "/getClockedInDayServicesAtLocationCounts/")]
        string getClockedInDayServicesAtLocationCounts(string token, string locationId);

        [OperationContract]
        [WebInvoke(Method = "POST",
             BodyStyle = WebMessageBodyStyle.Wrapped,
             ResponseFormat = WebMessageFormat.Json,
             RequestFormat = WebMessageFormat.Json,
             UriTemplate = "/saveDefaultLocationValue/")]
        string saveDefaultLocationValue(string token, string switchCase, string locationId);

        [OperationContract]
        [WebInvoke(Method = "POST",
             BodyStyle = WebMessageBodyStyle.Wrapped,
             ResponseFormat = WebMessageFormat.Json,
             RequestFormat = WebMessageFormat.Json,
             UriTemplate = "/saveDefaultLocationName/")]
        string saveDefaultLocationName(string token, string switchCase, string locationName);

        [OperationContract]
        [WebInvoke(Method = "POST",
             BodyStyle = WebMessageBodyStyle.Wrapped,
             ResponseFormat = WebMessageFormat.Json,
             RequestFormat = WebMessageFormat.Json,
             UriTemplate = "/getIntellivueCredentials/")]
        string getIntellivueCredentials(string token);

        [OperationContract]
        [WebInvoke(Method = "POST",
             BodyStyle = WebMessageBodyStyle.Wrapped,
             ResponseFormat = WebMessageFormat.Json,
             RequestFormat = WebMessageFormat.Json,
             UriTemplate = "/getIntellivueURL/")]
        string getIntellivueURL(string token);

        [OperationContract]
        [WebInvoke(Method = "POST",
             BodyStyle = WebMessageBodyStyle.Wrapped,
             ResponseFormat = WebMessageFormat.Json,
             RequestFormat = WebMessageFormat.Json,
             UriTemplate = "/getIntellivueAppIdURL/")]
        string getIntellivueAppIdURL(string token);

        [OperationContract]
        [WebInvoke(Method = "POST",
             BodyStyle = WebMessageBodyStyle.Wrapped,
             ResponseFormat = WebMessageFormat.Json,
             RequestFormat = WebMessageFormat.Json,
             UriTemplate = "/getIntellivueDomain/")]
        string getIntellivueDomain(string token);

        [OperationContract]
        [WebInvoke(Method = "POST",
             BodyStyle = WebMessageBodyStyle.Wrapped,
             ResponseFormat = WebMessageFormat.Json,
             RequestFormat = WebMessageFormat.Json,
             UriTemplate = "/getConsumerNumberForIntellivue/")]
        string getConsumerNumberForIntellivue(string token, string consumerId);

        [OperationContract]
        [WebInvoke(Method = "POST",
             BodyStyle = WebMessageBodyStyle.Wrapped,
             ResponseFormat = WebMessageFormat.Json,
             RequestFormat = WebMessageFormat.Json,
             UriTemplate = "/getClockedInConsumerNamesDayServicesJSON/")]
        DashboardWorker.DSClockedInConsumers[] getClockedInConsumerNamesDayServicesJSON(string token, string locationId);

        [OperationContract]
        [WebInvoke(Method = "POST",
             BodyStyle = WebMessageBodyStyle.Wrapped,
             ResponseFormat = WebMessageFormat.Json,
             RequestFormat = WebMessageFormat.Json,
             UriTemplate = "/getClockedInStaffNamesDayServicesJSON/")]
        DashboardWorker.DSClockedInStaff[] getClockedInStaffNamesDayServicesJSON(string token, string locationId);

        [OperationContract]
        [WebInvoke(Method = "POST",
             BodyStyle = WebMessageBodyStyle.Wrapped,
             ResponseFormat = WebMessageFormat.Json,
             RequestFormat = WebMessageFormat.Json,
             UriTemplate = "/getSingleEntryUsersByLocationJSON/")]
        SingleEntryWorker.SingleEntryUsersByLocation[] getSingleEntryUsersByLocationJSON(string token, string locationId, string seDate);
        //string getSingleEntryUsersByLocation(string token, string locationId, string seDate);

        [OperationContract]
        [WebInvoke(Method = "POST",
             BodyStyle = WebMessageBodyStyle.Wrapped,
             ResponseFormat = WebMessageFormat.Json,
             RequestFormat = WebMessageFormat.Json,
             UriTemplate = "/singleEntryOverlapCheckJSON/")]
          SingleEntryWorker.seOverlapCheck[] singleEntryOverlapCheckJSON(string token, string dateOfService, string startTime, string endTime, string singleEntryId);
        [OperationContract]
        [WebInvoke(Method = "POST",
             BodyStyle = WebMessageBodyStyle.Wrapped,
             ResponseFormat = WebMessageFormat.Json,
             RequestFormat = WebMessageFormat.Json,
             UriTemplate = "/getGroupNoteMaxMileage/")]
        string getGroupNoteMaxMileage(string token, string groupNoteId);

        [OperationContract]
        [WebInvoke(Method = "POST",
             BodyStyle = WebMessageBodyStyle.Wrapped,
             ResponseFormat = WebMessageFormat.Json,
             RequestFormat = WebMessageFormat.Json,
             UriTemplate = "/getDocTimeEditPermission/")]
        string getDocTimeEditPermission(string token, string peopleId);

        [OperationContract]
        [WebInvoke(Method = "POST",
             BodyStyle = WebMessageBodyStyle.Wrapped,
             ResponseFormat = WebMessageFormat.Json,
             RequestFormat = WebMessageFormat.Json,
             UriTemplate = "/clearTravelTimeOnChange/")]
        string clearTravelTimeOnChange(string token, string noteId);

        [OperationContract]
        [WebInvoke(Method = "POST",
        BodyStyle = WebMessageBodyStyle.Wrapped,
        ResponseFormat = WebMessageFormat.Json,
        RequestFormat = WebMessageFormat.Json,
        UriTemplate = "/singleEntryFilterAdminListJSON/")]
        SingleEntryWorker.SEFilteredListResults[] singleEntryFilterAdminListJSON(string token, string startDate, string endDate, string supervisorId, string locationId, string employeeId, string status, string workCodeId);

        [OperationContract]
        [WebInvoke(Method = "POST",
         BodyStyle = WebMessageBodyStyle.Wrapped,
         ResponseFormat = WebMessageFormat.Json,
         RequestFormat = WebMessageFormat.Json,
         UriTemplate = "/getSingleEntrySupervisorsJSON/")]
        SingleEntryWorker.SingleEntrySupervisors[] getSingleEntrySupervisorsJSON(string token);

        [OperationContract]
        [WebInvoke(Method = "POST",
         BodyStyle = WebMessageBodyStyle.Wrapped,
         ResponseFormat = WebMessageFormat.Json,
         RequestFormat = WebMessageFormat.Json,
         UriTemplate = "/getSingleEntryConsumersPresentJSON/")]
        SingleEntryWorker.SingleEntryConsumersPresent[] getSingleEntryConsumersPresentJSON(string token, string singleEntryId);

        [OperationContract]
        [WebInvoke(Method = "POST",
             BodyStyle = WebMessageBodyStyle.Wrapped,
             ResponseFormat = WebMessageFormat.Json,
             RequestFormat = WebMessageFormat.Json,
             UriTemplate = "/getGoalsCommunityIntegrationLevelJSON/")]
          OutcomesWorker.CommunityIntegrationLevel[] getGoalsCommunityIntegrationLevelJSON(string token);

        [OperationContract]
        [WebInvoke(Method = "POST",
             BodyStyle = WebMessageBodyStyle.Wrapped,
             ResponseFormat = WebMessageFormat.Json,
             RequestFormat = WebMessageFormat.Json,
             UriTemplate = "/getGoalsByDateNew/")]
        OutcomesWorker.ConsumerGoalsData[] getGoalsByDateNew(string consumerId, string goalDate);

        [OperationContract]
        [WebInvoke(Method = "POST",
             BodyStyle = WebMessageBodyStyle.Wrapped,
             ResponseFormat = WebMessageFormat.Json,
             RequestFormat = WebMessageFormat.Json,
             UriTemplate = "/getObjectiveActivity/")]
        OutcomesWorker.ObjectiveActivityData[] getObjectiveActivity(string objectiveActivityId);

        [OperationContract]
        [WebInvoke(Method = "POST",
             BodyStyle = WebMessageBodyStyle.Wrapped,
             ResponseFormat = WebMessageFormat.Json,
             RequestFormat = WebMessageFormat.Json,
             UriTemplate = "/getOutcomesPrimaryAndSecondaryLocations/")]
        OutcomesWorker.PrimaryAndSecondaryLocationData[] getOutcomesPrimaryAndSecondaryLocations(string consumerId, string goalDate);

        [OperationContract]
        [WebInvoke(Method = "POST",
            BodyStyle = WebMessageBodyStyle.Wrapped,
            ResponseFormat = WebMessageFormat.Json,
            RequestFormat = WebMessageFormat.Json,
            UriTemplate = "/getOutcomesPrompts/")]
        OutcomesWorker.PromptsData[] getOutcomesPrompts();

        [OperationContract]
        [WebInvoke(Method = "POST",
            BodyStyle = WebMessageBodyStyle.Wrapped,
            ResponseFormat = WebMessageFormat.Json,
            RequestFormat = WebMessageFormat.Json,
            UriTemplate = "/getOutcomesSuccessTypes/")]
        OutcomesWorker.SuccessTypeData[] getOutcomesSuccessTypes(string goalTypeId);

        [OperationContract]
        [WebInvoke(Method = "POST",
             BodyStyle = WebMessageBodyStyle.Wrapped,
             ResponseFormat = WebMessageFormat.Json,
             RequestFormat = WebMessageFormat.Json,
             UriTemplate = "/adminUpdateSingleEntryStatus/")]
        string adminUpdateSingleEntryStatus(string token, string singleEntryIdString, string newStatus, string userID, string rejectionReason);

        //Infal Time Clock Stuff Below
        [OperationContract]
        [WebInvoke(Method = "POST",
             BodyStyle = WebMessageBodyStyle.Wrapped,
             ResponseFormat = WebMessageFormat.Json,
             RequestFormat = WebMessageFormat.Json,
             UriTemplate = "/ValidateLogin/")]
        string ValidateLogin(string id);

        [OperationContract]
        [WebInvoke(Method = "POST",
             BodyStyle = WebMessageBodyStyle.Wrapped,
             ResponseFormat = WebMessageFormat.Json,
             RequestFormat = WebMessageFormat.Json,
             UriTemplate = "/getInfalUserName/")]
        string getInfalUserName(string empId);

        [OperationContract]
        [WebInvoke(Method = "POST",
             BodyStyle = WebMessageBodyStyle.Wrapped,
             ResponseFormat = WebMessageFormat.Json,
             RequestFormat = WebMessageFormat.Json,
             UriTemplate = "/InfalGetJobs/")]
        string InfalGetJobs(string id);

        [OperationContract]
        [WebInvoke(Method = "POST",
             BodyStyle = WebMessageBodyStyle.Wrapped,
             ResponseFormat = WebMessageFormat.Json,
             RequestFormat = WebMessageFormat.Json,
             UriTemplate = "/InfalGetClockInsAndOuts/")]
        string InfalGetClockInsAndOuts(string id);

        [OperationContract]
        [WebInvoke(Method = "POST",
             BodyStyle = WebMessageBodyStyle.Wrapped,
             ResponseFormat = WebMessageFormat.Json,
             RequestFormat = WebMessageFormat.Json,
             UriTemplate = "/InfalClockIn/")]
        string InfalClockIn(string empIdString, string jobIdString, string latInString, string longInString, string inDate, string StartTime, string StartAMPM);

        [OperationContract]
        [WebInvoke(Method = "POST",
             BodyStyle = WebMessageBodyStyle.Wrapped,
             ResponseFormat = WebMessageFormat.Json,
             RequestFormat = WebMessageFormat.Json,
             UriTemplate = "/InfalClockOut/")]
        string InfalClockOut(string empIdString, string jobIdString, string recIdString, string latOutString, string longOutString, string outDate, string EndTime, string EndTimeAMPM, string Memo);

        //TODO: Add IntelliView stuff below
        [OperationContract]
        [WebInvoke(Method = "POST",
             BodyStyle = WebMessageBodyStyle.Wrapped,
             ResponseFormat = WebMessageFormat.Json,
             RequestFormat = WebMessageFormat.Json,
             UriTemplate = "/intellivueLogInUser/")]
        string intellivueLogInUser(string token, string userId, string appId, string consumerNumber, string domain);

        [OperationContract]
        [WebInvoke(Method = "POST",
             BodyStyle = WebMessageBodyStyle.Wrapped,
             ResponseFormat = WebMessageFormat.Json,
             RequestFormat = WebMessageFormat.Json,
             UriTemplate = "/getIntellivueAppId/")]
        string getIntellivueAppId(string token, string consumerId, string userId, string applicationName);

        [OperationContract]
        [WebInvoke(Method = "POST",
             BodyStyle = WebMessageBodyStyle.Wrapped,
             ResponseFormat = WebMessageFormat.Json,
             RequestFormat = WebMessageFormat.Json,
             UriTemplate = "/getApplicationListHostedWithUser/")]
        string getApplicationListHostedWithUser(string token, string userId);

        [OperationContract]
        [WebInvoke(Method = "POST",
                     BodyStyle = WebMessageBodyStyle.Wrapped,
                     ResponseFormat = WebMessageFormat.Json,
                     RequestFormat = WebMessageFormat.Json,
                     UriTemplate = "/getIntellivueViewURL/")]
        string getIntellivueViewURL(string token, string consumerId, string userId, string appName, string applicationName);

        [OperationContract]
        [WebInvoke(Method = "POST",
                     BodyStyle = WebMessageBodyStyle.Wrapped,
                     ResponseFormat = WebMessageFormat.Json,
                     RequestFormat = WebMessageFormat.Json,
                     UriTemplate = "/simpleMarLogin/")]
        string simpleMarLogin(string token);

        //Report Code Below
        [OperationContract]
        [WebInvoke(Method = "POST",
             BodyStyle = WebMessageBodyStyle.Wrapped,
             ResponseFormat = WebMessageFormat.Json,
             RequestFormat = WebMessageFormat.Json,
             UriTemplate = "/BasicSingleEntryReport/")]
        System.IO.MemoryStream BasicSingleEntryReport(string token, string userId, string startDate, string endDate);

        [OperationContract]
        [WebInvoke(Method = "POST",
             BodyStyle = WebMessageBodyStyle.Wrapped,
             ResponseFormat = WebMessageFormat.Json,
             RequestFormat = WebMessageFormat.Json,
             UriTemplate = "/SingleEntryOverLapReport/")]
        System.IO.MemoryStream SingleEntryOverLapReport(string token, string userId, string startDate, string endDate);

        [OperationContract]
        [WebInvoke(Method = "POST",
             BodyStyle = WebMessageBodyStyle.Wrapped,
             ResponseFormat = WebMessageFormat.Json,
             RequestFormat = WebMessageFormat.Json,
             UriTemplate = "/getPlanAssessmentReport/")]
        System.IO.MemoryStream getPlanAssessmentReport(string token, string userId, string assessmentID, string versionID, string extraSpace, bool isp);

        [OperationContract]
        [WebInvoke(Method = "POST",
             BodyStyle = WebMessageBodyStyle.Wrapped,
             ResponseFormat = WebMessageFormat.Json,
             RequestFormat = WebMessageFormat.Json,
             UriTemplate = "/getDashboardDayServicesLocationsJSON/")]
        DashboardWorker.DashDSLocations[] getDashboardDayServicesLocationsJSON(string token);

        [OperationContract]
        [WebInvoke(Method = "POST",
             BodyStyle = WebMessageBodyStyle.Wrapped,
             ResponseFormat = WebMessageFormat.Json,
             RequestFormat = WebMessageFormat.Json,
             UriTemplate = "/getCIStaffDropdownJSON/")]
        DayServicesWorker.CIDropdownStaff[] getCIStaffDropdownJSON(string token, string serviceDate, string locationID);

        [OperationContract]
        [WebInvoke(Method = "POST",
             BodyStyle = WebMessageBodyStyle.Wrapped,
             ResponseFormat = WebMessageFormat.Json,
             RequestFormat = WebMessageFormat.Json,
             UriTemplate = "/getExistingCIStaffId/")]
        string getExistingCIStaffId(string token, string serviceDate, string locationID, string consumerId, string startTime);

        [OperationContract]
        [WebInvoke(Method = "POST",
             BodyStyle = WebMessageBodyStyle.Wrapped,
             ResponseFormat = WebMessageFormat.Json,
             RequestFormat = WebMessageFormat.Json,
             UriTemplate = "/updateCIStaff/")]
        string updateCIStaff(string token, string serviceDate, string locationID, string consumerId, string startTime, string staffId);

        [OperationContract]
        [WebInvoke(Method = "POST",
             BodyStyle = WebMessageBodyStyle.Wrapped,
             ResponseFormat = WebMessageFormat.Json,
             RequestFormat = WebMessageFormat.Json,
             UriTemplate = "/deleteCIStaffId/")]
        string deleteCIStaffId(string token, string serviceDate, string locationID, string consumerId, string startTime);

        [OperationContract]
        [WebInvoke(Method = "POST",
             BodyStyle = WebMessageBodyStyle.Wrapped,
             ResponseFormat = WebMessageFormat.Json,
             RequestFormat = WebMessageFormat.Json,
             UriTemplate = "/getConsumersThatCanHaveMileageJSON/")]
     //    string getConsumersThatCanHaveMileage(string token);
        CaseNotesWorker.ConsumersThatCanHaveMileage[] getConsumersThatCanHaveMileageJSON(string token);

        [OperationContract]
        [WebInvoke(Method = "POST",
             BodyStyle = WebMessageBodyStyle.Wrapped,
             ResponseFormat = WebMessageFormat.Json,
             RequestFormat = WebMessageFormat.Json,
             UriTemplate = "/updateVersion/")]
        string updateVersion(string token, string version);

        [OperationContract]
        [WebInvoke(Method = "POST",
             BodyStyle = WebMessageBodyStyle.Wrapped,
             ResponseFormat = WebMessageFormat.Json,
             RequestFormat = WebMessageFormat.Json,
             UriTemplate = "/getAdminSingleEntryLocationsJSON/")]
          SingleEntryWorker.AdminSELocations[] getAdminSingleEntryLocationsJSON(string token);
        
        [OperationContract]
        [WebInvoke(Method = "POST",
             BodyStyle = WebMessageBodyStyle.Wrapped,
             ResponseFormat = WebMessageFormat.Json,
             RequestFormat = WebMessageFormat.Json,
             UriTemplate = "/getInfalLoginCredentials/")]
        string getInfalLoginCredentials(string token);

        [OperationContract]
        [WebInvoke(Method = "POST",
             BodyStyle = WebMessageBodyStyle.Wrapped,
             ResponseFormat = WebMessageFormat.Json,
             RequestFormat = WebMessageFormat.Json,
             UriTemplate = "/getDateToCheckShowCI/")]
        string getDateToCheckShowCI(string token);

        [OperationContract]
        [WebInvoke(Method = "POST",
             BodyStyle = WebMessageBodyStyle.Wrapped,
             ResponseFormat = WebMessageFormat.Json,
             RequestFormat = WebMessageFormat.Json,
             UriTemplate = "/getGoalsCommunityIntegrationRequiredJSON/")]
        OutcomesWorker.CIRequired[] getGoalsCommunityIntegrationRequiredJSON(string token);

        [OperationContract]
        [WebInvoke(Method = "POST",
             BodyStyle = WebMessageBodyStyle.Wrapped,
             ResponseFormat = WebMessageFormat.Json,
             RequestFormat = WebMessageFormat.Json,
             UriTemplate = "/CheckInfalConnection/")]
        string CheckInfalConnection();

        [OperationContract]
        [WebInvoke(Method = "POST",
             BodyStyle = WebMessageBodyStyle.Wrapped,
             ResponseFormat = WebMessageFormat.Json,
             RequestFormat = WebMessageFormat.Json,
             UriTemplate = "/deleteConsumerNote/")]
        string deleteConsumerNote(string token, string noteId);

        [OperationContract]
        [WebInvoke(Method = "POST",
             BodyStyle = WebMessageBodyStyle.Wrapped,
             ResponseFormat = WebMessageFormat.Json,
             RequestFormat = WebMessageFormat.Json,
             UriTemplate = "/insertConsumerNote/")]
        string insertConsumerNote(string token, string consumerId, string noteTitle, string note, string locationId, string hideNote);

        [OperationContract]
        [WebInvoke(Method = "POST",
             BodyStyle = WebMessageBodyStyle.Wrapped,
             ResponseFormat = WebMessageFormat.Json,
             RequestFormat = WebMessageFormat.Json,
             UriTemplate = "/updateConsumerNoteDateRead/")]
        string updateConsumerNoteDateRead(string token, string noteId);

        [OperationContract]
        [WebInvoke(Method = "POST",
             BodyStyle = WebMessageBodyStyle.Wrapped,
             ResponseFormat = WebMessageFormat.Json,
             RequestFormat = WebMessageFormat.Json,
             UriTemplate = "/selectConsumerNote/")]
        string selectConsumerNote(string token, string noteId);

        [OperationContract]
        [WebInvoke(Method = "POST",
             BodyStyle = WebMessageBodyStyle.Wrapped,
             ResponseFormat = WebMessageFormat.Json,
             RequestFormat = WebMessageFormat.Json,
             UriTemplate = "/updateConsumerNotesDaysBack/")]
        string updateConsumerNotesDaysBack(string token, string updatedReviewDays);

        [OperationContract]
        [WebInvoke(Method = "POST",
             BodyStyle = WebMessageBodyStyle.Wrapped,
             ResponseFormat = WebMessageFormat.Json,
             RequestFormat = WebMessageFormat.Json,
             UriTemplate = "/updateConsumerNotesChecklistDaysBack/")]
        string updateConsumerNotesChecklistDaysBack(string token, string updatedChecklistDays);

        [OperationContract]
        [WebInvoke(Method = "POST",
             BodyStyle = WebMessageBodyStyle.Wrapped,
             ResponseFormat = WebMessageFormat.Json,
             RequestFormat = WebMessageFormat.Json,
             UriTemplate = "/updateLocationNoteDateRead/")]
        string updateLocationNoteDateRead(string token, string noteId);

        [OperationContract]
        [WebInvoke(Method = "POST",
             BodyStyle = WebMessageBodyStyle.Wrapped,
             ResponseFormat = WebMessageFormat.Json,
             RequestFormat = WebMessageFormat.Json,
             UriTemplate = "/insertLocationNote/")]
        string insertLocationNote(string token, string noteTitle, string note, string locationId);

        [OperationContract]
        [WebInvoke(Method = "POST",
             BodyStyle = WebMessageBodyStyle.Wrapped,
             ResponseFormat = WebMessageFormat.Json,
             RequestFormat = WebMessageFormat.Json,
             UriTemplate = "/deleteLocationNote/")]
        string deleteLocationNote(string token, string noteId);

        [OperationContract]
        [WebInvoke(Method = "POST",
             BodyStyle = WebMessageBodyStyle.Wrapped,
             ResponseFormat = WebMessageFormat.Json,
             RequestFormat = WebMessageFormat.Json,
             UriTemplate = "/selectAllUsersConsumersNotes/")]
        string selectAllUsersConsumersNotes(string token);

        [OperationContract]
        [WebInvoke(Method = "POST",
             BodyStyle = WebMessageBodyStyle.Wrapped,
             ResponseFormat = WebMessageFormat.Json,
             RequestFormat = WebMessageFormat.Json,
             UriTemplate = "/selectAllUsersLocationNotes/")]
        string selectAllUsersLocationNotes(string token, string daysBackDate);

        [OperationContract]
        [WebInvoke(Method = "POST",
             BodyStyle = WebMessageBodyStyle.Wrapped,
             ResponseFormat = WebMessageFormat.Json,
             RequestFormat = WebMessageFormat.Json,
             UriTemplate = "/selectNotesByConsumerAndLocation/")]
        string selectNotesByConsumerAndLocation(string token, string consumerId, string locationId);

        [OperationContract]
        [WebInvoke(Method = "POST",
             BodyStyle = WebMessageBodyStyle.Wrapped,
             ResponseFormat = WebMessageFormat.Json,
             RequestFormat = WebMessageFormat.Json,
             UriTemplate = "/selectNotesByLocation/")]
        string selectNotesByLocation(string token, string locationId, string daysBackDate);

        [OperationContract]
        [WebInvoke(Method = "POST",
                     BodyStyle = WebMessageBodyStyle.Wrapped,
                     ResponseFormat = WebMessageFormat.Json,
                     RequestFormat = WebMessageFormat.Json,
                     UriTemplate = "/selectNotesByLocationAndPermission/")]
        string selectNotesByLocationAndPermission(string token, string locationId, string daysBackDate);

        [OperationContract]
        [WebInvoke(Method = "POST",
             BodyStyle = WebMessageBodyStyle.Wrapped,
             ResponseFormat = WebMessageFormat.Json,
             RequestFormat = WebMessageFormat.Json,
             UriTemplate = "/selectLocationNote/")]
        string selectLocationNote(string token, string noteId);

        [OperationContract]
        [WebInvoke(Method = "POST",
             BodyStyle = WebMessageBodyStyle.Wrapped,
             ResponseFormat = WebMessageFormat.Json,
             RequestFormat = WebMessageFormat.Json,
             UriTemplate = "/updateConsumerNote/")]
        string updateConsumerNote(string token, string noteId, string consumerId, string note);

        [OperationContract]
        [WebInvoke(Method = "POST",
           BodyStyle = WebMessageBodyStyle.Wrapped,
           ResponseFormat = WebMessageFormat.Json,
           RequestFormat = WebMessageFormat.Json,
           UriTemplate = "/updateHideNote/")]
        string updateHideNote(string token, string noteId, string consumerId, string hideNote);

        [OperationContract]
        [WebInvoke(Method = "POST",
             BodyStyle = WebMessageBodyStyle.Wrapped,
             ResponseFormat = WebMessageFormat.Json,
             RequestFormat = WebMessageFormat.Json,
             UriTemplate = "/updateLocationNote/")]
        string updateLocationNote(string token, string noteId, string locationId, string note);

        [OperationContract]
        [WebInvoke(Method = "POST",
             BodyStyle = WebMessageBodyStyle.Wrapped,
             ResponseFormat = WebMessageFormat.Json,
             RequestFormat = WebMessageFormat.Json,
             UriTemplate = "/getLocationsWithUnreadNotes/")]
        string getLocationsWithUnreadNotes(string token, string daysBackDate);

        [OperationContract]
        [WebInvoke(Method = "POST",
                     BodyStyle = WebMessageBodyStyle.Wrapped,
                     ResponseFormat = WebMessageFormat.Json,
                     RequestFormat = WebMessageFormat.Json,
                     UriTemplate = "/getLocationsWithUnreadNotesAndPermission/")]
        string getLocationsWithUnreadNotesAndPermission(string token, string daysBackDate);

        [OperationContract]
        [WebInvoke(Method = "POST",
             BodyStyle = WebMessageBodyStyle.Wrapped,
             ResponseFormat = WebMessageFormat.Json,
             RequestFormat = WebMessageFormat.Json,
             UriTemplate = "/getConsumersWithUnreadNotesByEmployeeAndLocation/")]
        string getConsumersWithUnreadNotesByEmployeeAndLocation(string token, string locationId);

        [OperationContract]
        [WebInvoke(Method = "POST",
                     BodyStyle = WebMessageBodyStyle.Wrapped,
                     ResponseFormat = WebMessageFormat.Json,
                     RequestFormat = WebMessageFormat.Json,
                     UriTemplate = "/getConsumersWithUnreadNotesByEmployeeAndLocationPermission/")]
        string getConsumersWithUnreadNotesByEmployeeAndLocationPermission(string token, string locationId, string daysBackDate);

        [OperationContract]
        [WebInvoke(Method = "POST",
             BodyStyle = WebMessageBodyStyle.Wrapped,
             ResponseFormat = WebMessageFormat.Json,
             RequestFormat = WebMessageFormat.Json,
             UriTemplate = "/checkIfLocationHasUnreadNotes/")]
        string checkIfLocationHasUnreadNotes(string token, string locationId, string daysBackDate);

        [OperationContract]
        [WebInvoke(Method = "POST",
             BodyStyle = WebMessageBodyStyle.Wrapped,
             ResponseFormat = WebMessageFormat.Json,
             RequestFormat = WebMessageFormat.Json,
             UriTemplate = "/deleteAbsent/")]
        string deleteAbsent(string token, string absentId);

        [OperationContract]
        [WebInvoke(Method = "POST",
             BodyStyle = WebMessageBodyStyle.Wrapped,
             ResponseFormat = WebMessageFormat.Json,
             RequestFormat = WebMessageFormat.Json,
             UriTemplate = "/selectAbsent/")]
        string selectAbsent(string token, string consumerId, string locationId, string statusDate);

        [OperationContract]
        [WebInvoke(Method = "POST",
             BodyStyle = WebMessageBodyStyle.Wrapped,
             ResponseFormat = WebMessageFormat.Json,
             RequestFormat = WebMessageFormat.Json,
             UriTemplate = "/selectAbsentNotificationTypes/")]
        string selectAbsentNotificationTypes(string token);

        [OperationContract]
        [WebInvoke(Method = "POST",
             BodyStyle = WebMessageBodyStyle.Wrapped,
             ResponseFormat = WebMessageFormat.Json,
             RequestFormat = WebMessageFormat.Json,
             UriTemplate = "/selectAbsentReasons/")]
        string selectAbsentReasons(string token);

        [OperationContract]
        [WebInvoke(Method = "POST",
             BodyStyle = WebMessageBodyStyle.Wrapped,
             ResponseFormat = WebMessageFormat.Json,
             RequestFormat = WebMessageFormat.Json,
             UriTemplate = "/oneLocationAbsentSave/")]
        string oneLocationAbsentTableSave(string token, string absentReasonId, string absentNotificationId, string consumerIdString, string absenceDate, string locationId, string reportedBy, string timeReported, string dateReported);

        [OperationContract]
        [WebInvoke(Method = "POST",
             BodyStyle = WebMessageBodyStyle.Wrapped,
             ResponseFormat = WebMessageFormat.Json,
             RequestFormat = WebMessageFormat.Json,
             UriTemplate = "/absentPreSave/")]
        List<string> absentPreSave(string token, string consumerIdString, string absentDate, string locationId);

        [OperationContract]
        [WebInvoke(Method = "POST",
             BodyStyle = WebMessageBodyStyle.Wrapped,
             ResponseFormat = WebMessageFormat.Json,
             RequestFormat = WebMessageFormat.Json,
             UriTemplate = "/allLocationSaveAbsent/")]
        string allLocationSaveAbsent(string token, string absentReasonId, string absentNotificationId, string consumerIdString, string absenceDate, string reportedBy, string timeReported, string dateReported);

        [OperationContract]
        [WebInvoke(Method = "POST",
             BodyStyle = WebMessageBodyStyle.Wrapped,
             ResponseFormat = WebMessageFormat.Json,
             RequestFormat = WebMessageFormat.Json,
             UriTemplate = "/getConsumersByLocationAbsent/")]
        string getConsumersByLocationAbsent(string token, string absenceDate, string locationId);

        [OperationContract]
        [WebInvoke(Method = "POST",
             BodyStyle = WebMessageBodyStyle.Wrapped,
             ResponseFormat = WebMessageFormat.Json,
             RequestFormat = WebMessageFormat.Json,
             UriTemplate = "/getCompanyWorkWeekAndHours/")]
        AnywhereWorker.DaysAndHours[] getCompanyWorkWeekAndHours(string token);

        [OperationContract]
        [WebInvoke(Method = "POST",
             BodyStyle = WebMessageBodyStyle.Wrapped,
             ResponseFormat = WebMessageFormat.Json,
             RequestFormat = WebMessageFormat.Json,
             UriTemplate = "/getWorkWeeks/")]
        AnywhereWorker.WorkWeek getWorkWeeks(string token);

        [OperationContract]
        [WebInvoke(Method = "POST",
             BodyStyle = WebMessageBodyStyle.Wrapped,
             ResponseFormat = WebMessageFormat.Json,
             RequestFormat = WebMessageFormat.Json,
             UriTemplate = "/getSchedulingPeriods/")]
        AnywhereWorker.SchedulingPeriods[] getSchedulingPeriods(string token);

        [OperationContract]
        [WebInvoke(Method = "POST",
             BodyStyle = WebMessageBodyStyle.Wrapped,
             ResponseFormat = WebMessageFormat.Json,
             RequestFormat = WebMessageFormat.Json,
             UriTemplate = "/getSchedulingPeriodsDetails/")]
        AnywhereWorker.SchedulingData[] getSchedulingPeriodsDetails(string token, string startDate, string endDate);

        [OperationContract]
        [WebInvoke(Method = "POST",
             BodyStyle = WebMessageBodyStyle.Wrapped,
             ResponseFormat = WebMessageFormat.Json,
             RequestFormat = WebMessageFormat.Json,
             UriTemplate = "/getSingleEntryUsersWCJSON/")]
        SingleEntryWorker.SingleEntryUsersWC[] getSingleEntryUsersWCJSON(string token, string seDate);


        [OperationContract]
        [WebInvoke(Method = "GET",
             BodyStyle = WebMessageBodyStyle.Wrapped,
             ResponseFormat = WebMessageFormat.Json,
             RequestFormat = WebMessageFormat.Json,
             UriTemplate = "/testCaraSolva/")]
        string testCaraSolva();

        [OperationContract]
        [WebInvoke(Method = "POST",
             BodyStyle = WebMessageBodyStyle.Wrapped,
             ResponseFormat = WebMessageFormat.Json,
             RequestFormat = WebMessageFormat.Json,
             UriTemplate = "/CaraSolvaSignIn/")]
        void CaraSolvaSignIn(System.IO.Stream testInput);

        [OperationContract]
        [WebInvoke(Method = "POST",
             BodyStyle = WebMessageBodyStyle.Wrapped,
             ResponseFormat = WebMessageFormat.Json,
             RequestFormat = WebMessageFormat.Json,
             UriTemplate = "/CaraSolvaURL/")]
        string CaraSolvaURL(string token);

        [OperationContract]
        [WebInvoke(Method = "POST",
             BodyStyle = WebMessageBodyStyle.Wrapped,
             ResponseFormat = WebMessageFormat.Json,
             RequestFormat = WebMessageFormat.Json,
             UriTemplate = "/checkForIndividualAbsentJSON/")]
          RosterWorker.CheckForIndividualAbsent[] checkForIndividualAbsentJSON(string token, string locationId, string consumerId, string checkDate);

        [OperationContract]
        [WebInvoke(Method = "POST",
             BodyStyle = WebMessageBodyStyle.Wrapped,
             ResponseFormat = WebMessageFormat.Json,
             RequestFormat = WebMessageFormat.Json,
             UriTemplate = "/getOutcomeTypeForFilterJSON/")]
        OutcomesWorker.OutcomeTypeForFilter[] getOutcomeTypeForFilterJSON(string token, string selectedDate, string consumerId);

        [OperationContract]
        [WebInvoke(Method = "POST",
             BodyStyle = WebMessageBodyStyle.Wrapped,
             ResponseFormat = WebMessageFormat.Json,
             RequestFormat = WebMessageFormat.Json,
             UriTemplate = "/getPSIUserOptionListJSON/")]
        AnywhereWorker.UserOptionList[] getPSIUserOptionListJSON(string token);

        // TODO: Add your service operations here 

        [OperationContract]
        [WebInvoke(Method = "POST",
            BodyStyle = WebMessageBodyStyle.Wrapped,
             ResponseFormat = WebMessageFormat.Json,
             RequestFormat = WebMessageFormat.Json,
             UriTemplate = "/getAllAttachments/")]
        AnywhereAttachmentWorker.Attachments[] getAllAttachments(string token, string consumerId);

        [OperationContract]
        [WebInvoke(Method = "POST",
             BodyStyle = WebMessageBodyStyle.Bare,
             UriTemplate = "/getIndividualAttachment/")]
        //void getIndividualAttachment(string token, string attachmentId);
        void getIndividualAttachment(System.IO.Stream testInput);

        [OperationContract]
        [WebInvoke(Method = "POST",
             BodyStyle = WebMessageBodyStyle.Bare,
             UriTemplate = "/getAttachment/")]
        void getAttachment(System.IO.Stream testInput);

        [OperationContract]
        [WebInvoke(Method = "GET",
             BodyStyle = WebMessageBodyStyle.Bare,
             ResponseFormat = WebMessageFormat.Xml,
             UriTemplate = "/setTestValue/{val}")]
        string setTestValue(string val);

        [OperationContract]
        [WebInvoke(Method = "GET",
             BodyStyle = WebMessageBodyStyle.Bare,
             ResponseFormat = WebMessageFormat.Xml,
             RequestFormat = WebMessageFormat.Json,
             UriTemplate = "/getTestValue/")]
        string getTestValue();

        [OperationContract]
        [WebInvoke(Method = "POST",
             BodyStyle = WebMessageBodyStyle.Wrapped,
             ResponseFormat = WebMessageFormat.Json,
             RequestFormat = WebMessageFormat.Json,
             UriTemplate = "/getAbsentWidgetFilterData/")]
        string getAbsentWidgetFilterData(string token, string absentDate, string absentLocationId, string absentGroupCode, string custGroupId);

        [OperationContract]
        [WebInvoke(Method = "POST",
             BodyStyle = WebMessageBodyStyle.Wrapped,
             ResponseFormat = WebMessageFormat.Json,
             RequestFormat = WebMessageFormat.Json,
             UriTemplate = "/changeFromPSI/")]
        string changeFromPSI(string token, string userID);

        [OperationContract]
        [WebInvoke(Method = "POST",
             BodyStyle = WebMessageBodyStyle.Wrapped,
             ResponseFormat = WebMessageFormat.Json,
             RequestFormat = WebMessageFormat.Json,
             UriTemplate = "/WorkshopPreBatchLoad/")]
        AnywhereWorkshopWorkerTwo.BatchID[] WorkshopPreBatchLoad(string token, string absenceDate);

        [OperationContract]
        [WebInvoke(Method = "POST",
             BodyStyle = WebMessageBodyStyle.Wrapped,
             ResponseFormat = WebMessageFormat.Json,
             RequestFormat = WebMessageFormat.Json,
             UriTemplate = "/WorkshopLocations/")]
        AnywhereWorkshopWorkerTwo.Location[] WorkshopLocations(string token, string serviceDate);


        [OperationContract]
        [WebInvoke(Method = "POST",
             BodyStyle = WebMessageBodyStyle.Wrapped,
             ResponseFormat = WebMessageFormat.Json,
             RequestFormat = WebMessageFormat.Json,
             UriTemplate = "/getEnabledConsumersForWorkshop/")]
        string getEnabledConsumersForWorkshop(string token, string selectedDate, string selectedLocation);

        [OperationContract]
        [WebInvoke(Method = "POST",
             BodyStyle = WebMessageBodyStyle.Wrapped,
             ResponseFormat = WebMessageFormat.Json,
             RequestFormat = WebMessageFormat.Json,
             UriTemplate = "/getWorkshopSupervisors/")]
        AnywhereWorkshopWorkerTwo.Supervisor[] getWorkshopSupervisors(string token, string selectedDate);

        [OperationContract]
        [WebInvoke(Method = "POST",
             BodyStyle = WebMessageBodyStyle.Wrapped,
             ResponseFormat = WebMessageFormat.Json,
             RequestFormat = WebMessageFormat.Json,
             UriTemplate = "/getWorkshopJobCode/")]
        AnywhereWorkshopWorkerTwo.JobCode[] getWorkshopJobCode(string token, string selectedDate, string location);

        [OperationContract]
        [WebInvoke(Method = "POST",
             BodyStyle = WebMessageBodyStyle.Wrapped,
             ResponseFormat = WebMessageFormat.Json,
             RequestFormat = WebMessageFormat.Json,
             UriTemplate = "/getWorkshopFilterListData/")]
        AnywhereWorkshopWorkerTwo.GridData[] getWorkshopFilterListData(string token, string selectedDate, string consumerIds, string locationId, string jobStepId, string application, string batchId);

        [OperationContract]
        [WebInvoke(Method = "POST",
             BodyStyle = WebMessageBodyStyle.Wrapped,
             ResponseFormat = WebMessageFormat.Json,
             RequestFormat = WebMessageFormat.Json,
             UriTemplate = "/GetWorkshopOverlaps/")]
        List<string> GetWorkshopOverlaps(string token, string selectedDate, string jobString, string jobStepId, string jobActType, string location, string supervisor, string time, string batchId, string consumerids, string startOrEnd);

        [OperationContract]
        [WebInvoke(Method = "POST",
             BodyStyle = WebMessageBodyStyle.Wrapped,
             ResponseFormat = WebMessageFormat.Json,
             RequestFormat = WebMessageFormat.Json,
             UriTemplate = "/WorkshopClockOut/")]
        string WorkshopClockOut(string token, string consumerIds, string time, string supervisorId, string selectedDate, string jobStepId);

        [OperationContract]
        [WebInvoke(Method = "POST",
             BodyStyle = WebMessageBodyStyle.Wrapped,
             ResponseFormat = WebMessageFormat.Json,
             RequestFormat = WebMessageFormat.Json,
             UriTemplate = "/UpdateWorkshopClockIn/")]
        string UpdateWorkshopClockIn(string token, string jobActivityId, string timeEntered);

        [OperationContract]
        [WebInvoke(Method = "POST",
             BodyStyle = WebMessageBodyStyle.Wrapped,
             ResponseFormat = WebMessageFormat.Json,
             RequestFormat = WebMessageFormat.Json,
             UriTemplate = "/ClockoutWorkshopSingle/")]
        string ClockoutWorkshopSingle(string token, string jobActivityId, string timeEntered);

        [OperationContract]
        [WebInvoke(Method = "POST",
             BodyStyle = WebMessageBodyStyle.Wrapped,
             ResponseFormat = WebMessageFormat.Json,
             RequestFormat = WebMessageFormat.Json,
             UriTemplate = "/DeleteWorkshopEntry/")]
        string DeleteWorkshopEntry(string token, string jobActivityId);

        [OperationContract]
        [WebInvoke(Method = "POST",
             BodyStyle = WebMessageBodyStyle.Wrapped,
             ResponseFormat = WebMessageFormat.Json,
             RequestFormat = WebMessageFormat.Json,
             UriTemplate = "/UpdateWorkshopQuantity/")]
        string UpdateWorkshopQuantity(string token, string quantity, string jobActivityId);

        [OperationContract]
        [WebInvoke(Method = "POST",
             BodyStyle = WebMessageBodyStyle.Wrapped,
             ResponseFormat = WebMessageFormat.Json,
             RequestFormat = WebMessageFormat.Json,
             UriTemplate = "/getConsumerScheduleLocation/")]
        AnywhereWorker.Location[] getConsumerScheduleLocation(string token, string consumerId);

        [OperationContract]
        [WebInvoke(Method = "POST",
             BodyStyle = WebMessageBodyStyle.Wrapped,
             ResponseFormat = WebMessageFormat.Json,
             RequestFormat = WebMessageFormat.Json,
             UriTemplate = "/populateConsumerSchedule/")]
        AnywhereWorker.ConsumerSchedule[] populateConsumerSchedule(string token, string locationId, string consumerId);

        [OperationContract]
        [WebInvoke(Method = "POST",
             BodyStyle = WebMessageBodyStyle.Wrapped,
             ResponseFormat = WebMessageFormat.Json,
             RequestFormat = WebMessageFormat.Json,
             UriTemplate = "/remainingServicesWidgetFilter/")]
        AnywhereWorker.RemainingServiceWidgetData[] remainingServicesWidgetFilter(string token, string outcomeType, string locationId, string group, string checkDate);

        [OperationContract]
        [WebInvoke(Method = "POST",
             BodyStyle = WebMessageBodyStyle.Wrapped,
             ResponseFormat = WebMessageFormat.Json,
             RequestFormat = WebMessageFormat.Json,
             UriTemplate = "/populateOutcomeTypesRemainingServicesWidgetFilter/")]
        AnywhereWorker.OutcomeTypesRemainingServiceWidgetData[] populateOutcomeTypesRemainingServicesWidgetFilter(string token);

        [OperationContract]
        [WebInvoke(Method = "POST",
             BodyStyle = WebMessageBodyStyle.Wrapped,
             ResponseFormat = WebMessageFormat.Json,
             RequestFormat = WebMessageFormat.Json,
             UriTemplate = "/populateLocationsRemainingServicesWidgetFilter/")]
        AnywhereWorker.LocationsRemainingServiceWidgetData[] populateLocationsRemainingServicesWidgetFilter(string token);

        [OperationContract]
        [WebInvoke(Method = "POST",
             BodyStyle = WebMessageBodyStyle.Wrapped,
             ResponseFormat = WebMessageFormat.Json,
             RequestFormat = WebMessageFormat.Json,
             UriTemplate = "/populateGroupsRemainingServicesWidgetFilter/")]
        AnywhereWorker.GroupsRemainingServiceWidgetData[] populateGroupsRemainingServicesWidgetFilter(string token, string locationId);

        //Start of incident tracking
        [OperationContract]
        [WebInvoke(Method = "POST",
             BodyStyle = WebMessageBodyStyle.Wrapped,
             ResponseFormat = WebMessageFormat.Json,
             RequestFormat = WebMessageFormat.Json,
             UriTemplate = "/getITInvolvementTypeData/")]
        IncidentTrackingWorker.InvolvementTypeData[] getITInvolvementTypeData(string token);

        [OperationContract]
        [WebInvoke(Method = "POST",
             BodyStyle = WebMessageBodyStyle.Wrapped,
             ResponseFormat = WebMessageFormat.Json,
             RequestFormat = WebMessageFormat.Json,
             UriTemplate = "/getITIncidentCategories/")]
        IncidentTrackingWorker.IncidentCategories[] getITIncidentCategories(string token);

        [OperationContract]
        [WebInvoke(Method = "POST",
             BodyStyle = WebMessageBodyStyle.Wrapped,
             ResponseFormat = WebMessageFormat.Json,
             RequestFormat = WebMessageFormat.Json,
             UriTemplate = "/getITIncidentLocationDetail/")]
        IncidentTrackingWorker.IncidentLocationDetail[] getITIncidentLocationDetail(string token);

        [OperationContract]
        [WebInvoke(Method = "POST",
             BodyStyle = WebMessageBodyStyle.Wrapped,
             ResponseFormat = WebMessageFormat.Json,
             RequestFormat = WebMessageFormat.Json,
             UriTemplate = "/getITConsumerServiceLocations/")]
        IncidentTrackingWorker.IncidentTrackingConsumerServiceLocations[] getITConsumerServiceLocations(string token, string consumerId);

        [OperationContract]
        [WebInvoke(Method = "POST",
        BodyStyle = WebMessageBodyStyle.Wrapped,
        ResponseFormat = WebMessageFormat.Json,
        RequestFormat = WebMessageFormat.Json,
        UriTemplate = "/getITDashboardWidgetData/")]
        IncidentTrackingWorker.IncidentWidgetData[] getITDashboardWidgetData(string token, string viewCaseLoad);

        [OperationContract]
        [WebInvoke(Method = "POST",
        BodyStyle = WebMessageBodyStyle.Wrapped,
        ResponseFormat = WebMessageFormat.Json,
        RequestFormat = WebMessageFormat.Json,
        UriTemplate = "/updateIncidentTrackingDaysBack/")]
        string updateIncidentTrackingDaysBack(string token, string updatedReviewDays);

        [OperationContract]
        [WebInvoke(Method = "POST",
        BodyStyle = WebMessageBodyStyle.Wrapped,
        ResponseFormat = WebMessageFormat.Json,
        RequestFormat = WebMessageFormat.Json,
        UriTemplate = "/getITReviewTableData/")]
        IncidentTrackingWorker.IncidentTrackingReviewTableData[] getITReviewTableData(string token, string locationId, string employeeId, string supervisorId, string subcategoryId, string fromDate, string toDate, string viewCaseLoad);

        [OperationContract]
        [WebInvoke(Method = "POST",
             BodyStyle = WebMessageBodyStyle.Wrapped,
             ResponseFormat = WebMessageFormat.Json,
             RequestFormat = WebMessageFormat.Json,
             UriTemplate = "/saveUpdateITIncident/")]
        List<string> saveUpdateITIncident(string token, string incidentTypeId, string incidentDate, string incidentTime, string reportedDate,
                                    string reportedTime, string subcategoryId, string locationDetailId, string serviceLocationId, string summary, string note, string prevention, string contributingFactor, //end of main table data
                                    string consumerIdString, string includeInCount, string involvementId, string consumerIncidentLocationIdString, string consumerInvolvedIdString,//end of consumers
                                    string employeeIdString, string notifyEmployeeString, string employeeInvolvementIdString,//end of employees
                                    string othersInvolvedNameString, string othersInvolvedCompanyString, string othersInvolvedAddress1String, string othersInvolvedAddress2String, string othersInvolvedCityString, string othersInvolvedStateString,
                                    string othersInvolvedZipCodeString, string othersInvolvedPhoneString, string othersInvolvedInvolvementTypeIdString, string othersInvolvedInvolvementDescriptionString, string updateIncidentId, string saveUpdate);
        [OperationContract]
        [WebInvoke(Method = "POST",
             BodyStyle = WebMessageBodyStyle.Wrapped,
             ResponseFormat = WebMessageFormat.Json,
             RequestFormat = WebMessageFormat.Json,
             UriTemplate = "/sendITNotification/")]
        string sendITNotification(string token, string notificationType, string employeeId);

        [OperationContract]
        [WebInvoke(Method = "POST",
             BodyStyle = WebMessageBodyStyle.Wrapped,
             ResponseFormat = WebMessageFormat.Json,
             RequestFormat = WebMessageFormat.Json,
             UriTemplate = "/getLocationsIncidentTrackingReviewPage/")]
        IncidentTrackingWorker.IncidentTrackingReviewLocations[] getLocationsIncidentTrackingReviewPage(string token);

        [OperationContract]
        [WebInvoke(Method = "POST",
             BodyStyle = WebMessageBodyStyle.Wrapped,
             ResponseFormat = WebMessageFormat.Json,
             RequestFormat = WebMessageFormat.Json,
             UriTemplate = "/GetEmployeesInvolvedEmployeeDropdown/")]
        IncidentTrackingWorker.EmployeesInvolvedEmployeeDropdown[] getEmployeesInvolvedEmployeeDropdown(string token);

        [OperationContract]
        [WebInvoke(Method = "POST",
             BodyStyle = WebMessageBodyStyle.Wrapped,
             ResponseFormat = WebMessageFormat.Json,
             RequestFormat = WebMessageFormat.Json,
             UriTemplate = "/getIncidentEditReviewDataAllObjects/")]
        IncidentTrackingWorker.IncidentEditReviewDataAllObjects getIncidentEditReviewDataAllObjects(string token, string incidentId);

        [OperationContract]
        [WebInvoke(Method = "POST",
             BodyStyle = WebMessageBodyStyle.Wrapped,
             ResponseFormat = WebMessageFormat.Json,
             RequestFormat = WebMessageFormat.Json,
             UriTemplate = "/getITReviewPageEmployeeListAndSubList/")]
        string getITReviewPageEmployeeListAndSubList(string token, string supervisorId);

        [OperationContract]
        [WebInvoke(Method = "POST",
             BodyStyle = WebMessageBodyStyle.Wrapped,
             ResponseFormat = WebMessageFormat.Json,
             RequestFormat = WebMessageFormat.Json,
             UriTemplate = "/deleteAnywhereITIncident/")]
        string deleteAnywhereITIncident(string token, string incidentId);

        //[OperationContract]
        //[WebInvoke(Method = "POST",
        //     BodyStyle = WebMessageBodyStyle.Wrapped,
        //     ResponseFormat = WebMessageFormat.Json,
        //     RequestFormat = WebMessageFormat.Json,
        //     UriTemplate = "/getConsumerTableConsumerLocation/")]
        //AnywhereWorker.ConsumerTableLocation[] getConsumerTableConsumerLocation(string token, string consumerId);

        //Schduling
        [OperationContract]
        [WebInvoke(Method = "POST",
             BodyStyle = WebMessageBodyStyle.Wrapped,
             ResponseFormat = WebMessageFormat.Json,
             RequestFormat = WebMessageFormat.Json,
             UriTemplate = "/getSchedulesForSchedulingModule/")]
        AnywhereScheduleWorker.AllScheduleData[] getSchedulesForSchedulingModule(string token, string locationId, string personId);

        [OperationContract]
        [WebInvoke(Method = "POST",
             BodyStyle = WebMessageBodyStyle.Wrapped,
             ResponseFormat = WebMessageFormat.Json,
             RequestFormat = WebMessageFormat.Json,
             UriTemplate = "/getLocationDropdownForScheduling/")]
        AnywhereScheduleWorker.MainLocationDropDownData[] getLocationDropdownForScheduling(string token);

        [OperationContract]
        [WebInvoke(Method = "POST",
             BodyStyle = WebMessageBodyStyle.Wrapped,
             ResponseFormat = WebMessageFormat.Json,
             RequestFormat = WebMessageFormat.Json,
             UriTemplate = "/saveSchedulingCallOffRequest/")]
        string saveSchedulingCallOffRequest(string token, string shiftId, string personId, string reasonId, string note, string status, string notifiedEmployeeId);    

        [OperationContract]
        [WebInvoke(Method = "POST",
             BodyStyle = WebMessageBodyStyle.Wrapped,
             ResponseFormat = WebMessageFormat.Json,
             RequestFormat = WebMessageFormat.Json,
             UriTemplate = "/getCallOffDropdownReasons/")]
        AnywhereScheduleWorker.CallOffReasons[] getCallOffDropdownReasons(string token);

        [OperationContract]
        [WebInvoke(Method = "POST",
             BodyStyle = WebMessageBodyStyle.Wrapped,
             ResponseFormat = WebMessageFormat.Json,
             RequestFormat = WebMessageFormat.Json,
             UriTemplate = "/getCallOffDropdownEmployees/")]
        AnywhereScheduleWorker.CallOffEmployees[] getCallOffDropdownEmployees(string token, string shiftDate, string locationId);

        [OperationContract]
        [WebInvoke(Method = "POST",
            BodyStyle = WebMessageBodyStyle.Wrapped,
            ResponseFormat = WebMessageFormat.Json,
            RequestFormat = WebMessageFormat.Json,
            UriTemplate = "/getRequestTimeOffDropdownEmployees/")]
        AnywhereScheduleWorker.CallOffEmployees[] getRequestTimeOffDropdownEmployees(string token);

        [OperationContract]
        [WebInvoke(Method = "POST",
             BodyStyle = WebMessageBodyStyle.Wrapped,
             ResponseFormat = WebMessageFormat.Json,
             RequestFormat = WebMessageFormat.Json,
             UriTemplate = "/getDayOfWeekSchedule/")]
        AnywhereScheduleWorker.DayOfWeek[] getDayOfWeekSchedule(string token);

        [OperationContract]
        [WebInvoke(Method = "POST",
             BodyStyle = WebMessageBodyStyle.Wrapped,
             ResponseFormat = WebMessageFormat.Json,
             RequestFormat = WebMessageFormat.Json,
             UriTemplate = "/getScheduleApptInformation/")]
        AnywhereScheduleWorker.ConsumerAppointmentData[] getScheduleApptInformation(string token, string locationId);

        [OperationContract]
        [WebInvoke(Method = "POST",
             BodyStyle = WebMessageBodyStyle.Wrapped,
             ResponseFormat = WebMessageFormat.Json,
             RequestFormat = WebMessageFormat.Json,
             UriTemplate = "/requestDaysOffScheduling/")]
        string requestDaysOffScheduling(string token, string personId, string dates, string fromTime, string toTime, string reasonId, string employeeNotifiedId, string status);

        [OperationContract]
        [WebInvoke(Method = "POST",
             BodyStyle = WebMessageBodyStyle.Wrapped,
             ResponseFormat = WebMessageFormat.Json,
             RequestFormat = WebMessageFormat.Json,
             UriTemplate = "/saveOpenShiftRequestScheduling/")]
        string saveOpenShiftRequestScheduling(string token, string shiftId, string personId, string status, string notifiedEmployeeId);

        [OperationContract]
        [WebInvoke(Method = "POST",
             BodyStyle = WebMessageBodyStyle.Wrapped,
             ResponseFormat = WebMessageFormat.Json,
             RequestFormat = WebMessageFormat.Json,
             UriTemplate = "/cancelRequestOpenShiftScheduling/")]
        string cancelRequestOpenShiftScheduling(string token, string requestShiftId);

        [OperationContract]
        [WebInvoke(Method = "POST",
             BodyStyle = WebMessageBodyStyle.Wrapped,
             ResponseFormat = WebMessageFormat.Json,
             RequestFormat = WebMessageFormat.Json,
             UriTemplate = "/approveDenyOpenShiftRequestScheduling/")]
        string approveDenyOpenShiftRequestScheduling(string token, string requestedShiftId, string decision);

        [OperationContract]
        [WebInvoke(Method = "POST",
             BodyStyle = WebMessageBodyStyle.Wrapped,
             ResponseFormat = WebMessageFormat.Json,
             RequestFormat = WebMessageFormat.Json,
             UriTemplate = "/approveDenyCallOffRequestScheduling/")]
        string approveDenyCallOffRequestScheduling(string token, string callOffShiftId, string decision);

        [OperationContract]
        [WebInvoke(Method = "POST",
             BodyStyle = WebMessageBodyStyle.Wrapped,
             ResponseFormat = WebMessageFormat.Json,
             RequestFormat = WebMessageFormat.Json,
             UriTemplate = "/approveDenyDaysOffRequestScheduling/")]
        string approveDenyDaysOffRequestScheduling(string token, string daysOffIdString, string decision);

        [OperationContract]
        [WebInvoke(Method = "POST",
             BodyStyle = WebMessageBodyStyle.Wrapped,
             ResponseFormat = WebMessageFormat.Json,
             RequestFormat = WebMessageFormat.Json,
             UriTemplate = "/getScheduleMyApprovalData/")]
        AnywhereScheduleWorker.MyApprovalData[] getScheduleMyApprovalData(string token, string personId);

        [OperationContract]
        [WebInvoke(Method = "POST",
             BodyStyle = WebMessageBodyStyle.Wrapped,
             ResponseFormat = WebMessageFormat.Json,
             RequestFormat = WebMessageFormat.Json,
             UriTemplate = "/singleEntrySaveSignatureAndNote/")]
        string singleEntrySaveSignatureAndNote(string token, string singleEntryId, string consumerId, string note, string signatureImage);

        [OperationContract]
        [WebInvoke(Method = "POST",
             BodyStyle = WebMessageBodyStyle.Wrapped,
             ResponseFormat = WebMessageFormat.Json,
             RequestFormat = WebMessageFormat.Json,
             UriTemplate = "/getSpecificConsumerSignatureAndNote/")]
        SingleEntryWorker.SignatureAndNote[] getSpecificConsumerSignatureAndNote(string token, string singleEntryId, string consumerId);

        [OperationContract]
        [WebInvoke(Method = "POST",
             BodyStyle = WebMessageBodyStyle.Wrapped,
             ResponseFormat = WebMessageFormat.Json,
             RequestFormat = WebMessageFormat.Json,
             UriTemplate = "/getConsumersSignaturesAndNotes/")]
        SingleEntryWorker.ConsumerSignaturesAndNotes[] getConsumersSignaturesAndNotes(string token, string singleEntryId);

        [OperationContract]
        [WebInvoke(Method = "POST",
                BodyStyle = WebMessageBodyStyle.Wrapped,
                ResponseFormat = WebMessageFormat.Json,
                RequestFormat = WebMessageFormat.Json,
                UriTemplate = "/getSuccessSymbolLookup/")]
        OutcomesWorker.SuccessSymbolLookup[] getSuccessSymbolLookup(string token);

        [OperationContract]
        [WebInvoke(Method = "POST",
                BodyStyle = WebMessageBodyStyle.Wrapped,
                ResponseFormat = WebMessageFormat.Json,
                RequestFormat = WebMessageFormat.Json,
                UriTemplate = "/getCustomPhrases/")]
        CaseNotesWorker.CustomPhrases[] getCustomPhrases(string token, string showAll);

        [OperationContract]
        [WebInvoke(Method = "POST",
                BodyStyle = WebMessageBodyStyle.Wrapped,
                ResponseFormat = WebMessageFormat.Json,
                RequestFormat = WebMessageFormat.Json,
                UriTemplate = "/getConsumersForCNFilter/")]
        CaseNotesWorker.ConsumersForFilter[] getConsumersForCNFilter(string token, string caseLoadOnly);

        [OperationContract]
        [WebInvoke(Method = "POST",
                BodyStyle = WebMessageBodyStyle.Wrapped,
                ResponseFormat = WebMessageFormat.Json,
                RequestFormat = WebMessageFormat.Json,
                UriTemplate = "/insertCustomPhrase/")]
        string insertCustomPhrase(string token, string shortcut, string phrase, string makePublic);

        [OperationContract]
        [WebInvoke(Method = "POST",
                BodyStyle = WebMessageBodyStyle.Wrapped,
                ResponseFormat = WebMessageFormat.Json,
                RequestFormat = WebMessageFormat.Json,
                UriTemplate = "/getlocationsWithConsumersWithUnreadNotes/")]
        string getlocationsWithConsumersWithUnreadNotes(string token, string daysBackDate);

        [OperationContract]
        [WebInvoke(Method = "POST",
                BodyStyle = WebMessageBodyStyle.Wrapped,
                ResponseFormat = WebMessageFormat.Json,
                RequestFormat = WebMessageFormat.Json,
                UriTemplate = "/getInterventionTypesDropdown/")]
        IncidentTrackingWorker.InterventionTypesDropdown[] getInterventionTypesDropdown(string token);

        [OperationContract]
        [WebInvoke(Method = "POST",
                BodyStyle = WebMessageBodyStyle.Wrapped,
                ResponseFormat = WebMessageFormat.Json,
                RequestFormat = WebMessageFormat.Json,
                UriTemplate = "/getReviewedByDropdown/")]
        IncidentTrackingWorker.ReviewedByDropdown[] getReviewedByDropdown(string token);

        [OperationContract]
        [WebInvoke(Method = "POST",
                BodyStyle = WebMessageBodyStyle.Wrapped,
                ResponseFormat = WebMessageFormat.Json,
                RequestFormat = WebMessageFormat.Json,
                UriTemplate = "/getInjuryLocationsDropdown/")]
        IncidentTrackingWorker.InjuryLocationsDropdown[] getInjuryLocationsDropdown(string token);

        [OperationContract]
        [WebInvoke(Method = "POST",
                BodyStyle = WebMessageBodyStyle.Wrapped,
                ResponseFormat = WebMessageFormat.Json,
                RequestFormat = WebMessageFormat.Json,
                UriTemplate = "/getInjuryTypesDropdown/")]
        IncidentTrackingWorker.InjuryTypesDropdown[] getInjuryTypesDropdown(string token);

        [OperationContract]
        [WebInvoke(Method = "POST",
                BodyStyle = WebMessageBodyStyle.Wrapped,
                ResponseFormat = WebMessageFormat.Json,
                RequestFormat = WebMessageFormat.Json,
                UriTemplate = "/getitConsumerFollowUpTypes/")]
        IncidentTrackingWorker.ConsumerFollowUpTypes[] getitConsumerFollowUpTypes(string token);

        [OperationContract]
        [WebInvoke(Method = "POST",
                BodyStyle = WebMessageBodyStyle.Wrapped,
                ResponseFormat = WebMessageFormat.Json,
                RequestFormat = WebMessageFormat.Json,
                UriTemplate = "/getitReportingCategories/")]
        IncidentTrackingWorker.ReportingCategories[] getitReportingCategories(string token);

        [OperationContract]
        [WebInvoke(Method = "POST",
                BodyStyle = WebMessageBodyStyle.Wrapped,
                ResponseFormat = WebMessageFormat.Json,
                RequestFormat = WebMessageFormat.Json,
                UriTemplate = "/getitConsumerInterventions/")]
        IncidentTrackingWorker.ConsumerInterventions[] getitConsumerInterventions(string token, string consumerId, string incidentId);

        [OperationContract]
        [WebInvoke(Method = "POST",
                BodyStyle = WebMessageBodyStyle.Wrapped,
                ResponseFormat = WebMessageFormat.Json,
                RequestFormat = WebMessageFormat.Json,
                UriTemplate = "/getitConsumerInjuries/")]
        IncidentTrackingWorker.ConsumerInjuries[] getitConsumerInjuries(string token, string consumerId, string incidentId);
        
        [OperationContract]
        [WebInvoke(Method = "POST",
                BodyStyle = WebMessageBodyStyle.Wrapped,
                ResponseFormat = WebMessageFormat.Json,
                RequestFormat = WebMessageFormat.Json,
                UriTemplate = "/getitConsumerReviews/")]
        IncidentTrackingWorker.ConsumerReviews[] getitConsumerReviews(string token, string consumerId, string incidentId);

        [OperationContract]
        [WebInvoke(Method = "POST",
                BodyStyle = WebMessageBodyStyle.Wrapped,
                ResponseFormat = WebMessageFormat.Json,
                RequestFormat = WebMessageFormat.Json,
                UriTemplate = "/getitConsumerFollowUps/")]
        IncidentTrackingWorker.ConsumerFollowUps[] getitConsumerFollowUps(string token, string consumerId, string incidentId);

        [OperationContract]
        [WebInvoke(Method = "POST",
                BodyStyle = WebMessageBodyStyle.Wrapped,
                ResponseFormat = WebMessageFormat.Json,
                RequestFormat = WebMessageFormat.Json,
                UriTemplate = "/getitConsumerReporting/")]
        IncidentTrackingWorker.ConsumerReporting[] getitConsumerReporting(string token, string consumerId, string incidentId);

        //Incident Tracking Consumer Follow Up specific alters
        [OperationContract]
        [WebInvoke(Method = "POST",
             BodyStyle = WebMessageBodyStyle.Wrapped,
             ResponseFormat = WebMessageFormat.Json,
             RequestFormat = WebMessageFormat.Json,
             UriTemplate = "/itDeleteConsumerFollowUp/")]
        string itDeleteConsumerFollowUp(string token, string itConsumerFollowUpId);

        [OperationContract]
        [WebInvoke(Method = "POST",
            BodyStyle = WebMessageBodyStyle.Wrapped,
            ResponseFormat = WebMessageFormat.Json,
            RequestFormat = WebMessageFormat.Json,
            UriTemplate = "/saveUpdateITConsumerFollowUp/")]
        string saveUpdateITConsumerFollowUp(string token, List<String> consumerFollowUpIdArray, string consumerInvolvedId, List<String> followUpTypeIdArray, List<String> personResponsibleArray,
                                                    List<String> dueDateArray, List<String> completedDateArray, List<String> notesArray);

        //Incident Tracking Consumer Reporting specific alters
        [OperationContract]
        [WebInvoke(Method = "POST",
             BodyStyle = WebMessageBodyStyle.Wrapped,
             ResponseFormat = WebMessageFormat.Json,
             RequestFormat = WebMessageFormat.Json,
             UriTemplate = "/itDeleteConsumerReporting/")]
        string itDeleteConsumerReporting(string token, string itConsumerReportingId);

        [OperationContract]
        [WebInvoke(Method = "POST",
            BodyStyle = WebMessageBodyStyle.Wrapped,
            ResponseFormat = WebMessageFormat.Json,
            RequestFormat = WebMessageFormat.Json,
            UriTemplate = "/saveUpdateITConsumerReporting/")]
        string saveUpdateITConsumerReporting(string token, List<String> consumerReportIdArray, string consumerInvolvedId, List<String> reportDateArray, List<String> reportTimeArray,
                                                            List<String> reportingCategoryIdArray, List<String> reportToArray, List<String> reportByArray,
                                                            List<String> reportMethodArray, List<String> notesArray);

        //Incident Tracking Consumer Reporting specific alters
        [OperationContract]
        [WebInvoke(Method = "POST",
             BodyStyle = WebMessageBodyStyle.Wrapped,
             ResponseFormat = WebMessageFormat.Json,
             RequestFormat = WebMessageFormat.Json,
             UriTemplate = "/itDeleteConsumerReviews/")]
        string itDeleteConsumerReviews(string token, string itConsumerReviewId);

        [OperationContract]
        [WebInvoke(Method = "POST",
            BodyStyle = WebMessageBodyStyle.Wrapped,
            ResponseFormat = WebMessageFormat.Json,
            RequestFormat = WebMessageFormat.Json,
            UriTemplate = "/saveUpdateITConsumerReviews/")]
        string saveUpdateITConsumerReviews(string token, List<String> itConsumerReviewIdArray, string consumerInvolvedId, List<String> reviewedByArray, List<String> reviewedDateArray, List<String> noteArray);

        //Incident Tracking Consumer Injuries specific alters
        [OperationContract]
        [WebInvoke(Method = "POST",
             BodyStyle = WebMessageBodyStyle.Wrapped,
             ResponseFormat = WebMessageFormat.Json,
             RequestFormat = WebMessageFormat.Json,
             UriTemplate = "/itDeleteConsumerInjuries/")]
        string itDeleteConsumerInjuries(string token, string itConsumerInjuryId);

        //Incident Tracking Consumer Injuries specific alters
        [OperationContract]
        [WebInvoke(Method = "POST",
             BodyStyle = WebMessageBodyStyle.Wrapped,
             ResponseFormat = WebMessageFormat.Json,
             RequestFormat = WebMessageFormat.Json,
             UriTemplate = "/itDeleteConsumerInterventions/")]
        string itDeleteConsumerInterventions(string token, string itConsumerInterventionId);

        [OperationContract]
        [WebInvoke(Method = "POST",
            BodyStyle = WebMessageBodyStyle.Wrapped,
            ResponseFormat = WebMessageFormat.Json,
            RequestFormat = WebMessageFormat.Json,
            UriTemplate = "/saveUpdateITConsumerInjuries/")]
        string saveUpdateITConsumerInjuries(string token, List<String> checkedByNurseArray, List<String> checkedDateArray, List<String> detailsArray, List<String> itConsumerInjuryIdArray, 
                                                    string consumerInvolvedId, List<String> itInjuryLocationIdArray, List<String> itInjuryTypeIdArray, List<String> treatmentArray);
        [OperationContract]
        [WebInvoke(Method = "POST",
            BodyStyle = WebMessageBodyStyle.Wrapped,
            ResponseFormat = WebMessageFormat.Json,
            RequestFormat = WebMessageFormat.Json,
            UriTemplate = "/saveUpdateITConsumerInterventions/")]
        string saveUpdateITConsumerInterventions(string token, List<String> aversiveArray, List<String> itConsumerInterventionIdArray, string consumerInvolvedId, List<String> itConsumerInterventionTypeIdArray, 
                                                List<String> notesArray, List<String> startTimeArray, List<String> stopTimeArray, List<String> timeLengthArray);

        #region PLAN MODULE
        [OperationContract]
        [WebInvoke(Method = "POST",
            BodyStyle = WebMessageBodyStyle.Wrapped,
            ResponseFormat = WebMessageFormat.Json,
            RequestFormat = WebMessageFormat.Json,
            UriTemplate = "/getConsumerPlans/")]
        AnywherePlanWorker.ConsumerPlans[] getConsumerPlans(string token, string consumerId);

        [OperationContract]
        [WebInvoke(Method = "POST",
            BodyStyle = WebMessageBodyStyle.Wrapped,
            ResponseFormat = WebMessageFormat.Json,
            RequestFormat = WebMessageFormat.Json,
            UriTemplate = "/getPlanAttachmentsList/")]
        AnywherePlanWorker.AttachmentList[] getPlanAttachmentsList(string token, long planId, string section);

        [OperationContract]
        [WebInvoke(Method = "POST",
            BodyStyle = WebMessageBodyStyle.Wrapped,
            ResponseFormat = WebMessageFormat.Json,
            RequestFormat = WebMessageFormat.Json,
            UriTemplate = "/addPlanAttachment/")]
        AnywherePlanWorker.AddAttachment[] addPlanAttachment(string token, long assessmentId, string description, string attachmentType, string attachment, string section, long questionId);

        [OperationContract]
        [WebInvoke(Method = "POST",
            BodyStyle = WebMessageBodyStyle.Wrapped,
            ResponseFormat = WebMessageFormat.Json,
            RequestFormat = WebMessageFormat.Json,
            UriTemplate = "/deletePlanAttachment/")]
        string deletePlanAttachment(string token, long planId, string attachmentId);

        [OperationContract]
        [WebInvoke(Method = "POST",
            BodyStyle = WebMessageBodyStyle.Wrapped,
            ResponseFormat = WebMessageFormat.Json,
            RequestFormat = WebMessageFormat.Json,
            UriTemplate = "/getConsumerAssessment/")]
        AssessmentWorker.ConsumerAssessment[] getConsumerAssessment(string token, string consumerPlanId);

        [OperationContract]
        [WebInvoke(Method = "POST",
            BodyStyle = WebMessageBodyStyle.Wrapped,
            ResponseFormat = WebMessageFormat.Json,
            RequestFormat = WebMessageFormat.Json,
            UriTemplate = "/getConsumerRelationships/")]
        AssessmentWorker.ConsumerRelationships[] getConsumerRelationships(string token, string consumerId, string effectiveStartDate, string effectiveEndDate, string areInSalesForce, string planId);

        [OperationContract]
        [WebInvoke(Method = "POST",
            BodyStyle = WebMessageBodyStyle.Wrapped,
            ResponseFormat = WebMessageFormat.Json,
            RequestFormat = WebMessageFormat.Json,
            UriTemplate = "/getConsumerNameInfo/")]
        AssessmentWorker.ConsumerNameInfo[] getConsumerNameInfo(string token, string consumerId);

        [OperationContract]
        [WebInvoke(Method = "POST",
            BodyStyle = WebMessageBodyStyle.Wrapped,
            ResponseFormat = WebMessageFormat.Json,
            RequestFormat = WebMessageFormat.Json,
            UriTemplate = "/getServiceAndSupportsData/")]
        AnywhereAssessmentWorker.ServiceAndsSupportData getServiceAndSupportsData(string token, string effectiveStartDate, string effectiveEndDate, long consumerId, string areInSalesForce, string planId);

        [OperationContract]
        [WebInvoke(Method = "POST",
                    BodyStyle = WebMessageBodyStyle.Wrapped,
                    ResponseFormat = WebMessageFormat.Json,
                    RequestFormat = WebMessageFormat.Json,
                    UriTemplate = "/getPaidSupportsVendors/")]
        AnywhereAssessmentWorker.ServiceVendors[] getPaidSupportsVendors(string fundingSourceName, string serviceName, string areInSalesForce);


        [OperationContract]
        [WebInvoke(Method = "POST",
            BodyStyle = WebMessageBodyStyle.Wrapped,
            ResponseFormat = WebMessageFormat.Json,
            RequestFormat = WebMessageFormat.Json,
            UriTemplate = "/insertPlanReportToBeTranferredToONET/")]
        string insertPlanReportToBeTranferredToONET(string token, string report, long planId);

        [OperationContract]
        [WebInvoke(Method = "POST",
            BodyStyle = WebMessageBodyStyle.Wrapped,
            ResponseFormat = WebMessageFormat.Json,
            RequestFormat = WebMessageFormat.Json,
            UriTemplate = "/transferPlanReportToONET/")]
        string transferPlanReportToONET(string token, long planId);

        [OperationContract]
        [WebInvoke(Method = "POST",
            BodyStyle = WebMessageBodyStyle.Wrapped,
            ResponseFormat = WebMessageFormat.Json,
            RequestFormat = WebMessageFormat.Json,
            UriTemplate = "/updateConsumerNameInfo/")]
        int updateConsumerNameInfo(string token, string consumerId, string firstName, string lastName, string middleName, string nickName);

        [OperationContract]
        [WebInvoke(Method = "POST",
            BodyStyle = WebMessageBodyStyle.Wrapped,
            ResponseFormat = WebMessageFormat.Json,
            RequestFormat = WebMessageFormat.Json,
            UriTemplate = "/insertConsumerPlanAnnual/")]
        string insertConsumerPlanAnnual(string token, string consumerId, string planYearStart, string reviewDate);

        [OperationContract]
        [WebInvoke(Method = "POST",
            BodyStyle = WebMessageBodyStyle.Wrapped,
            ResponseFormat = WebMessageFormat.Json,
            RequestFormat = WebMessageFormat.Json,
            UriTemplate = "/updateConsumerPlanReviewDate/")]
        string updateConsumerPlanReviewDate(string token, string reviewDate, long planId);

        [OperationContract]
        [WebInvoke(Method = "POST",
            BodyStyle = WebMessageBodyStyle.Wrapped,
            ResponseFormat = WebMessageFormat.Json,
            RequestFormat = WebMessageFormat.Json,
            UriTemplate = "/insertConsumerPlanRevision/")]
        string insertConsumerPlanRevision(string token, string priorConsumerPlanId, string effectiveStart, string effectiveEnd, string reviewDate, Boolean useLatestAssessmentVersion);

        [OperationContract]
        [WebInvoke(Method = "POST",
            BodyStyle = WebMessageBodyStyle.Wrapped,
            ResponseFormat = WebMessageFormat.Json,
            RequestFormat = WebMessageFormat.Json,
            UriTemplate = "/insertAssessmentGridRowAnswers/")]
        AssessmentWorker.AssessmentAnswer[] insertAssessmentGridRowAnswers(string token, string consumerPlanId, string assessmentQuestionSetId);

        [OperationContract]
        [WebInvoke(Method = "POST",
            BodyStyle = WebMessageBodyStyle.Wrapped,
            ResponseFormat = WebMessageFormat.Json,
            RequestFormat = WebMessageFormat.Json,
            UriTemplate = "/updateAssessmentAnswers/")]
        int updateAssessmentAnswers(string token, AssessmentWorker.AssessmentAnswer[] answers);

        [OperationContract]
        [WebInvoke(Method = "POST",
            BodyStyle = WebMessageBodyStyle.Wrapped,
            ResponseFormat = WebMessageFormat.Json,
            RequestFormat = WebMessageFormat.Json,
            UriTemplate = "/updateConsumerPlanReactivate/")]
        int updateConsumerPlanReactivate(string token, string consumerPlanId);

        [OperationContract]
        [WebInvoke(Method = "POST",
            BodyStyle = WebMessageBodyStyle.Wrapped,
            ResponseFormat = WebMessageFormat.Json,
            RequestFormat = WebMessageFormat.Json,
            UriTemplate = "/updateConsumerPlanSetStatus/")]
        int updateConsumerPlanSetStatus(string token, string consumerPlanId, string status);

        [OperationContract]
        [WebInvoke(Method = "POST",
            BodyStyle = WebMessageBodyStyle.Wrapped,
            ResponseFormat = WebMessageFormat.Json,
            RequestFormat = WebMessageFormat.Json,
            UriTemplate = "/updateConsumerPlanSetAnnualDates/")]
        int updateConsumerPlanSetAnnualDates(string token, string consumerPlanId, string newPlanYearStart);

        [OperationContract]
        [WebInvoke(Method = "POST",
            BodyStyle = WebMessageBodyStyle.Wrapped,
            ResponseFormat = WebMessageFormat.Json,
            RequestFormat = WebMessageFormat.Json,
            UriTemplate = "/updateConsumerPlanSetRevisionEffectiveDates/")]
        int updateConsumerPlanSetRevisionEffectiveDates(string token, string consumerPlanId, string newEffectiveStart, string newEffectiveEnd);

        [OperationContract]
        [WebInvoke(Method = "DELETE",
            BodyStyle = WebMessageBodyStyle.Wrapped,
            ResponseFormat = WebMessageFormat.Json,
            RequestFormat = WebMessageFormat.Json,
            UriTemplate = "/deleteAssessmentGridRowAnswers/")]
        string deleteAssessmentGridRowAnswers(string token, string consumerPlanId, string assessmentQuestionSetId, string[] rowsToDelete);

        [OperationContract]
        [WebInvoke(Method = "DELETE",
            BodyStyle = WebMessageBodyStyle.Wrapped,
            ResponseFormat = WebMessageFormat.Json,
            RequestFormat = WebMessageFormat.Json,
            UriTemplate = "/deleteConsumerPlan/")]
        string deleteConsumerPlan(string token, string consumerPlanId);

        [OperationContract]
        [WebInvoke(Method = "POST",
            BodyStyle = WebMessageBodyStyle.Wrapped,
            ResponseFormat = WebMessageFormat.Json,
            RequestFormat = WebMessageFormat.Json,
            UriTemplate = "/getConsumerPlanYearInfo/")]
        RosterWorker.ConsumerPlanYearInfo getConsumerPlanYearInfo(string token, string consumerId);
        #endregion

        #region WORKFLOW MODULE 

        [OperationContract]
        [WebInvoke(Method = "DELETE",
            BodyStyle = WebMessageBodyStyle.Wrapped,
            ResponseFormat = WebMessageFormat.Json,
            RequestFormat = WebMessageFormat.Json,
            UriTemplate = "/deleteWorkflowStep/")]
        String deleteWorkflowStep(string token, string stepId);

        [OperationContract]
        [WebInvoke(Method = "DELETE",
            BodyStyle = WebMessageBodyStyle.Wrapped,
            ResponseFormat = WebMessageFormat.Json,
            RequestFormat = WebMessageFormat.Json,
            UriTemplate = "/deleteWorkflowStepDocument/")]
        String deleteWorkflowStepDocument(string token, string documentId);

        [OperationContract]
        [WebInvoke(Method = "DELETE",
          BodyStyle = WebMessageBodyStyle.Wrapped,
          ResponseFormat = WebMessageFormat.Json,
          RequestFormat = WebMessageFormat.Json,
          UriTemplate = "/deleteWorkflow/")]
        String deleteWorkflow(string token, string workflowId);

        [OperationContract]
        [WebInvoke(Method = "POST",
           BodyStyle = WebMessageBodyStyle.Wrapped,
           ResponseFormat = WebMessageFormat.Json,
           RequestFormat = WebMessageFormat.Json,
           UriTemplate = "/getPeopleNames/")]
        WorkflowWorker.PeopleName[] getPeopleNames(string token);

        [OperationContract]
        [WebInvoke(Method = "POST",
           BodyStyle = WebMessageBodyStyle.Wrapped,
           ResponseFormat = WebMessageFormat.Json,
           RequestFormat = WebMessageFormat.Json,
           UriTemplate = "/getWFResponsiblePartyRelationships/")]
        WorkflowWorker.ResponsiblePartyRelationship[] getWFResponsiblePartyRelationships(string token, string workflowId);

        [OperationContract]
        [WebInvoke(Method = "POST",
           BodyStyle = WebMessageBodyStyle.Wrapped,
           ResponseFormat = WebMessageFormat.Json,
           RequestFormat = WebMessageFormat.Json,
           UriTemplate = "/getWFResponsibleParties/")]
        WorkflowWorker.ResponsiblePartyRelationship[] getWFResponsibleParties(string token, string workflowId);

        [OperationContract]
        [WebInvoke(Method = "POST",
           BodyStyle = WebMessageBodyStyle.Wrapped,
           ResponseFormat = WebMessageFormat.Json,
           RequestFormat = WebMessageFormat.Json,
           UriTemplate = "/getWFwithMissingResponsibleParties/")]
        WorkflowWorker.Workflow[] getWFwithMissingResponsibleParties(string token, string workflowIds);

        [OperationContract]
        [WebInvoke(Method = "POST",
           BodyStyle = WebMessageBodyStyle.Wrapped,
           ResponseFormat = WebMessageFormat.Json,
           RequestFormat = WebMessageFormat.Json,
           UriTemplate = "/getResponsiblePartyIdforThisEditStep/")]
        WorkflowWorker.WorkflowStep[] getResponsiblePartyIdforThisEditStep(string token, string stepId);

        [OperationContract]
        [WebInvoke(Method = "POST",
          BodyStyle = WebMessageBodyStyle.Wrapped,
          ResponseFormat = WebMessageFormat.Json,
          RequestFormat = WebMessageFormat.Json,
          UriTemplate = "/getFormTemplates/")]
        FormWorker.FormTemplate[] getFormTemplates(string token);

        [OperationContract]
        [WebInvoke(Method = "POST",
           BodyStyle = WebMessageBodyStyle.Wrapped,
           ResponseFormat = WebMessageFormat.Json,
           RequestFormat = WebMessageFormat.Json,
           UriTemplate = "/getManualWorkflowList/")]
        WorkflowWorker.ManualWorkflowList[] getManualWorkflowList(string token, string processId, string planId);

        [OperationContract]
        [WebInvoke(Method = "POST",
           BodyStyle = WebMessageBodyStyle.Wrapped,
           ResponseFormat = WebMessageFormat.Json,
           RequestFormat = WebMessageFormat.Json,
           UriTemplate = "/copyWorkflowtemplateToRecord/")]
        string copyWorkflowtemplateToRecord(string token, string templateId, string peopleId, string referenceId);

        [OperationContract]
        [WebInvoke(Method = "POST",
           BodyStyle = WebMessageBodyStyle.Wrapped,
           ResponseFormat = WebMessageFormat.Json,
           RequestFormat = WebMessageFormat.Json,
           UriTemplate = "/getPlanWorkflowWidgetData/")]
        WorkflowWorker.PlanWorkflowWidgetData[] getPlanWorkflowWidgetData(string token, string responsiblePartyId);

        [OperationContract]
        [WebInvoke(Method = "POST",
           BodyStyle = WebMessageBodyStyle.Wrapped,
           ResponseFormat = WebMessageFormat.Json,
           RequestFormat = WebMessageFormat.Json,
           UriTemplate = "/getWorkflowProcesses/")]
        WorkflowWorker.WorkflowProcess[] getWorkflowProcesses(string token);
        
        /*
        [OperationContract]
        [WebGet(UriTemplate = "/getWorkflows?processId={processId}&referenceId={referenceId}", 
            RequestFormat = WebMessageFormat.Json, 
            ResponseFormat = WebMessageFormat.Json)]
        WorkflowWorker.Workflow[] getWorkflows(string processId, string referenceId);
        */

        [OperationContract]
        [WebInvoke(Method = "POST",
           BodyStyle = WebMessageBodyStyle.Wrapped,
           ResponseFormat = WebMessageFormat.Json,
           RequestFormat = WebMessageFormat.Json,
           UriTemplate = "/getWorkflows/")]
        WorkflowWorker.Workflow[] getWorkflows(string token, string processId, string referenceId);

        [OperationContract]
        [WebInvoke(Method = "POST",
           BodyStyle = WebMessageBodyStyle.Wrapped,
           ResponseFormat = WebMessageFormat.Json,
           RequestFormat = WebMessageFormat.Json,
           UriTemplate = "/insertAutomatedWorkflows/")]
        String insertAutomatedWorkflows(string token, string processId, string peopleId, string referenceId);

        [OperationContract]
        [WebInvoke(Method = "POST",
          BodyStyle = WebMessageBodyStyle.Wrapped,
          ResponseFormat = WebMessageFormat.Json,
          RequestFormat = WebMessageFormat.Json,
          UriTemplate = "/isWorkflowAutoCreated/")]
        String isWorkflowAutoCreated(string token, string workflowName);

        [OperationContract]
        [WebInvoke(Method = "POST",
            BodyStyle = WebMessageBodyStyle.Wrapped,
            ResponseFormat = WebMessageFormat.Json,
            RequestFormat = WebMessageFormat.Json,
            UriTemplate = "/insertWorkflow/")]
        String insertWorkflow(string token, string templateId, string peopleId, string referenceId);

        [OperationContract]
        [WebInvoke(Method = "POST",
            BodyStyle = WebMessageBodyStyle.Wrapped,
            ResponseFormat = WebMessageFormat.Json,
            RequestFormat = WebMessageFormat.Json,
            UriTemplate = "/insertWorkflowStep/")]
        String insertWorkflowStep(string token, WorkflowWorker.WorkflowStep step);

        [OperationContract]
        [WebInvoke(Method = "POST",
           BodyStyle = WebMessageBodyStyle.Wrapped,
           ResponseFormat = WebMessageFormat.Json,
           RequestFormat = WebMessageFormat.Json,
           UriTemplate = "/insertWorkflowStepDocument/")]
        WorkflowWorker.DocumentAttachment insertWorkflowStepDocument(string token, string stepId, string docOrder, string description, string attachmentType, string attachment, string documentEdited);

        [OperationContract]
        [WebInvoke(Method = "POST",
           BodyStyle = WebMessageBodyStyle.Wrapped,
           ResponseFormat = WebMessageFormat.Json,
           RequestFormat = WebMessageFormat.Json,
           UriTemplate = "/updateWorkflowStepDocument/")]
        WorkflowWorker.DocumentAttachment updateWorkflowStepDocument(string token, string documentId, string attachmentType, string attachment, string documentEdited);

        [OperationContract]
        [WebInvoke(Method = "PUT",
            BodyStyle = WebMessageBodyStyle.Wrapped,
            ResponseFormat = WebMessageFormat.Json,
            RequestFormat = WebMessageFormat.Json,
            UriTemplate = "/setWorkflowStatus/")]
        String setWorkflowStatus(string token, string workflowId, string statusId);

        [OperationContract]
        [WebInvoke(Method = "PUT",
            BodyStyle = WebMessageBodyStyle.Wrapped,
            ResponseFormat = WebMessageFormat.Json,
            RequestFormat = WebMessageFormat.Json,
            UriTemplate = "/setWorkflowStepDoneDate/")]
        String setWorkflowStepDoneDate(string token, string stepId, string doneDate);

  [OperationContract]
        [WebInvoke(Method = "PUT",
            BodyStyle = WebMessageBodyStyle.Wrapped,
            ResponseFormat = WebMessageFormat.Json,
            RequestFormat = WebMessageFormat.Json,
            UriTemplate = "/setWorkflowStepDueDate/")]
        String setWorkflowStepDueDate(string token, string stepId, string dueDate);

        [OperationContract]
        [WebInvoke(Method = "PUT",
            BodyStyle = WebMessageBodyStyle.Wrapped,
            ResponseFormat = WebMessageFormat.Json,
            RequestFormat = WebMessageFormat.Json,
            UriTemplate = "/setWorkflowStepDocumentOrder/")]
        String setWorkflowStepDocumentOrder(string token, WorkflowWorker.OrderObject[] orderArray);

        [OperationContract]
        [WebInvoke(Method = "PUT",
            BodyStyle = WebMessageBodyStyle.Wrapped,
            ResponseFormat = WebMessageFormat.Json,
            RequestFormat = WebMessageFormat.Json,
            UriTemplate = "/setWorkflowStepOrder/")]
        String setWorkflowStepOrder(string token, WorkflowWorker.OrderObject[] orderArray);

        [OperationContract]
        [WebInvoke(Method = "PUT",
            BodyStyle = WebMessageBodyStyle.Wrapped,
            ResponseFormat = WebMessageFormat.Json,
            RequestFormat = WebMessageFormat.Json,
            UriTemplate = "/updateWorkflowStep/")]
        String updateWorkflowStep(string token, WorkflowWorker.WorkflowStep step);

        [OperationContract]
        [WebInvoke(Method = "PUT",
        BodyStyle = WebMessageBodyStyle.Wrapped,
        ResponseFormat = WebMessageFormat.Json,
        RequestFormat = WebMessageFormat.Json,
        UriTemplate = "/updateRelationshipResponsiblePartyID/")]
        String updateRelationshipResponsiblePartyID(string token, string peopleId, string WFID, string responsiblePartyType);

      
        [OperationContract]
        [WebInvoke(Method = "PUT",
           BodyStyle = WebMessageBodyStyle.Wrapped,
           ResponseFormat = WebMessageFormat.Json,
           RequestFormat = WebMessageFormat.Json,
           UriTemplate = "/processWorkflowStepEvent/")]
        string processWorkflowStepEvent(string token, WorkflowWorker.WorkflowEditedStepStatus thisEvent);

        #endregion

        [OperationContract]
        [WebInvoke(Method = "POST",
            BodyStyle = WebMessageBodyStyle.Wrapped,
            ResponseFormat = WebMessageFormat.Json,
            RequestFormat = WebMessageFormat.Json,
            UriTemplate = "/getDashboardCaseNoteProductivity/")]
        DashboardWorker.ProductivityWidget[] getDashboardCaseNoteProductivity(string token, string daysBack);

        [OperationContract]
        [WebInvoke(Method = "POST",
           BodyStyle = WebMessageBodyStyle.Wrapped,
           ResponseFormat = WebMessageFormat.Json,
           RequestFormat = WebMessageFormat.Json,
           UriTemplate = "/getDashboardCaseNotesRejected/")]
        DashboardWorker.RejectedWidget[] getDashboardCaseNotesRejected(string token, string daysBack);

        [OperationContract]
        [WebInvoke(Method = "POST",
           BodyStyle = WebMessageBodyStyle.Wrapped,
           ResponseFormat = WebMessageFormat.Json,
           RequestFormat = WebMessageFormat.Json,
           UriTemplate = "/getDashboardGroupCaseNoteConsumerNames/")]
        DashboardWorker.RejectedWidget[] getDashboardGroupCaseNoteConsumerNames(string token, string groupNoteIds);

        [OperationContract]
        [WebInvoke(Method = "POST",
            BodyStyle = WebMessageBodyStyle.Wrapped,
            ResponseFormat = WebMessageFormat.Json,
            RequestFormat = WebMessageFormat.Json,
            UriTemplate = "/getUserWidgetSettings/")]
        DashboardWorker.UserWidgetSettings[] getUserWidgetSettings(string token);

        [OperationContract]
        [WebInvoke(Method = "POST",
            BodyStyle = WebMessageBodyStyle.Wrapped,
            ResponseFormat = WebMessageFormat.Json,
            RequestFormat = WebMessageFormat.Json,
            UriTemplate = "/updateUserWidgetSettings/")]
        string updateUserWidgetSettings(string token, string widgetId, string showHide, string widgetConfig);

        [OperationContract]
        [WebInvoke(Method = "POST",
            BodyStyle = WebMessageBodyStyle.Wrapped,
            ResponseFormat = WebMessageFormat.Json,
            RequestFormat = WebMessageFormat.Json,
            UriTemplate = "/generateAuthentication/")]
        string generateAuthentication(string userId, string password);

        [OperationContract]
        [WebInvoke(Method = "POST",
            BodyStyle = WebMessageBodyStyle.Wrapped,
            ResponseFormat = WebMessageFormat.Json,
            RequestFormat = WebMessageFormat.Json,
            UriTemplate = "/authenticatedLogin/")]
        string authenticatedLogin(string userName, string genKey);

        [OperationContract]
        [WebInvoke(Method = "POST",
            BodyStyle = WebMessageBodyStyle.Wrapped,
            ResponseFormat = WebMessageFormat.Json,
            RequestFormat = WebMessageFormat.Json,
            UriTemplate = "/checkLoginType/")]
        string checkLoginType();

        //Covid-19
        [OperationContract]
        [WebInvoke(Method = "POST",
            BodyStyle = WebMessageBodyStyle.Wrapped,
            ResponseFormat = WebMessageFormat.Json,
            RequestFormat = WebMessageFormat.Json,
            UriTemplate = "/insertUpdateCovidAssessment/")]
        string insertUpdateCovidAssessment(string token, string assesmentDate, string assessmentTime, string cough, string diarrhea,
           string fever, string locationId, string malaise, string nasalCong, string nausea,string tasteAndSmell, string notes, string peopleId, string settingType, string shortnessBreath, string soreThroat, string assessmentId, string isConsumer);

        [OperationContract]
        [WebInvoke(Method = "POST",
            BodyStyle = WebMessageBodyStyle.Wrapped,
            ResponseFormat = WebMessageFormat.Json,
            RequestFormat = WebMessageFormat.Json,
            UriTemplate = "/getIndividualsCovidDetails/")]
        CovidWorker.CovidDetails[] getIndividualsCovidDetails(string token, string peopleId, string assessmentDate, string isConsumer);

        [OperationContract]
        [WebInvoke(Method = "POST",
            BodyStyle = WebMessageBodyStyle.Wrapped,
            ResponseFormat = WebMessageFormat.Json,
            RequestFormat = WebMessageFormat.Json,
            UriTemplate = "/deleteCovidAssessment/")]
        string deleteCovidAssessment(string token, string assessmentId);

        //SSA Case Notes 
        [WebInvoke(Method = "POST",
            BodyStyle = WebMessageBodyStyle.Wrapped,
            ResponseFormat = WebMessageFormat.Json,
            RequestFormat = WebMessageFormat.Json,
            UriTemplate = "/getSSAServiceOptionsDropdown/")]
        CaseNoteSSAWorker.ServiceOptions[] getSSAServiceOptionsDropdown(string token, string serviceDate, string consumerId);

        [WebInvoke(Method = "POST",
            BodyStyle = WebMessageBodyStyle.Wrapped,
            ResponseFormat = WebMessageFormat.Json,
            RequestFormat = WebMessageFormat.Json,
            UriTemplate = "/getSSABillCodesFromService/")]
        CaseNoteSSAWorker.BillingCodes[] getSSABillCodesFromService(string token, string serviceName, string personApproved);

        //Transportation
        [WebInvoke(Method = "POST",
            BodyStyle = WebMessageBodyStyle.Wrapped,
            ResponseFormat = WebMessageFormat.Json,
            RequestFormat = WebMessageFormat.Json,
            UriTemplate = "/insertTripCompleted/")]
        TransportationWorker.InsertTripCompleted[] insertTripCompleted(string token, string tripName, string driverId, string otherRider, string dateOfService, string billingType, string vehicleInformationId, string locationId);

        [WebInvoke(Method = "POST",
            BodyStyle = WebMessageBodyStyle.Wrapped,
            ResponseFormat = WebMessageFormat.Json,
            RequestFormat = WebMessageFormat.Json,
            UriTemplate = "/insertVehicleInformation/")]
        string insertVehicleInformation(string token);

        [WebInvoke(Method = "POST",
            BodyStyle = WebMessageBodyStyle.Wrapped,
            ResponseFormat = WebMessageFormat.Json,
            RequestFormat = WebMessageFormat.Json,
            UriTemplate = "/updateVehicleInformation/")]
        string updateVehicleInformation(string token);

        [WebInvoke(Method = "POST",
            BodyStyle = WebMessageBodyStyle.Wrapped,
            ResponseFormat = WebMessageFormat.Json,
            RequestFormat = WebMessageFormat.Json,
            UriTemplate = "/getVehicleInformation/")]
        TransportationWorker.VehicleInformation[] getVehicleInformation(string token, string informationId);

        [WebInvoke(Method = "POST",
            BodyStyle = WebMessageBodyStyle.Wrapped,
            ResponseFormat = WebMessageFormat.Json,
            RequestFormat = WebMessageFormat.Json,
            UriTemplate = "/getAlternateAddresses/")]
        TransportationWorker.AlternateAddresses[] getAlternateAddresses(string token, string consumerId);

        [WebInvoke(Method = "POST",
            BodyStyle = WebMessageBodyStyle.Wrapped,
            ResponseFormat = WebMessageFormat.Json,
            RequestFormat = WebMessageFormat.Json,
            UriTemplate = "/getInspectionCategories/")]
        TransportationWorker.VehicleInspectionCategories[] getInspectionCategories(string token);

        [WebInvoke(Method = "POST",
            BodyStyle = WebMessageBodyStyle.Wrapped,
            ResponseFormat = WebMessageFormat.Json,
            RequestFormat = WebMessageFormat.Json,
            UriTemplate = "/insertUpdateVehicleInspectionDetails/")]
        List<string> insertVehicleInspectionDetails(string token, string vehicleInspectionId, string inspectionCatString, string inspectionStatusString);

        [WebInvoke(Method = "POST",
            BodyStyle = WebMessageBodyStyle.Wrapped,
            ResponseFormat = WebMessageFormat.Json,
            RequestFormat = WebMessageFormat.Json,
            UriTemplate = "/massUpdateDriverVehicle/")]
        List<string> massUpdateDriverVehicle(string token, string method, string routeIdString, string updateVal);

        [WebInvoke(Method = "POST",
            BodyStyle = WebMessageBodyStyle.Wrapped,
            ResponseFormat = WebMessageFormat.Json,
            RequestFormat = WebMessageFormat.Json,
            UriTemplate = "/getVehicleDropdown/")]   
        TransportationWorker.VehicleDropdown[] getVehicleDropdown(string token);

        [WebInvoke(Method = "POST",
            BodyStyle = WebMessageBodyStyle.Wrapped,
            ResponseFormat = WebMessageFormat.Json,
            RequestFormat = WebMessageFormat.Json,
            UriTemplate = "/getCompletedInspections/")]
        TransportationWorker.CompletedVehicleInspections[] getCompletedInspections(string token, string fromDate, string toDate, string vehicleInfoId, string userId);

        [WebInvoke(Method = "POST",
            BodyStyle = WebMessageBodyStyle.Wrapped,
            ResponseFormat = WebMessageFormat.Json,
            RequestFormat = WebMessageFormat.Json,
            UriTemplate = "/deleteVehicleInspection/")]
        string deleteVehicleInspection(string token, string vehicleInspectionId);

        [WebInvoke(Method = "POST",
            BodyStyle = WebMessageBodyStyle.Wrapped,
            ResponseFormat = WebMessageFormat.Json,
            RequestFormat = WebMessageFormat.Json,
            UriTemplate = "/insertVehicleInspection/")]
        TransportationWorker.InsertVehicleInspection[] insertVehicleInspection(string token, string vehicleInformationId, string tripCompletedId, string inspectionDate, string inspectionTime, string notes);

        [WebInvoke(Method = "POST",
            BodyStyle = WebMessageBodyStyle.Wrapped,
            ResponseFormat = WebMessageFormat.Json,
            RequestFormat = WebMessageFormat.Json,
            UriTemplate = "/updateVehicleInspection/")]
        string updateVehicleInspection(string token, string vehicleInspectionId, string vehicleInformationId, string tripCompletedId, string inspectionDate, string inspectionTime, string notes);

        [WebInvoke(Method = "POST",
            BodyStyle = WebMessageBodyStyle.Wrapped,
            ResponseFormat = WebMessageFormat.Json,
            RequestFormat = WebMessageFormat.Json,
            UriTemplate = "/updateTripDetails/")]
        string updateTripDetails(string token, string tripsCompletedId, string odometerStart, string odometerStop, string startTime, string endTime);

        [WebInvoke(Method = "POST",
            BodyStyle = WebMessageBodyStyle.Wrapped,
            ResponseFormat = WebMessageFormat.Json,
            RequestFormat = WebMessageFormat.Json,
            UriTemplate = "/updateManageTripDetails/")]
        string updateManageTripDetails(string token, string tripsCompletedId, string odometerStart, string odometerStop, string startTime, string endTime, string driverId, string otherRiderId, string vehicleId, string locationId, string billingType);

        [WebInvoke(Method = "POST",
            BodyStyle = WebMessageBodyStyle.Wrapped,
            ResponseFormat = WebMessageFormat.Json,
            RequestFormat = WebMessageFormat.Json,
            UriTemplate = "/insertUpdateTripConsumers/")]
        string insertUpdateTripConsumers(string token, string tripDetailId, string tripsCompletedId, string consumerId, string alternateAddress, string scheduledTime,
            string totalTravelTime, string riderStatus, string specialInstructions, string directions, string pickupOrder, string notes);

        [WebInvoke(Method = "POST",
            BodyStyle = WebMessageBodyStyle.Wrapped,
            ResponseFormat = WebMessageFormat.Json,
            RequestFormat = WebMessageFormat.Json,
            UriTemplate = "/getDrivers/")]
        TransportationWorker.Drivers[] getDrivers(string token);

        [WebInvoke(Method = "POST",
            BodyStyle = WebMessageBodyStyle.Wrapped,
            ResponseFormat = WebMessageFormat.Json,
            RequestFormat = WebMessageFormat.Json,
            UriTemplate = "/getConsumerDetails/")]
        TransportationWorker.ConsumerDetail[] getConsumerDetails(string token, string consumerId);


        [WebInvoke(Method = "POST",
            BodyStyle = WebMessageBodyStyle.Wrapped,
            ResponseFormat = WebMessageFormat.Json,
            RequestFormat = WebMessageFormat.Json,
            UriTemplate = "/getTrips/")]
        TransportationWorker.Trips[] getTrips(string token, string serviceDateStart, string serviceDateStop, string personId, string locationId);

        [WebInvoke(Method = "POST",
            BodyStyle = WebMessageBodyStyle.Wrapped,
            ResponseFormat = WebMessageFormat.Json,
            RequestFormat = WebMessageFormat.Json,
            UriTemplate = "/getTripConsumers/")]
        TransportationWorker.TripConsumers[] getTripConsumers(string token, string tripsCompletedId);

        [WebInvoke(Method = "POST",
            BodyStyle = WebMessageBodyStyle.Wrapped,
            ResponseFormat = WebMessageFormat.Json,
            RequestFormat = WebMessageFormat.Json,
            UriTemplate = "/getTripInformation/")]
        TransportationWorker.TripInformation[] getTripInformation(string token, string tripsCompletedId);

        [WebInvoke(Method = "POST",
            BodyStyle = WebMessageBodyStyle.Wrapped,
            ResponseFormat = WebMessageFormat.Json,
            RequestFormat = WebMessageFormat.Json,
            UriTemplate = "/deleteConsumerFromTrip/")]
        string deleteConsumerFromTrip(string tripsCompletedId, string consumerId);

        [WebInvoke(Method = "POST",
            BodyStyle = WebMessageBodyStyle.Wrapped,
            ResponseFormat = WebMessageFormat.Json,
            RequestFormat = WebMessageFormat.Json,
            UriTemplate = "/deleteTrip/")]
        string deleteTrip(string token, string tripsCompletedId);

        [WebInvoke(Method = "POST",
            BodyStyle = WebMessageBodyStyle.Wrapped,
            ResponseFormat = WebMessageFormat.Json,
            RequestFormat = WebMessageFormat.Json,
            UriTemplate = "/getVehicleInspectionDetails/")]
        TransportationWorker.VehicleInspection[] getVehicleInspectionDetails(string token, string vehicleInspectionId);

        //Plan Outcomes
        [WebInvoke(Method = "POST",
            BodyStyle = WebMessageBodyStyle.Wrapped,
            ResponseFormat = WebMessageFormat.Json,
            RequestFormat = WebMessageFormat.Json,
            UriTemplate = "/getPlanSpecificOutcomes/")]
        PlanOutcomesWorker.PlanTotalOutcome getPlanSpecificOutcomes(string token, string assessmentId, int targetAssessmentVersionId);

        [WebInvoke(Method = "POST",
            BodyStyle = WebMessageBodyStyle.Wrapped,
            ResponseFormat = WebMessageFormat.Json,
            RequestFormat = WebMessageFormat.Json,
            UriTemplate = "/insertPlanOutcomeProgressSummary/")]
        string insertPlanOutcomeProgressSummary(string token, long planId, string progressSummary);

        [WebInvoke(Method = "POST",
            BodyStyle = WebMessageBodyStyle.Wrapped,
            ResponseFormat = WebMessageFormat.Json,
            RequestFormat = WebMessageFormat.Json,
            UriTemplate = "/updatePlanOutcomeProgressSummary/")]
        string updatePlanOutcomeProgressSummary(string token, long progressSummaryId, string progressSummary);

        [WebInvoke(Method = "POST",
            BodyStyle = WebMessageBodyStyle.Wrapped,
            ResponseFormat = WebMessageFormat.Json,
            RequestFormat = WebMessageFormat.Json,
            UriTemplate = "/deletePlanOutcomeProgressSummary/")]
        string deletePlanOutcomeProgressSummary(string token, long progressSummaryId);

        [WebInvoke(Method = "POST",
            BodyStyle = WebMessageBodyStyle.Wrapped,
            ResponseFormat = WebMessageFormat.Json,
            RequestFormat = WebMessageFormat.Json,
            UriTemplate = "/deletePlanOutcomeExperienceResponsibility/")]
        string deletePlanOutcomeExperienceResponsibility(string token, long responsibilityId);

        [WebInvoke(Method = "POST",
            BodyStyle = WebMessageBodyStyle.Wrapped,
            ResponseFormat = WebMessageFormat.Json,
            RequestFormat = WebMessageFormat.Json,
            UriTemplate = "/insertPlanOutcome/")]
        string insertPlanOutcome(string token, string assessmentId, string outcome, string details, string history, string sectionId, string outcomeOrder, string summaryOfProgress, int status, string carryOverReason);

        [WebInvoke(Method = "POST",
            BodyStyle = WebMessageBodyStyle.Wrapped,
            ResponseFormat = WebMessageFormat.Json,
            RequestFormat = WebMessageFormat.Json,
            UriTemplate = "/insertPlanOutcomesExperience/")]
        string insertPlanOutcomesExperience(string outcomeId, string[] howHappened, string[] whatHappened, int[] responsibleContact, int[] responsibleProvider, string[] whenHowOftenValue, int[] whenHowOftenFrequency, string[] whenHowOftenText, string[] experienceOrder);

        [WebInvoke(Method = "POST",
            BodyStyle = WebMessageBodyStyle.Wrapped,
            ResponseFormat = WebMessageFormat.Json,
            RequestFormat = WebMessageFormat.Json,
            UriTemplate = "/insertPlanOutcomeExperienceResponsibility/")]
        List<string> insertPlanOutcomeExperienceResponsibility(string experienceId, int[] responsibleContact, int[] responsibleProvider, string[] whenHowOftenValue, int[] whenHowOftenFrequency, string[] whenHowOftenText);

        [WebInvoke(Method = "POST",
            BodyStyle = WebMessageBodyStyle.Wrapped,
            ResponseFormat = WebMessageFormat.Json,
            RequestFormat = WebMessageFormat.Json,
            UriTemplate = "/updatePlanOutcomeExperienceResponsibility/")]
        string updatePlanOutcomeExperienceResponsibility(long[] responsibilityIds, int[] responsibleContact, int[] responsibleProvider, string[] whenHowOftenValue, int[] whenHowOftenFrequency, string[] whenHowOftenText);

        [WebInvoke(Method = "POST",
            BodyStyle = WebMessageBodyStyle.Wrapped,
            ResponseFormat = WebMessageFormat.Json,
            RequestFormat = WebMessageFormat.Json,
            UriTemplate = "/insertPlanOutcomesReview/")]
        string insertPlanOutcomesReview(long outcomeId, string[] whatWillHappen, string[] whenToCheckIn, string[] whoReview, string[] reviewOrder, long[] contactId);

        [WebInvoke(Method = "POST",
            BodyStyle = WebMessageBodyStyle.Wrapped,
            ResponseFormat = WebMessageFormat.Json,
            RequestFormat = WebMessageFormat.Json,
            UriTemplate = "/updatePlanOutcome/")]
        string updatePlanOutcome(string token, string assessmentId, string outcomeId, string outcome, string details, string history, string sectionId, string summaryOfProgress, int status, string carryOverReason);

        [WebInvoke(Method = "POST",
            BodyStyle = WebMessageBodyStyle.Wrapped,
            ResponseFormat = WebMessageFormat.Json,
            RequestFormat = WebMessageFormat.Json,
            UriTemplate = "/updatePlanOutcomesExperience/")]
        string updatePlanOutcomesExperience(string outcomeId, string[] experienceIds, string[] howHappened, string[] whatHappened, long[] responsibilityId, int[] responsibleContact, int[] responsibleProvider, string[] whenHowOftenValue, int[] whenHowOftenFrequency, string[] whenHowOftenText);

        [WebInvoke(Method = "POST",
            BodyStyle = WebMessageBodyStyle.Wrapped,
            ResponseFormat = WebMessageFormat.Json,
            RequestFormat = WebMessageFormat.Json,
            UriTemplate = "/updatePlanOutcomesReview/")]
        string updatePlanOutcomesReview(long outcomeId, string[] reviewIds, string[] whatWillHappen, string[] whenToCheckIn, string[] whoReview, long[] contactId);

        [WebInvoke(Method = "POST",
            BodyStyle = WebMessageBodyStyle.Wrapped,
            ResponseFormat = WebMessageFormat.Json,
            RequestFormat = WebMessageFormat.Json,
            UriTemplate = "/updatePlanSectionApplicable/")]
        string updatePlanSectionApplicable(string token, long planId, long sectionId, string applicable);

        [WebInvoke(Method = "POST",
            BodyStyle = WebMessageBodyStyle.Wrapped,
            ResponseFormat = WebMessageFormat.Json,
            RequestFormat = WebMessageFormat.Json,
            UriTemplate = "/updatePlanOutcomesExperienceOrder/")]
        string updatePlanOutcomesExperienceOrder(string token, long outcomeId, long experienceId, int newPos, int oldPos);

        [WebInvoke(Method = "POST",
            BodyStyle = WebMessageBodyStyle.Wrapped,
            ResponseFormat = WebMessageFormat.Json,
            RequestFormat = WebMessageFormat.Json,
            UriTemplate = "/updatePlanOutcomesReviewOrder/")]
        string updatePlanOutcomesReviewOrder(string token, long outcomeId, long reviewId, int newPos, int oldPos);

        [WebInvoke(Method = "POST",
            BodyStyle = WebMessageBodyStyle.Wrapped,
            ResponseFormat = WebMessageFormat.Json,
            RequestFormat = WebMessageFormat.Json,
            UriTemplate = "/deletePlanOutcome/")]
        string deletePlanOutcome(string token, string outcomeId);

        [WebInvoke(Method = "POST",
            BodyStyle = WebMessageBodyStyle.Wrapped,
            ResponseFormat = WebMessageFormat.Json,
            RequestFormat = WebMessageFormat.Json,
            UriTemplate = "/deletePlanOutcomeExperience/")]
        string deletePlanOutcomeExperience(string token, string outcomeId, string experienceId);

        [WebInvoke(Method = "POST",
            BodyStyle = WebMessageBodyStyle.Wrapped,
            ResponseFormat = WebMessageFormat.Json,
            RequestFormat = WebMessageFormat.Json,
            UriTemplate = "/deletePlanOutcomeReview/")]
        string deletePlanOutcomeReview(string token, string outcomeId, string reviewId);

        //Plan services and supports
        [WebInvoke(Method = "POST",
            BodyStyle = WebMessageBodyStyle.Wrapped,
            ResponseFormat = WebMessageFormat.Json,
            RequestFormat = WebMessageFormat.Json,
            UriTemplate = "/getServicesAndSupports/")]
        ServicesAndSupportsWorker.ServicesAndSupports getServicesAndSupports(string token, long anywAssessmentId, int consumerId);

        [WebInvoke(Method = "POST",
            BodyStyle = WebMessageBodyStyle.Wrapped,
            ResponseFormat = WebMessageFormat.Json,
            RequestFormat = WebMessageFormat.Json,
            UriTemplate = "/deleteProfessionalReferral/")]
        string deleteProfessionalReferral(string token, long professionalReferralId);        

        [WebInvoke(Method = "POST",
            BodyStyle = WebMessageBodyStyle.Wrapped,
            ResponseFormat = WebMessageFormat.Json,
            RequestFormat = WebMessageFormat.Json,
            UriTemplate = "/insertProfessionalReferral/")]
        string insertProfessionalReferral(string token, long anywAssessmentId, int assessmentAreaId, char newOrExisting, string whoSupports, string reasonForReferral, int rowOrder);

        [WebInvoke(Method = "POST",
            BodyStyle = WebMessageBodyStyle.Wrapped,
            ResponseFormat = WebMessageFormat.Json,
            RequestFormat = WebMessageFormat.Json,
            UriTemplate = "/updateProfessionalReferral/")]
        string updateProfessionalReferral(string token, long professionalReferralId, long anywAssessmentId, int assessmentAreaId, char newOrExisting, string whoSupports, string reasonForReferral);

        [WebInvoke(Method = "POST",
            BodyStyle = WebMessageBodyStyle.Wrapped,
            ResponseFormat = WebMessageFormat.Json,
            RequestFormat = WebMessageFormat.Json,
            UriTemplate = "/deleteAdditionalSupports/")]
        string deleteAdditionalSupports(string token, long additionalSupportsId);
        
        [WebInvoke(Method = "POST",
            BodyStyle = WebMessageBodyStyle.Wrapped,
            ResponseFormat = WebMessageFormat.Json,
            RequestFormat = WebMessageFormat.Json,
            UriTemplate = "/insertAdditionalSupports/")]
        string insertAdditionalSupports(string token, long anywAssessmentId, int assessmentAreaId, string whoSupports, string whatSupportLooksLike, string howOftenValue, int howOftenFrequency, string howOftenText, int rowOrder);

        [WebInvoke(Method = "POST",
            BodyStyle = WebMessageBodyStyle.Wrapped,
            ResponseFormat = WebMessageFormat.Json,
            RequestFormat = WebMessageFormat.Json,
            UriTemplate = "/updateAdditionalSupports/")]
        string updateAdditionalSupports(string token, long additionalSupportsId, long anywAssessmentId, int assessmentAreaId, string whoSupports, string whatSupportLooksLike, string howOftenValue, int howOftenFrequency, string howOftenText);

        [WebInvoke(Method = "POST",
            BodyStyle = WebMessageBodyStyle.Wrapped,
            ResponseFormat = WebMessageFormat.Json,
            RequestFormat = WebMessageFormat.Json,
            UriTemplate = "/deleteSSModifications/")]
        string deleteSSModifications(string token, long modificationsId);

        [WebInvoke(Method = "POST",
            BodyStyle = WebMessageBodyStyle.Wrapped,
            ResponseFormat = WebMessageFormat.Json,
            RequestFormat = WebMessageFormat.Json,
            UriTemplate = "/insertSSModifications/")]
        string insertSSModifications(string token, long anywAssessmentId, char medicalRate, char behaviorRate, char icfRate, char complexRate, char developmentalRate, char childIntensiveRate);

        [WebInvoke(Method = "POST",
            BodyStyle = WebMessageBodyStyle.Wrapped,
            ResponseFormat = WebMessageFormat.Json,
            RequestFormat = WebMessageFormat.Json,
            UriTemplate = "/updateSSModifications/")]
        string updateSSModifications(string token, long modificationsId, long anywAssessmentId, char medicalRate, char behaviorRate, char icfRate, char complexRate, char developmentalRate, char childIntensiveRate);

        [WebInvoke(Method = "POST",
            BodyStyle = WebMessageBodyStyle.Wrapped,
            ResponseFormat = WebMessageFormat.Json,
            RequestFormat = WebMessageFormat.Json,
            UriTemplate = "/deletePaidSupports/")]
        string deletePaidSupports(string token, long paidSupportsId);
        
        [WebInvoke(Method = "POST",
           BodyStyle = WebMessageBodyStyle.Wrapped,
           ResponseFormat = WebMessageFormat.Json,
           RequestFormat = WebMessageFormat.Json,
           UriTemplate = "/insertPaidSupports/")]
        string insertPaidSupports(string token, long anywAssessmentId, int providerId, int assessmentAreaId, int serviceNameId, string scopeOfService, string howOftenValue, int howOftenFrequency, string howOftenText, string beginDate, string endDate, int fundingSource, string fundingSourceText, int rowOrder, string serviceNameOther);

        [WebInvoke(Method = "POST",
            BodyStyle = WebMessageBodyStyle.Wrapped,
            ResponseFormat = WebMessageFormat.Json,
            RequestFormat = WebMessageFormat.Json,
            UriTemplate = "/updatePaidSupports/")]
        string updatePaidSupports(string token, long paidSupportsId, long anywAssessmentId, int providerId, int assessmentAreaId, int serviceNameId, string scopeOfService, string howOftenValue, int howOftenFrequency, string howOftenText, string beginDate, string endDate, int fundingSource, string fundingSourceText, string serviceNameOther);

        [WebInvoke(Method = "POST",
            BodyStyle = WebMessageBodyStyle.Wrapped,
            ResponseFormat = WebMessageFormat.Json,
            RequestFormat = WebMessageFormat.Json,
            UriTemplate = "/updatePaidSupportsRowOrder/")]
        string updatePaidSupportsRowOrder(string token, long assessmentId, long supportId, int newPos, int oldPos);

        [WebInvoke(Method = "POST",
            BodyStyle = WebMessageBodyStyle.Wrapped,
            ResponseFormat = WebMessageFormat.Json,
            RequestFormat = WebMessageFormat.Json,
            UriTemplate = "/updateModificationRowOrder/")]
        string updateModificationRowOrder(string token, long assessmentId, long modificationId, int newPos, int oldPos);

        [WebInvoke(Method = "POST",
            BodyStyle = WebMessageBodyStyle.Wrapped,
            ResponseFormat = WebMessageFormat.Json,
            RequestFormat = WebMessageFormat.Json,
            UriTemplate = "/updateServiceReferralRowOrder/")]
        string updateServiceReferralRowOrder(string token, long assessmentId, long referralId, int newPos, int oldPos);

        [WebInvoke(Method = "POST",
           BodyStyle = WebMessageBodyStyle.Wrapped,
           ResponseFormat = WebMessageFormat.Json,
           RequestFormat = WebMessageFormat.Json,
           UriTemplate = "/updateAssessmentAnswerRowOrder/")]
        string updateAssessmentAnswerRowOrder(string token, string answerIds, long assessmentId, long questionSetId, int newPos, int oldPos);

        [WebInvoke(Method = "POST",
            BodyStyle = WebMessageBodyStyle.Wrapped,
            ResponseFormat = WebMessageFormat.Json,
            RequestFormat = WebMessageFormat.Json,
            UriTemplate = "/updateAdditionalSupportsRowOrder/")]
        string updateAdditionalSupportsRowOrder(string token, long assessmentId, long addSupportId, int newPos, int oldPos);

        //Plan Informed Consent
        [WebInvoke(Method = "POST",
            BodyStyle = WebMessageBodyStyle.Wrapped,
            ResponseFormat = WebMessageFormat.Json,
            RequestFormat = WebMessageFormat.Json,
            UriTemplate = "/getPlanRestrictiveMeasures/")]
        PlanInformedConsentWorker.InformedConsent[] getPlanRestrictiveMeasures(string token, string assessmentId);

        [WebInvoke(Method = "POST",
            BodyStyle = WebMessageBodyStyle.Wrapped,
            ResponseFormat = WebMessageFormat.Json,
            RequestFormat = WebMessageFormat.Json,
            UriTemplate = "/getPlanInformedConsentVendors/")]
        PlanInformedConsentWorker.InformedConsentVendors[] getPlanInformedConsentVendors(string token);

        [WebInvoke(Method = "POST",
            BodyStyle = WebMessageBodyStyle.Wrapped,
            ResponseFormat = WebMessageFormat.Json,
            RequestFormat = WebMessageFormat.Json,
            UriTemplate = "/getPlanInformedConsentSSAs/")]
        PlanInformedConsentWorker.InformedConsentSSAs[] getPlanInformedConsentSSAs(string token);

        [WebInvoke(Method = "POST",
            BodyStyle = WebMessageBodyStyle.Wrapped,
            ResponseFormat = WebMessageFormat.Json,
            RequestFormat = WebMessageFormat.Json,
            UriTemplate = "/insertPlanRestrictiveMeasures/")]
        PlanInformedConsentWorker.InsertInformedConsent[] insertPlanRestrictiveMeasures(string token, string assessmentId);

        [WebInvoke(Method = "POST",
            BodyStyle = WebMessageBodyStyle.Wrapped,
            ResponseFormat = WebMessageFormat.Json,
            RequestFormat = WebMessageFormat.Json,
            UriTemplate = "/updatePlanRestrictiveMeasures/")]
        string updatePlanRestrictiveMeasures(string token, string informedConsentId, string rmIdentified, string rmHRCDate, string rmKeepSelfSafe, string rmFadeRestriction, string rmOtherWayHelpGood, string rmOtherWayHelpBad, string rmWhatCouldHappenGood, string rmWhatCouldHappenBad);

        [WebInvoke(Method = "POST",
            BodyStyle = WebMessageBodyStyle.Wrapped,
            ResponseFormat = WebMessageFormat.Json,
            RequestFormat = WebMessageFormat.Json,
            UriTemplate = "/updatePlanConsentStatements/")]
        string updatePlanConsentStatements(string token, string signatureId, string csChangeMind, string csChangeMindSSAPeopleId, string csContact, string csContactProviderVendorId, string csContactInput, string csRightsReviewed, string csAgreeToPlan, string csFCOPExplained, string csDueProcess, string csResidentialOptions, string csSupportsHealthNeeds, string csTechnology);

        //Plan Signature
        [WebInvoke(Method = "POST",
            BodyStyle = WebMessageBodyStyle.Wrapped,
            ResponseFormat = WebMessageFormat.Json,
            RequestFormat = WebMessageFormat.Json,
            UriTemplate = "/getPlanSignatures/")]
        PlanSignatureWorker.PlanSignatures[] getSignatures(string token, long assessmentId);

        [WebInvoke(Method = "POST",
            BodyStyle = WebMessageBodyStyle.Wrapped,
            ResponseFormat = WebMessageFormat.Json,
            RequestFormat = WebMessageFormat.Json,
            UriTemplate = "/getTeamMemberListFromState/")]
        PlanSignatureWorker.TeamMemberFromState[] getTeamMemberListFromState(long peopleId);

        [WebInvoke(Method = "POST",
            BodyStyle = WebMessageBodyStyle.Wrapped,
            ResponseFormat = WebMessageFormat.Json,
            RequestFormat = WebMessageFormat.Json,
            UriTemplate = "/setSalesForceIdForTeamMemberUpdate/")]
        string setSalesForceIdForTeamMemberUpdate(string peopleId, string salesForceId);

        [WebInvoke(Method = "POST",
            BodyStyle = WebMessageBodyStyle.Wrapped,
            ResponseFormat = WebMessageFormat.Json,
            RequestFormat = WebMessageFormat.Json,
            UriTemplate = "/validateConsumerForSalesForceId/")]
        bool validateConsumerForSalesForceId(string consumerId);

        [WebInvoke(Method = "POST",
            BodyStyle = WebMessageBodyStyle.Wrapped,
            ResponseFormat = WebMessageFormat.Json,
            RequestFormat = WebMessageFormat.Json,
            UriTemplate = "/checkForSalesForce/")]
        string checkForSalesForce();

        [WebInvoke(Method = "POST",
            BodyStyle = WebMessageBodyStyle.Wrapped,
            ResponseFormat = WebMessageFormat.Json,
            RequestFormat = WebMessageFormat.Json,
            UriTemplate = "/updatePlanTeamMember/")]
        string updatePlanTeamMember(string token, string signatureId, string teamMember, string name, string lastName, string participated, string dissentAreaDisagree, string dissentHowToAddress, string signature, string contactId, string buildingNumber, string dateOfBirth, string salesForceId, string consumerId);

        [WebInvoke(Method = "POST",
            BodyStyle = WebMessageBodyStyle.Wrapped,
            ResponseFormat = WebMessageFormat.Json,
            RequestFormat = WebMessageFormat.Json,
            UriTemplate = "/updatePlanSignatureOrder/")]
        string updatePlanSignatureOrder(long assessmentId, long signatureId, int newPos);

        [WebInvoke(Method = "POST",
            BodyStyle = WebMessageBodyStyle.Wrapped,
            ResponseFormat = WebMessageFormat.Json,
            RequestFormat = WebMessageFormat.Json,
            UriTemplate = "/uploadPlanToDODD/")]
        string uploadPlanToDODD(string consumerId, string planId);

        [WebInvoke(Method = "POST",
            BodyStyle = WebMessageBodyStyle.Wrapped,
            ResponseFormat = WebMessageFormat.Json,
            RequestFormat = WebMessageFormat.Json,
            UriTemplate = "/insertTeamMember/")]
        PlanSignatureWorker.SigId[] insertPlanTeamMember(string token, string assessmentId, string teamMember, string name, string lastName, string participated, string signature, string contactId, string planYearStart, string planYearEnd, string dissentAreaDisagree, string dissentHowToAddress,
               string csChangeMind, string csChangeMindSSAPeopleId, string csContact, string csContactProviderVendorId, string csContactInput, string csRightsReviewed, string csAgreeToPlan, string csFCOPExplained, string csDueProcess,
               string csResidentialOptions, string csSupportsHealthNeeds, string csTechnology, string buildingNumber, string dateOfBirth, string peopleId, string useExisting, string relationshipImport, string consumerId, string createRelationship, string salesforceId);

        [WebInvoke(Method = "POST",
            BodyStyle = WebMessageBodyStyle.Wrapped,
            ResponseFormat = WebMessageFormat.Json,
            RequestFormat = WebMessageFormat.Json,
            UriTemplate = "/GetSalesForceId/")]
        string GetSalesForceId(long consumerId, long peopleId);

        [WebInvoke(Method = "POST",
            BodyStyle = WebMessageBodyStyle.Wrapped,
            ResponseFormat = WebMessageFormat.Json,
            RequestFormat = WebMessageFormat.Json,
            UriTemplate = "/deletePlanSignature/")]
        string deletePlanSignature(string token, string signatureId);

        //Plan Contact Information
          [WebInvoke(Method = "POST",
            BodyStyle = WebMessageBodyStyle.Wrapped,
            ResponseFormat = WebMessageFormat.Json,
            RequestFormat = WebMessageFormat.Json,
            UriTemplate = "/getPlanContact/")]
        PlanContactInformationWorker.ContactInformation[] getPlanContact(string token, string assessmentId);

          [WebInvoke(Method = "POST",
            BodyStyle = WebMessageBodyStyle.Wrapped,
            ResponseFormat = WebMessageFormat.Json,
            RequestFormat = WebMessageFormat.Json,
            UriTemplate = "/importExistingContactInfo/")]
        PlanContactInformationWorker.ContactImport[] importExistingContactInfo(string token, string peopleId);

        [WebInvoke(Method = "POST",
            BodyStyle = WebMessageBodyStyle.Wrapped,
            ResponseFormat = WebMessageFormat.Json,
            RequestFormat = WebMessageFormat.Json,
            UriTemplate = "/getPlanContactImportantPeople/")]
        PlanContactInformationWorker.ImportantPeople[] getPlanContactImportantPeople(string token, string contactId);
       
        [WebInvoke(Method = "POST",
            BodyStyle = WebMessageBodyStyle.Wrapped,
            ResponseFormat = WebMessageFormat.Json,
            RequestFormat = WebMessageFormat.Json,
            UriTemplate = "/getConsumerRelationshipsCI/")]
        PlanContactInformationWorker.ConsumerRelationships[] getConsumerRelationshipsCI(string token, string consumerId, string effectiveStartDate, string effectiveEndDate, string areInSalesForce, string planId);

        [WebInvoke(Method = "POST",
            BodyStyle = WebMessageBodyStyle.Wrapped,
            ResponseFormat = WebMessageFormat.Json,
            RequestFormat = WebMessageFormat.Json,
            UriTemplate = "/getPlanContactImportantPlaces/")]
        PlanContactInformationWorker.ImportantPlaces[] getPlanContactImportantPlaces(string token, string contactId);

        [WebInvoke(Method = "POST",
            BodyStyle = WebMessageBodyStyle.Wrapped,
            ResponseFormat = WebMessageFormat.Json,
            RequestFormat = WebMessageFormat.Json,
            UriTemplate = "/getPlanContactImportantGroups/")]
        PlanContactInformationWorker.ImportantGroups[] getPlanContactImportantGroups(string token, string contactId);

        [WebInvoke(Method = "POST",
            BodyStyle = WebMessageBodyStyle.Wrapped,
            ResponseFormat = WebMessageFormat.Json,
            RequestFormat = WebMessageFormat.Json,
            UriTemplate = "/getPlanContactFundingSources/")]
        PlanContactInformationWorker.FundingSource[] getPlanContactFundingSources(long assessmentId);

        [WebInvoke(Method = "POST",
            BodyStyle = WebMessageBodyStyle.Wrapped,
            ResponseFormat = WebMessageFormat.Json,
            RequestFormat = WebMessageFormat.Json,
            UriTemplate = "/insertPlanContactImportantPeople/")]
        string insertPlanContactImportantPeople(string token, string contactId, string type, string name, string relationship, string address, string phone, string email);

        [WebInvoke(Method = "POST",
            BodyStyle = WebMessageBodyStyle.Wrapped,
            ResponseFormat = WebMessageFormat.Json,
            RequestFormat = WebMessageFormat.Json,
            UriTemplate = "/insertPlanContactImportantGroup/")]
        string insertPlanContactImportantGroup(string token, string contactId, string status, string name, string address, string phone, string meetingInfo, string whoHelps);

        [WebInvoke(Method = "POST",
            BodyStyle = WebMessageBodyStyle.Wrapped,
            ResponseFormat = WebMessageFormat.Json,
            RequestFormat = WebMessageFormat.Json,
            UriTemplate = "/insertPlanContactImportantPlaces/")]
        string insertPlanContactImportantPlaces(string token, string contactId, string type, string name, string address, string phone, string schedule, string acuity);                

        [WebInvoke(Method = "POST",
            BodyStyle = WebMessageBodyStyle.Wrapped,
            ResponseFormat = WebMessageFormat.Json,
            RequestFormat = WebMessageFormat.Json,
            UriTemplate = "/updatePlanContactImportantPeople/")]
        string updatePlanContactImportantPeople(string token, string importantPersonId, string type, string name, string relationship, string address, string phone, string email);

        [WebInvoke(Method = "POST",
            BodyStyle = WebMessageBodyStyle.Wrapped,
            ResponseFormat = WebMessageFormat.Json,
            RequestFormat = WebMessageFormat.Json,
            UriTemplate = "/updatePlanContactImportantGroup/")]
        string updatePlanContactImportantGroup(string token, string importantGroupId, string status, string name, string address, string phone, string meetingInfo, string whoHelps);

        [WebInvoke(Method = "POST",
            BodyStyle = WebMessageBodyStyle.Wrapped,
            ResponseFormat = WebMessageFormat.Json,
            RequestFormat = WebMessageFormat.Json,
            UriTemplate = "/updatePlanContactImportantPlaces/")]
        string updatePlanContactImportantPlaces(string token, string importantPlacesId, string type, string name, string address, string phone, string schedule, string acuity);

        [WebInvoke(Method = "POST",
            BodyStyle = WebMessageBodyStyle.Wrapped,
            ResponseFormat = WebMessageFormat.Json,
            RequestFormat = WebMessageFormat.Json,
            UriTemplate = "/updatePlanContact/")]
        string updatePlanContact(string token, string contactId, string ohiInfo, string ohiPhone, string ohiPolicy);

        [WebInvoke(Method = "POST",
            BodyStyle = WebMessageBodyStyle.Wrapped,
            ResponseFormat = WebMessageFormat.Json,
            RequestFormat = WebMessageFormat.Json,
            UriTemplate = "/updatePlanContactImportantOrder/")]
        string updatePlanContactImportantOrder(long contactId, long importantId, int newPos, int oldPos, int type);

        [WebInvoke(Method = "POST",
            BodyStyle = WebMessageBodyStyle.Wrapped,
            ResponseFormat = WebMessageFormat.Json,
            RequestFormat = WebMessageFormat.Json,
            UriTemplate = "/deletePlanContactImportant/")]
        string deletePlanContactImportant(string token, string importantId, string type);

        // Plan Introduction

        [WebInvoke(Method = "POST",
           BodyStyle = WebMessageBodyStyle.Wrapped,
           ResponseFormat = WebMessageFormat.Json,
           RequestFormat = WebMessageFormat.Json,
           UriTemplate = "/getPlanIntroduction/")]
        PlanIntroductionWorker.PlanIntroduction getPlanIntroduction(string token, string planId, string consumerId);

        [WebInvoke(Method = "POST",
           BodyStyle = WebMessageBodyStyle.Wrapped,
           ResponseFormat = WebMessageFormat.Json,
           RequestFormat = WebMessageFormat.Json,
           UriTemplate = "/updatePlanIntroduction/")]
        string updatePlanIntroduction(string token, string planId, string consumerId, string likeAdmire, string thingsImportantTo, string thingsImportantFor, string howToSupport, int usePlanImage, string consumerImage);
            



        //Assessment Summary
        [WebInvoke(Method = "POST",
            BodyStyle = WebMessageBodyStyle.Wrapped,
            ResponseFormat = WebMessageFormat.Json,
            RequestFormat = WebMessageFormat.Json,
            UriTemplate = "/getAssessmentSummaryQuestions/")] 
        PlanDiscoverySummaryWorker.AssessmentSummaryQuestions[] getAssessmentSummaryQuestions(string token, long anywAssessmentId);
        [WebInvoke(Method = "POST",
            BodyStyle = WebMessageBodyStyle.Wrapped,
            ResponseFormat = WebMessageFormat.Json,
            RequestFormat = WebMessageFormat.Json,
            UriTemplate = "/getAdditionalAssessmentSummaryQuestions/")]
        PlanDiscoverySummaryWorker.AdditionalAssessmentSummaryQuestions[] getAdditionalAssessmentSummaryQuestions(long anywAssessmentId);

        [WebInvoke(Method = "POST",
            BodyStyle = WebMessageBodyStyle.Wrapped,
            ResponseFormat = WebMessageFormat.Json,
            RequestFormat = WebMessageFormat.Json,
            UriTemplate = "/insertAssessmentSummaryAnswers/")]
        PlanDiscoverySummaryWorker.SummarySavedAnswerIds insertAssessmentSummaryAnswers(string token, long anywAssessmentId, long[] anywQuestionIds, int[] answerRow, string[] answers, string userId);

        [WebInvoke(Method = "POST",
            BodyStyle = WebMessageBodyStyle.Wrapped,
            ResponseFormat = WebMessageFormat.Json,
            RequestFormat = WebMessageFormat.Json,
            UriTemplate = "/updateAssessmentSummaryAnswers/")]
        string updateAssessmentSummaryAnswers(string token, long anywAssessmentId, long[] anywAnswerIds, string[] answers, string userId);

        [WebInvoke(Method = "POST",
            BodyStyle = WebMessageBodyStyle.Wrapped,
            ResponseFormat = WebMessageFormat.Json,
            RequestFormat = WebMessageFormat.Json,
            UriTemplate = "/updateAdditionalAssessmentSummaryAnswer/")]
        string updateAdditionalAssessmentSummaryAnswer(long anywAssessmentId, string aloneTimeAmount, string providerBackUp);

        [WebInvoke(Method = "POST",
            BodyStyle = WebMessageBodyStyle.Wrapped,
            ResponseFormat = WebMessageFormat.Json,
            RequestFormat = WebMessageFormat.Json,
            UriTemplate = "/updateBestWayToConnect/")]
        string updateBestWayToConnect(string token, long anywAssessmentId, int bestWayId);

        [WebInvoke(Method = "POST",
            BodyStyle = WebMessageBodyStyle.Wrapped,
            ResponseFormat = WebMessageFormat.Json,
            RequestFormat = WebMessageFormat.Json,
            UriTemplate = "/updatePlaceOnPath/")]
        string updatePlaceOnPath(string token, long anywAssessmentId, int placeId);

        [WebInvoke(Method = "POST",
            BodyStyle = WebMessageBodyStyle.Wrapped,
            ResponseFormat = WebMessageFormat.Json,
            RequestFormat = WebMessageFormat.Json,
            UriTemplate = "/updateMoreDetail/")]
        string updateMoreDetail(string token, long anywAssessmentId, string detail);

        [WebInvoke(Method = "POST",
            BodyStyle = WebMessageBodyStyle.Wrapped,
            ResponseFormat = WebMessageFormat.Json,
            RequestFormat = WebMessageFormat.Json,
            UriTemplate = "/generateCNDetailReport/")]
        CaseNoteReportBuilderWorker.ReportScheduleId[] generateCNDetailReport(string token, string userId, string billerId, string consumerId, string consumerName, string serviceStartDate, string serviceEndDate,
                                                        string location, string originallyEnteredStart, string originallyEnteredEnd, string billingCode, string service, string need, string contact, string applicationName);

        [WebInvoke(Method = "POST",
            BodyStyle = WebMessageBodyStyle.Wrapped,
            ResponseFormat = WebMessageFormat.Json,
            RequestFormat = WebMessageFormat.Json,
            UriTemplate = "/generateCNTimeAnalysisReport/")]
        CaseNoteReportBuilderWorker.ReportScheduleId[] generateCNTimeAnalysisReport(string token, string userId, string billerId, string consumerId, string billingCode, string serviceStartDate, string serviceEndDate, string applicationName);

        [WebInvoke(Method = "POST",
            BodyStyle = WebMessageBodyStyle.Wrapped,
            ResponseFormat = WebMessageFormat.Json,
            RequestFormat = WebMessageFormat.Json,
            UriTemplate = "/checkIfCNReportExists/")]
        string checkIfCNReportExists(string token, string reportScheduleId);

        [OperationContract]
        [WebInvoke(Method = "POST",
             BodyStyle = WebMessageBodyStyle.Bare,
             UriTemplate = "/viewCaseNoteReport/")]
        //void viewCaseNoteAttachment(string attachmentId);
        void viewCaseNoteReport(System.IO.Stream testInput);

        //Defaults
        //Move other calls related to defaults here at some point
        [WebInvoke(Method = "POST",
            BodyStyle = WebMessageBodyStyle.Wrapped,
            ResponseFormat = WebMessageFormat.Json,
            RequestFormat = WebMessageFormat.Json,
            UriTemplate = "/getInvalidDefaults/")]
        DefaultsWorker.InvalidDefaults[] getInvalidDefaults(string token);


        //Forms
       
    [WebInvoke(Method = "POST",
           BodyStyle = WebMessageBodyStyle.Wrapped,
           ResponseFormat = WebMessageFormat.Json,
           RequestFormat = WebMessageFormat.Json,
           UriTemplate = "/openEditor/")]
    string openEditor(string templateId, string consumerId);

        [WebInvoke(Method = "POST",
           BodyStyle = WebMessageBodyStyle.Wrapped,
           ResponseFormat = WebMessageFormat.Json,
           RequestFormat = WebMessageFormat.Json,
           UriTemplate = "/openPDFEditor/")]
        string openPDFEditor(string documentId, string documentEdited, string consumerId, bool isRefresh);

        [WebInvoke(Method = "POST",
          BodyStyle = WebMessageBodyStyle.Wrapped,
          ResponseFormat = WebMessageFormat.Json,
          RequestFormat = WebMessageFormat.Json,
          UriTemplate = "/openFormEditor/")]
        string openFormEditor(string formId, string documentEdited, string consumerId, bool isRefresh, string isTemplate, string applicationName);

        [OperationContract]
        [WebInvoke(Method = "POST",
          BodyStyle = WebMessageBodyStyle.Wrapped,
          ResponseFormat = WebMessageFormat.Json,
          RequestFormat = WebMessageFormat.Json,
          UriTemplate = "/getUserFormTemplates/")]
        FormWorker.FormTemplate[] getUserFormTemplates(string token, string userId, string hasAssignedFormTypes);

        [OperationContract]
        [WebInvoke(Method = "POST",
          BodyStyle = WebMessageBodyStyle.Wrapped,
          ResponseFormat = WebMessageFormat.Json,
          RequestFormat = WebMessageFormat.Json,
          UriTemplate = "/insertConsumerForm/")]
        Anywhere.service.Data.FormWorker.consumerForm insertConsumerForm(string token, string userId, string consumerId, string formtemplateid, string formdata, string formCompleteDate);


        [OperationContract]
        [WebInvoke(Method = "POST",
              BodyStyle = WebMessageBodyStyle.Wrapped,
              ResponseFormat = WebMessageFormat.Json,
              RequestFormat = WebMessageFormat.Json,
              UriTemplate = "/updateConsumerForm/")]
        Anywhere.service.Data.FormWorker.consumerForm updateConsumerForm(string token, string formId, string formdata, string documentEdited);

        [OperationContract]
        [WebInvoke(Method = "POST",
              BodyStyle = WebMessageBodyStyle.Wrapped,
              ResponseFormat = WebMessageFormat.Json,
              RequestFormat = WebMessageFormat.Json,
              UriTemplate = "/updateConsumerFormCompletionDate/")]
        Anywhere.service.Data.FormWorker.consumerForm updateConsumerFormCompletionDate(string token, string formId, string formCompletionDate);

        [OperationContract]
        [WebInvoke(Method = "DELETE",
            BodyStyle = WebMessageBodyStyle.Wrapped,
            ResponseFormat = WebMessageFormat.Json,
            RequestFormat = WebMessageFormat.Json,
            UriTemplate = "/deleteConsumerForm/")]
        String deleteConsumerForm(string token, string formId);


        [OperationContract]
        [WebInvoke(Method = "POST",
           BodyStyle = WebMessageBodyStyle.Wrapped,
           ResponseFormat = WebMessageFormat.Json,
           RequestFormat = WebMessageFormat.Json,
           UriTemplate = "/getconsumerForms/")]
        Anywhere.service.Data.FormWorker.consumerForm[] getconsumerForms(string token, string userId, string consumerId, string hasAssignedFormTypes);

        //OOD Module

        [OperationContract]
        [WebInvoke(Method = "POST",
           BodyStyle = WebMessageBodyStyle.Wrapped,
           ResponseFormat = WebMessageFormat.Json,
           RequestFormat = WebMessageFormat.Json,
           UriTemplate = "/getOODEntries/")]
        Anywhere.service.Data.OODWorker.OODEntry[] getOODEntries(string token, string consumerIds, string serviceStartDate, string serviceEndDate, string userId, string serviceCode, string referenceNumber);

        [OperationContract]
        [WebInvoke(Method = "POST",
          BodyStyle = WebMessageBodyStyle.Wrapped,
          ResponseFormat = WebMessageFormat.Json,
          RequestFormat = WebMessageFormat.Json,
          UriTemplate = "/getActiveEmployees/")]
        OODWorker.ActiveEmployee[] getActiveEmployees(string token);

        [OperationContract]
        [WebInvoke(Method = "POST",
          BodyStyle = WebMessageBodyStyle.Wrapped,
          ResponseFormat = WebMessageFormat.Json,
          RequestFormat = WebMessageFormat.Json,
          UriTemplate = "/getConsumerEmployers/")]
        OODWorker.ActiveEmployer[] getConsumerEmployers(string consumerId, string token);

        [OperationContract]
        [WebInvoke(Method = "POST",
         BodyStyle = WebMessageBodyStyle.Wrapped,
         ResponseFormat = WebMessageFormat.Json,
         RequestFormat = WebMessageFormat.Json,
         UriTemplate = "/getActiveEmployers/")]
        OODWorker.ActiveEmployer[] getActiveEmployers(string token);

        [OperationContract]
        [WebInvoke(Method = "DELETE",
            BodyStyle = WebMessageBodyStyle.Wrapped,
            ResponseFormat = WebMessageFormat.Json,
            RequestFormat = WebMessageFormat.Json,
            UriTemplate = "/deleteEmployer/")]
        String deleteEmployer(string token, string employerId);

        [OperationContract]
        [WebInvoke(Method = "POST",
                 BodyStyle = WebMessageBodyStyle.Wrapped,
                 ResponseFormat = WebMessageFormat.Json,
                 RequestFormat = WebMessageFormat.Json,
                 UriTemplate = "/insertEmployer/")]
        Anywhere.service.Data.OODWorker.ActiveEmployer insertEmployer(string token, string employerName, string address1, string address2, string city, string state, string zipcode, string userId);

        [OperationContract]
        [WebInvoke(Method = "POST",
              BodyStyle = WebMessageBodyStyle.Wrapped,
              ResponseFormat = WebMessageFormat.Json,
              RequestFormat = WebMessageFormat.Json,
              UriTemplate = "/updateEmployer/")]
        Anywhere.service.Data.OODWorker.ActiveEmployer updateEmployer(string token, string employerId, string employerName, string address1, string address2, string city, string state, string zipcode, string userId);

        [OperationContract]
        [WebInvoke(Method = "POST",
             BodyStyle = WebMessageBodyStyle.Wrapped,
             ResponseFormat = WebMessageFormat.Json,
             RequestFormat = WebMessageFormat.Json,
             UriTemplate = "/getEmployerJSON/")]
        OODWorker.ActiveEmployer[] getEmployerJSON(string token, string employerId);

        [OperationContract]
        [WebInvoke(Method = "POST",
              BodyStyle = WebMessageBodyStyle.Wrapped,
              ResponseFormat = WebMessageFormat.Json,
              RequestFormat = WebMessageFormat.Json,
              UriTemplate = "/getActiveServiceCodes/")]
        OODWorker.ServiceCode[] getActiveServiceCodes(string token, string serviceCodeType);

        [OperationContract]
        [WebInvoke(Method = "POST",
          BodyStyle = WebMessageBodyStyle.Wrapped,
          ResponseFormat = WebMessageFormat.Json,
          RequestFormat = WebMessageFormat.Json,
          UriTemplate = "/getConsumerReferenceNumbers/")]
        OODWorker.ReferenceNumber[] getConsumerReferenceNumbers(string token, string consumerIds, string startDate, string endDate);

        [OperationContract]
        [WebInvoke(Method = "POST",
          BodyStyle = WebMessageBodyStyle.Wrapped,
          ResponseFormat = WebMessageFormat.Json,
          RequestFormat = WebMessageFormat.Json,
          UriTemplate = "/getConsumerServiceCodes/")]
        OODWorker.ServiceCode[] getConsumerServiceCodes(string consumerId, string serviceDate, string token);

        [OperationContract]
        [WebInvoke(Method = "POST",
          BodyStyle = WebMessageBodyStyle.Wrapped,
          ResponseFormat = WebMessageFormat.Json,
          RequestFormat = WebMessageFormat.Json,
          UriTemplate = "/getContactTypes/")]
        OODWorker.ContactType[] getContactTypes(string token);

        [OperationContract]
        [WebInvoke(Method = "POST",
          BodyStyle = WebMessageBodyStyle.Wrapped,
          ResponseFormat = WebMessageFormat.Json,
          RequestFormat = WebMessageFormat.Json,
          UriTemplate = "/getOutcomes/")]
        OODWorker.Outcome[] getOutcomes(string token);

        [OperationContract]
        [WebInvoke(Method = "POST",
             BodyStyle = WebMessageBodyStyle.Wrapped,
             ResponseFormat = WebMessageFormat.Json,
             RequestFormat = WebMessageFormat.Json,
             UriTemplate = "/getForm4MonthlyPlacementEditDataJSON/")]
        OODWorker.Form4MonthlyPlacementEditData[] getForm4MonthlyPlacementEditDataJSON(string token, string caseNoteId);

        [OperationContract]
        [WebInvoke(Method = "POST",
             BodyStyle = WebMessageBodyStyle.Wrapped,
             ResponseFormat = WebMessageFormat.Json,
             RequestFormat = WebMessageFormat.Json,
             UriTemplate = "/updateForm4MonthlyPlacementEditData/")]
        string updateForm4MonthlyPlacementEditData(string token, string consumerId, string caseNoteId, string serviceDate, string startTime, string endTime, string SAMLevel, string employer, string contactType, string jobSeekerPresent, string outcome, string TSCNotified, string bilingualSupplement, string notes, string userId, string application, string interview);

        [OperationContract]
        [WebInvoke(Method = "POST",
            BodyStyle = WebMessageBodyStyle.Wrapped,
            ResponseFormat = WebMessageFormat.Json,
            RequestFormat = WebMessageFormat.Json,
            UriTemplate = "/insertForm4MonthlyPlacementEditData/")]
        string insertForm4MonthlyPlacementEditData(string token, string consumerId, string caseNoteId, string serviceDate, string startTime, string endTime, string SAMLevel, string employer, string contactType, string jobSeekerPresent, string outcome, string TSCNotified, string bilingualSupplement, string notes,  string caseManagerId, string userId, string serviceId, string referenceNumber, string application, string interview);

        [OperationContract]
        [WebInvoke(Method = "DELETE",
            BodyStyle = WebMessageBodyStyle.Wrapped,
            ResponseFormat = WebMessageFormat.Json,
            RequestFormat = WebMessageFormat.Json,
            UriTemplate = "/deleteForm4MonthlyPlacementEditData/")]
        String deleteForm4MonthlyPlacementEditData(string token, string caseNoteId);

        [OperationContract]
        [WebInvoke(Method = "POST",
             BodyStyle = WebMessageBodyStyle.Wrapped,
             ResponseFormat = WebMessageFormat.Json,
             RequestFormat = WebMessageFormat.Json,
             UriTemplate = "/getForm4MonthlySummaryJSON/")]
        OODWorker.Form4MonthlySummary[] getForm4MonthlySummaryJSON(string token, string emReviewId);

        [OperationContract]
        [WebInvoke(Method = "POST",
             BodyStyle = WebMessageBodyStyle.Wrapped,
             ResponseFormat = WebMessageFormat.Json,
             RequestFormat = WebMessageFormat.Json,
             UriTemplate = "/updateForm4MonthlySummary/")]
        string updateForm4MonthlySummary(string token, string consumerId, string emReviewId, string emReviewDate, string emReferenceNumber, string emNextScheduledReview, string emEmploymentGoal, string emReferralQuestions, string emIndivInputonSearch, string emPotentialIssueswithProgress, string emPlanGoalsNextMonth, string emNumberofConsumerContacts, string emNumberEmployerContactsbyConsumer, string emNumberEmployerContactsbyStaff, string emNumberMonthsJobDevelopment, string userId);

        [OperationContract]
        [WebInvoke(Method = "POST",
            BodyStyle = WebMessageBodyStyle.Wrapped,
            ResponseFormat = WebMessageFormat.Json,
            RequestFormat = WebMessageFormat.Json,
            UriTemplate = "/insertForm4MonthlySummary/")]
        string insertForm4MonthlySummary(string token, string consumerId, string emReviewDate, string emReferenceNumber, string emNextScheduledReview, string emEmploymentGoal, string emReferralQuestions, string emIndivInputonSearch, string emPotentialIssueswithProgress, string emPlanGoalsNextMonth, string emNumberofConsumerContacts, string emNumberEmployerContactsbyConsumer, string emNumberEmployerContactsbyStaff, string emNumberMonthsJobDevelopment, string userId, string serviceId);

        [OperationContract]
        [WebInvoke(Method = "DELETE",
            BodyStyle = WebMessageBodyStyle.Wrapped,
            ResponseFormat = WebMessageFormat.Json,
            RequestFormat = WebMessageFormat.Json,
            UriTemplate = "/deleteForm4MonthlySummary/")]
        String deleteForm4MonthlySummary(string token, string emReviewId);

        [WebInvoke(Method = "POST",
           BodyStyle = WebMessageBodyStyle.Wrapped,
           ResponseFormat = WebMessageFormat.Json,
           RequestFormat = WebMessageFormat.Json,
           UriTemplate = "/oneSpanBuildSigners/")]
        string oneSpanBuildSigners(string token, string packageName, string documentName, string filePath, string[] emails, string[] names);


    }


// Use a data contract as illustrated in the sample below to add composite types to service operations.
[DataContract]
    public class CompositeType
    {
        bool boolValue = true;
        string stringValue = "Hello ";

        [DataMember]
        public bool BoolValue
        {
            get { return boolValue; }
            set { boolValue = value; }
        }

        [DataMember]
        public string StringValue
        {
            get { return stringValue; }
            set { stringValue = value; }
        }
    }
}