using System;
using System.Web.Script.Serialization;

namespace Anywhere.service.Data.PlanValidation
{
    public class PlanValidationWorker
    {
        private string connectionString = System.Configuration.ConfigurationManager.ConnectionStrings["connection"].ToString();
        JavaScriptSerializer js = new JavaScriptSerializer();
        PlanValidationDataGetter pvdg = new PlanValidationDataGetter();

        public class ContactValidationData
        {
            public string bestWayToConnect { get; set; }
            public string importantPeopleType { get; set; }
            public string importantPeopleTypeOther { get; set; }
            public string importantPlacesType { get; set; }
            public string importantPlacesTypeOther { get; set; }
        }

        public ContactValidationData[] getContactValidationData(string token, string planId)
        {
            try
            {
                string result = pvdg.getContactValidationData(token, planId);
                ContactValidationData[] contactValidationObj = js.Deserialize<ContactValidationData[]>(result);
                return contactValidationObj;
            }
            catch (Exception ex)
            {
                return null;
            }
        }

    }
}