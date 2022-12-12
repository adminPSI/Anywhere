using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Anywhere.Data;
using System.Web.Script.Serialization;
using System.Text;
using System.Security.Cryptography;

namespace Anywhere.service.Data
{
    public class DayServicesWorker
    {
        DataGetter dg = new DataGetter();
        JavaScriptSerializer js = new JavaScriptSerializer();

        public DayServiceLocations[] getDayServiceLocationsJSON(string token, string serviceDate)
        {
            string dsLocationsString = dg.getDayServiceLocationsJSON(token, serviceDate);
            DayServiceLocations[] locationsObj = js.Deserialize<DayServiceLocations[]>(dsLocationsString);
            return locationsObj;
        }

        public DSConsumerActivityObject[] getConsumerDayServiceActivityJSON(string token, string peopleList, string serviceDate, string locationId, string groupCode, string retrieveId)
        {
            string consumerActivityString = dg.getConsumerDayServiceActivityJSON(token, peopleList, serviceDate, locationId, groupCode, retrieveId);
            DSConsumerActivityObject[] consumerActivityObj = js.Deserialize<DSConsumerActivityObject[]>(consumerActivityString);
            return consumerActivityObj;
        }

        public CIDropdownStaff[] getCIStaffDropdownJSON(string token, string serviceDate, string locationID)
        {
            string ciStaffDropdownString = dg.getCIStaffDropdownJSON(token, serviceDate, locationID);
            CIDropdownStaff[] ciStaffDropdownObj = js.Deserialize<CIDropdownStaff[]>(ciStaffDropdownString);
            return ciStaffDropdownObj;
        }

        public EnabledConsumers[] getDayServiceGetEnabledConsumers(string serviceDate, string locationId)
        {
            string enabledConsumersString = dg.getDayServiceGetEnabledConsumers(serviceDate, locationId);
            EnabledConsumers[] enabledConsumersObj = js.Deserialize<EnabledConsumers[]>(enabledConsumersString);
            return enabledConsumersObj;
        }

        public BatchedBillingId[] getDSIsLocationBatched(string token, string locationId, string serviceDate)
        {
            string billingIdString = dg.getDSIsLocationBatched(token, locationId, serviceDate);
            BatchedBillingId[] billingIdObj = js.Deserialize<BatchedBillingId[]>(billingIdString);

            return billingIdObj;
        }

        public DayServiceGroups[] getDayServiceGroups(string token, string locationId)
        {
            string groupString = dg.getDayServiceGroups(token, locationId);
            DayServiceGroups[] groupObj = js.Deserialize<DayServiceGroups[]>(groupString);

            return groupObj;
        }

        public ClockedInConsumers[] getDayServiceClockedInConsumers(string token, string consumerIdString, string serviceDate, string locationId)
        {
            consumerIdString = consumerIdString.Replace("|", ",");
            string idString = dg.getDayServiceClockedInConsumers(token, consumerIdString, serviceDate, locationId);
            ClockedInConsumers[] idObj = js.Deserialize<ClockedInConsumers[]>(idString);

            return idObj;
        }


        public class ClockedInConsumers
        {
            public string name { get; set; }
            public string location { get; set; }
            public string startTime { get; set; }
            public string endTime { get; set; }
        }

        public class DayServiceGroups
        {
            public string groupId { get; set; }
            public string groupDescription { get; set; }
        }

        public class BatchedBillingId
        {
            public string billing_id { get; set; }
        }

        public class EnabledConsumers
        {
            public string consumerId { get; set; }
        }

        public class DayServiceLocations
        {
            public string locationId { get; set; }
            public string Name { get; set; }
            public string defaultDayServiceType { get; set; }
        }        

        public class DSConsumerActivityObject
        {
            public string ID { get; set; }
            public string Service_Date { get; set; }
            public string Start_Time { get; set; }
            public string Stop_Time { get; set; }
            public string Day_Service_Type { get; set; }
            public string Day_service_group_id { get; set; }
            public string FirstName { get; set; }
            public string LastName { get; set; }
            public string Acuity { get; set; }
            public string isBatched { get; set; }
            public string AllowNonBillable { get; set; }
            public string ciStaffID { get; set; }
        }
        
        public class CIDropdownStaff
        {
            public string fullName { get; set; }
            public string id { get; set; }
        }
    }
}