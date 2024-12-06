using Anywhere.Data;
using System.ServiceModel.Web;
using System;
using System.Web.Script.Serialization;
using static Anywhere.service.Data.Employment.EmploymentWorker;

namespace Anywhere.service.Data
{
    public class DashboardWorker
    {
        DataGetter dg = new DataGetter();
        JavaScriptSerializer js = new JavaScriptSerializer();
        TimeClocktoTimeEntryWorker tcW = new TimeClocktoTimeEntryWorker();

        public DashDSLocations[] getDashboardDayServicesLocationsJSON(string token)
        {
            string locationsString = dg.getDashboardDayServicesLocationsJSON(token);
            DashDSLocations[] locationsObj = js.Deserialize<DashDSLocations[]>(locationsString);
            return locationsObj;
        }

        public SingleEntryCountObj[] getSingleEntryCountInfoJSON(string token)
        {
            string singleEntryCountString = dg.getSingleEntryCountInfoJSON(token);
            SingleEntryCountObj[] singleEntryCountObj = js.Deserialize<SingleEntryCountObj[]>(singleEntryCountString);
            return singleEntryCountObj;
        }

        public MissingPlanSignaturesObj[] getMissingPlanSignatures(string token)
        {
            string missingSignaturesString = dg.getMissingPlanSignatures(token);
            MissingPlanSignaturesObj[] missingSignaturesObj = js.Deserialize<MissingPlanSignaturesObj[]>(missingSignaturesString);
            return missingSignaturesObj;
        }

        public AdminApprovalNumbersObj[] getSingleEntryAdminApprovalNumbersJSON(string token)
        {
            string singleEntryAdminApprovalNumbersString = dg.getSingleEntryAdminApprovalNumbersJSON(token);
            AdminApprovalNumbersObj[] singleEntryAdminApprovalNumbersObj = js.Deserialize<AdminApprovalNumbersObj[]>(singleEntryAdminApprovalNumbersString);
            return singleEntryAdminApprovalNumbersObj;
        }

        public SingleEntryLocationObj[] getSingleEntryAdminLocations(string token)
        {
            string singleEntryAdminLocationsString = dg.getSingleEntryAdminLocations(token);
            SingleEntryLocationObj[] singleEntryAdminLocations = js.Deserialize<SingleEntryLocationObj[]>(singleEntryAdminLocationsString);
            return singleEntryAdminLocations;
        }

        public StaffActivityObj[] getStaffActivityJSON(string token, string serviceDate)
        {
            string staffActivityString = dg.getStaffActivityJSON(token, serviceDate);
            StaffActivityObj[] staffActivityObj = js.Deserialize<StaffActivityObj[]>(staffActivityString);
            return staffActivityObj;
        }

        public DSClockedInConsumers[] getClockedInConsumerNamesDayServicesJSON(string token, string serviceDate)
        {
            string clockedInConsumerNameString = dg.getClockedInConsumerNamesDayServicesJSON(token, serviceDate);
            DSClockedInConsumers[] clockedInConsumerNameObj = js.Deserialize<DSClockedInConsumers[]>(clockedInConsumerNameString);
            return clockedInConsumerNameObj;
        }

        public DSClockedInStaff[] getClockedInStaffNamesDayServicesJSON(string token, string serviceDate)
        {
            string clockedInStaffNameString = dg.getClockedInStaffNamesDayServicesJSON(token, serviceDate);
            DSClockedInStaff[] clockedInStaffNameObj = js.Deserialize<DSClockedInStaff[]>(clockedInStaffNameString);
            return clockedInStaffNameObj;
        }

        public SystemMessagesAndCustomLinks[] getSystemMessagesAndCustomLinksJSON(string token)
        {
            string sysMesAndCustLinkString = dg.getSystemMessagesAndCustomLinksJSON(token);
            SystemMessagesAndCustomLinks[] sysMesAndCustLinkObj = js.Deserialize<SystemMessagesAndCustomLinks[]>(sysMesAndCustLinkString);
            return sysMesAndCustLinkObj;
        }

        public ProductivityWidget[] getDashboardCaseNoteProductivity(string token, string daysBack)
        {
            string cnProdWidgetString = dg.getDashboardCaseNoteProductivity(token, daysBack);
            ProductivityWidget[] cnProdWidgetObj = js.Deserialize<ProductivityWidget[]>(cnProdWidgetString);
            return cnProdWidgetObj;
        }

        public RejectedWidget[] getDashboardCaseNotesRejected(string token, string daysBack)
        {
            string cnRejectWidgetString = dg.getDashboardCaseNotesRejected(token, daysBack);
            RejectedWidget[] cnRejectWidgetObj = js.Deserialize<RejectedWidget[]>(cnRejectWidgetString);
            return cnRejectWidgetObj;
        }

        public RejectedWidget[] getDashboardGroupCaseNoteConsumerNames(string token, string groupNoteIds)
        {
            string cnGroupCaseNotesString = dg.getDashboardGroupCaseNoteConsumerNames(token, groupNoteIds);
            RejectedWidget[] cnGroupCaseNotesObj = js.Deserialize<RejectedWidget[]>(cnGroupCaseNotesString);
            return cnGroupCaseNotesObj;
        }

        public UserWidgetSettings[] getUserWidgetSettings(string token)
        {
            string userWidgetString = dg.getUserWidgetSettings(token);
            UserWidgetSettings[] userWidgetObj = js.Deserialize<UserWidgetSettings[]>(userWidgetString);
            return userWidgetObj;
        }

