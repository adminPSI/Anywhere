using Anywhere.Data;
using System.ServiceModel.Web;
using System;
using System.Web.Script.Serialization;
using static Anywhere.service.Data.WorkflowWorker;
using OneSpanSign.Sdk;
using System.Runtime.Serialization;
using static Anywhere.service.Data.SimpleMar.SignInUser;
using static System.Windows.Forms.AxHost;
using System.Reflection.Emit;
using System.Threading;
using System.Runtime.InteropServices.ComTypes;
using System.Collections.Generic;
using System.Linq;
using static Anywhere.service.Data.PlanReport;
using DocumentFormat.OpenXml.Bibliography;

namespace Anywhere.service.Data
{
    public class RosterWorker
    {
        DataGetter dg = new DataGetter();
        JavaScriptSerializer js = new JavaScriptSerializer();

        public CheckForIndividualAbsent[] checkForIndividualAbsentJSON(string token, string locationId, string consumerId, string checkDate)
        {
            string isIndividualAbsentString = dg.checkForIndividualAbsentJSON(token, locationId, consumerId, checkDate);
            CheckForIndividualAbsent[] isIndividualAbsentObj = js.Deserialize<CheckForIndividualAbsent[]>(isIndividualAbsentString);
            return isIndividualAbsentObj;
        }

        public AddCustomGroup[] addCustomGroupJSON(string groupName, string locationId, string token, string ispubliclyAvailableChecked)
        {
            string customGroupString = dg.addCustomGroupJSON(groupName, locationId, token, ispubliclyAvailableChecked);
            AddCustomGroup[] customGroupObj = js.Deserialize<AddCustomGroup[]>(customGroupString);
            return customGroupObj;
        }

        public ConsumerGroups[] getConsumerGroupsJSON(string locationId, string token)
        {
            string consumerGroupsString = dg.getConsumerGroupsJSON(locationId, token);
            ConsumerGroups[] consumerGroupsObj = js.Deserialize<ConsumerGroups[]>(consumerGroupsString);
            return consumerGroupsObj;
        }
        public ConsumerNotes[] getDemographicsNotesJSON(string token, string consumerId)
        {
            string consumerNotesString = dg.getDemographicsNotesJSON(token, consumerId);
            ConsumerNotes[] consumerNotesObj = js.Deserialize<ConsumerNotes[]>(consumerNotesString);
            return consumerNotesObj;
        }
        public ConsumerDemographics[] getConsumerDemographicsJSON(string token, string consumerId)
        {
            string consumerDemoString = dg.getConsumerDemographicsJSON(token, consumerId);
            ConsumerDemographics[] consumerDemoObj = js.Deserialize<ConsumerDemographics[]>(consumerDemoString);
            return consumerDemoObj;
        }
        public DemographicInformation[] GetDemographicInformation(string token)
        {
            string demoInfoString = dg.GetDemographicInformation(token);
            DemographicInformation[] demoInfoObj = js.Deserialize<DemographicInformation[]>(demoInfoString);
            return demoInfoObj;
        }
        public DemographicInformation[] GetValidateEmailInformation(string token, string email)
        {
            string demoInfoString = dg.GetValidateEmailInformation(token, email);
            DemographicInformation[] demoInfoObj = js.Deserialize<DemographicInformation[]>(demoInfoString);
            return demoInfoObj;
        }
        public MobileCarrierDropdown[] getMobileCarrierDropdown(string token)
        {
            string mobileCarrierDropdownString = dg.getMobileCarrierDropdown(token);
            MobileCarrierDropdown[] mobileCarrierDropdownData = js.Deserialize<MobileCarrierDropdown[]>(mobileCarrierDropdownString);
            return mobileCarrierDropdownData;
        }
        public ConsumerRelationships[] getConsumerRelationshipsJSON(string token, string consumerId)
        {
            js.MaxJsonLength = Int32.MaxValue;
            string consumerRelString = dg.getConsumerRelationshipsJSON(token, consumerId);
            ConsumerRelationships[] consumerRelObj = js.Deserialize<ConsumerRelationships[]>(consumerRelString);
            return consumerRelObj;
        }

