using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Anywhere.Data;
using System.Web.Script.Serialization;

namespace Anywhere.service.Data
{
    public class AnywhereAbsentWorker
    {
        DataGetter dg = new DataGetter();
        JavaScriptSerializer js = new JavaScriptSerializer();

        public List<String> AbsentPreSave(String token, String consumerIdString, string absentDate, string locationId)
        {
            List<string> idsWithEntries = new List<string>();
            string[] consumerIds = consumerIdString.Split(',');
            String count;
            foreach (string consumerId in consumerIds)
            {
                //Call database and pass consumerId and date to check for existing value
                //add id with entry to idsWithEntries
                count = dg.absentPreSaveCheck(token, consumerId, absentDate, locationId);
                if (count.Contains("1"))
                {
                    count = "1";
                }
                if (count.Equals("1"))
                {
                    idsWithEntries.Add(consumerId);
                }
            }

            return idsWithEntries;
        }     


        public string OneLocationAbsentSave(string token, string absentReasonId, string absentNotificationId, string consumerIdString, string absenceDate, string locationId, string reportedBy, string timeReported, string dateReported)
        {
            string absentIdString = "";
            string absentId = "";
            string objIdString = "";
            string[] consumerIds = consumerIdString.Split(',');
            foreach (string consumerId in consumerIds)
            {
                absentIdString = dg.oneLocationAbsentTableSave(token, absentReasonId, absentNotificationId, consumerId, absenceDate, locationId, reportedBy, timeReported, dateReported);
                AbsentId[] absentIdd = js.Deserialize<AbsentId[]>(absentIdString);
                absentId = absentIdd[0].absentId.ToString();
                objIdString = dg.getObjectiveIdsForAbsentSave(token, consumerId, absenceDate);
                ObjectiveIds[] objectiveIds = js.Deserialize<ObjectiveIds[]>(objIdString);
                foreach (ObjectiveIds objIdOI in objectiveIds)
                {
                    //Save correct fields to objective activity table
                    string objId = objIdOI.Objective_id.ToString();
                    dg.saveAbsentObjctiveActivities(token, absentId, objId, absenceDate, absentReasonId, locationId, dateReported, reportedBy);
                }
            }
            return "Absent Saved";
        }


        public String AllLocationSaveAbsent(string token, string absentReasonId, string absentNotificationId, string consumerIdString, string absenceDate, string reportedBy, string timeReported, string dateReported)
        {
            string absentId = "";
            string absentIdString = "";
            string objIdString = "";
            string locationIdString = "";
            string[] consumerIds = consumerIdString.Split(',');
            String count ="";
            foreach (string consumerId in consumerIds)
            {
                locationIdString = dg.getCounsumerLocationsForAbsentSave(token, consumerId, absenceDate);//May need work to get into string correctly
                LocationId[] locationIds = js.Deserialize<LocationId[]>(locationIdString);
                foreach (LocationId consumerLocationId in locationIds)
                {
                    string formattedocationId = consumerLocationId.Location_ID.ToString();
                    absentIdString = dg.oneLocationAbsentTableSave(token, absentReasonId, absentNotificationId, consumerId, absenceDate, formattedocationId, reportedBy, timeReported, dateReported);
                    AbsentId[] absentIdd = js.Deserialize<AbsentId[]>(absentIdString);
                    absentId = absentIdd[0].absentId.ToString();
                    objIdString = dg.getObjectiveIdsForAbsentSave(token, consumerId, absenceDate);//May need wor to get into string correctly
                    ObjectiveIds[] objectiveIds = js.Deserialize<ObjectiveIds[]>(objIdString);
                    foreach (ObjectiveIds objIdOI in objectiveIds)
                    {
                        //Save correct fields to objective activity table
                        string objId = objIdOI.Objective_id.ToString();
                        dg.saveAbsentObjctiveActivities(token, absentId, objId, absenceDate, absentReasonId, formattedocationId, dateReported, reportedBy);
                    }
                }
            }

            return count;
        }

        public class ObjectiveIds
        {
            public int Objective_id { get; set; }
        }

        public class AbsentId
        {
            public int absentId { get; set; }
        }
        public class LocationId
        {
            public int Location_ID { get; set; }
        }
    }
}