using Microsoft.Win32;

namespace Anywhere.service.Data.ConsumerDemographics
{
    public class DemographicsWoker
    {
        UpdateDemographicsWorker udw = new UpdateDemographicsWorker();
        public string updateDemographicsRecord(string consumerId, string field, string newValue, string applicationName)
        {
            return udw.updateDemographicsRecord(consumerId, field, newValue, applicationName);
        }

        public string verifyDefaultEmailClient()
        {
            object mailClient = Registry.GetValue(@"HKEY_LOCAL_MACHINE\SOFTWARE\Clients\Mail", "", "none");
            if (mailClient != null)
            {
                return mailClient.ToString();
            }
            else
            {
                return "";
            }
        }
    }
}