        public ConsumerEditRelationship[] getEditConsumerRelationshipsJSON(string token, string consumerId, string isActive)
        {
            js.MaxJsonLength = Int32.MaxValue;
            string consumerRelString = dg.getEditConsumerRelationshipsJSON(token, consumerId, isActive);
            ConsumerEditRelationship[] consumerRelObj = js.Deserialize<ConsumerEditRelationship[]>(consumerRelString);
            return consumerRelObj;
        }

        public ConsumerRelationshipType[] getRelationshipsTypeJSON(string token)
        {
            js.MaxJsonLength = Int32.MaxValue;
            string consumerRelString = dg.getRelationshipsTypeJSON(token);
            ConsumerRelationshipType[] consumerRelObj = js.Deserialize<ConsumerRelationshipType[]>(consumerRelString);
            return consumerRelObj;
        }

        public ConsumerRelationshipName[] getRelationshipsNameJSON(string token)
        {
            js.MaxJsonLength = Int32.MaxValue;
            string personString = dg.getRelationshipsNameJSON(token);
            ConsumerRelationshipName[] personObj = js.Deserialize<ConsumerRelationshipName[]>(personString);
            return personObj;
        }

        public ConsumerRelationshipName[] getRelationshipsNameByIDJSON(string token, string relationType)
        {
            string personString = dg.getRelationshipsNameByIDJSON(token, relationType);
            ConsumerRelationshipName[] personObj = js.Deserialize<ConsumerRelationshipName[]>(personString);
            return personObj;
        }

        public string insertEditRelationship(string token, string userId, ConsumerEditRelationship[] consumerRelationshipsNewList, ConsumerEditRelationship[] consumerRelationshipsList, string consumerId)
        {
            string sucess;
            try
            {
                dg.deleteRelationship(token, consumerId);
                foreach (ConsumerEditRelationship relationship in consumerRelationshipsNewList)
                {
                    dg.insertEditRelationship(token, userId, consumerId, relationship.startDate, relationship.endDate, relationship.personID, relationship.typeID);
                }
                foreach (ConsumerEditRelationship archiveRelationship in consumerRelationshipsList)
                {
                    dg.insertArchiveRelationship(token, userId, consumerId, archiveRelationship.startDate, archiveRelationship.endDate, archiveRelationship.personID, archiveRelationship.typeID);
                }
                sucess = "true";
            }
            catch (Exception)
            {
                sucess = "false";
            }
            return sucess;
        }

        public ConsumerPlanYearInfo getConsumerPlanYearInfo(string token, string consumerId)
        {
            string consumerPlanYearInfoString = dg.getConsumerPlanYearInfo(token, consumerId);
            ConsumerPlanYearInfo[] consumerPlanYearInfoObj = js.Deserialize<ConsumerPlanYearInfo[]>(consumerPlanYearInfoString);
            return consumerPlanYearInfoObj[0];
        }

        public RosterToDoListWidgetData[] getRosterToDoListWidgetData(string token, string responsiblePartyId, string isCaseLoad)
        {
            string rosterToDoListDataString = dg.getRosterToDoListWidgetData(responsiblePartyId, token, isCaseLoad);
            RosterToDoListWidgetData[] rosterToDoListObj = js.Deserialize<RosterToDoListWidgetData[]>(rosterToDoListDataString);
            return rosterToDoListObj;
        }

        public ConsumerDemographicsInformation[] getConsumerDemographicsInformation(long ConsumerId)
        {
            string cDIString = "";
            cDIString = dg.getConsumerDemographicsInformation(ConsumerId);
            ConsumerDemographicsInformation[] waitingLists = js.Deserialize<ConsumerDemographicsInformation[]>(cDIString);

            return waitingLists;
        }

