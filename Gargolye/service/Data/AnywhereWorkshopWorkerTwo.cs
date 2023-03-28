using Anywhere.Data;
using System.Collections.Generic;
using System.Web.Script.Serialization;

namespace Anywhere.service.Data
{//Test Back
    public class AnywhereWorkshopWorkerTwo
    {
        DataGetter dg = new DataGetter();
        JavaScriptSerializer js = new JavaScriptSerializer();
        AnywhereWorker anywhereWorker = new AnywhereWorker();

        public BatchID[] PreBatchLoad(string token, string absenceDate)
        {
            string allBatchIDs = dg.WorkshopPreBatchLoad(token, absenceDate);
            BatchID[] batches = js.Deserialize<BatchID[]>(allBatchIDs);
            return batches;
        }

        public Supervisor[] GetSupervisors(string token, string serviceDate)
        {
            string allSupervisors = dg.getWorkshopSupervisors(token, serviceDate);
            Supervisor[] supervisors = js.Deserialize<Supervisor[]>(allSupervisors);
            return supervisors;
        }

        public Location[] GetLocations(string token, string serviceDate)
        {
            string allLocations = dg.WorkshopGetLocations(token, serviceDate);
            Location[] locations = js.Deserialize<Location[]>(allLocations);
            return locations;
        }

        public JobCode[] getWorkshopJobCode(string token, string selectedDate, string location)
        {
            string allJobcodes = dg.getWorkshopJobCode(token, selectedDate, location);
            JobCode[] jobCodes = js.Deserialize<JobCode[]>(allJobcodes);
            return jobCodes;
        }

        public GridData[] getWorkshopFilterListData(string token, string selectedDate, string consumerIds, string locationId, string jobStepId, string application, string batchId)
        {
            if (application == "Advisor")
            {      //                  

                consumerIds = dg.getEmployeeIdForAdvisor(token, consumerIds);
                consumerIds = consumerIds.Replace("<><><LIST(p.id)>", "").Replace("</LIST(p.id)></></>", "");
            }
            string stringGridData = dg.getWorkshopFilterListData(token, selectedDate, consumerIds, locationId, jobStepId, batchId);
            GridData[] gridData = js.Deserialize<GridData[]>(stringGridData);
            return gridData;
        }

        public List<string> GetWorkshopOverlaps(string token, string selectedDate, string jobString, string jobStepId, string jobActType, string locationId, string supervisorId, string time, string batchId, string consumerIds, string startOrEnd)
        {
            List<string> overlapIds = new List<string>();
            string[] conIds = consumerIds.Split('|');
            consumerIds = "";

            foreach (string consumerId in conIds)
            {
                string overlapData = dg.getWorkshopOverlapCheck(token, consumerId, locationId, selectedDate, time, startOrEnd, supervisorId, jobStepId);
                OverlapId[] id = js.Deserialize<OverlapId[]>(overlapData);
                string test = "";
                if (id.Length >= 1)
                {
                    test = id[0].ErrorCode.ToString();
                }

                if (!test.Equals(""))
                {
                    overlapIds.Add(test);
                }
                else
                {
                    consumerIds = consumerIds + consumerId + "|";
                }
            }
            if (startOrEnd == "Start")
            {
                if (!consumerIds.Equals("|"))
                {
                    consumerIds = consumerIds.Replace("||", "|");
                    WorkshopClockIn(token, selectedDate, jobString, jobStepId, jobActType, locationId, supervisorId, time, batchId, consumerIds);
                }
            }
            else
            {
                if (!consumerIds.Equals("|"))
                {
                    consumerIds = consumerIds.Replace("||", "|");
                    WorkshopClockOut(token, consumerIds, time, supervisorId, selectedDate, jobStepId);
                }
            }

            return overlapIds;
        }



        public string WorkshopClockIn(string token, string selectedDate, string jobString, string jobStepId, string jobActType, string locationId, string supervisorId, string startTime, string batchId, string consumerIds)
        {
            //string[] subStrings = jobString.Split('-');
            //string custSuppliers = subStrings[0];
            //string job = subStrings[1];
            //string jobStep = subStrings[2];

            return dg.workshopPreClockIn(token, selectedDate, locationId, supervisorId, startTime, consumerIds, jobStepId, jobActType, batchId);

        }

        public string WorkshopClockOut(string token, string consumerIds, string endTime, string supervisorId, string selectedDate, string jobStepId)
        {
            return dg.workshopPreClockOut(token, consumerIds, endTime, supervisorId, selectedDate, jobStepId);
        }

        public string UpdateWorkshopClockIn(string token, string jobActivityId, string timeEntered)
        {
            string overlap = "";
            overlap = dg.checkSingleClockInOverlapWorkshop(token, jobActivityId, timeEntered);
            if (overlap != "")
            {
                return "Start Overlap";
            }
            else
            {
                return dg.UpdateWorkshopClockIn(token, jobActivityId, timeEntered);
            }
        }

        public string ClockoutWorkshopSingle(string token, string jobActivityId, string timeEntered)
        {
            string overlap = "";
            overlap = dg.checkSingleClockOutOverlapWorkshop(token, jobActivityId, timeEntered);
            if (overlap != "")
            {
                return "End Overlap";
            }
            else
            {
                return dg.ClockoutWorkshopSingle(token, jobActivityId, timeEntered);
            }
        }

        public string DeleteWorkshopEntry(string token, string jobActivityId)
        {
            return dg.deleteWorkshopEntry(token, jobActivityId);
        }

        public string UpdateWorkshopQuantity(string token, string quantity, string jobActivityId)
        {
            return dg.UpdateWorkshopQuantity(token, quantity, jobActivityId);
        }

        public class Location
        {
            public int id { get; set; }
            public string name { get; set; }
        }

        public class Overlaps
        {
            public string id { get; set; }
        }

        public class OverlapId
        {
            public string ErrorCode { get; set; }
        }

        public class BatchID
        {
            public int id { get; set; }
            public string name { get; set; }
            public string startdate { get; set; }
            public string enddate { get; set; }
        }

        public class Supervisor
        {
            public int id { get; set; }
            public string name { get; set; }
        }

        public class JobCode
        {
            public string customercode { get; set; }
            public string jobcode { get; set; }
            public string jobstep { get; set; }
            public string jobstepid { get; set; }
            public string activitytype { get; set; }
            public string shortdescription { get; set; }
        }

        public class GridData
        {
            public double jobactid { get; set; }
            public string name { get; set; }
            public string starttime { get; set; }
            public string endtime { get; set; }
            public string jobstep { get; set; }
            public string activitytype { get; set; }
            public string jobcode { get; set; }
            public string hours { get; set; }
            public string quantity { get; set; }
            public string supervisor { get; set; }
            public string consumerid { get; set; }
        }

        public class EmployeeId
        {
            public string id { get; set; }
        }
    }


}