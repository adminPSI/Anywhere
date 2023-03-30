using Anywhere.Data;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.RegularExpressions;
using System.Web.Script.Serialization;

namespace Anywhere.service.Data
{
    public class IncidentTrackingWorker
    {
        DataGetter dg = new DataGetter();
        JavaScriptSerializer js = new JavaScriptSerializer();

        public InvolvementTypeData[] GetITInvolvementTypeData(string token)
        {
            string involvementTypeDataString = dg.getITInvolvementTypeData(token);
            InvolvementTypeData[] involvementTypeData = js.Deserialize<InvolvementTypeData[]>(involvementTypeDataString);
            return involvementTypeData;
        }

        public IncidentCategories[] GetITIncidentCategories(string token)
        {
            string incidentCategoriesString = dg.getITIncidentCategories(token);
            IncidentCategories[] incidentCategories = js.Deserialize<IncidentCategories[]>(incidentCategoriesString);
            return incidentCategories;
        }

        public IncidentLocationDetail[] GetITIncidentLocationDetail(string token)
        {
            string itIncidentLocationDetailString = dg.getITIncidentLocationDetail(token);
            IncidentLocationDetail[] itIncidentLocationDetail = js.Deserialize<IncidentLocationDetail[]>(itIncidentLocationDetailString);
            return itIncidentLocationDetail;
        }

        public IncidentTrackingConsumerServiceLocations[] GetITConsumerServiceLocations(string token, string consumerId)
        {
            string itConsumerServiceLocations = dg.getITConsumerServiceLocations(token, consumerId);
            IncidentTrackingConsumerServiceLocations[] itConsumerServiceLocationsDetail = js.Deserialize<IncidentTrackingConsumerServiceLocations[]>(itConsumerServiceLocations);
            return itConsumerServiceLocationsDetail;
        }

        public IncidentWidgetData[] GetITDashboardWidgetData(string token, string viewCaseLoad)
        {
            string itIncidentWidgetDataString = dg.getITDashboardWidgetData(token, viewCaseLoad);
            IncidentWidgetData[] itIncidentWidgetData = js.Deserialize<IncidentWidgetData[]>(itIncidentWidgetDataString);
            return itIncidentWidgetData;
        }

        public IncidentTrackingReviewTableData[] GetITReviewTableData(string token, string locationId, string employeeId, string supervisorId, string subcategoryId, string fromDate, string toDate, string viewCaseLoad)
        {
            string itReviewTableDataString = dg.getITReviewTableData(token, locationId, employeeId, supervisorId, subcategoryId, fromDate, toDate, viewCaseLoad);
            IncidentTrackingReviewTableData[] itReviewTableData = js.Deserialize<IncidentTrackingReviewTableData[]>(itReviewTableDataString);
            return itReviewTableData;
        }

        public IncidentTrackingReviewLocations[] GetLocationsIncidentTrackingReviewPage(string token)
        {
            string itReviewLocations = dg.getLocationsIncidentTrackingReviewPage(token);
            IncidentTrackingReviewLocations[] itReviewLocationData = js.Deserialize<IncidentTrackingReviewLocations[]>(itReviewLocations);
            return itReviewLocationData;
        }

        public EmployeesInvolvedEmployeeDropdown[] GetEmployeesInvolvedEmployeeDropdown(string token)
        {
            string itEmployeeDropdownString = dg.getEmployeesInvolvedEmployeeDropdown(token);
            EmployeesInvolvedEmployeeDropdown[] itEmployeeDropdownData = js.Deserialize<EmployeesInvolvedEmployeeDropdown[]>(itEmployeeDropdownString);
            return itEmployeeDropdownData;
        }

        public AutoNotify[] checkAutoNotifySupervisor(string token)
        {
            string setting = dg.checkITAutoNotifySupervisor(token);
            AutoNotify[] autoNotify = js.Deserialize<AutoNotify[]>(setting);
            return autoNotify;
        }

        public class AutoNotify
        {
            public string setting_value { get; set; }
        }

        public class SupervisorIdList
        {
            public string employeeId { get; set; }
        }