        public ConsumerServiceLocation[] getConsumerServiceLocation(long ConsumerId)
        {
            string cDIString = "";
            cDIString = dg.getConsumerServiceLocation(ConsumerId);
            ConsumerServiceLocation[] waitingLists = js.Deserialize<ConsumerServiceLocation[]>(cDIString);

            return waitingLists;
        }

        public ConsumerRelationship[] getConsumerIndividualRelationships(long ConsumerId)
        {
            string cDIString = "";
            cDIString = dg.getConsumerIndividualRelationships(ConsumerId);
            ConsumerRelationship[] waitingLists = js.Deserialize<ConsumerRelationship[]>(cDIString);

            return waitingLists;
        }

        public ConsumerCatagories[] getConsumerCategories(long ConsumerId)
        {
            string cDIString = "";
            cDIString = dg.getConsumerCategories(ConsumerId);
            ConsumerCatagories[] waitingLists = js.Deserialize<ConsumerCatagories[]>(cDIString);

            return waitingLists;
        }

        public ConsumerAppointmnets[] getConsumerAppointmnets(long ConsumerId)
        {
            string cDIString = "";
            cDIString = dg.getConsumerAppointmnets(ConsumerId);
            ConsumerAppointmnets[] waitingLists = js.Deserialize<ConsumerAppointmnets[]>(cDIString);

            return waitingLists;
        }

        public ConsumerClassifications[] getConsumerClassifications(long ConsumerId)
        {
            string cDIString = "";
            cDIString = dg.getConsumerClassifications(ConsumerId);
            ConsumerClassifications[] waitingLists = js.Deserialize<ConsumerClassifications[]>(cDIString);

            return waitingLists;
        }

        public ConsumerIntake[] getConsumerIntake(long ConsumerId)
        {
            string cDIString = "";
            cDIString = dg.getConsumerIntake(ConsumerId);
            ConsumerIntake[] waitingLists = js.Deserialize<ConsumerIntake[]>(cDIString);

            return waitingLists;
        }

        public class MobileCarrierDropdown
        {
            public string carrierName { get; set; }
            public string carrierId { get; set; }
        }

        public class CheckForIndividualAbsent
        {
            public string isAbsent { get; set; }
        }

        public class AddCustomGroup
        {
            public string CustomGroupID { get; set; }
        }

        public class ConsumerPlanYearInfo
        {
            public string startMonth { get; set; }
            public string startDay { get; set; }
        }

        public class ConsumerGroups
        {
            public string RetrieveID { get; set; }
            public string GroupCode { get; set; }
            public string GroupName { get; set; }
            public string Members { get; set; }
        }
        public class ConsumerNotes
        {
            public string noteDate { get; set; }
            public string note { get; set; }
            public string description { get; set; }
        }
        public class ConsumerDemographics
        {
            public string firstname { get; set; }
            public string lastname { get; set; }
            public string nickname { get; set; }
            public string middlename { get; set; }
            public string primaryphone { get; set; }
            public string secondaryphone { get; set; }
            public string cellphone { get; set; }
            public string addressone { get; set; }
            public string addresstwo { get; set; }
            public string mailcity { get; set; }
            public string mailstate { get; set; }
            public string mailzipcode { get; set; }
            public string email { get; set; }
            public string notes { get; set; }
            public string DOB { get; set; }
            public string SSN { get; set; }
            public string MedicaidNumber { get; set; }
            public string MedicareNumber { get; set; }
            public string ResidentNumber { get; set; }
            public string consumerNumber { get; set; }
            public string localID { get; set; }

