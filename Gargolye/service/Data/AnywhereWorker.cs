using Anywhere.Data;
using Anywhere.service.Data.PlanInformedConsent;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Runtime.InteropServices.ComTypes;
using System.Security.Cryptography;
using System.Text;
using System.Web.Script.Serialization;
using static Anywhere.service.Data.IncidentTrackingWorker;
using static Anywhere.service.Data.PlanSignature.PlanSignatureWorker;
using System.Data;
using System.Data.SqlClient;
using System.Text;
using Anywhere.Log;
using PSIOISP;
using System.Text.RegularExpressions;
using Anywhere.service.Data.PlanSignature;
using System.Linq;
using System.Data.Odbc;
using System.Configuration;
using static Anywhere.service.Data.WaitingListAssessment.WaitingListWorker;

namespace Anywhere.service.Data
{
    public class AnywhereWorker
    {
        DataGetter dg = new DataGetter();
        JavaScriptSerializer js = new JavaScriptSerializer();
        AnywhereAuthenticator aAuth = new AnywhereAuthenticator();
        AuthenticationDataGetter aDG = new AuthenticationDataGetter();

        //Below code is for hours worked widget
        public WorkWeek GetWorkWeeks(String token)
        {
            StartAndEndWeek startAndEnd = GetCompanyCurrentWorkWeekStart(token, 'N');
            StartAndEndWeek startAndEndPrevious = GetCompanyCurrentWorkWeekStart(token, 'Y');
            
            double daysOfPayPeriod = (startAndEnd.endOfWeek - startAndEnd.startOfWeek).TotalDays;
            string currWS = "";
            string currWE = "";
            string prevWS = "";
            string prevWE = "";
            DateTime previousWeekStart;
            DateTime previousWeekEnd;
            if (daysOfPayPeriod > 2)
            {
                DateTime currentWeekStart = startAndEnd.startOfWeek;
                DateTime currentWeekEnd = startAndEnd.endOfWeek;
                if (startAndEndPrevious is null)
                {
                    previousWeekStart = DateTime.Parse("1900-01-01");
                    previousWeekEnd = DateTime.Parse("1900-01-01");
                }else{
                    previousWeekStart = startAndEndPrevious.startOfWeek;
                    previousWeekEnd = startAndEndPrevious.endOfWeek;
                }
                
                currWS = currentWeekStart.ToString("yyyy-MM-dd");
                currWE = currentWeekEnd.ToString("yyyy-MM-dd");
                prevWS = previousWeekStart.ToString("yyyy-MM-dd");
                prevWE = previousWeekEnd.ToString("yyyy-MM-dd");
            }
            else
            {
                DateTime currentWeekStart = startAndEnd.startOfWeek;
                DateTime currentWeekEnd = currentWeekStart.AddDays(6);
                previousWeekStart = currentWeekStart.AddDays(-7);
                previousWeekEnd = currentWeekStart.AddDays(-1);
                currWS = currentWeekStart.ToString("yyyy-MM-dd");
                currWE = currentWeekEnd.ToString("yyyy-MM-dd");
                prevWS = previousWeekStart.ToString("yyyy-MM-dd");
                prevWE = previousWeekEnd.ToString("yyyy-MM-dd");
            }
            WorkWeek workWeek = new WorkWeek();
            workWeek.curr_start_date = currWS;
            workWeek.curr_end_date = currWE;
            if(prevWS != "1900-01-01")
            {
                workWeek.prev_start_date = prevWS;
                workWeek.prev_end_date = prevWE;
            }            

            return workWeek;
        }
        public DaysAndHours[] GetDatesAndHoursWorked(String token)
        {
            StartAndEndWeek startAndEnd = GetCompanyCurrentWorkWeekStart(token, 'N');
            StartAndEndWeek startAndEndPrevious = GetCompanyCurrentWorkWeekStart(token, 'Y');

            

            double daysOfPayPeriod = (startAndEnd.endOfWeek - startAndEnd.startOfWeek).TotalDays;
            string currWS = "";
            string currWE = "";
            string prevWS = "";
            string prevWE = "";
            DateTime previousWeekStart;
            DateTime previousWeekEnd;

            if (daysOfPayPeriod > 1)
            {
                DateTime currentWeekStart = startAndEnd.startOfWeek;
                DateTime currentWeekEnd = startAndEnd.endOfWeek;
                if (startAndEndPrevious is null)
                {
                    previousWeekStart = DateTime.Parse("1900-01-01");
                    previousWeekEnd = DateTime.Parse("1900-01-01");
                }
                else
                {
                    previousWeekStart = startAndEndPrevious.startOfWeek;
                    previousWeekEnd = startAndEndPrevious.endOfWeek;
                }
                
                currWS = currentWeekStart.ToString("yyyy-MM-dd");
                currWE = currentWeekEnd.ToString("yyyy-MM-dd");
                prevWS = previousWeekStart.ToString("yyyy-MM-dd");
                prevWE = previousWeekEnd.ToString("yyyy-MM-dd");
                string currentWeekHoursWorkedString = dg.getWeekHoursWorked(token, currWS, currWE, prevWS, prevWE);
                DaysAndHours[] daysAndHours = js.Deserialize<DaysAndHours[]>(currentWeekHoursWorkedString);
                return daysAndHours;
            }
            else
            {
                DateTime currentWeekStart = startAndEnd.startOfWeek;
                DateTime currentWeekEnd = currentWeekStart.AddDays(6);
                previousWeekStart = currentWeekStart.AddDays(-7);
                previousWeekEnd = currentWeekStart.AddDays(-1);
                currWS = currentWeekStart.ToString("yyyy-MM-dd");
                currWE = currentWeekEnd.ToString("yyyy-MM-dd");
                prevWS = previousWeekStart.ToString("yyyy-MM-dd");
                prevWE = previousWeekEnd.ToString("yyyy-MM-dd");
                string currentWeekHoursWorkedString = dg.getWeekHoursWorked(token, currWS, currWE, prevWS, prevWE);
                DaysAndHours[] daysAndHours = js.Deserialize<DaysAndHours[]>(currentWeekHoursWorkedString);
                return daysAndHours;
            }
            
        }
        //todaysDate = dateTime.ToString("yyyy/MM/dd");
        public StartAndEndWeek GetCompanyCurrentWorkWeekStart(String token, char weekTwo)
        {
            string companyWorkWeekStart = dg.getCompanyWorkWeekStartFromDB(token, weekTwo);
            string companyWorkWeekEnd = dg.getCompanyWorkWeekEndFromDB(token, weekTwo);
            StartDayOfWeek[] startDay = js.Deserialize<StartDayOfWeek[]>(companyWorkWeekStart);
            EndDayOfWeek[] endDay = js.Deserialize<EndDayOfWeek[]>(companyWorkWeekEnd);
            if(startDay.Length != 0)
            {
                if (startDay[0].Day_of_Week.Length > 3)
                {
                    DateTime weekStart = DateTime.Parse(startDay[0].Day_of_Week.ToString());
                    DateTime weekEnd = DateTime.Parse(endDay[0].Day_of_Week.ToString());
                    StartAndEndWeek startAndEnd = new StartAndEndWeek();
                    startAndEnd.startOfWeek = weekStart;
                    startAndEnd.endOfWeek = weekEnd;
                    return startAndEnd;
                }
                else
                {
                    //string workWeekStart = startDay[0].Day_of_Week.ToString();
                    string workWeekStart = startDay.Length != 0 ? startDay[0].Day_of_Week.ToString() : "S";
                    int ded = DayOfWeekDeductionJD(DateTime.Today.Date, workWeekStart);
                    DateTime weekStart = DateTime.Today.AddDays(-ded);
                    StartAndEndWeek startAndEnd = new StartAndEndWeek();
                    startAndEnd.startOfWeek = weekStart;
                    startAndEnd.endOfWeek = weekStart;
                    return startAndEnd;
                }
            }
            return null;
        }

