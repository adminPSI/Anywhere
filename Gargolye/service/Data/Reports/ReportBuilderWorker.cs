using Anywhere.Data;
using Anywhere.service.Data.CaseNoteReportBuilder;
using Anywhere.service.Data.PlanInformedConsent;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.InteropServices.ComTypes;
using System.Security.Cryptography;
using System.Text;
using System.Web.Script.Serialization;
using static Anywhere.service.Data.AnywhereAttachmentWorker;
using static Anywhere.service.Data.CaseNoteSSA.CaseNoteSSAWorker;
using static Anywhere.service.Data.ConsumerFinances.ConsumerFinancesWorker;
using static Anywhere.service.Data.SimpleMar.SignInUser;

namespace Anywhere.service.Data.ReportBuilder
{
    public class ReportBuilderWorker
    {
        JavaScriptSerializer js = new JavaScriptSerializer();
        ReportBuilderDataGetter rbdg = new ReportBuilderDataGetter();
        AnywhereWorker anywhereWorker = new AnywhereWorker();
        CaseNoteReportBuilderDataGetter cnrdG = new CaseNoteReportBuilderDataGetter();
        DataGetter dg = new DataGetter();

        public ReportScheduleId[] generateReport(string token, string reportType, ReportData reportData)
        {
            ReportScheduleId[] reportScheduleId = null;

            switch (reportType)
            {
                //Day Service
                case "Individual Day Service Activity Report":
                    string result = generateIndividualDayServiceActivityReport(token, reportData);

                    reportScheduleId = js.Deserialize<ReportScheduleId[]>(result);
                    break;
                //Forms
                case "Form Listing - By Consumer":
                    result = generateformListingReport(token, reportData);

                    reportScheduleId = js.Deserialize<ReportScheduleId[]>(result);

                    break;
                //Outcomes
                case "Documentation - Completed With Percentages":
                    result = generateOutcomeDocumentationReport(token, reportData);

                    reportScheduleId = js.Deserialize<ReportScheduleId[]>(result);

                    break;

                case "Outcome Activity - With Community Integration by Employee, Consumer, Date":
                    result = generateOutcomeActivityReport(token, reportData);

                    reportScheduleId = js.Deserialize<ReportScheduleId[]>(result);

                    break;
                //Case Notes
                case "Detailed Case Notes By Biller":
                    result = generateDetailedCaseNotesReport(token, reportData);

                    reportScheduleId = js.Deserialize<ReportScheduleId[]>(result);

                    break;

                case "Minutes By Date":
                    result = generateMinutesByDateReport(token, reportData);

                    reportScheduleId = js.Deserialize<ReportScheduleId[]>(result);

                    break;

                    // GK only
                case "Detail Report":
                    result = generateDetailedCaseNotesReportGK(token, reportData);

                    reportScheduleId = js.Deserialize<ReportScheduleId[]>(result);

                    break;

                case "Time Analysis Report":
                    result = generateTimeAnalysisCaseNotesReport(token, reportData);

                    reportScheduleId = js.Deserialize<ReportScheduleId[]>(result);

                    break;

                case "TXX Case Notes":
                    result = generateTXXCaseNotesReport(token, reportData);

                    reportScheduleId = js.Deserialize<ReportScheduleId[]>(result);

                    break;
                //Workshop
                case "Job Activity Detail Report by Employee and Job":
                    result = generatejobActivityReport(token, reportData);

                    reportScheduleId = js.Deserialize<ReportScheduleId[]>(result);

                    break;
                //Incident Tracking
                case "Incident Reporting Log":
                    result = generateIncidentReportingLog(token, reportData);

                    reportScheduleId = js.Deserialize<ReportScheduleId[]>(result);

                    break;
                //Employment
                case "Employee Reporting Information":
                    result = generateEmploymentReport(token, reportData);

                    reportScheduleId = js.Deserialize<ReportScheduleId[]>(result);

                    break;
                //Case Load
                case "My Case Load Roster List":
                    result = generateCaseLoadRosterListReport(token, reportData);

                    reportScheduleId = js.Deserialize<ReportScheduleId[]>(result);

                    break;
            }

            return reportScheduleId;
        }

        public string generateIndividualDayServiceActivityReport(string token, ReportData reportData)
        {
            string category = "Day Services";
            string title = "Consumer Day Service Activity - By Location and Date of Service";
            string reportServerList = "Primary";
            string result = "";

            result = rbdg.generateIndividualDayServiceActivityReport(token, category, title, reportServerList, reportData.dayServiceLocation, reportData.dayServiceServiceDate);

            return result;
        }

        public string generateformListingReport(string token, ReportData reportData)
        {
            string category = "Forms";
            string title = "Form Listing - By Consumer";
            string reportServerList = "Primary";
            string result = "";

            result = rbdg.generateformListingReport(token, category, title, reportServerList, reportData.formsConsumer);

            return result;
        }

