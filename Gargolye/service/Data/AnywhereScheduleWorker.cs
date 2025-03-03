using Anywhere.Data;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Web.Script.Serialization;

namespace Anywhere.service.Data
{
    public class AnywhereScheduleWorker
    {
        DataGetter dg = new DataGetter();
        JavaScriptSerializer js = new JavaScriptSerializer();

        public AllScheduleData[] getSchedulesForSchedulingModule(string token, string locationId, string personId)
        {
            string allSchedules = dg.getSchedulesForSchedulingModule(token, locationId, personId);
            js.MaxJsonLength = Int32.MaxValue;
            AllScheduleData[] allScheduleObj = js.Deserialize<AllScheduleData[]>(allSchedules);
            return allScheduleObj;
        }

        public MainLocationDropDownData[] getLocationDropdownForScheduling(string token, char showOpenShifts)
        {
            string locationsString = dg.getLocationDropdownForScheduling(token, showOpenShifts);
            MainLocationDropDownData[] locationsObj = js.Deserialize<MainLocationDropDownData[]>(locationsString);
            return locationsObj;
        }

        public string saveOrUpdateShift(string dateString, string locationId, string personId, string startTime, string endTime, string color, string notifyEmployee, string consumerIdString, string saveUpdateFlag)
        {
            string saveUpdateString = dg.saveOrUpdateShift(dateString, locationId, personId, startTime, endTime, color, notifyEmployee, consumerIdString, saveUpdateFlag);
            return saveUpdateString;
        }

        public string saveSchedulingCallOffRequest(string token, string shiftId, string personId, string reasonId, string note, string status, string notifiedEmployeeId)
        {
            return dg.saveSchedulingCallOffRequest(token, shiftId, personId, reasonId, note, status, notifiedEmployeeId);
        }

        public CallOffReasons[] getCallOffDropdownReasons(string token)
        {
            string callOffReasonsString = dg.getCallOffDropdownReasons(token);
            CallOffReasons[] callOffReasonsObj = js.Deserialize<CallOffReasons[]>(callOffReasonsString);
            return callOffReasonsObj;
        }

        public CallOffEmployees[] getCallOffDropdownEmployees(string token, string shiftDate, string locationId)
        {
            string callOffEmployeesString = dg.getCallOffDropdownEmployees(token, shiftDate, locationId);
            CallOffEmployees[] callOffEmployeesObj = js.Deserialize<CallOffEmployees[]>(callOffEmployeesString);
            return callOffEmployeesObj;
        }

        public CallOffEmployees[] getRequestTimeOffDropdownEmployees(string token)
        {
            string callOffEmployeesString = dg.getRequestTimeOffDropdownEmployees(token);
            CallOffEmployees[] callOffEmployeesObj = js.Deserialize<CallOffEmployees[]>(callOffEmployeesString);
            return callOffEmployeesObj;
        }

        public DayOfWeek[] getDayOfWeekSchedule(string token)
        {
            string dayOfWeekString = dg.getCompanyWorkWeekStartFromDBSch(token);
            DayOfWeek[] dayOfWeekObj = js.Deserialize<DayOfWeek[]>(dayOfWeekString);
            return dayOfWeekObj;
        }

        public ConsumerAppointmentData[] getScheduleApptInformation(string token, string locationId)
        {
            string consumerApptString = dg.getScheduleApptInformation(token, locationId);
            ConsumerAppointmentData[] consumerApptObj = js.Deserialize<ConsumerAppointmentData[]>(consumerApptString);
            return consumerApptObj;
        }

        public MyApprovalData[] getScheduleMyApprovalData(string token, string personId)
        {
            string myApprovalDataString = dg.getScheduleMyApprovalData(token, personId);
            MyApprovalData[] myApprovalDataObj = js.Deserialize<MyApprovalData[]>(myApprovalDataString);
            return myApprovalDataObj;
        }

        public AllEmployees[] getAllEmployees(string userId)
        {
            string allEmployeeString = dg.getAllEmployees(userId);
            AllEmployees[] allEmployeeObj = js.Deserialize<AllEmployees[]>(allEmployeeString);
            return allEmployeeObj;
        }

