using Anywhere.Data;
using System.Web.Script.Serialization;

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

        public AddCustomGroup[] addCustomGroupJSON(string groupName, string locationId, string token)
        {
            string customGroupString = dg.addCustomGroupJSON(groupName, locationId, token);
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
        public ConsumerRelationships[] getConsumerRelationshipsJSON(string token, string consumerId)
        {
            string consumerRelString = dg.getConsumerRelationshipsJSON(token, consumerId);
            ConsumerRelationships[] consumerRelObj = js.Deserialize<ConsumerRelationships[]>(consumerRelString);
            return consumerRelObj;
        }

        public ConsumerPlanYearInfo getConsumerPlanYearInfo(string token, string consumerId)
        {
            string consumerPlanYearInfoString = dg.getConsumerPlanYearInfo(token, consumerId);
            ConsumerPlanYearInfo[] consumerPlanYearInfoObj = js.Deserialize<ConsumerPlanYearInfo[]>(consumerPlanYearInfoString);
            return consumerPlanYearInfoObj[0];
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
            public string County { get; set; }
            public string orgName { get; set; }
            public string orgAdd1 { get; set; }
            public string orgAdd2 { get; set; }
            public string city { get; set; }
            public string orgZipCode { get; set; }
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
        }

    }
}