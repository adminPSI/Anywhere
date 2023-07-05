using System.Web.Script.Serialization;

namespace Anywhere.service.Data.Covid
{
    public class CovidWorker
    {
        CovidDataGetter cdg = new CovidDataGetter();
        JavaScriptSerializer js = new JavaScriptSerializer();

        public string insertUpdateCovidAssessment(string token, string assesmentDate, string assessmentTime, string cough, string diarrhea,
           string fever, string locationId, string malaise, string nasalCong, string nausea, string tasteAndSmell, string notes, string peopleId, string settingType, string shortnessBreath, string soreThroat, string assessmentId, string isConsumer)
        {
            return cdg.insertUpdateCovidAssessment(token, assesmentDate, assessmentTime, cough, diarrhea, fever, locationId, malaise, nasalCong, nausea, tasteAndSmell, notes, peopleId, settingType, shortnessBreath, soreThroat, assessmentId, isConsumer);
        }

        public CovidDetails[] getIndividualsCovidDetails(string token, string peopleId, string assessmentDate, string isConsumer)
        {
            string details = cdg.getIndividualsCovidDetails(token, peopleId, assessmentDate, isConsumer);
            CovidDetails[] detailsObj = js.Deserialize<CovidDetails[]>(details);
            return detailsObj;
        }

        public string deleteCovidAssessment(string token, string assessmentId)
        {
            return cdg.deleteCovidAssessment(token, assessmentId);
        }


        public class CovidDetails
        {
            public int assessmentId { get; set; }
            public string assessmentTime { get; set; }
            public string cough { get; set; }
            public string diarrhea { get; set; }
            public string fever { get; set; }
            public string locationId { get; set; }
            public string malaise { get; set; }
            public string nasalCong { get; set; }
            public string nausea { get; set; }
            public string tasteAndSmell { get; set; }
            public string notes { get; set; }
            public string peopleId { get; set; }
            public string settingType { get; set; }
            public string shortnessBreath { get; set; }
            public string soreThroat { get; set; }
            public string enteredBy { get; set; }
        }
    }
}