        public int DayOfWeekDeductionJD(DateTime date, string workWeekShort)
        {
            int deduction = 0;
            Dictionary<string, string> workWeekShortToDay = new Dictionary<string, string>();
            workWeekShortToDay.Add("S", "Sunday");
            workWeekShortToDay.Add("M", "Monday");
            workWeekShortToDay.Add("T", "Tuesday");
            workWeekShortToDay.Add("W", "Wednesday");
            workWeekShortToDay.Add("R", "Thursday");
            workWeekShortToDay.Add("F", "Friday");
            workWeekShortToDay.Add("A", "Saturday");
            string workWeekStart = workWeekShortToDay[workWeekShort];
            while (date.DayOfWeek.ToString() != workWeekStart)
            {
                deduction++;
                date = date.AddDays(-1);
            }
            return deduction;
        }

        public string changeFromPSI(string token, string userID)
        {
            string info = "";
            string stringDetail = "";
            info = dg.getUserInfo(token, userID);
            Credential[] detail = js.Deserialize<Credential[]>(info);
            stringDetail = detail[0].Password.ToString();
            stringDetail = MD5Hash(detail[0].Password.ToString());
            return dg.getLogIn(userID, stringDetail);
        }

        public static string CreateMD5(string input)
        {
            // Use input string to calculate MD5 hash
            using (System.Security.Cryptography.MD5 md5 = System.Security.Cryptography.MD5.Create())
            {
                //byte[] inputBytes = System.Text.Encoding.ASCII.GetBytes(input);
                //byte[] hashBytes = md5.ComputeHash(inputBytes);

                byte[] textToHash = Encoding.Default.GetBytes(input);
                byte[] hashBytes = md5.ComputeHash(textToHash);

                return System.BitConverter.ToString(hashBytes);

                //// Convert the byte array to hexadecimal string
                //StringBuilder sb = new StringBuilder();
                //for (int i = 0; i < hashBytes.Length; i++)
                //{
                //    sb.Append(hashBytes[i].ToString("X2"));
                //}
                //return sb.ToString();
            }
        }

