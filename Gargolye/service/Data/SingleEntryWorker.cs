using Anywhere.Data;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.Script.Serialization;

namespace Anywhere.service.Data
{
    public class SingleEntryWorker
    {
        DataGetter dg = new DataGetter();
        JavaScriptSerializer js = new JavaScriptSerializer();

        public ConsumerAndLocation[] getSelectedConsumerLocations(string token, string userId, string updaterId, string personId, string dateOfService, string locationId, string workCodeID, string startTime, string endTime, string checkHours, string consumerId, string transportationUnits, string transportationReimbursable, string numberOfConsumersPresent, string inComments, string odometerStart, string odometerEnd, string destination, string reason, string latitude, string longitude, string endLatitude, string endLongitude, string deviceType, string evvReason, string attest, string licensePlateNumber, string community)
        {
            
            List<string> consumerIdList = new List<string>();
            List<string> locationIdList = new List<string>();
            int consumerCount = 0;
            string locIdString = dg.getConsumerLocationForSingleEntry(token, dateOfService, consumerId);
            ConsumerAndLocation[] consumerAndLocations = js.Deserialize<ConsumerAndLocation[]>(locIdString);
            for (int i = 0; i < consumerAndLocations.GetLength(0); i++)
            {
                consumerIdList.Add(consumerAndLocations[i].consumerId.ToString());
                locationIdList.Add(consumerAndLocations[i].locationId.ToString());
            }

            //var duplicateConsumerLocations = consumerAndLocations
            //.GroupBy(x => x.consumerName) // items with same shorName are grouped to gether
            // .Where(x => x.Count() > 1) // filter groups where they have more than one memeber
            //.Select(x => x.Key) // select shortName from these groups
            //.ToList(); // convert it to a list

            if (consumerIdList.Count != consumerIdList.Distinct().Count())
            {
                //If there is more than one loction for any of the selected consumers, send the list of all selected consumers/locations for "location overlap processing"
                return consumerAndLocations;
            } else
            {
                // if no overlap locations for any consumers, send back an empty list of consumers/locations to indicate no "location overlap processing" required 
                ConsumerAndLocation[] emptyconsumerAndLocations = new ConsumerAndLocation[0];
                return emptyconsumerAndLocations;

            }
                
        }


            public ConsumerAndLocation[] preInsertSingleEntry(string token, string userId, string updaterId, string personId, string dateOfService, string locationId, string workCodeID, string startTime, string endTime, string checkHours, string consumerId, string transportationUnits, string transportationReimbursable, string numberOfConsumersPresent, string inComments, string odometerStart, string odometerEnd, string destination, string reason, string latitude, string longitude, string endLatitude, string endLongitude, string deviceType, string evvReason, string attest, string licensePlateNumber, string community)
        {
            List<string> consumerIdList = new List<string>();
            List<string> locationIdList = new List<string>();
            int consumerCount = 0;
            string locIdString = dg.getConsumerLocationForSingleEntry(token, dateOfService, consumerId);
            ConsumerAndLocation[] consumerAndLocation = js.Deserialize<ConsumerAndLocation[]>(locIdString);
            for (int i = 0; i < consumerAndLocation.GetLength(0); i++)
            {
                consumerIdList.Add(consumerAndLocation[i].consumerId.ToString());
                locationIdList.Add(consumerAndLocation[i].locationId.ToString());
            }
            if (consumerIdList.Count != consumerIdList.Distinct().Count())
            {
                //Retrun to front end to get rid of duplicate consumer records by having user check which location they want
                return consumerAndLocation;
            }
            else
            {
                string consumerIdString = "";
                List<string> locConList = new List<string>();
                int j = 0;
                foreach (string location in locationIdList.Distinct())
                {
                    for (int i = 0; i < consumerAndLocation.GetLength(0); i++)
                    {
                        if (consumerAndLocation[i].locationId.ToString().Equals(location))
                        {
                            locConList.Add(consumerAndLocation[i].consumerId.ToString());
                            consumerCount++;
                        }
                    }
                    numberOfConsumersPresent = consumerCount.ToString();
                    consumerIdString = string.Join(",", locConList);
                    consumerAndLocation[j].consumerId = consumerIdString;
                    //consumerAndLocation[j].singleEntryId =  dg.insertSingleEntry(token, userId, dateOfService, location, workCodeID, startTime, endTime, checkHours, consumerIdString, transportationUnits, transportationReimbursable, numberOfConsumersPresent, inComments, odometerStart, odometerEnd, destination, reason, latitude, longitude, endLatitude, endLongitude);
                    string singleEntryId = dg.insertSingleEntry(token, userId, updaterId, personId, dateOfService, location, workCodeID, startTime, endTime, checkHours, consumerIdString, transportationUnits, transportationReimbursable, numberOfConsumersPresent, inComments, odometerStart, odometerEnd, destination, reason, latitude, longitude, endLatitude, endLongitude, deviceType, evvReason, attest, licensePlateNumber, community);
                    singleEntryId = singleEntryId.Replace("<results><results><@singleEntryRecordID>", "");
                    singleEntryId = singleEntryId.Replace("</@singleEntryRecordID></results></results>", "");
                    consumerAndLocation[j].singleEntryId = singleEntryId;
                    locConList.Clear();
                    consumerCount = 0;
                    j++;
                }                //<results><results><@singleEntryRecordID>2881</@singleEntryRecordID></results></results>
            }
            //Null signifies success               
            return consumerAndLocation;
        }