        public string generateOutcomeDocumentationReport(string token, ReportData reportData)
        {
            string category = "Outcomes and Services";
            string title = "Habilitation Documentation - Completed with Percentages";
            string reportServerList = "Primary";
            string result = "";

            result = rbdg.generateOutcomeDocumentationReport(token, category, title, reportServerList, reportData.outcomesDate, reportData.outcomesConsumer, reportData.outcomesType);

            return result;
        }

        public string generateOutcomeActivityReport(string token, ReportData reportData)
        {
            string category = "Outcomes and Services";
            string title = "Outcome Activity - With Community Integration by Employee, Consumer, Date";
            string reportServerList = "Primary";
            string result = "";

            result = rbdg.generateOutcomeActivityReport(token, category, title, reportServerList, reportData.outcomesService, reportData.outcomesDate, reportData.outcomesConsumer);

            return result;
        }

        public string generateDetailedCaseNotesReport(string token, ReportData reportData)
        {
            string category = "Case Notes";
            string title = "Detailed Case Notes By Biller";
            string reportServerList = "Primary";
            string result = "";

            result = rbdg.generateDetailedCaseNotesReport(token, category, title, reportServerList, reportData.billerId, reportData.consumer, reportData.consumerName, reportData.serviceDateStart, reportData.serviceDateEnd, reportData.location,
                reportData.enteredDateStart, reportData.enteredDateEnd, reportData.billingCode, reportData.service, reportData.need, reportData.contact);

            return result;
        }

        public string generateMinutesByDateReport(string token, ReportData reportData)
        {
            string category = "Case Notes";
            string title = "Minutes By Date";
            string reportServerList = "Primary";
            string result = "";
            string caseloadRestriction = "";

            // Apply filters based on permissions used in the front-end
            if (reportData.viewEntered == "false")
            {
                reportData.userId = "";
            }

            if (reportData.caseloadOnly == "true")
            {
                caseloadRestriction = dg.getCaseLoadRestriction(token);

                // Deserialize JSON into a list of dictionaries
                List<Dictionary<string, string>> people = JsonConvert.DeserializeObject<List<Dictionary<string, string>>>(caseloadRestriction);

                // Extract IDs
                List<string> ids = people.Select(p => p["id"]).ToList();

                // Create comma-separated list
                string commaSeparatedIds = string.Join(",", ids);

                caseloadRestriction = commaSeparatedIds;
            }

            result = rbdg.generateMinutesByDateReport(token, category, title, reportServerList, reportData.billerId, reportData.consumer, reportData.consumerName, reportData.serviceDateStart, reportData.serviceDateEnd, reportData.location,
                reportData.enteredDateStart, reportData.enteredDateEnd, reportData.billingCode, reportData.service, reportData.need, reportData.contact, reportData.userId, caseloadRestriction);

            return result;
        }

        public string generateDetailedCaseNotesReportGK(string token, ReportData reportData)
        {
            string category = "Case Notes";
            string title = "Detailed Case Notes";
            string reportServerList = "Primary";
            string result = "";

            result = rbdg.generateDetailedCaseNotesReport(token, category, title, reportServerList, reportData.billerId, reportData.consumer, reportData.consumerName, reportData.serviceDateStart, reportData.serviceDateEnd, reportData.location,
                reportData.enteredDateStart, reportData.enteredDateEnd, reportData.billCodeText, reportData.service, reportData.need, reportData.contact);

            return result;
        }

        public string generateTimeAnalysisCaseNotesReport(string token, ReportData reportData)
        {
            string category = "Case Notes";
            string title = "Case Notes Time Analysis with Doc and Travel Time ANYWTEST";
            string reportServerList = "Primary";
            string result = "";

            result = rbdg.generateCaseNoteTimeReport(token, category, title, reportServerList, reportData.billerId, reportData.consumer, reportData.billCodeText, reportData.serviceDateStart, reportData.serviceDateEnd);

            return result;
        }

        public string generateTXXCaseNotesReport(string token, ReportData reportData)
        {
            string category = "Case Notes";
            string title = "TXX Case Notes";
            string reportServerList = "Primary";
            string result = "";

            DateTime startDate = DateTime.Parse(reportData.serviceDateStart);
            string formattedStartDateString = startDate.ToString("MM/dd/yyyy");
            DateTime endDate = DateTime.Parse(reportData.serviceDateEnd);
            string formattedEndDateString = endDate.ToString("MM/dd/yyyy");

            result = rbdg.generateTXXCaseNotesReport(token, category, title, reportServerList, reportData.billerId, reportData.consumer, reportData.billingCode, formattedStartDateString, formattedEndDateString);

            return result;
        }

        public string generatejobActivityReport(string token, ReportData reportData)
        {
            string category = "Workshop";
            string title = "Job Activity Detail Report by Employee and Job";
            string reportServerList = "Primary";
            string result = "";

            result = rbdg.generateJobActivityReport(token, category, title, reportServerList, reportData.workshopLocation, reportData.workshopJob, reportData.workshopStartDate, reportData.workshopEndDate, reportData.workshopDate);
            return result;
        }