        public IncidentEditReviewDataAllObjects GetIncidentEditReviewDataAllObjects(string token, string incidentId)
        {
            //Main incident tracking table data
            string itRevieweditDetailsString = dg.getIncidentEditReviewData(token, incidentId);
            IncidentEditReviewData[] itReviewEditDetailsObj = js.Deserialize<IncidentEditReviewData[]>(itRevieweditDetailsString);
            //Consumers involved incident tracking data
            string itConsumersInvolvedString = dg.getIncidentTrackingEditReviewConsumersInvolved(token, incidentId);
            IncidentEditReviewConsumersInvolved[] itConsumersInvolvedDetailsObj = js.Deserialize<IncidentEditReviewConsumersInvolved[]>(itConsumersInvolvedString);
            //Employees involved incident tracking data
            string itEmployeesInvolvedString = dg.getIncidentTrackingEditReviewEmployeesInvolved(token, incidentId);
            IncidentEditReviewEmployeesInvolved[] itEmployeesInvolvedDetailsObj = js.Deserialize<IncidentEditReviewEmployeesInvolved[]>(itEmployeesInvolvedString);
            //Others involved incident tracking data
            string itOthersInvolvedString = dg.getIncidentTrackingEditReviewOthersInvolved(token, incidentId);
            IncidentEditReviewOthersInvolved[] itOthersInvolvedDetailsObj = js.Deserialize<IncidentEditReviewOthersInvolved[]>(itOthersInvolvedString);


            IncidentEditReviewDataAllObjects test = new IncidentEditReviewDataAllObjects();
            test.itReviewData = itReviewEditDetailsObj;
            test.itConsumerInvolved = itConsumersInvolvedDetailsObj;
            test.itEmployeesInvolved = itEmployeesInvolvedDetailsObj;
            test.itOthersInvolved = itOthersInvolvedDetailsObj;

            return test;
        }

        //Save incident
        public List<string> SaveUpdateITIncident(string token, string incidentTypeId, string incidentDate, string incidentTime, string reportedDate, string incidentTypeDesc,
                                    string reportedTime, string subcategoryId, string locationDetailId, string serviceLocation, string summary, string note, string prevention, string contributingFactor,//end of main table data
                                    string consumerIdString, string includeInCount, string involvementId, string consumerIncidentLocationIdString, string consumerInvolvedIdString, //end of consumers
                                    string employeeIdString, string notifyEmployeeString, string employeeInvolvementIdString, //end of employees
                                    string othersInvolvedNameString, string othersInvolvedCompanyString, string othersInvolvedAddress1String, string othersInvolvedAddress2String, string othersInvolvedCityString, string othersInvolvedStateString,
                                    string othersInvolvedZipCodeString, string othersInvolvedPhoneString, string othersInvolvedInvolvementTypeIdString, string othersInvolvedInvolvementDescriptionString, string updateIncidentId, string saveUpdate)
        {
            List<string> consumerIdAndInvolvedId = new List<string>();
            List<string> ret1 = new List<string>();
            string ret = "";
            AutoNotify[] notify = checkAutoNotifySupervisor(token);
            string notifyS = notify[0].setting_value.ToString();
            if (saveUpdate == "Save")
            {
                //Save initial incident
                string incidentIdS = dg.saveUpdateIncidentTrackingITDetails(token, incidentTypeId, incidentDate, incidentTime, reportedDate, reportedTime, subcategoryId, locationDetailId, summary, note, prevention, contributingFactor, updateIncidentId, saveUpdate);
                string incidentId = Regex.Replace(incidentIdS, "[^0-9]", "");
                consumerIdAndInvolvedId = saveUpdateITConsumersInvolved(token, consumerIdString, incidentId, includeInCount, involvementId, consumerIncidentLocationIdString, consumerInvolvedIdString, "Save");
                ret = saveUpdateITEmployeesInvolved(token, incidentId, employeeIdString, notifyEmployeeString, employeeInvolvementIdString);
                ret = saveUpdateITOthersInvolved(token, incidentId, othersInvolvedNameString, othersInvolvedCompanyString, othersInvolvedAddress1String, othersInvolvedAddress2String,
                othersInvolvedCityString, othersInvolvedStateString, othersInvolvedZipCodeString, othersInvolvedPhoneString, othersInvolvedInvolvementTypeIdString);
                if (notifyS.Equals("Y"))
                {
                    autoNotifySupervisors(token, incidentDate, "Insert", consumerIncidentLocationIdString, employeeIdString, notifyEmployeeString, incidentTime, subcategoryId, incidentTypeDesc);
                }
            }
            else
            {
                ret = dg.saveUpdateIncidentTrackingITDetails(token, incidentTypeId, incidentDate, incidentTime, reportedDate, reportedTime, subcategoryId, locationDetailId, summary, note, prevention, contributingFactor, updateIncidentId, saveUpdate);
                ret1 = saveUpdateITConsumersInvolved(token, consumerIdString, updateIncidentId, includeInCount, involvementId, consumerIncidentLocationIdString, consumerInvolvedIdString, "Update");
                ret = saveUpdateITEmployeesInvolved(token, updateIncidentId, employeeIdString, notifyEmployeeString, employeeInvolvementIdString);
                ret = saveUpdateITOthersInvolved(token, updateIncidentId, othersInvolvedNameString, othersInvolvedCompanyString, othersInvolvedAddress1String, othersInvolvedAddress2String,
                                                othersInvolvedCityString, othersInvolvedStateString, othersInvolvedZipCodeString, othersInvolvedPhoneString, othersInvolvedInvolvementTypeIdString);
                if (notifyS.Equals("Y"))
                {
                    autoNotifySupervisors(token, incidentDate, "Update", consumerIncidentLocationIdString, employeeIdString, notifyEmployeeString, incidentTime, subcategoryId, incidentTypeDesc);
                }
            }
            return consumerIdAndInvolvedId;
        }