        public class ConsumerAndLocation
        {
            public string consumerId { get; set; }
            public string locationId { get; set; }
            public string locationName { get; set; }
            public string consumerName { get; set; }
            public string singleEntryId { get; set; }
        }

        public string singleEntrySaveSignatureAndNote(string token, string singleEntryId, string consumerId, string note, string signatureImage)
        {
            return dg.singleEntrySaveSignatureAndNote(token, singleEntryId, consumerId, note, signatureImage);
        }

        public string insertConsumerforSavedSingleEntry(string token, string singleEntryId, string consumerId, string deviceType, string evvReason)
        {
            return dg.insertConsumerforSavedSingleEntry(token, singleEntryId, consumerId, deviceType, evvReason);
        }

        public SignatureAndNote[] getSpecificConsumerSignatureAndNote(string token, string singleEntryId, string consumerId)
        {
            string signatureAndNote = dg.getSpecificConsumerSignatureAndNote(token, singleEntryId, consumerId);
            SignatureAndNote[] signatureAndNoteObj = js.Deserialize<SignatureAndNote[]>(signatureAndNote);
            return signatureAndNoteObj;
        }

        public class SignatureAndNote
        {
            public string signature { get; set; }
            public string note { get; set; }
        }

        //Gets consumer signatures and notes
        public ConsumerSignaturesAndNotes[] getConsumersSignaturesAndNotes(string token, string singleEntryId)
        {
            string signaturesAndNotes = dg.getConsumersSignaturesAndNotes(token, singleEntryId);
            ConsumerSignaturesAndNotes[] signaturesAndNotesObj = js.Deserialize<ConsumerSignaturesAndNotes[]>(signaturesAndNotes);
            int count = 0;
            for (int i = 0; i < signaturesAndNotesObj.Length; i++)
            {
                if (signaturesAndNotesObj[i].signature != "")
                {
                    signaturesAndNotesObj[i].signature = "data:image/png;base64," + signaturesAndNotesObj[i].signature;
                }
                count++;
            }
            return signaturesAndNotesObj;
        }

        public class ConsumerSignaturesAndNotes
        {
            public string singleEntryId { get; set; }
            public string consumerId { get; set; }
            public string signature { get; set; }
            public string note { get; set; }
        }

        //Main employee drop down in admin
        public EmployeeListAndCountInfo[] getEmployeeListAndCountInfoJSON(string token, string supervisorId)
        {
            string empListAndCoutInfo = dg.getEmployeeListAndCountInfoJSON(token, supervisorId);
            EmployeeListAndCountInfo[] empListAndCoutInfoObj = js.Deserialize<EmployeeListAndCountInfo[]>(empListAndCoutInfo);
            return empListAndCoutInfoObj;
        }

        public class EmployeeListAndCountInfo
        {
            public string Person_ID { get; set; }
            public string first_name { get; set; }
            public string last_name { get; set; }
            public string user_id { get; set; }
        }

        //Sub employee dropdown in admin
        public SubEmployeeListAndCountInfo[] getSubEmployeeListAndCountInfoJSON(string token, string supervisorId)
        {
            string subEmpListAndCoutInfo = dg.getSubEmployeeListAndCountInfoJSON(token, supervisorId);
            SubEmployeeListAndCountInfo[] subEmpListAndCoutInfoObj = js.Deserialize<SubEmployeeListAndCountInfo[]>(subEmpListAndCoutInfo);
            return subEmpListAndCoutInfoObj;
        }