        public static string MD5Hash(string text)
        {
            MD5 md5 = new MD5CryptoServiceProvider();

            //compute hash from the bytes of text
            md5.ComputeHash(ASCIIEncoding.ASCII.GetBytes(text));

            //get hash result after compute it
            byte[] result = md5.Hash;

            StringBuilder strBuilder = new StringBuilder();
            for (int i = 0; i < result.Length; i++)
            {
                //change it into 2 hexadecimal digits
                //for each byte
                strBuilder.Append(result[i].ToString("x2"));
            }

            return strBuilder.ToString();
        }

        //public UserPermissions[] getUserPermissions(string token)
        //{
        //    string permissionString = dg.getUserPermissions(token);
        //    UserPermissions[] dropdownObj = js.Deserialize<UserPermissions[]>(permissionString);
        //    return dropdownObj;
        //}

        public class UserPermissions
        {
            public string window_name { get; set; }
            public string permission { get; set; }
            public string special_data { get; set; }
        }

        public bool ValidateToken(string token)
        {
            return dg.validateToken(token);
        }

        public PermissionObject[] getUserPermissions(string token)
        {
            string permissionString = dg.getUserPermissions(token);
            PermissionObject[] permissionObj = js.Deserialize<PermissionObject[]>(permissionString);
            return permissionObj;
        }

        public class PermissionObject
        {
            public string window_name { get; set; }
            public string permission { get; set; }
            public string special_data { get; set; }
        }

        public class StartAndEndWeek
        {
            public DateTime startOfWeek { get; set; }
            public DateTime endOfWeek { get; set; }
        }

        public class StartDayOfWeek
        {
            public string Day_of_Week { get; set; }
        }

        public class EndDayOfWeek
        {
            public string Day_of_Week { get; set; }
        }

        public class DaysAndHours
        {
            public string check_hours { get; set; }
            public string location { get; set; }
            public string hours { get; set; }
            public string workdate { get; set; }
            public string week { get; set; }
        }

        public class WorkWeek
        {
            public string curr_start_date { get; set; }
            public string curr_end_date { get; set; }
            public string prev_start_date { get; set; }
            public string prev_end_date { get; set; }
        }

        //Scheduling Widget Code
        public SchedulingPeriods[] GetSchedulingPeriods(string token)
        {
            string schedulingPeriodsString = dg.getSchedulingPeriods(token);
            SchedulingPeriods[] schedulingPeriods = js.Deserialize<SchedulingPeriods[]>(schedulingPeriodsString);
            return schedulingPeriods;
        }

        public SchedulingData[] getSchedulingPeriodsDetails(string token, string startDate, string endDate)
        {
            string schedulePerodDataString = dg.getSchedulingPeriodsDetails(token, startDate, endDate);
            SchedulingData[] SchedulingData = js.Deserialize<SchedulingData[]>(schedulePerodDataString);
            return SchedulingData;
        }

        public EmployeeDropdown[] getEmployeeDropdown(string token, string locationId, string region, int maxWeeklyHours, string shiftStartTime, string shiftEndTime, int minTimeBetweenShifts, int includeTrainedOnly)
        {
            js.MaxJsonLength = Int32.MaxValue;
            string empDropdown = dg.getEmployeeDropdown(token, locationId, region, maxWeeklyHours, shiftStartTime, shiftEndTime, minTimeBetweenShifts, includeTrainedOnly);
            EmployeeDropdown[] empDropdownObj = js.Deserialize<EmployeeDropdown[]>(empDropdown);
            return empDropdownObj;
        }

