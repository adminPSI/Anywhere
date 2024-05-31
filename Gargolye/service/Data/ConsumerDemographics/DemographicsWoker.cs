using Microsoft.Win32;
using System;

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
            bool emailClient = IsEmailClientConfigured();
            if (emailClient)
            {
                return "True";
            }
            else
            {
                return "False";
            }

        }

        public static bool IsEmailClientConfigured()
        {
            try
            {
                using (RegistryKey mailKey = Registry.ClassesRoot.OpenSubKey("mailto"))
                {
                    if (mailKey != null)
                    {
                        object urlProtocol = mailKey.GetValue("URL Protocol");
                        if (urlProtocol != null && urlProtocol.ToString() == "")
                        {
                            return true;
                        }
                    }
                }

                using (RegistryKey clientKey = Registry.CurrentUser.OpenSubKey(@"Software\Clients\Mail"))
                {
                    return clientKey != null;
                }
            }
            catch (Exception ex)
            {
                return false;
            }
        }
    }

}