using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Script.Serialization;

namespace Anywhere.service.Data.PlanContactInformation
{
    public class PlanContactInformationWorker
    {
        JavaScriptSerializer js = new JavaScriptSerializer();
        PlanContactInformationDataGetter pcidg = new PlanContactInformationDataGetter();


        public ContactInformation[] getPlanContact(string token, string assessmentId)
        {
            long planId = long.Parse(assessmentId);
            string ciString = pcidg.getPlanContact(token, planId);
            ContactInformation[] ciObj = js.Deserialize<ContactInformation[]>(ciString);
            return ciObj;
        }

        public class ContactInformation
        {
            public string contactId { get; set; }
            //public string name { get; set; }
            //public string address { get; set; }
            //public string cityStateZip { get; set; }
            //public string county { get; set; }
            //public string phone { get; set; }
            //public string dob { get; set; }
            //public string sex { get; set; }
            //public string status { get; set; }
            //public string doddNumber { get; set; }
            //public string medicaidNumber { get; set; }
            //public string medicareNumber { get; set; }
            public string ohiInfo { get; set; }
            public string ohiPhone { get; set; }
            public string ohiPolicy { get; set; }
            //public string ssn { get; set; }
        }
        public ImportantPeople[] getPlanContactImportantPeople(string token, string contactId)
        {
            string ciString = pcidg.getPlanContactImportantPeople(token, contactId);
            ImportantPeople[] ciObj = js.Deserialize<ImportantPeople[]>(ciString);
            return ciObj;
        }

        public class ImportantPeople
        {
            public string importantPersonId { get; set; }
            public string type { get; set; }
            public string name { get; set; }
            public string relationship { get; set; }
            public string address { get; set; }
            public string phone { get; set; }
            public string email { get; set; }
            public string rowOrder { get; set; }
        }

        public ImportantPlaces[] getPlanContactImportantPlaces(string token, string contactId)
        {
            string ciString = pcidg.getPlanContactImportantPlaces(token, contactId);
            ImportantPlaces[] ciObj = js.Deserialize<ImportantPlaces[]>(ciString);
            return ciObj;
        }

        public class ImportantPlaces
        {
            public string importantPlacesId { get; set; }
            public string type { get; set; }
            public string name { get; set; }
            public string address { get; set; }
            public string phone { get; set; }
            public string schedule { get; set; }
            public string acuity { get; set; }
            public string rowOrder { get; set; }

        }

        public ImportantGroups[] getPlanContactImportantGroups(string token, string contactId)
        {
            string ciString = pcidg.getPlanContactImportantGroups(token, contactId);
            ImportantGroups[] ciObj = js.Deserialize<ImportantGroups[]>(ciString);
            return ciObj;
        }

        public class ImportantGroups
        {
            public string importantGroupId { get; set; }
            public string status { get; set; }
            public string name { get; set; }
            public string address { get; set; }
            public string phone { get; set; }
            public string meetingInfo { get; set; }
            public string whoHelps { get; set; }
            public string rowOrder { get; set; }

        }

        public class ContactId
        {
            public string contactId { get; set; }
        }

        public class ImportantPersonId
        {
            public string importantPersonId { get; set; }
        }

        public class ImportantGroupId
        {
            public string importantGroupId { get; set; }
        }

        public class ImportantPlacesId
        {
            public string importantPlacesId { get; set; }
        }

        public FundingSource[] getPlanContactFundingSources(long assessmentId)
        {
            string ciString = pcidg.getPlanContactFundingSources(assessmentId);
            FundingSource[] ciObj = js.Deserialize<FundingSource[]>(ciString);
            return ciObj;
        }

        public class FundingSource
        {
            public string fundingSource { get; set; }
        }

        public string insertPlanContactImportantPeople(string token, string contactId, string type, string name, string relationship, string address, string phone, string email)
        {
            string ciString = "";
            ciString = pcidg.insertPlanContactImportantPeople(token, contactId, type, name, relationship, address, phone, email);
            ImportantPersonId[] ciObj = js.Deserialize<ImportantPersonId[]>(ciString);
            return ciObj[0].importantPersonId.ToString();
        }
        public string insertPlanContactImportantGroup(string token, string contactId, string status, string name, string address, string phone, string meetingInfo, string whoHelps)
        {
            string ciString = "";
            ciString = pcidg.insertPlanContactImportantGroup(token, contactId, status, name, address, phone, meetingInfo, whoHelps);
            ImportantGroupId[] ciObj = js.Deserialize<ImportantGroupId[]>(ciString);
            return ciObj[0].importantGroupId.ToString();
        }
        public string insertPlanContactImportantPlaces(string token, string contactId, string type, string name, string address, string phone, string schedule, string acuity)
        {
            string ciString = "";
            ciString = pcidg.insertPlanContactImportantPlaces(token, contactId, type, name, address, phone, schedule, acuity);
            ImportantPlacesId[] ciObj = js.Deserialize<ImportantPlacesId[]>(ciString);
            return ciObj[0].importantPlacesId.ToString();
        }