        public void autoNotifySupervisors(string token, string incidentDate, string saveUpdate, string locationIdString, string employeeIdString, string notifyEmployeeString,
                                            string incidentTime, string subcategoryId, string incidentTypeDesc)
        {
            string supervisorIds = "";
            string[] locationIds = locationIdString.Split('|');
            foreach (var locId in locationIds.Distinct())
            {
                supervisorIds = dg.getSupervisorIdsToNotify(token, incidentDate, locId.ToString());
            }
            string[] employeeIds = employeeIdString.Split('|');
            string[] notifyEmployeeChars = notifyEmployeeString.Split('|');
            var dontNotify = new List<string>();
            var i = 0;
            foreach (var empId in employeeIds)
            {
                if (notifyEmployeeChars[i] == "N")
                {
                    dontNotify.Add(empId);
                }
            }
            SupervisorIdList[] ids = js.Deserialize<SupervisorIdList[]>(supervisorIds);
            foreach (var id in ids.Distinct())
            {
                if (dontNotify.Contains(id.employeeId.ToString()))
                {
                    return;
                }
                else
                {
                    dg.sendITNotification(token, saveUpdate, id.employeeId.ToString(), incidentTypeDesc, incidentDate, incidentTime, subcategoryId);
                }
            }
        }

        public List<string> saveUpdateITConsumersInvolved(string token, string consumerIdString, string incidentId, string includeInCount, string involvementId, string consumerIncidentLocationIdString, string consumerInvolvedIdString, string saveOrUpdate)
        {
            List<string> consumerIdAndInvolvedId = new List<string>();
            string[] consumerIds = consumerIdString.Split(',');
            string[] consumerIncidentLocationIds = consumerIncidentLocationIdString.Split('|');
            string[] consumerInvolvedIds = consumerInvolvedIdString.Split('|');
            string[] includeCount = includeInCount.Split('|');
            string[] involveId = involvementId.Split('|');
            string run = "first";
            int i = 0;
            string consumerInvolvedId = "";
            foreach (string consumerId in consumerIds)
            {
                consumerInvolvedId = dg.saveUpdateITConsumersInvolved(token, consumerId, incidentId, includeCount[i], involveId[i], consumerIncidentLocationIds[i], run, consumerInvolvedIds[i], saveOrUpdate, consumerIdString);
                run = "";
                i++;
                consumerInvolvedId = Regex.Replace(consumerInvolvedId, "[^0-9]", "");
                //263|[{\"@consumerInvolvedID\":\"2096\"}]
                consumerIdAndInvolvedId.Add(consumerId.ToString() + '|' + consumerInvolvedId.ToString());
            }
            return consumerIdAndInvolvedId;
        }