        public OverlapData[] requestDaysOffScheduling(string token, string personId, string dates, string fromTime, string toTime, string reasonId, string employeeNotifiedId, string status)
        {
            string[] dateArr = dates.Split(',');
            int length = dateArr.Length;
            int count = 1;
            OverlapData[] checkOverlapObj = new OverlapData[1];

            foreach (var requestedDate in dateArr)
            {
                string checkOverlap = dg.RequestDaysOffOverlapCheck(token, personId, requestedDate, fromTime, toTime);
                checkOverlapObj = js.Deserialize<OverlapData[]>(checkOverlap);

                if (checkOverlapObj.Length > 0)
                {
                    dg.requestDaysOffSchedulingNotification(token, personId, employeeNotifiedId);
                    return checkOverlapObj;
                }
                else
                {
                    if (length == 1)
                    {
                        dg.requestDaysOffScheduling(token, personId, requestedDate, fromTime, toTime, reasonId, employeeNotifiedId, status);
                    }
                    else if (length > 1 && count == 1)
                    {
                        dg.requestDaysOffScheduling(token, personId, requestedDate, fromTime, "23:59:59", reasonId, employeeNotifiedId, status);
                    }
                    else if (length > 1 && count > 0 && count < length)
                    {
                        dg.requestDaysOffScheduling(token, personId, requestedDate, "00:00:00", "23:59:59", reasonId, employeeNotifiedId, status);
                    }
                    else
                    {
                        dg.requestDaysOffScheduling(token, personId, requestedDate, "00:00:00", toTime, reasonId, employeeNotifiedId, status);
                    }
                }
                count++;
            }

            //Send request day off notification
            dg.requestDaysOffSchedulingNotification(token, personId, employeeNotifiedId);
            return checkOverlapObj;
        }

        public string saveOpenShiftRequestScheduling(string token, string shiftId, string personId, string status, string notifiedEmployeeId)
        {
            return dg.saveOpenShiftRequestScheduling(token, shiftId, personId, status, notifiedEmployeeId);
        }

        public string getOverlapStatusforSelectedShift(string token, string shiftId, string personId)
        {
            try
            {

                string selectedShiftDataString = dg.getSelectedShiftData(token, shiftId);
                List<AllScheduleData> selectedShiftDataObj = JsonConvert.DeserializeObject<List<AllScheduleData>>(selectedShiftDataString);

                string currentUserApprovedShiftsString = dg.getCurrentUserApprovedShifts(token, personId);
                AllScheduleData[] currentUserApprovedShiftsObj = js.Deserialize<AllScheduleData[]>(currentUserApprovedShiftsString);

                foreach (var selectedShift in selectedShiftDataObj)
                {
                    foreach (var existingShift in currentUserApprovedShiftsObj)
                    {
                        if (existingShift.serviceDate == selectedShift.serviceDate)
                        {

                            TimeSpan selectedStartTime = TimeSpan.Parse(selectedShift.startTime);
                            TimeSpan selectedEndTime = TimeSpan.Parse(selectedShift.endTime);
                            TimeSpan existingStartTime = TimeSpan.Parse(existingShift.startTime);
                            TimeSpan existingEndTime = TimeSpan.Parse(existingShift.endTime);

                            // if (existingEndTime < selectedStartTime || existingStartTime > selectedEndTime)

                            if (((selectedStartTime > existingStartTime) && (selectedStartTime < existingEndTime))
                                || ((selectedEndTime > existingStartTime) && (selectedEndTime < existingEndTime))
                                || (((existingStartTime >= selectedStartTime) && (existingStartTime <= selectedEndTime))
                                   && ((existingEndTime >= selectedStartTime) && (existingEndTime <= selectedEndTime)))
                                || ((existingStartTime == selectedStartTime) && (existingEndTime == selectedEndTime)))
                            {
                                return existingShift.locationName;
                            }
                        }
                    }
                }
            }
            catch (Exception ex)
            {

            }

            return "NoOverLap";
        }

        public string getOverlapDataforSelectedShift(string token, string shiftId, string personId)
        {
            try
            {

                string selectedShiftDataString = dg.getSelectedShiftData(token, shiftId);
                List<AllScheduleData> selectedShiftDataObj = JsonConvert.DeserializeObject<List<AllScheduleData>>(selectedShiftDataString);

                string currentUserApprovedShiftsString = dg.getCurrentUserApprovedShifts(token, personId);
                AllScheduleData[] currentUserApprovedShiftsObj = js.Deserialize<AllScheduleData[]>(currentUserApprovedShiftsString);

                foreach (var selectedShift in selectedShiftDataObj)
                {
                    foreach (var existingShift in currentUserApprovedShiftsObj)
                    {
                        if (existingShift.serviceDate == selectedShift.serviceDate)
                        {

                            TimeSpan selectedStartTime = TimeSpan.Parse(selectedShift.startTime);
                            TimeSpan selectedEndTime = TimeSpan.Parse(selectedShift.endTime);
                            TimeSpan existingStartTime = TimeSpan.Parse(existingShift.startTime);
                            TimeSpan existingEndTime = TimeSpan.Parse(existingShift.endTime);

                            //    // if (existingEndTime < selectedStartTime || existingStartTime > selectedEndTime)

                            if (((selectedStartTime > existingStartTime) && (selectedStartTime < existingEndTime))
                                || ((selectedEndTime > existingStartTime) && (selectedEndTime < existingEndTime))
                                 || (((existingStartTime >= selectedStartTime) && (existingStartTime <= selectedEndTime))
                                   && ((existingEndTime >= selectedStartTime) && (existingEndTime <= selectedEndTime)))
                                 || ((existingStartTime == selectedStartTime) && (existingEndTime == selectedEndTime)))
                            {
                                string returnJSON = Newtonsoft.Json.JsonConvert.SerializeObject(selectedShift);
                                return returnJSON;
                            }
                        }
                    }
                }
            }
            catch (Exception ex)
            {

            }

            return "NoOverLap";
        }

