using System.Web.Script.Serialization;

namespace Anywhere.service.Data.CaseNoteSSA
{
    public class CaseNoteSSAWorker
    {
        CaseNoteSSADataGetter dg = new CaseNoteSSADataGetter();
        JavaScriptSerializer js = new JavaScriptSerializer();

        public ServiceOptions[] getSSAServiceOptionsDropdown(string token, string serviceDate, string consumerId)
        {
            string details = dg.getSSAServiceOptionsDropdown(token, serviceDate, consumerId);
            ServiceOptions[] detailsObj = js.Deserialize<ServiceOptions[]>(details);
            return detailsObj;
        }

        public BillingCodes[] getSSABillCodesFromService(string token, string serviceName, string personApproved)
        {
            string details = dg.getSSABillCodesFromService(token, serviceName, personApproved);
            BillingCodes[] detailsObj = js.Deserialize<BillingCodes[]>(details);
            return detailsObj;
        }

        public class BillingCodes
        {
            public string service_id { get; set; }
            public string serviceCode { get; set; }
            public string fullName { get; set; }
            public string noteType { get; set; }

        }

        public class ServiceOptions
        {
            public string fullName { get; set; }
            public string serviceCode { get; set; }
            public string personApproved { get; set; }
        }
    }
}