        public class EmployeeDropdown
        {
            public string Person_ID { get; set; }
            public string EmployeeName { get; set; }
        }

        public class SchedulingPeriods
        {
            public string start_date { get; set; }
            public string end_date { get; set; }
            public string is_curr_date { get; set; }
        }

        public class SchedulingData
        {
            public string start_time { get; set; }
            public string end_time { get; set; }
            public string difftime { get; set; }
            public string location { get; set; }
            public string initials { get; set; }
            public string service_date { get; set; }
        }

        public class Credential
        {
            public string Password { get; set; }
        }

        public Location[] getConsumerScheduleLocation(string token, string consumerId)
        {
            string conSchedLocations = dg.getConsumerScheduleLocation(token, consumerId);
            Location[] locations = js.Deserialize<Location[]>(conSchedLocations);
            return locations;
        }

        public class Location
        {
            public int id { get; set; }
            public string name { get; set; }
        }

        public ConsumerSchedule[] populateConsumerSchedule(string token, string locationId, string consumerId)
        {
            string conSchedule = dg.populateConsumerSchedule(token, locationId, consumerId);
            ConsumerSchedule[] schedule = js.Deserialize<ConsumerSchedule[]>(conSchedule);
            return schedule;//test
        }

        public class ConsumerSchedule
        {
            public string SunStart { get; set; }
            public string SunEnd { get; set; }
            public string MonStart { get; set; }
            public string MonEnd { get; set; }
            public string TuesStart { get; set; }
            public string TuesEnd { get; set; }
            public string WedStart { get; set; }
            public string WedEnd { get; set; }
            public string ThurStart { get; set; }
            public string ThurEnd { get; set; }
            public string FriStart { get; set; }
            public string FriEnd { get; set; }
            public string SatStart { get; set; }
            public string SatEnd { get; set; }

            public string SunStart2 { get; set; }
            public string SunEnd2 { get; set; }
            public string MonStart2 { get; set; }
            public string MonEnd2 { get; set; }
            public string TuesStart2 { get; set; }
            public string TuesEnd2 { get; set; }
            public string WedStart2 { get; set; }
            public string WedEnd2 { get; set; }
            public string ThurStart2 { get; set; }
            public string ThurEnd2 { get; set; }
            public string FriStart2 { get; set; }
            public string FriEnd2 { get; set; }
            public string SatStart2 { get; set; }
            public string SatEnd2 { get; set; }
        }

        public RemainingServiceWidgetData[] remainingServicesWidgetFilter(string token, string outcomeType, string locationId, string group, string checkDate)
        {
            string widgetDataString = dg.remainingServicesWidgetFilter(token, outcomeType, locationId, group, checkDate);
            RemainingServiceWidgetData[] widgetData = js.Deserialize<RemainingServiceWidgetData[]>(widgetDataString);
            return widgetData;//test
        }

        public class RemainingServiceWidgetData
        {
            public string ID { get; set; }
            public string oid { get; set; }
            public string first_name { get; set; }
            public string last_name { get; set; }
        }

        public OutcomeTypesRemainingServiceWidgetData[] populateOutcomeTypesRemainingServicesWidgetFilter(string token)
        {
            string outcomeTypeForFilter = dg.populateOutcomeTypesRemainingServicesWidgetFilter(token);
            OutcomeTypesRemainingServiceWidgetData[] widgetData = js.Deserialize<OutcomeTypesRemainingServiceWidgetData[]>(outcomeTypeForFilter);
            return widgetData;//test
        }

        public class OutcomeTypesRemainingServiceWidgetData
        {
            public string Description { get; set; }
            public string Id { get; set; }
        }

        public LocationsRemainingServiceWidgetData[] populateLocationsRemainingServicesWidgetFilter(string token)
        {
            string locationsForFilter = dg.populateLocationsRemainingServicesWidgetFilter(token);
            LocationsRemainingServiceWidgetData[] widgetData = js.Deserialize<LocationsRemainingServiceWidgetData[]>(locationsForFilter);
            return widgetData;//test
        }

        public class LocationsRemainingServiceWidgetData
        {
            public string ID { get; set; }
            public string Name { get; set; }
            public string Residence { get; set; }
        }

        public GroupsRemainingServiceWidgetData[] populateGroupsRemainingServicesWidgetFilter(string token, string locationId)
        {
            string groupsForFilter = dg.populateGroupsRemainingServicesWidgetFilter(token, locationId);
            GroupsRemainingServiceWidgetData[] widgetData = js.Deserialize<GroupsRemainingServiceWidgetData[]>(groupsForFilter);
            return widgetData;//test
        }