        public string saveUpdateITOthersInvolved(string token, string incidentId, string othersInvolvedNameString, string othersInvolvedCompanyString, string othersInvolvedAddress1String,
                                                string othersInvolvedAddress2String, string othersInvolvedCityString, string othersInvolvedStateString,
                                                string othersInvolvedZipCodeString, string othersInvolvedPhoneString, string othersInvolvedInvolvementTypeIdString)
        {
            string othersName; string othersCompany; string otherAddress1; string otherAddress2; string othersCity; string othersState; string othersZip; string othersPhone; string othersInvolvementTyId;
            string[] othersInvolvedNames = othersInvolvedNameString.Split('|');
            string[] othersInvolvedCompanies = othersInvolvedCompanyString.Split('|');
            string[] othersInvolvedAddress1s = othersInvolvedAddress1String.Split('|');
            string[] othersInvolvedAddress2s = othersInvolvedAddress2String.Split('|');
            string[] othersInvolvedCities = othersInvolvedCityString.Split('|');
            string[] otherInvolvedStates = othersInvolvedStateString.Split('|');
            string[] othersInvolvedZips = othersInvolvedZipCodeString.Split('|');
            string[] othersInvolvedPhones = othersInvolvedPhoneString.Split('|');
            string[] othersInvolvedInvolvementTypeIds = othersInvolvedInvolvementTypeIdString.Split('|');
            string run = "first";
            int i = 0;
            // New
            foreach (string othersInvolvedName in othersInvolvedNames)
            {
                if (othersInvolvedName == "1ZXY2") { othersName = null; } else { othersName = othersInvolvedName; }
                if (othersInvolvedCompanies[i] == "1ZXY2") { othersCompany = null; } else { othersCompany = othersInvolvedCompanies[i]; }
                if (othersInvolvedAddress1s[i] == "1ZXY2") { otherAddress1 = null; } else { otherAddress1 = othersInvolvedAddress1s[i]; }
                if (othersInvolvedAddress2s[i] == "1ZXY2") { otherAddress2 = null; } else { otherAddress2 = othersInvolvedAddress2s[i]; }
                //otherAddress2 = "";
                if (othersInvolvedCities[i] == "1ZXY2") { othersCity = null; } else { othersCity = othersInvolvedCities[i]; }
                if (otherInvolvedStates[i] == "1ZXY2") { othersState = null; } else { othersState = otherInvolvedStates[i]; }
                if (othersInvolvedZips[i] == "1ZXY2") { othersZip = null; } else { othersZip = othersInvolvedZips[i]; }
                if (othersInvolvedPhones[i] == "1ZXY2") { othersPhone = null; } else { othersPhone = othersInvolvedPhones[i]; }
                if (othersInvolvedInvolvementTypeIds[i] == "1ZXY2") { othersInvolvementTyId = null; } else { othersInvolvementTyId = othersInvolvedInvolvementTypeIds[i]; }
                if (othersInvolvementTyId == "%") { othersInvolvementTyId = ""; }
                dg.saveUpdateITOthersInvolved(token, incidentId, othersName, othersCompany, otherAddress1, otherAddress2, othersCity, othersState, othersZip, othersPhone, othersInvolvementTyId, run);
                run = "";
                i++;
            }
            return "Success";
        }

        public string saveUpdateITEmployeesInvolved(string token, string incidentId, string employeeIdString, string notifyEmployeeString, string employeeInvolvementIdString)
        {
            string[] employeeIds = employeeIdString.Split('|');
            string[] notifyEmployeeChars = notifyEmployeeString.Split('|');
            string[] employeeInvolvementIds = employeeInvolvementIdString.Split('|');
            int i = 0;
            string run = "first";
            foreach (string employeeId in employeeIds)
            {
                dg.saveUpdateITEmployeesInvolved(token, incidentId, employeeId, notifyEmployeeChars[i], employeeInvolvementIds[i], run);
                i++;
                run = "";
            }
            return "Success";
        }

        public string SendITNotification(string token, string notificationType, string employeeId, string incidentTypeDesc, string incidentDate, string incidentTime, string subcategoryId)
        {
            dg.sendITNotification(token, notificationType, employeeId, incidentTypeDesc, incidentDate, incidentTime, subcategoryId);
            return "success";
        }

        public string GetITReviewPageEmployeeListAndSubList(string token, string supervisorId)
        {
            return dg.getITReviewPageEmployeeListAndSubList(token, supervisorId);
        }

        public InterventionTypesDropdown[] getInterventionTypesDropdown(string token)
        {
            string interventionTypesDropdownString = dg.getInterventionTypesDropdown(token);
            InterventionTypesDropdown[] interventionTypesDropdownData = js.Deserialize<InterventionTypesDropdown[]>(interventionTypesDropdownString);
            return interventionTypesDropdownData;
        }

        public ReviewedByDropdown[] getReviewedByDropdown(string token)
        {
            string reviewedByDropdownString = dg.getReviewedByDropdown(token);
            ReviewedByDropdown[] reviewedByDropdownData = js.Deserialize<ReviewedByDropdown[]>(reviewedByDropdownString);
            return reviewedByDropdownData;
        }