        public string updatePlanContactImportantPeople(string token, string importantPersonId, string type, string name, string relationship, string address, string phone, string email)
        {
            pcidg.updatePlanContactImportantPeople(token, importantPersonId, type, name, relationship, address, phone, email);
            return "Sucess";
        }        
        public string updatePlanContactImportantGroup(string token, string importantGroupId, string status, string name, string address, string phone, string meetingInfo, string whoHelps)
        {
            pcidg.updatePlanContactImportantGroup(token, importantGroupId, status, name, address, phone, meetingInfo, whoHelps);
            return "Sucess";
        }        
        public string updatePlanContactImportantPlaces(string token, string importantPlacesId, string type, string name, string address, string phone, string schedule, string acuity)
        {
            pcidg.updatePlanContactImportantPlaces(token, importantPlacesId, type, name, address, phone, schedule, acuity);
            return "Sucess";
        }
        public string updatePlanContact(string token, string contactId, string ohiInfo, string ohiPhone, string ohiPolicy)
        {
            pcidg.updatePlanContact(token, contactId, ohiInfo, ohiPhone, ohiPolicy);
            return "Sucess";
        }

        public string updatePlanContactImportantOrder(long contactId, long importantId, int newPos, int oldPos, int type)
        {
           return pcidg.updatePlanContactImportantOrder(contactId, importantId, newPos, oldPos, type);
        }

        public string deletePlanContactImportant(string token, string importantId, string type)
        {
            pcidg.deletePlanContactImportant(token, importantId, type);
            return "Sucess";
        }

        public ContactImport[] importExistingContactInfo(string token, string peopleId)
        {
            string ciString = pcidg.importExistingContactInfo(token, peopleId);
            ContactImport[] ciObj = js.Deserialize<ContactImport[]>(ciString);
            return ciObj;
        }

        public class ContactImport
        {
            public string lastName { get; set; }
            public string firstName { get; set; }
            public string middleName { get; set; }
            public string nickName { get; set; }
            public string address1 { get; set; }
            public string address2 { get; set; }
            public string city { get; set; }
            public string state { get; set; }
            public string zip { get; set; }
            public string county { get; set; }
            public string email { get; set; }
            public string phone { get; set; }
            public string dob { get; set; }
            public string sex { get; set; }
            public string status { get; set; }
            public string ssn { get; set; }
            public string doddNumber { get; set; }
            public string medicaidNumber { get; set; }
            public string medicareNumber { get; set; }
        }

        public ConsumerRelationships[] getConsumerRelationships(string token, string consumerId, string effectiveStartDate, string effectiveEndDate, string areInSalesForce, string planId)
        {
            string ciString = pcidg.getConsumerRelationships(token, consumerId, effectiveStartDate, effectiveEndDate, areInSalesForce, planId);
            ConsumerRelationships[] ciObj = js.Deserialize<ConsumerRelationships[]>(ciString);
            return ciObj;
        }

        public class ConsumerRelationships
        {
            public string firstName { get; set; }
            public string lastName { get; set; }
            public string middleName { get; set; }
            public string address1 { get; set; }
            public string address2 { get; set; }
            public string city { get; set; }
            public string state { get; set; }
            public string zip { get; set; }
            public string phone { get; set; }
            public string relationship { get; set; }
            public string contactId { get; set; }
        }        

        public void carryOverContactToNewPlan(string consumerPlanId, string priorConsumerPlanId, string token)
        {
            long priorPlanId = long.Parse(priorConsumerPlanId);
            long newPlanId = long.Parse(consumerPlanId);
            // MAIN CONTACT INFORMATION
            string contactInformationString = pcidg.getPlanContact(token, priorPlanId);
            ContactInformation[] ciObj = js.Deserialize<ContactInformation[]>(contactInformationString);

            string insertString = pcidg.insertPlanContact(token, newPlanId, ciObj[0].ohiInfo, ciObj[0].ohiPhone, ciObj[0].ohiPolicy);
            ContactId[] ciIdObj = js.Deserialize<ContactId[]>(insertString);
            string newContactId = ciIdObj[0].contactId;

            //IMPORTANT PEOPLE
            string importantPeopleString = pcidg.getPlanContactImportantPeople(token, ciObj[0].contactId);
            ImportantPeople[] importantPeopleObj = js.Deserialize<ImportantPeople[]>(importantPeopleString);
            for (int i = 0; i < importantPeopleObj.Length; i++)
            {
                pcidg.insertPlanContactImportantPeople(token, newContactId, importantPeopleObj[i].type, importantPeopleObj[i].name, importantPeopleObj[i].relationship, importantPeopleObj[i].address, importantPeopleObj[i].phone, importantPeopleObj[i].email);
            }
            //IMPORTANT GROUPS
            string importantGroupString = pcidg.getPlanContactImportantGroups(token, ciObj[0].contactId);
            ImportantGroups[] importantGroupObj = js.Deserialize<ImportantGroups[]>(importantGroupString);
            for (int i = 0; i < importantGroupObj.Length; i++)
            {
                pcidg.insertPlanContactImportantGroup(token, newContactId, importantGroupObj[i].status, importantGroupObj[i].name, importantGroupObj[i].address, importantGroupObj[i].phone, importantGroupObj[i].meetingInfo, importantGroupObj[i].whoHelps);
            }
            //IMPORTANT PLACES
            string importantPlacesString = pcidg.getPlanContactImportantPlaces(token, ciObj[0].contactId);
            ImportantPlaces[] importantPlacesObj = js.Deserialize<ImportantPlaces[]>(importantPlacesString);
            for (int i = 0; i < importantPlacesObj.Length; i++)
            {
                pcidg.insertPlanContactImportantPlaces(token, newContactId, importantPlacesObj[i].type, importantPlacesObj[i].name, importantPlacesObj[i].address, importantPlacesObj[i].phone, importantPlacesObj[i].schedule, importantPlacesObj[i].acuity);
            }
        }


    }
}