        public string generateIncidentReportingLog(string token, ReportData reportData)
        {
            string category = "Incident Tracking";
            string title = "Incident Reporting Log";
            string reportServerList = "Primary";
            string result = "";

            result = rbdg.generateIncidentReportingLog(token, category, title, reportServerList, reportData.ITLocation, reportData.ITConsumer, reportData.ITFromDate, reportData.ITToDate);

            return result;
        }

        public string generateWaitingListAssessmentReport(string token, string waitingListId)
        {
            string category = "Waiting List";
            string title = "Ohio Assessment for Immediate and Current Needs";
            string reportServerList = "Primary";
            string result = "";

            result = rbdg.generateWaitingListAssessmentReport(token, category, title, reportServerList, waitingListId);

            return result;
        }

        public string sendWaitingListAssessmentReport(string token, string reportScheduleId, string header, string body, string waitingListId)
        {
            return rbdg.sendWaitingListReport(token, reportScheduleId, header, body, waitingListId);
        }

        public void viewReport(string token, string reportScheduleId)
        {
            Attachment attachment = new Attachment();
            attachment.filename = "Anywhere Report";
            attachment.data = null;
            bool isTokenValid = anywhereWorker.ValidateToken(token);
            if (isTokenValid)
            {
                try
                {
                    attachment.data = rbdg.viewReport(reportScheduleId);//reused
                }
                catch (Exception ex)
                {

                }
            }
            displayAttachment(attachment);
        }

        public void displayAttachment(Attachment attachment)
        {
            var current = System.Web.HttpContext.Current;
            var response = current.Response;
            response.Buffer = true;
            try
            {
                response.Clear();
                if (attachment.filename == "")
                {
                    response.StatusCode = 404;
                    response.Status = "404 Not Found";
                }
                else
                {
                    byte[] bytes = StreamExtensions.ToByteArray(attachment.data);
                    response.AddHeader("content-disposition", "attachment;filename=" + attachment.filename + ".pdf" + ";");
                    response.ContentType = "application/pdf";
                    response.AddHeader("Transfer-Encoding", "identity");
                    response.BinaryWrite(bytes);
                }
            }
            catch (Exception ex)
            {
                response.Write("Error: " + ex.InnerException.ToString());
            }
            finally
            {
                //logger2.debug("Done?");
            }
        }

        public string checkIfReportExists(string token, string reportScheduleId)
        {
            return rbdg.checkIfReportExists(token, reportScheduleId);
        }

        public string generateEmploymentReport(string token, ReportData reportData)
        {
            string category = "Employment";
            string title = "Employment Reporting Information";
            string reportServerList = "Primary";
            string result = "";

            result = rbdg.generateEmploymentReport(token, category, title, reportServerList, reportData.employer, reportData.position, reportData.positionStartDate, reportData.positionEndDate, reportData.jobStanding, reportData.consumerID);
            return result;
        }

        public string generateCaseLoadRosterListReport(string token, ReportData reportData)
        {
            string category = "Demographics - Case Load";
            string title = "My Case Load Roster List";
            string reportServerList = "Primary";
            string result = "";

            result = rbdg.generateCaseLoadRosterListReport(token, category, title, reportServerList);
            return result;
        }

        public class ReportData
        {
            public string userId { get; set; }

            // DAY SERVICES
            public string dayServiceLocation { get; set; }
            public string dayServiceServiceDate { get; set; }

            // FORMS
            public string formsConsumer { get; set; }
            
            // OUTCOMES
            public string outcomesConsumer { get; set; }
            public string outcomesDate { get; set; }
            public string outcomesService { get; set; }
            public string outcomesType { get; set; }

            // CASE NOTES
            public string billerId { get; set; }
            public string consumer { get; set; }
            public string consumerName { get; set; }
            public string billCodeText { get; set; }
            public string billingCode { get; set; }
            public string reviewStatus { get; set; }
            public string serviceDateStart { get; set; }
            public string serviceDateEnd { get; set; }
            public string enteredDateStart { get; set; }
            public string enteredDateEnd { get; set; }
            public string location { get; set; }
            public string service { get; set; }
            public string need { get; set; }
            public string contact { get; set; }
            public string confidential { get; set; }
            public string corrected { get; set; }
            public string billed { get; set; }
            public string attachments { get; set; }
            public string overlaps { get; set; }
            public string noteText { get; set; }
            public string noteTextValue { get; set; }
            public string viewEntered { get; set; }
            public string caseloadOnly { get; set; }

            // INCIDENT TRACKING
            public string ITLocation { get; set; }
            public string ITConsumer { get; set; }
            public string ITFromDate { get; set; }
            public string ITToDate { get; set; }

            // WORKSHOP
            public string workshopLocation { get; set; }
            public string workshopJob { get; set; }
            public string workshopDate { get; set; }
            public string workshopStartDate { get; set; }
            public string workshopEndDate { get; set; }

            // Employment 
            public string employer { get; set; }
            public string position { get; set; }
            public string positionStartDate { get; set; }
            public string positionEndDate { get; set; }
            public string jobStanding { get; set; }
            public string consumerID { get; set; }
        }

        public class ReportScheduleId
        {
            public string reportScheduleId { get; set; }
        }
    }
}