        public InjuryLocationsDropdown[] getInjuryLocationsDropdown(string token)
        {
            string injuryLocationsDropdownString = dg.getInjuryLocationsDropdown(token);
            InjuryLocationsDropdown[] injuryLocationsDropdownData = js.Deserialize<InjuryLocationsDropdown[]>(injuryLocationsDropdownString);
            return injuryLocationsDropdownData;
        }

        public InjuryTypesDropdown[] getInjuryTypesDropdown(string token)
        {
            string injuryTypesDropdownString = dg.getInjuryTypesDropdown(token);
            InjuryTypesDropdown[] injuryTypesDropdownData = js.Deserialize<InjuryTypesDropdown[]>(injuryTypesDropdownString);
            return injuryTypesDropdownData;
        }

        public ConsumerInterventions[] getitConsumerInterventions(string token, string consumerId, string incidentId)
        {
            string consumerInterventionsString = dg.getitConsumerInterventions(token, consumerId, incidentId);
            ConsumerInterventions[] consumerInterventionsData = js.Deserialize<ConsumerInterventions[]>(consumerInterventionsString);
            return consumerInterventionsData;
        }

        public ConsumerInjuries[] getitConsumerInjuries(string token, string consumerId, string incidentId)
        {
            string consumerInjuriesString = dg.getitConsumerInjuries(token, consumerId, incidentId);
            ConsumerInjuries[] consumerInjuriesData = js.Deserialize<ConsumerInjuries[]>(consumerInjuriesString);
            return consumerInjuriesData;
        }

        public ConsumerReviews[] getitConsumerReviews(string token, string consumerId, string incidentId)
        {
            string consumerReviewsString = dg.getitConsumerReviews(token, consumerId, incidentId);
            ConsumerReviews[] consumerReviewsData = js.Deserialize<ConsumerReviews[]>(consumerReviewsString);
            return consumerReviewsData;
        }

        public ConsumerFollowUps[] getitConsumerFollowUps(string token, string consumerId, string incidentId)
        {
            string consumerFollowUpsString = dg.getitConsumerFollowUps(token, consumerId, incidentId);
            ConsumerFollowUps[] consumerFollowUpsData = js.Deserialize<ConsumerFollowUps[]>(consumerFollowUpsString);
            return consumerFollowUpsData;
        }

        public ConsumerBehaviors[] getitConsumerBehaviors(string token, string consumerId, string incidentId)
        {
            string consumerBehaviorsString = dg.getitConsumerBehaviors(token, consumerId, incidentId);
            ConsumerBehaviors[] consumerBehaviorsData = js.Deserialize<ConsumerBehaviors[]>(consumerBehaviorsString);
            return consumerBehaviorsData;
        }

        public ConsumerReporting[] getitConsumerReporting(string token, string consumerId, string incidentId)
        {
            string consumerReportingString = dg.getitConsumerReporting(token, consumerId, incidentId);
            ConsumerReporting[] consumerReportingData = js.Deserialize<ConsumerReporting[]>(consumerReportingString);
            return consumerReportingData;
        }

        public ConsumerFollowUpTypes[] getitConsumerFollowUpTypes(string token)
        {
            string followUpTypesString = dg.getitConsumerFollowUpTypes(token);
            ConsumerFollowUpTypes[] followUpTypesData = js.Deserialize<ConsumerFollowUpTypes[]>(followUpTypesString);
            return followUpTypesData;
        }

        public ConsumerBehaviorTypes[] getitConsumerBehaviorTypes(string token)
        {
            string behaviorTypesString = dg.getitConsumerBehaviorTypes(token);
            ConsumerBehaviorTypes[] behaviorTypesData = js.Deserialize<ConsumerBehaviorTypes[]>(behaviorTypesString);
            return behaviorTypesData;
        }

        public ReportingCategories[] getitReportingCategories(string token)
        {
            string reportingCategoriesString = dg.getitReportingCategories(token);
            ReportingCategories[] reportingCategoriesData = js.Deserialize<ReportingCategories[]>(reportingCategoriesString);
            return reportingCategoriesData;
        }

        //Consumer Follow Up Alter Specific Calls
        public string itDeleteConsumerFollowUp(string token, string itConsumerFollowUpId)
        {
            dg.itDeleteConsumerFollowUp(token, itConsumerFollowUpId);
            return "success";
        }