            public string County { get; set; }
            public string orgName { get; set; }
            public string orgAdd1 { get; set; }
            public string orgAdd2 { get; set; }
            public string city { get; set; }
            public string orgZipCode { get; set; }
            public string orgCity { get; set; }
            public string orgPrimaryPhone { get; set; }
            public string pathToEmployment { get; set; }
            public string race { get; set; }
            public string language { get; set; }
            public string gender { get; set; }
            public string generation { get; set; }
            public string maritalStatus { get; set; }
            public string educationLevel { get; set; }
            public string orgState { get; set; }
        }
        public class DemographicInformation
        {
            public string addressOne { get; set; }
            public string addressTwo { get; set; }
            public string city { get; set; }
            public string state { get; set; }
            public string zipCode { get; set; }
            public string mobilePhone { get; set; }
            public string carrier { get; set; }
            public string email { get; set; }
            public string isEmailExist { get; set; }
        }
        public class ConsumerRelationships
        {
            public string firstName { get; set; }
            public string lastName { get; set; }
            public string primaryPhone { get; set; }
            public string secondaryPhone { get; set; }
            public string cellularPhone { get; set; }
            public string description { get; set; }
            public string companyName { get; set; }
            public string title { get; set; }
            public string addressOne { get; set; }
            public string addressTwo { get; set; }
            public string city { get; set; }
            public string state { get; set; }
            public string zipcode { get; set; }
            public string email { get; set; }
        }

        [DataContract]
        public class RosterToDoListWidgetData
        {
            [DataMember(Order = 0)]
            public string workflowName { get; set; }
            [DataMember(Order = 1)]
            public string consumerId { get; set; }
            [DataMember(Order = 2)]
            public string consumerFirstName { get; set; }
            [DataMember(Order = 3)]
            public string consumerLastName { get; set; }
            [DataMember(Order = 4)]
            public string consumerMiddleName { get; set; }
            [DataMember(Order = 5)]
            public string workflowStepId { get; set; }
            [DataMember(Order = 6)]
            public string workflowStepDescription { get; set; }
            [DataMember(Order = 7)]
            public string workflowStepDueDate { get; set; }
            [DataMember(Order = 8)]
            public string responsiblePartyId { get; set; }
        }

        public class ConsumerEditRelationship
        {
            public string consumerId { get; set; }
            public string startDate { get; set; }
            public string endDate { get; set; }
            public string personID { get; set; }
            public string typeID { get; set; }
        }

        public class ConsumerRelationshipType
        {
            public string typeID { get; set; }
            public string description { get; set; }
        }

        public class ConsumerRelationshipName
        {
            public string personID { get; set; }
            public string name { get; set; }
            public string statusCode { get; set; }
        }

        public class ConsumerDemographicsInformation
        {
            public string ConsumerId { get; set; }
            public string firstname { get; set; }
            public string lastname { get; set; }
            public string nickname { get; set; }
            public string middlename { get; set; }
            public string primaryphone { get; set; }
            public string secondaryphone { get; set; }
            public string addressone { get; set; }
            public string addresstwo { get; set; }
            public string mailcity { get; set; }
            public string mailstate { get; set; }
            public string mailzipcode { get; set; }
            public string email { get; set; }
            public string residentialAddressEffectiveDate { get; set; }
            public string county { get; set; }
            public string SSN { get; set; }
            public string MedicaidNumber { get; set; }
            public string MedicareNumber { get; set; }
            public string ResidentNumber { get; set; }
            public string consumerNumber { get; set; }
            public string billingNumber { get; set; }
            public string contractNumber { get; set; }
            public string areaConsumerNumber { get; set; }
            public string activeDate { get; set; }
            public string inactiveDate { get; set; }
            public string DOB { get; set; }
            public string title { get; set; }
            public string maritalStatus { get; set; }
            public string gender { get; set; }
            public string courtLegalInvolvement { get; set; }
            public string communicationType { get; set; }
            public string firstProcedureDate { get; set; }
            public string secondProcedureDate { get; set; }
            public string eMarConsumer { get; set; }
            public string race { get; set; }
            public string language { get; set; }
            public string generation { get; set; }
            public string educationLevel { get; set; }
            public string otherSource { get; set; }
            public string eMarMadCart { get; set; }
            public string DNRFile { get; set; }
            public string eMARVisible { get; set; }
            public string NPI { get; set; }
            public string payrollId { get; set; }
            public string salesforceId { get; set; }
            public string enrollmentNumber { get; set; }
            public string caseNumber { get; set; }