        public class GroupsRemainingServiceWidgetData
        {
            public string RetrieveID { get; set; }
            public string GroupCode { get; set; }
            public string GroupName { get; set; }
            public string Members { get; set; }
        }

        //public ConsumerTableLocation[] getConsumerTableConsumerLocation(string token, string consumerId)
        //{
        //    string consumerLocationString = dg.getConsumerTableConsumerLocation(token, consumerId);
        //    ConsumerTableLocation[] consumerLocation = js.Deserialize<ConsumerTableLocation[]>(consumerLocationString);
        //    return consumerLocation;//test
        //}
        //public class ConsumerTableLocation
        //{
        //    public string locationId { get; set; }
        //    public string description { get; set; }
        //}

        public ConsumersByGroup[] getConsumersByGroupJSON(string groupCode, string retrieveId, string token, string serviceDate, string daysBackDate, string isActive)
        {
            string consumersByGroupString = dg.getConsumersByGroupJSON(groupCode, retrieveId, token, serviceDate, daysBackDate, isActive);
            js.MaxJsonLength = Int32.MaxValue;
            ConsumersByGroup[] consumersByGroupObj = js.Deserialize<ConsumersByGroup[]>(consumersByGroupString);
            return consumersByGroupObj;
        }

        public class ConsumersByGroup
        {
            public string id { get; set; }
            public string FN { get; set; }
            public string LN { get; set; }
            public string dob { get; set; }
            public string LId { get; set; }
            public string IDa { get; set; }
            public string SD { get; set; }
            public string conL { get; set; }
            public string MN { get; set; }
            public string residentNumber { get; set; }
            public string statusCode { get; set; }
            public string SalesforceID { get; set; }
        }

        public RosterLocations[] getLocationsJSON(string token)
        {
            string locationsString = dg.getLocationsJSON(token);
            RosterLocations[] locationsObj = js.Deserialize<RosterLocations[]>(locationsString);
            return locationsObj;
        }

        public class RosterLocations
        {
            public string ID { get; set; }
            public string Name { get; set; }
            public string Residence { get; set; }
        }

        public DefaultSettings[] getDefaultAnywhereSettingsJSON(string token)
        {
            string defaultSettingssString = dg.getDefaultAnywhereSettingsJSON(token);
            DefaultSettings[] defaultSettingsObj = js.Deserialize<DefaultSettings[]>(defaultSettingssString);
            return defaultSettingsObj;
        }

        public class DefaultSettings
        {
            public string setting_value { get; set; }
            public string notes_days_back { get; set; }
            public string checklist_days_back { get; set; }
            public string minutesToTimeout { get; set; }
            public string useAbsentFeature { get; set; }
            public string useProgressNotes { get; set; }
            public string removeGoalsWidget { get; set; }
            public string application { get; set; }
            public string portraitPath { get; set; }
            public string anywhereMainPermission { get; set; }
            public string outcomesPermission { get; set; }
            public string dayServicesPermission { get; set; }
            public string caseNotesPermission { get; set; }
            public string singleEntryPermission { get; set; }
            public string covidPermission { get; set; }
            public string transportationPermission { get; set; }
            public string emarPermission { get; set; }
            public string formsPermission { get; set; }
            public string OODPermission { get; set; }
            public string resetPassword { get; set; }
            public string workshopPermission { get; set; }
            public string anywhereSchedulingPermission { get; set; }
            public string anywherePlanPermission { get; set; }
            public string intellivuePermission { get; set; }
            public string webPermission { get; set; }
            public string defaultrosterlocation { get; set; }
            public string defaultrosterlocationname { get; set; }
            public string defaultrostergroup { get; set; }
            public string defaultrostergroupname { get; set; }
            public string showConsumerSignature { get; set; }
            public string showConsumerNote { get; set; }
            public string seShowTransportation { get; set; }
            public string defaultdayservicelocation { get; set; }
            public string defaultdayservicelocationname { get; set; }
            public string defaulttimeclocklocation { get; set; }
            public string defaulttimeclocklocationName { get; set; }
            public string defaultworkshoplocation { get; set; }
            public string defaultworkshoplocationname { get; set; }
            public string administrator { get; set; }
            public string incidentTracking_days_back { get; set; }
            public string removeSEAdminMap { get; set; }
            public string incidentTrackingPermission { get; set; }
            public string incidentTrackingPopulateIncidentTime { get; set; }
            public string incidentTrackingPopulateIncidentDate { get; set; }
            public string incidentTrackingPopulateReportedTime { get; set; }
            public string incidentTrackingPopulateReportedDate { get; set; }
            public string incidentTrackingShowCauseAndContributingFactors { get; set; }
            public string incidentTrackingShowPreventionPlan { get; set; }
            public string schedulingPermission { get; set; }
            public string singleEntryApproveEnabled { get; set; }
            public string seShowConsumerSignature { get; set; }
            public string seShowConsumerNote { get; set; }
            public string isASupervisor { get; set; }
            public string singleEntryLocationRequired { get; set; }
            public string allowCallOffRequests { get; set; }
            public string requestOpenShifts { get; set; }
            public string stateAbbreviation { get; set; }
            public string sttEnabled { get; set; }
            public string azureSttApi { get; set; }
            public string reportSeconds { get; set; }
            public string planPeopleId { get; set; }
            public string adminPermission { get; set; }
            public string oneSpan { get; set; }
            public string anywhereResetPasswordPermission { get; set; }
            public string anywhereConsumerFinancesPermission { get; set; }
            public string anywhereEmploymentPermission { get; set; }
            public string warningStartTime { get; set; }
            public string warningEndTime { get; set; }
            public string appendITSummary { get; set; }
            public string appendITImmediateAction { get; set; }
            public string appendITPreventionPlan { get; set; }
            public string appendITCause { get; set; }
            public string planFormCarryover { get; set; }
            public string sendWaitingListEmail { get; set; }
            public string defaultMoneyManagementLocation { get; set; }
            public string defaultMoneyManagementLocationName { get; set; }
            public string billableTransportation { get; set; }
            public string ohioEVVChangeDate { get; set; }
            public string anyRequireEndTime { get; set; }