        public string saveUpdateITConsumerFollowUp(string token, List<String> consumerFollowUpIdArray, string consumerInvolvedId, List<String> followUpTypeIdArray, List<String> personResponsibleArray,
                                                    List<String> dueDateArray, List<String> completedDateArray, List<String> notesArray)
        {
            int i = 0;
            foreach (string followUpTypeId in followUpTypeIdArray)
            {
                dg.saveUpdateITConsumerFollowUp(token, consumerFollowUpIdArray[i], consumerInvolvedId, followUpTypeId, personResponsibleArray[i], dueDateArray[i], completedDateArray[i], notesArray[i]);
                i++;
            }
            return "Success";
        }

        //Consumer Behavior Alter Specific Calls
        public string itDeleteConsumerBehavior(string token, string itConsumerFollowUpId)
        {
            dg.itDeleteConsumerBehavior(token, itConsumerFollowUpId);
            return "success";
        }

        public string saveUpdateITConsumerBehavior(string token, List<String> consumerFollowUpIdArray, string consumerInvolvedId, List<String> behaviorTypeIdArray, List<String> startTimeArray,
                                                    List<String> endTimeArray, List<String> occurrencesArray)
        {
            int i = 0;
            foreach (string behaviorTypeId in behaviorTypeIdArray)
            {
                dg.saveUpdateITConsumerBehavior(token, consumerFollowUpIdArray[i], consumerInvolvedId, behaviorTypeId, startTimeArray[i], endTimeArray[i], occurrencesArray[i]);
                i++;
            }
            return "Success";
        }

        //Consumer Reporting Up Alter Specific Calls
        public string itDeleteConsumerReporting(string token, string itConsumerReportingId)
        {
            dg.itDeleteConsumerReporting(token, itConsumerReportingId);
            return "success";
        }

        public string saveUpdateITConsumerReporting(string token, List<String> consumerReportIdArray, string consumerInvolvedId, List<String> reportDateArray, List<String> reportTimeArray,
                                                            List<String> reportingCategoryIdArray, List<String> reportToArray, List<String> reportByArray,
                                                            List<String> reportMethodArray, List<String> notesArray)
        {
            int i = 0;
            foreach (string reportingCategoryId in reportingCategoryIdArray)
            {
                dg.saveUpdateITConsumerReporting(token, consumerReportIdArray[i], consumerInvolvedId, reportDateArray[i], reportTimeArray[i], reportingCategoryId,
                                                 reportToArray[i], reportByArray[i], reportMethodArray[i], notesArray[i]);
                i++;
            }
            return "Success";
        }

        //Consumer Reviews Alter Specific Calls
        public string itDeleteConsumerReviews(string token, string itConsumerReviewId)
        {
            dg.itDeleteConsumerReviews(token, itConsumerReviewId);
            return "success";
        }

        public string saveUpdateITConsumerReviews(string token, List<String> itConsumerReviewIdArray, string consumerInvolvedId, List<String> reviewedByArray, List<String> reviewedDateArray, List<String> noteArray)
        {
            int i = 0;
            foreach (string reviewedDate in reviewedDateArray)
            {
                dg.saveUpdateITConsumerReviews(token, itConsumerReviewIdArray[i], consumerInvolvedId, reviewedByArray[i], reviewedDate, noteArray[i]);
                i++;
            }
            return "Success";
        }

        //Consumer Injuries Alter Specific Calls
        public string itDeleteConsumerInjuries(string token, string itConsumerInjuryId)
        {
            dg.itDeleteConsumerInjuries(token, itConsumerInjuryId);
            return "success";
        }

        //Consumer interventions Alter Specific Calls
        public string itDeleteConsumerInterventions(string token, string itConsumerInterventionId)
        {
            dg.itDeleteConsumerInterventions(token, itConsumerInterventionId);
            return "success";
        }

        public string saveUpdateITConsumerInjuries(string token, List<String> checkedByNurseArray, List<String> checkedDateArray, List<String> detailsArray, List<String> itConsumerInjuryIdArray,
                                                            string consumerInvolvedId, List<String> itInjuryLocationIdArray, List<String> itInjuryTypeIdArray, List<String> treatmentArray)
        {
            int i = 0;
            foreach (string itInjuryLocationId in itInjuryLocationIdArray)
            {
                dg.saveUpdateITConsumerInjuries(token, checkedByNurseArray[i], checkedDateArray[i], detailsArray[i], itConsumerInjuryIdArray[i], consumerInvolvedId, itInjuryLocationId,
                                            itInjuryTypeIdArray[i], treatmentArray[i]);
                i++;
            }
            return "success";
        }