        public class SubEmployeeListAndCountInfo
        {
            public string Person_ID { get; set; }
            public string first_name { get; set; }
            public string last_name { get; set; }
            public string user_id { get; set; }
            public string Pending { get; set; }
            public string Approved { get; set; }
            public string Rejected { get; set; }
            public string Idontknow { get; set; }
            public string Submitted { get; set; }
        }

        //Gets pay periods. 
        public SingleEntryPayPeriods[] getSingleEntryPayPeriodsJSON(string token)
        {
            string singleEntryPayPeriodsString = dg.getSingleEntryPayPeriodsJSON(token);
            SingleEntryPayPeriods[] singleEntryPayPeriodsObj = js.Deserialize<SingleEntryPayPeriods[]>(singleEntryPayPeriodsString);
            return singleEntryPayPeriodsObj;
        }

        public class SingleEntryPayPeriods
        {
            public string startdate { get; set; }
            public string enddate { get; set; }
            public string anywhereclosed { get; set; }
            public string sendevvdata { get; set; }
        }

        //Gets required fields
        public RequiredSingleEntryFields[] getRequiredSingleEntryFieldsJSON(string token)
        {
            string requiredSingleEntryFieldsString = dg.getRequiredSingleEntryFieldsJSON(token);
            RequiredSingleEntryFields[] requiredSingleEntryFieldsObj = js.Deserialize<RequiredSingleEntryFields[]>(requiredSingleEntryFieldsString);
            return requiredSingleEntryFieldsObj;
        }

        //Gets SE work codes
        public WorkCodes[] getWorkCodesJSON(string token, string getAllWorkCodes)
        {
            if (getAllWorkCodes != "Y")
            {
                getAllWorkCodes = "N";
            }
            string workCodesString = dg.getWorkCodesJSON(token, getAllWorkCodes);
            WorkCodes[] workCodesObj = js.Deserialize<WorkCodes[]>(workCodesString);
            return workCodesObj;
        }

        public SingleEntryLocations[] getSingleEntryLocationsJSON(string token)
        {
            string seLocationsString = dg.getSingleEntryLocationsJSON(token);
            SingleEntryLocations[] seLocationsObj = js.Deserialize<SingleEntryLocations[]>(seLocationsString);
            return seLocationsObj;
        }

        public SingleEntryUsersByLocation[] getSingleEntryUsersByLocationJSON(string token, string locationId, string seDate)
        {
            string seUsersByLocationString = dg.getSingleEntryUsersByLocationJSON(token, locationId, seDate);
            SingleEntryUsersByLocation[] seUsersByLocationObj = js.Deserialize<SingleEntryUsersByLocation[]>(seUsersByLocationString);
            return seUsersByLocationObj;
        }

        public SingleEntryByDate[] getSingleEntryByDateJSON(string token, string userId, string startDate, string endDate, string locationId, string statusIn)
        {
            string seByDateString = dg.getSingleEntryByDateJSON(token, userId, startDate, endDate, locationId, statusIn);
            SingleEntryByDate[] seByDateObj = js.Deserialize<SingleEntryByDate[]>(seByDateString);
            return seByDateObj;
        }

        public SingleEntryById[] getSingleEntryByIdJSON(string token, string singleEntryId)
        {
            string seByIdString = dg.getSingleEntryByIdJSON(token, singleEntryId);
            SingleEntryById[] seByIdObj = js.Deserialize<SingleEntryById[]>(seByIdString);
            return seByIdObj;
        }

        public SEFilteredListResults[] singleEntryFilterAdminListJSON(string token, string startDate, string endDate, string supervisorId, string locationId, string employeeId, string status, string workCodeId)
        {
            string filteredListResultsString = dg.singleEntryFilterAdminListJSON(token, startDate, endDate, supervisorId, locationId, employeeId, status, workCodeId);
            SEFilteredListResults[] filteredListResultsObj = js.Deserialize<SEFilteredListResults[]>(filteredListResultsString);
            return filteredListResultsObj;
        }

        public AdminSELocations[] getAdminSingleEntryLocationsJSON(string token)
        {
            string adminSELocationsString = dg.getAdminSingleEntryLocationsJSON(token);
            AdminSELocations[] adminSELocationsObj = js.Deserialize<AdminSELocations[]>(adminSELocationsString);
            return adminSELocationsObj;
        }

        public SingleEntrySupervisors[] getSingleEntrySupervisorsJSON(string token)
        {
            string seSupervisorString = dg.getSingleEntrySupervisorsJSON(token);
            SingleEntrySupervisors[] seSupervisorObj = js.Deserialize<SingleEntrySupervisors[]>(seSupervisorString);
            return seSupervisorObj;
        }