            public string requireTimeEntryTransportationTimes { get; set; }
            public string anywhereFSSPermission { get; set; }
            public string RequireViewPlan { get; set; }
        }

        public ConsumerGroups[] getConsumerGroupsJSON(string locationId, string token)
        {
            string consumerGroupsString = dg.getConsumerGroupsJSON(locationId, token);
            ConsumerGroups[] consumerGroupsObj = js.Deserialize<ConsumerGroups[]>(consumerGroupsString);
            return consumerGroupsObj;
        }

        public class ConsumerGroups
        {
            public string RetrieveID { get; set; }
            public string GroupCode { get; set; }
            public string GroupName { get; set; }
            public string Members { get; set; }
        }

        public PeopleId[] getConsumerPeopleId(string consumerId)
        {
            string pidString = dg.getConsumerPeopleId(consumerId);
            PeopleId[] pidObj = js.Deserialize<PeopleId[]>(pidString);
            return pidObj;
        }

        public class PeopleId
        {
            public string id { get; set; }
        }

        public OrganiztionId[] getConsumerOrganizationId(string peopleId)
        {
            string oidString = dg.getConsumerOrganizationId(peopleId);
            OrganiztionId[] oidObj = js.Deserialize<OrganiztionId[]>(oidString);
            return oidObj;
        }

        public PlanInformedConsentWorker.InformedConsentSSAs[] getCaseManagersfromOptionsTable(string token)
        {
            string caseManagersString = dg.getCaseManagersfromOptionsTable(token);
            PlanInformedConsentWorker.InformedConsentSSAs[] caseManagerObj = js.Deserialize<PlanInformedConsentWorker.InformedConsentSSAs[]>(caseManagersString);
            return caseManagerObj;
        }


        public PlanInformedConsentWorker.InformedConsentSSAs[] getConsumerswithSaleforceIds(string token)
        {
            string consumersString = dg.getConsumerswithSaleforceIds(token);
            js.MaxJsonLength = Int32.MaxValue;
            PlanInformedConsentWorker.InformedConsentSSAs[] consumersObj = js.Deserialize<PlanInformedConsentWorker.InformedConsentSSAs[]>(consumersString);
            return consumersObj;
        }




        public class OrganiztionId
        {
            public string orgId { get; set; }
        }

        //BRAD add here
        //Create function that call getPSIUserOptionList
        //add custom object. user_id, first_name, last_name

        public UserOptionList[] getPSIUserOptionListJSON(string token)
        {
            string userOptionListString = dg.getPSIUserOptionListJSON(token);
            UserOptionList[] userOptionListObj = js.Deserialize<UserOptionList[]>(userOptionListString);
            return userOptionListObj;
        }