        public string saveUpdateITConsumerInterventions(string token, List<String> aversiveArray, List<String> itConsumerInterventionIdArray, string consumerInvolvedId, List<String> itConsumerInterventionTypeIdArray,
                                                List<String> notesArray, List<String> startTimeArray, List<String> stopTimeArray, List<String> timeLengthArray)
        {
            int i = 0;
            foreach (string itConsumerInterventionTypeId in itConsumerInterventionTypeIdArray)
            {
                dg.saveUpdateITConsumerInterventions(token, aversiveArray[i], itConsumerInterventionIdArray[i], consumerInvolvedId, itConsumerInterventionTypeId, notesArray[i], startTimeArray[i],
                                                 stopTimeArray[i], timeLengthArray[i]);
                i++;
            }
            return "success";
        }

        // NEW - Incident Tracking Update Incident View By User
        public string updateIncidentViewByUser(string token, string incidentId, string userId)
        {
            dg.updateIncidentViewByUser(token, incidentId, userId);
            return "success";
        }

        public ReportScheduleId[] generateIncidentTrackingReport(string token, string incidentId)
        {
            string category = "Incident Tracking";
            string title = "Incidents [Composite] by Consumer, Date";
            string reportServerList = "Primary";
            string result = "";

            result = dg.generateIncidentTrackingReport(token, category, title, reportServerList, incidentId);

            ReportScheduleId[] reportScheduleId = js.Deserialize<ReportScheduleId[]>(result);
            return reportScheduleId;
        }

        public string checkIfITReportExists(string token, string reportScheduleId)
        {
            return dg.checkIfITReportExists(token, reportScheduleId);
        }

        public class ReportingCategories
        {
            public string itReportingCategoryId { get; set; }
            public string itReportingCategoryName { get; set; }
        }

        public class ConsumerFollowUpTypes
        {
            public string itFollowUpTypeId { get; set; }
            public string followUpTypeName { get; set; }
        }

        public class ConsumerBehaviorTypes
        {
            public string itBehaviorTypeId { get; set; }
            public string behaviorTypeName { get; set; }
        }

        public class ConsumerReporting
        {
            public string itConsumerReportId { get; set; }
            public string reportingCategoryID { get; set; }
            public string dateReported { get; set; }
            public string timeReported { get; set; }
            public string reportTo { get; set; }
            public string reportBy { get; set; }
            public string reportMethod { get; set; }
            public string lastUpdatedBy { get; set; }
            public string lastUpdatedOn { get; set; }
            public string notes { get; set; }
        }

        public class ConsumerFollowUps
        {
            public string itConsumerFollowUpId { get; set; }
            public string followUpTypeId { get; set; }
            public string personResponsible { get; set; }
            public string dueDate { get; set; }
            public string dateCompleted { get; set; }
            public string lastUpdatedBy { get; set; }
            public string lastUpdatedOn { get; set; }
            public string notes { get; set; }
        }

        public class ConsumerBehaviors
        {
            public string itConsumerBehaviorId { get; set; }
            public string behaviorTypeId { get; set; }
            public string startTime { get; set; }
            public string endTime { get; set; }
            public string occurrences { get; set; }
            public string lastUpdatedBy { get; set; }
            public string lastUpdatedOn { get; set; }
        }

        public class ConsumerReviews
        {
            public string itConsumerReviewId { get; set; }
            public string reviewedDate { get; set; }
            public string reviewedBy { get; set; }
            public string lastUpdatedBy { get; set; }
            public string lastUpdatedOn { get; set; }
            public string notes { get; set; }
        }

        public class ConsumerInjuries
        {
            public string checkedByNurse { get; set; }
            public string injuryDetails { get; set; }
            public string injuryTreatment { get; set; }
            public string checkedDate { get; set; }
            public string itConsumerInjuryId { get; set; }
            public string injuryLocationId { get; set; }
            public string injuryTypeId { get; set; }
            public string lastUpdatedBy { get; set; }
            public string lastUpdatedOn { get; set; }
        }

        public class ConsumerInterventions
        {
            public string itConsumerInterventionId { get; set; }
            public string interventionType { get; set; }
            public string aversive { get; set; }
            public string startTime { get; set; }
            public string stopTime { get; set; }
            public string timeLength { get; set; }
            public string lastUpdatedBy { get; set; }
            public string lastUpdatedOn { get; set; }
            public string interventionNotes { get; set; }
        }

        public class InjuryTypesDropdown
        {
            public string injuryTypeId { get; set; }
            public string injuryType { get; set; }
        }

