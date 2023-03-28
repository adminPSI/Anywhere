namespace Anywhere.service.Data.ConsumerDemographics
{
    public class DemographicsWoker
    {
        UpdateDemographicsWorker udw = new UpdateDemographicsWorker();
        public string updateDemographicsRecord(string consumerId, string field, string newValue, string applicationName)
        {
            return udw.updateDemographicsRecord(consumerId, field, newValue, applicationName);
        }
    }
}