        public class UserOptionList
        {
            public string user_id { get; set; }
            public string first_name { get; set; }
            public string last_name { get; set; }
        }

        public string getLogIn(string userId, string hash, string deviceId)//need to pass in code from device if exists
        {
            //Check login type
            //return dg.getLogIn(userId, hash);
            if (stringInjectionValidatorLogin(userId) == false) return null;
            if (stringInjectionValidatorLogin(hash) == false) return null;
            if (stringInjectionValidatorLogin(deviceId) == false) return null;
            string loginType = dg.checkLoginType();
            LoginType[] loginTypeObj = js.Deserialize<LoginType[]>(loginType);
            string type = loginTypeObj[0].setting_value.ToString();
            if (type.Equals("Y") && userId.ToUpper() != "PSI")
            {
                //check code against DB to see if expired
                if (deviceId.Equals(""))
                {
                    return aAuth.generateAuthentication(userId, hash);
                }
                else
                {
                    string expired = aDG.checkDeviceAuthentication(userId, deviceId);
                    DeviceExpired[] expiredObj = js.Deserialize<DeviceExpired[]>(expired);
                    string isExpired = expiredObj[0].deviceGUID.ToString();
                    if (isExpired.Equals("Y"))
                    {
                        return aAuth.generateAuthentication(userId, hash);
                    }
                    else if (isExpired.Equals("Invalid username"))
                    {
                        return "Invalid Username";
                    }
                    else
                    {
                        return dg.getLogIn(userId, hash);
                    }
                }
            }
            else
            {
                return dg.getLogIn(userId, hash);
            }
        }
        public bool stringInjectionValidatorLogin(string uncheckedString)
        {
            string waitFor = "WAITFOR DELAY";
            string dropTable = "DROP TABLE";
            string deleteFrom = "DELETE FROM";
            string singleQuote = "'";
            if (!string.IsNullOrWhiteSpace(uncheckedString) && (uncheckedString.ToUpper().Contains(waitFor) || uncheckedString.ToUpper().Contains(dropTable) || uncheckedString.ToUpper().Contains(singleQuote) || uncheckedString.ToUpper().Contains(deleteFrom)))
            {
                return false;
            }
            else
            {
                return true;
            }

        }


        public class LoginType
        {
            public string setting_value { get; set; }
        }

        public class DeviceExpired
        {
            public string deviceGUID { get; set; }
        }