        public SingleEntryUsersWC[] getSingleEntryUsersWCJSON(string token, string seDate)
        {
            string seUsersWCString = dg.getSingleEntryUsersWCJSON(token, seDate);
            SingleEntryUsersWC[] seUsersWCObj = js.Deserialize<SingleEntryUsersWC[]>(seUsersWCString);
            return seUsersWCObj;
        }

        public seOverlapCheck[] singleEntryOverlapCheckJSON(string token, string dateOfService, string startTime, string endTime, string singleEntryId)
        {
            string seOverlapCheckString = dg.singleEntryOverlapCheckJSON(token, dateOfService, startTime, endTime, singleEntryId);
            seOverlapCheck[] seOverlapCheckObj = js.Deserialize<seOverlapCheck[]>(seOverlapCheckString);
            return seOverlapCheckObj;
        }

        public SingleEntryConsumersPresent[] getSingleEntryConsumersPresentJSON(string token, string singleEntryId)
        {
            string consumersPresentString = dg.getSingleEntryConsumersPresentJSON(token, singleEntryId);
            SingleEntryConsumersPresent[] consumersPresentObj = js.Deserialize<SingleEntryConsumersPresent[]>(consumersPresentString);
            return consumersPresentObj;
        }

        public string adminUpdateSingleEntryStatus(string token, string singleEntryIdString, string newStatus, string userID, string rejectionReason)
        {
            // Update the AA_Single_Entry table
            dg.adminUpdateSingleEntryStatus(token, singleEntryIdString, newStatus, userID, rejectionReason);

            // If string has more than one id, the string will be split into an array containing each id
            string[] singleEntryIdArr = singleEntryIdString.Split(',');
            char newStatusRejected = 'R';

            // Looks for rejection status and sends out notification 
            if (newStatus == newStatusRejected.ToString())
            {
                foreach (var singleEntryId in singleEntryIdArr)
                {
                    try
                    {
                        // Converts the id into a double to be used in procedure
                        double singleEntryIdDouble = double.Parse(singleEntryId);
                        dg.timeEntryRejectionNotification(token, singleEntryId);
                    }
                    catch (Exception ex)
                    {
                        return "failed";
                    }
                }
            }
            return "success";
        }

        public SingleEntryEvvReasonCodes[] getSingleEntryEvvReasonCodesJSON(string token)
        {
            string evvReasonCodeString = dg.getSingleEntryEVVReasonCodeJSON(token);
            SingleEntryEvvReasonCodes[] evvReasonCodeObj = js.Deserialize<SingleEntryEvvReasonCodes[]>(evvReasonCodeString);
            return evvReasonCodeObj;
        }

        public class SingleEntryEvvReasonCodes
        {
            public string reasonCode { get; set; }
            public string reasonDescription { get; set; }
            public string stateID { get; set; }
        }

        public SingleEntryEvvEligibility[] getSingleEntryEvvEligibilityJSON(string token, string consumerId, string entryDate)
        {
            string evvEligibilityString = dg.getSingleEntryEvvEligibilityJSON(token, consumerId, entryDate);
            SingleEntryEvvEligibility[] evvEligibilityObj = js.Deserialize<SingleEntryEvvEligibility[]>(evvEligibilityString);
            return evvEligibilityObj;
        }

        public class SingleEntryEvvEligibility
        {
            public string startDate { get; set; }
            public string endDate { get; set; }
        }

        public LocationsAndResidences[] getLocationsAndResidencesJSON(string token)
        {
            string locationsAndResidencesString = dg.getLocationsAndResidencesJSON(token);
            LocationsAndResidences[] locationsAndResidencesObj = js.Deserialize<LocationsAndResidences[]>(locationsAndResidencesString);
            return locationsAndResidencesObj;
        }

        public SingleEntryById[] getExistingTimeEntry(string token)
        {
            string seByIdString = dg.getExistingTimeEntry(token);
            SingleEntryById[] seByIdObj = js.Deserialize<SingleEntryById[]>(seByIdString);
            return seByIdObj;
        }

        public class LocationsAndResidences
        {
            public string locationId { get; set; }
            public string residence { get; set; }
        }

        public class RequiredSingleEntryFields
        {
            public string destinationrequired { get; set; }
            public string noterequired { get; set; }
            public string odometerrequired { get; set; }
            public string reasonrequired { get; set; }
            public string supervisorapproval { get; set; }
            public string reconfigimportfile { get; set; }
            public string use5characterworkcode { get; set; }
            public string licenseplaterequired { get; set; }
        }