        public string cancelRequestOpenShiftScheduling(string token, string requestShiftId)
        {
            return dg.cancelRequestOpenShiftScheduling(token, requestShiftId);
        }

        public string approveDenyOpenShiftRequestScheduling(string token, string requestedShiftId, string decision)
        {
            return dg.approveDenyOpenShiftRequestScheduling(token, requestedShiftId, decision);
        }

        public string approveDenyCallOffRequestScheduling(string token, string callOffShiftId, string decision)
        {
            return dg.approveDenyCallOffRequestScheduling(token, callOffShiftId, decision);
        }

        public string approveDenyDaysOffRequestScheduling(string token, string daysOffIdString, string decision, string dateTime)
        {
            string[] dateArr = daysOffIdString.Split(',');
            string checkOverlap;
            Boolean returnOverlapMessage = false;

            foreach (var dayOffId in dateArr)
            {
                // If decision is 'approve' check for overlaps
                if (decision == "A".ToString())
                {
                    checkOverlap = dg.approveDenyDaysOffOverlapCheck(token, dayOffId);
                    OverlapData[] checkOverlapObj = js.Deserialize<OverlapData[]>(checkOverlap);

                    // if their is an overlap, exit the loop to return the id string
                    if (checkOverlapObj.Length > 0)
                    {
                        returnOverlapMessage = true;
                        break;
                    } else // run normal functionality
                    {
                        dg.approveDenyDaysOffRequestScheduling(token, dayOffId, decision);
                    }
                }

                // If decision is not 'approve', run normal functionality
                else
                {
                    dg.approveDenyDaysOffRequestScheduling(token, dayOffId, decision);
                }
            }

            //104844 - sends only one email/text per instance of a supervisor approving/denying time off 
            dg.approveDenyDaysOffRequestSchedulingNotification(token, dateArr[0], decision, dateTime);

            if (returnOverlapMessage)
            {
                return daysOffIdString;
            }
            else
            {
                return "Success";
            }

        }

        public class AllScheduleData
        {
            public int shiftId { get; set; }
            public int locationId { get; set; }
            public string serviceDate { get; set; }
            public string startTime { get; set; }
            public string endTime { get; set; }
            public int totalHours { get; set; }
            public string shiftType { get; set; }
            public string personID { get; set; }
            public string hoursScheduled { get; set; }
            public string shiftNotes { get; set; }
            public string workCodeId { get; set; }
            public string workCode { get; set; }
            public string workCodeDescription { get; set; }
            public string firstName { get; set; }
            public string lastName { get; set; }
            public string locationName { get; set; }
            public string requestShiftStatus { get; set; }
            public string requestedById { get; set; }
            public string callOffStatus { get; set; }
            public string consumerNames { get; set; }
            public string preferred { get; set; }
        }

        public class OverlapData
        {
            public string personId { get; set; }
            public string firstName { get; set; }
            public string lastName { get; set; }
            public string startTime { get; set; }
            public string endTime { get; set; }
            public string serviceDate { get; set; }
            public string requestReason { get; set; }
        }

        public class MainLocationDropDownData
        {
            public int locationId { get; set; }
            public string locationName { get; set; }
            public string residence { get; set; }
        }

        public class CallOffReasons
        {
            public int reasonId { get; set; }
            public string reasonName { get; set; }
        }

        public class CallOffEmployees
        {
            public int employeeId { get; set; }
            public string employeeName { get; set; }
        }

        public class DayOfWeek
        {
            public string Day_of_Week { get; set; }
        }

        public class ConsumerAppointmentData
        {
            public string medTrackingId { get; set; }
            public string consumerName { get; set; }
            public string typeDescription { get; set; }
            public string dateScheduled { get; set; }
            public string timeScheduled { get; set; }
            public string provider { get; set; }
            public string reason { get; set; }
            public string notes { get; set; }
            public string takenToApptBy { get; set; }
        }

        public class MyApprovalData
        {
            public string personId { get; set; }
            public string name { get; set; }
            public string day { get; set; }
            public string reasonId { get; set; }
            public string reasonName { get; set; }
            public string toTime { get; set; }
            public string fromTime { get; set; }
            public string shiftId { get; set; }
            public string dayOffId { get; set; }
            public string locationName { get; set; }
            public string requestType { get; set; }
        }

        public class AllEmployees
        {
            public string Person_Id { get; set; }
            public string EmployeeName { get; set; }            
        }

    }
}