        public class InjuryLocationsDropdown
        {
            public string injuryLocationId { get; set; }
            public string injuryLocation { get; set; }
        }

        public class ReviewedByDropdown
        {
            public string employeeId { get; set; }
            public string employeeName { get; set; }
        }

        public class InterventionTypesDropdown
        {
            public string interventionTypeId { get; set; }
            public string description { get; set; }
        }

        public class InvolvementTypeData
        {
            public string involvementId { get; set; }
            public string description { get; set; }
        }

        public class IncidentCategories
        {
            public string incidentCategory { get; set; }
            public string categoryId { get; set; }
            public string subcategoryId { get; set; }
        }

        public class IncidentLocationDetail
        {
            public string itLocationId { get; set; }
            public string description { get; set; }
        }

        public class IncidentTrackingConsumerServiceLocations
        {
            public string description { get; set; }
            public string locationId { get; set; }
        }

        public class IncidentWidgetData
        {
            public string incidentId { get; set; }
            public string consumerId { get; set; }
            public string consumerName { get; set; }
            public string incidentCategory { get; set; }
            public string incidentDate { get; set; }
            public string viewedOn { get; set; }
            public string originallyEnteredBy { get; set; }
        }

        public class IncidentTrackingReviewTableData
        {
            public string incidentId { get; set; }
            public string locationName { get; set; }
            public string locationId { get; set; }
            public string consumerId { get; set; }
            public string consumerName { get; set; }
            public string incidentCategory { get; set; }
            public string incidentDate { get; set; }
            public string supervisorName { get; set; }
            public string supervisorId { get; set; }
            public string includeInCount { get; set; }
            public string incidentTime { get; set; }
            public string viewedOn { get; set; }
            public string originallyEnteredBy { get; set; }
        }

        public class IncidentTrackingReviewLocations
        {
            public string ID { get; set; }
            public string Name { get; set; }
            public string Residence { get; set; }
        }


        public class IncidentTrackingIT
        {
            public string ID { get; set; }
            public string Name { get; set; }
            public string Residence { get; set; }
        }

        public class EmployeesInvolvedEmployeeDropdown
        {
            public string employeeId { get; set; }
            public string employeeName { get; set; }
        }

        public class IncidentEditReviewDataAllObjects
        {
            public IncidentEditReviewData[] itReviewData { get; set; }
            public IncidentEditReviewConsumersInvolved[] itConsumerInvolved { get; set; }
            public IncidentEditReviewEmployeesInvolved[] itEmployeesInvolved { get; set; }
            public IncidentEditReviewOthersInvolved[] itOthersInvolved { get; set; }
        }


        public class IncidentEditReviewData
        {
            public string incidentId { get; set; }
            public string incidentTypeId { get; set; }
            public string incidentTypeDesc { get; set; }
            public string incidentDate { get; set; }
            public string incidentTime { get; set; }
            public string reportedDate { get; set; }
            public string reportedTime { get; set; }
            public string statusId { get; set; }
            public string subcategoryId { get; set; }
            public string locationId { get; set; }
            public string serviceLocation { get; set; }
            public string summary { get; set; }
            public string note { get; set; }
            public string prevention { get; set; }
            public string contributingFactor { get; set; }
            public string originallyEnteredByUserId { get; set; }
        }

        public class IncidentEditReviewConsumersInvolved
        {
            public string consumerId { get; set; }
            public string includeInCount { get; set; }
            public string firstName { get; set; }
            public string lastName { get; set; }
            public string involvementId { get; set; }
            public string involvementDescription { get; set; }
            public string locationId { get; set; }
            public string locationDescription { get; set; }
            public string consumerInvolvedId { get; set; }
        }

        public class IncidentEditReviewEmployeesInvolved
        {
            public string employeeId { get; set; }
            public string firstName { get; set; }
            public string lastName { get; set; }
            public string notes { get; set; }
            public string notifyEmployee { get; set; }
            public string description { get; set; }
            public string employeeInvolvementTypeId { get; set; }
        }

        public class IncidentEditReviewOthersInvolved
        {
            public string othersInvolvedId { get; set; }
            public string name { get; set; }
            public string company { get; set; }
            public string address1 { get; set; }
            public string address2 { get; set; }
            public string city { get; set; }
            public string state { get; set; }
            public string zipCode { get; set; }
            public string phone { get; set; }
            public string involvementTypeId { get; set; }
            public string involvementDescription { get; set; }
        }

        public class ReportScheduleId
        {
            public string reportScheduleId { get; set; }
        }

    }
}