        public string updateUserWidgetSettings(string token, string widgetId, string showHide, string widgetConfig)
        {
            return dg.updateUserWidgetSettings(token, widgetId, showHide, widgetConfig);
        }

        public string clockInStaff(string token, string locationId, string createTimeEntries)
        {
            string response = dg.clockInStaff(token, locationId);
            if (response.IndexOf("setTime") != -1)
            {
                tcW.dataSetUp(response, "clockIn", locationId);
                response = "<results></results>";
            }
            return response;// dg.clockInStaff(token, locationId);
        }

        public string clockOutStaff(string token)
        {
            string response = dg.clockOutStaff(token);
            if (response.IndexOf("setTime") != -1)
            {
                tcW.dataSetUp(response, "clockOut", "");
                response = "<results></results>";
            }
            return response;
        }

        public string updateUserWidgetOrderSettings(string token, string[] updatedListOrder)
        {
            int orderCount = 1;
            foreach (string listName in updatedListOrder)
            {
                string nameOfTab = listName;
                if (listName == "Case Note Productivity")
                    nameOfTab = "Case_Note_Productivity";
                if (listName == "My Case Load")
                    nameOfTab = "Case Load Widget";

                dg.updateUserWidgetOrderSettings(token, nameOfTab, orderCount.ToString());
                orderCount++;
            }
            return "true";
        }

        public Employer[] getEmployeeList(string token)
        {

            try
            {
                Employer[] employers = js.Deserialize<Employer[]>(dg.getEmployeeList(token));               
                return employers;
            }
            catch (Exception ex)
            {
                throw new WebFaultException<string>(ex.Message, System.Net.HttpStatusCode.BadRequest);
            }

        }

        public SystemNotes[] addSystemMessage(string token, string textMessage, string timeOfExpiration, string dateOfExpiration, string[] selectedEmployee)
        {
            var expirationDate = DateTime.Parse(dateOfExpiration);
            var expirationTime = TimeSpan.Parse(timeOfExpiration);
            var mergeDateTime = expirationDate + expirationTime; 
            string expiration= mergeDateTime.ToString("yyyy-MM-dd HH:mm");  

            string noteId = dg.insertSystemNotes(token, textMessage, expiration);
            SystemNotes[] systemNotesObj = js.Deserialize<SystemNotes[]>(noteId);

            foreach (string employeeId in selectedEmployee)
            {
                dg.insertSystemNoteSharing(token, systemNotesObj[0].NoteID, employeeId);
            }
            return systemNotesObj;
        }

        public class UserWidgetSettings
        {
            public string widgetId { get; set; }
            public string widgetConfig { get; set; }
            public string showHide { get; set; }
            public string widgetName { get; set; }
            public string widgetOrder { get; set; }
        }

        public class ProductivityWidget
        {
            public string Service_Date { get; set; }
            public string Original_Update { get; set; }
            public string diffMinutes { get; set; }
            public string Travel_Time { get; set; }
            public string Total_Doc_Time { get; set; }
            public string Case_Note_Group_ID { get; set; }
        }


        public class RejectedWidget
        {
            public string Case_Note_ID { get; set; }
            public string ID { get; set; }
            public string Case_Note_Group_ID { get; set; }
            public string first_Name { get; set; }
            public string Last_Name { get; set; }
            public string Service_Date { get; set; }
            public string Service_Code { get; set; }
            public string Start_Time { get; set; }
            public string End_Time { get; set; }
            public string Last_Update { get; set; }
        }

        public class DashDSLocations
        {
            public string ID { get; set; }
            public string Name { get; set; }
            public string Residence { get; set; }
        }

        public class SingleEntryCountObj
        {
            public string startdate { get; set; }
            public string enddate { get; set; }
            public string Anywhere_Status { get; set; }
        }

        public class MissingPlanSignaturesObj
        {
            public string individual { get; set; }
            public string planYearStart { get; set; }
            public string planType { get; set; }
            public string planID { get; set; }
            public string planStatus { get; set; }
            public string revisionNumber { get; set; }
            public string planYearEnd { get; set; }
            public string effectiveStart { get; set; }
            public string effectiveEnd { get; set; }
            public string reviewDate { get; set; }
            public string consumerId { get; set; }
            public string firstName { get; set; }
            public string lastName { get; set; }
            public string locationId { get; set; }
            public string activeStatus { get; set; }
            public string groupId { get; set; }
        }

        public class SingleEntryLocationObj
        {
            public string locationId { get; set; }
            public string description { get; set; }
        }

        public class AdminApprovalNumbersObj
        {
            public string startdate { get; set; }
            public string enddate { get; set; }
            public string Anywhere_Status { get; set; }
            public string userId { get; set; }
            public string first_name { get; set; }
            public string last_name { get; set; }
            public string People_ID { get; set; }
            public string Location_ID { get; set; }
        }

        public class StaffActivityObj
        {
            public string Staff_ID { get; set; }
            public string Service_Date { get; set; }
            public string Location_ID { get; set; }
            public string Start_Time { get; set; }
            public string Stop_Time { get; set; }
            public string Description { get; set; }
            public string location_code { get; set; }
        }

        public class DSClockedInConsumers
        {
            public string clockedinconsumername { get; set; }
        }

        public class DSClockedInStaff
        {
            public string staffclockedinname { get; set; }
        }

        public class SystemMessagesAndCustomLinks
        {
            public string description { get; set; }
            public string linkname { get; set; }
            public string linkaddress { get; set; }
            public string linktarget { get; set; }
        }

        public class SystemNotes
        {
            public string NoteID { get; set; }
        }

    }

}