        public string updateSalesforceIdsScriptOneTimeUse(string applicationName)
        {
            try
            {
                StringBuilder sb = new StringBuilder();
                Data.Sybase di = new Data.Sybase();
                PlanSignatureWorker psw = new PlanSignatureWorker();
                string connectString = ConfigurationManager.ConnectionStrings["connection"].ToString();

                // Step 1: Get all people IDs with non-null, non-empty Salesforce_ID
                sb.Clear();
                sb.Append("SELECT DBA.People.ID ");
                sb.Append("FROM DBA.People ");
                sb.Append("WHERE DBA.People.Salesforce_ID IS NOT NULL ");
                sb.Append("AND DBA.People.Salesforce_ID <> '' ");
                DataSet dataSet = di.SelectRowsDS(sb.ToString());

                // Initialize a list to accumulate unique Salesforce IDs for guardians
                HashSet<string> guardianIds = new HashSet<string>();
                List<string> executedSQLQueries = new List<string>(); // Collect all SQL queries

                // Step 2: Collect guardian Salesforce IDs from the API calls
                if (dataSet != null && dataSet.Tables.Count > 0)
                {
                    DataTable table = dataSet.Tables[0];

                    // Loop through each row to call the API and collect Guardian IDs
                    foreach (DataRow row in table.Rows)
                    {
                        if (long.TryParse(row["ID"].ToString(), out long peopleId))
                        {
                            // API call to retrieve team members
                            TeamMemberFromState[] individualContacts = psw.getTeamMemberListFromState(peopleId);

                            if (individualContacts != null)
                            {
                                // Add guardian IDs from API response to the set
                                foreach (TeamMemberFromState member in individualContacts)
                                {
                                    if (member != null && member.Role.Contains("Guardian"))
                                    {
                                        guardianIds.Add(member.Id);
                                    }
                                }
                            }
                        }
                        else
                        {
                            return "Failed to parse People ID to a long.";
                        }
                    }
                }

                // Step 3: Retrieve unique IDs for the accumulated guardian Salesforce IDs
                HashSet<long> uniquePersonIds = new HashSet<long>();

                if (guardianIds.Count > 0)
                {
                    sb.Clear();

                    // Adjust the query logic based on applicationName
                    if (applicationName == "Advisor")
                    {
                        // Retrieve from Persons table
                        sb.Append("SELECT DBA.Persons.Person_ID, DBA.Persons.Salesforce_ID ");
                        sb.Append("FROM DBA.Persons ");
                        sb.Append("WHERE DBA.Persons.Salesforce_ID IN (");
                        sb.Append(string.Join(", ", guardianIds.Select(id => $"'{id}'")));
                        sb.Append(")");
                    }
                    else
                    {
                        // Default retrieval from People table
                        sb.Append("SELECT DBA.People.ID, DBA.People.Salesforce_ID ");
                        sb.Append("FROM DBA.People ");
                        sb.Append("WHERE DBA.People.Salesforce_ID IN (");
                        sb.Append(string.Join(", ", guardianIds.Select(id => $"'{id}'")));
                        sb.Append(")");
                    }

                    DataSet guardianDataSet = di.SelectRowsDS(sb.ToString());
                    executedSQLQueries.Add(sb.ToString()); // Log this SQL query

                    // Collect unique IDs
                    if (guardianDataSet != null && guardianDataSet.Tables.Count > 0)
                    {
                        DataTable guardianTable = guardianDataSet.Tables[0];
                        foreach (DataRow row in guardianTable.Rows)
                        {
                            if (applicationName == "Advisor")
                            {
                                if (long.TryParse(row["Person_ID"].ToString(), out long personId))
                                {
                                    uniquePersonIds.Add(personId);
                                }
                            }
                            else
                            {
                                if (long.TryParse(row["ID"].ToString(), out long personId))
                                {
                                    uniquePersonIds.Add(personId);
                                }
                            }
                        }
                    }

                    // Step 4: Generate the update SQL queries for unique IDs
                    foreach (var personId in uniquePersonIds)
                    {
                        sb.Clear();

                        if (applicationName == "Advisor")
                        {
                            // Update for Advisor logic using Persons table
                            sb.Append("UPDATE DBA.Persons ");
                            sb.Append("SET p.SalesForce_Guardian_ID = p.Salesforce_ID, ");
                            sb.Append("p.Salesforce_ID = NULL ");
                            sb.Append("FROM DBA.Persons p ");
                            sb.Append("JOIN DBA.People pe ON p.Person_ID = pe.Person_ID ");
                            sb.AppendFormat("WHERE p.Person_ID = {0};", personId);
                            sb.Append(" Commit Work;");
                        }
                        else
                        {
                            // Default update logic using People table
                            sb.Append("UPDATE DBA.People ");
                            sb.Append("SET SalesForce_Guardian_ID = Salesforce_ID, ");
                            sb.Append("Salesforce_ID = NULL ");
                            sb.AppendFormat("WHERE ID = {0};", personId);
                            sb.Append(" Commit Work;");
                        }

                        // Collect the query and execute it
                        executedSQLQueries.Add(sb.ToString());
                        SAUpdateRecord(connectString, sb.ToString());
                    }
                }

                // Return all executed SQL queries as a single concatenated string
                return string.Join("\n", executedSQLQueries);
            }
            catch (Exception ex)
            {
                return $"Error: {ex.Message}";
            }
        }


        // Helper method to extract IDs from the returned string
        private List<string> ExtractIdsFromString(string guardiansData)
        {
            List<string> ids = new List<string>();

            // Example regex pattern to match IDs if they follow a specific format, like "Id": "12345"
            var matches = Regex.Matches(guardiansData, @"""Id""\s*:\s*""(\d+)""");

            foreach (Match match in matches)
            {
                ids.Add(match.Groups[1].Value); // Add the ID value from the match
            }

            return ids;
        }

        public long SAUpdateRecord(string ConnString, string QueryString)
        {
            long num1;
            try
            {
                num1 = 0L;
                using (OdbcConnection connection = new OdbcConnection(ConnString))
                {
                    OdbcCommand odbcCommand = new OdbcCommand(QueryString, connection);
                    odbcCommand.CommandTimeout = 0;
                    connection.Open();
                    num1 = (long)odbcCommand.ExecuteNonQuery();
                    if (odbcCommand.Connection.State == ConnectionState.Open)
                        odbcCommand.Connection.Close();
                    if (connection.State == ConnectionState.Open)
                        connection.Close();
                    num1 = num1;
                }
            }
            catch (Exception ex)
            {
                num1 = -999L;
            }
            return num1;
        }



    }
}