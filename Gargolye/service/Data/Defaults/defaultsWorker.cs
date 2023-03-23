using System.Web.Script.Serialization;

namespace Anywhere.service.Data.Defaults
{
    public class DefaultsWorker
    {
        JavaScriptSerializer js = new JavaScriptSerializer();
        DefaultsDataGetter ddg = new DefaultsDataGetter();

        public InvalidDefaults[] getInvalidDefaults(string token)
        {
            string dString = ddg.getInvalidDefaults(token);
            InvalidDefaults[] dObj = js.Deserialize<InvalidDefaults[]>(dString);
            return dObj;
        }

        public class InvalidDefaults
        {
            public string invalidLocationId { get; set; }
            public string locationName { get; set; }
            public string moduleDefault { get; set; }
        }

    }
}