        public class WorkCodes
        {
            public string workcodeid { get; set; }
            public string workcodename { get; set; }
            public string billable { get; set; }
            public string keyTimes { get; set; }
            public string serviceType { get; set; }
        }

        public class SingleEntryLocations
        {
            public string ID { get; set; }
            public string Name { get; set; }
            public string Residence { get; set; }
            public string SE_Trans_Reimbursable { get; set; }
            public string Send_EVV_Data { get; set; }
        }

        public class SingleEntryUsersByLocation
        {
            public string consumer_id { get; set; }
        }

        public class SingleEntryByDate
        {
            public string Single_Entry_ID { get; set; }
            public string Anywhere_Status { get; set; }
            public string Date_of_Service { get; set; }
            public string Start_Time { get; set; }
            public string End_Time { get; set; }
            public string Check_Hours { get; set; }
            public string Location_ID { get; set; }
            public string Location_Name { get; set; }
            public string Comments { get; set; }
            public string Person_ID { get; set; }
            public string Work_Code_ID { get; set; }
            public string WCCode { get; set; }
            public string billable { get; set; }
            public string Work_Code_Name { get; set; }
            public string Transportation_Units { get; set; }
            public string Number_Consumers_Present { get; set; }
            public string destination { get; set; }
            public string approvedUser { get; set; }
            public string rejectedUser { get; set; }
            public string submittedUser { get; set; }
            public string approved_time { get; set; }
            public string submit_date { get; set; }
            public string rejected_time { get; set; }
        }

        public class SingleEntryById
        {
            public string Single_Entry_ID { get; set; }
            public string Person_ID { get; set; }
            public string Date_of_Service { get; set; }
            public string Location_ID { get; set; }
            public string Work_Code_ID { get; set; }
            public string Start_Time { get; set; }
            public string End_Time { get; set; }
            public string Check_Hours { get; set; }
            public string Notes { get; set; }
            public string User_ID { get; set; }
            public string Remote_Location { get; set; }
            public string Transportation_Units { get; set; }
            public string Transportation_reimbursable { get; set; }
            public string Number_Consumers_Present { get; set; }
            public string Anywhere_Status { get; set; }
            public string Comments { get; set; }
            public string Location_Name { get; set; }
            public string Work_Code_Name { get; set; }
            public string WCCode { get; set; }
            public string billable { get; set; }
            public string destination { get; set; }
            public string odometerend { get; set; }
            public string odometerstart { get; set; }
            public string reason { get; set; }
            public string keytimes { get; set; }
            public string attest { get; set; }
            public string licensePlateNumber { get; set; }
            public string community { get; set; }
            public string rejectionReason { get; set; }
            public string approvedUser { get; set; }
            public string rejectedUser { get; set; }
            public string submittedUser { get; set; }
            public string approved_time { get; set; }
            public string submit_date { get; set; }
            public string rejected_time { get; set; }
            public string supervisorId { get; set; }
        }

        public class SEFilteredListResults
        {
            public string Single_Entry_ID { get; set; }
            public string Date_of_Service { get; set; }
            public string start_time { get; set; }
            public string end_time { get; set; }
            public string check_hours { get; set; }
            public string Anywhere_status { get; set; }
            public string Number_Consumers_Present { get; set; }
            public string Last_Update { get; set; }
            public string transportation_units { get; set; }
            public string comments { get; set; }
            public string approved_time { get; set; }
            public string submit_date { get; set; }
            public string rejected_time { get; set; }
            public string Location_Name { get; set; }
            public string WCCode { get; set; }
            public string workCodeId { get; set; }
            public string firstname { get; set; }
            public string lastname { get; set; }
            public string userId { get; set; }
            public string peopleId { get; set; }
            public string latitude { get; set; }
            public string longitude { get; set; }
            public string approvedUser { get; set; }
            public string rejectedUser { get; set; }
            public string submittedUser { get; set; }
            public string keyTimes { get; set; }
        }

        public class AdminSELocations
        {
            public string locationID { get; set; }
            public string shortDescription { get; set; }
        }

        public class SingleEntrySupervisors
        {
            public string person_id { get; set; }
            public string first_name { get; set; }
            public string last_name { get; set; }
        }

        public class SingleEntryUsersWC
        {
            public string consumer_id { get; set; }
        }

        public class seOverlapCheck
        {
            public string single_entry_id { get; set; }
        }

        public class SingleEntryConsumersPresent
        {
            public string consumerid { get; set; }
            public string consumername { get; set; }
            public string evvReasonCode { get; set; }
            public string hasSignature { get; set; }
            public string hasNote { get; set; }
        }
    }

}