            public string primaryFundingSource { get; set; }
            public string planYearStartMonth { get; set; }
            public string planYearStartDay  { get; set; }
            public string planYearEndMonth { get; set; }
            public string planYearEndDay { get; set; }
            public string otherLanguage { get; set; }
            public string languageAtHome { get; set; }
            public string otherLanguageAtHome { get; set; }
            public string ethnicity { get; set; }
            public string religion { get; set; }
            public string livingArrangementCategory { get; set; }
            public string livingArrangementSubcategory { get; set; }
            public string facilityName { get; set; }
            public string facilityNumber { get; set; }
            public string site { get; set; }
        }

        public class ConsumerServiceLocation
        {
            public string SunStartTime { get; set; }
            public string monStartTime { get; set; }
            public string tuesStartTime { get; set; }
            public string wedStartTime { get; set; }
            public string thurStartTime { get; set; }
            public string friStartTime { get; set; }
            public string satStartTime { get; set; }
            public string sunEndTime { get; set; }
            public string monEndTime { get; set; }
            public string tuesEndTime { get; set; }
            public string wedEndTime { get; set; }
            public string thurEndTime { get; set; }
            public string friEndTime { get; set; }
            public string satEndTime { get; set; }
            public string sunDStype { get; set; }
            public string monDSType { get; set; }
            public string tueDSType { get; set; }
            public string wedDSType { get; set; }
            public string thuDSType { get; set; }
            public string friDSType { get; set; }
            public string satDSType { get; set; }
            public string sunStartTime2 { get; set; }
            public string monStartTime2 { get; set; }
            public string tueStartTime2 { get; set; }
            public string wedStartTime2 { get; set; }
            public string thurStartTime2 { get; set; }
            public string friStartTime2 { get; set; }
            public string satStartTime2 { get; set; }
            public string sunEndTime2 { get; set; }
            public string monEndTime2 { get; set; }
            public string tueEndTime2 { get; set; }
            public string wedEndTime2 { get; set; }
            public string thurEndTime2 { get; set; }
            public string friEndTime2 { get; set; }
            public string satEndTime2 { get; set; }
            public string sunDSType2 { get; set; }
            public string monDSType2 { get; set; }
            public string tueDSType2 { get; set; }
            public string wedDSType2 { get; set; }
            public string thuDSType2 { get; set; }
            public string friDSType2 { get; set; }
            public string satDSType2 { get; set; }
            public string locationId { get; set; }
            public string locationName { get; set; }
            public string startDate { get; set; }
            public string endDate { get; set; }
            public string consumerType { get; set; }
            public string notes { get; set; }
            public string LocationStatus { get; set; }
            public string defaultGroup { get; set; }
            public string MRC { get; set; }
        }

        public class ConsumerRelationship
        {
            public string personId { get; set; }
            public string relationshipType { get; set; }
            public string name { get; set; }
            public string startDate { get; set; }
            public string endDate { get; set; }
            public string rowNum { get; set; }

        }

        public class ConsumerCatagories
        {
            public string categoryID { get; set; }
            public string categoryName { get; set; }
            public string rowNum { get; set; }
        }

        public class ConsumerAppointmnets
        {
            public string trackingId { get; set; }
            public string appointmentDate { get; set; }
            public string appointmentTime { get; set; }
            public string appointmentType { get; set; }
            public string provider { get; set; }
            public string employee { get; set; }
            public string treatment { get; set; }
            public string reason { get; set; }
            public string notes { get; set; }
        }

        public class ConsumerClassifications
        {
            public string description { get; set; }
            public string startDate { get; set; }
            public string endDate { get; set; }
            public string rowNum { get; set; }
        }

        public class ConsumerIntake
        {
            public string fundingPreference { get; set; }
            public string locationPreference { get; set; }
            public string housingPreference { get; set; }
            public string intensityofService { get; set; }
            public string SDD { get; set; }
            public string onsetOfDisabilityAge { get; set; }
        }

    }
}