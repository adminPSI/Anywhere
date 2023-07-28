using Anywhere.Data;
using Anywhere.service.Data.PlanInformedConsent;
using System;
using System.Collections.Generic;
using System.Runtime.InteropServices.ComTypes;
using System.Security.Cryptography;
using System.Text;
using System.Web.Script.Serialization;
using static Anywhere.service.Data.AnywhereAttachmentWorker;

namespace Anywhere.service.Data.ReportBuilder
{
    public class ReportBuilderWorker
    {
        JavaScriptSerializer js = new JavaScriptSerializer();
        ReportBuilderDataGetter rbdg = new ReportBuilderDataGetter();
        AnywhereWorker anywhereWorker = new AnywhereWorker();

        public ReportScheduleId[] generateReport(string token, string reportType, ReportData reportData)
        {
            ReportScheduleId[] reportScheduleId = null;

            switch (reportType)
            {
                //Day Service
                case "Individual Day Service Activity Report":
                    string result = generateIndividualDayServiceActivityReport(token, reportType, reportData);

                    reportScheduleId = js.Deserialize<ReportScheduleId[]>(result);
                    break;
                //Forms
                case "Form Listing - By Consumer":
                    result = generateformListingReport(token, reportType, reportData);

                    reportScheduleId = js.Deserialize<ReportScheduleId[]>(result);

                    break;
                //Outcomes
                case "Outcome Documentation":
                    result = generateOutcomeDocumentationReport(token, reportType, reportData);

                    reportScheduleId = js.Deserialize<ReportScheduleId[]>(result);

                    break;

                case "outcomeActivity":
                    result = generateOutcomeActivityReport(token, reportType, reportData);

                    reportScheduleId = js.Deserialize<ReportScheduleId[]>(result);

                    break;
                //Case Notes
                case "caseNotes":
                    result = generateDetailedCaseNotesReport(token, reportType, reportData);

                    reportScheduleId = js.Deserialize<ReportScheduleId[]>(result);

                    break;
                //Workshop
                case "jobActivity":
                    result = generatejobActivityReport(token, reportType, reportData);

                    reportScheduleId = js.Deserialize<ReportScheduleId[]>(result);

                    break;
                //Incident Tracking
                case "incidentReporting":
                    result = generateIncidentReport(token, reportType, reportData);

                    reportScheduleId = js.Deserialize<ReportScheduleId[]>(result);

                    break;
            }

            return reportScheduleId;
        }

        public string generateIndividualDayServiceActivityReport(string token, string reportType, ReportData reportData)
        {
            string category = "Day Services";
            string title = "Consumer Day Service Activity - By Location and Date of Service";
            string reportServerList = "Primary";
            string result = "";

            result = rbdg.generateIndividualDayServiceActivityReport(token, category, title, reportServerList, reportData.dayServiceLocation, reportData.dayServiceServiceDate);

            return result;
        }

        public string generateformListingReport(string token, string reportType, ReportData reportData)
        {
            string category = "Forms";
            string title = "Form Listing - By Consumer";
            string reportServerList = "Primary";
            string result = "";

            result = rbdg.generateformListingReport(token, category, title, reportServerList, reportData.formsConsumer);

            return result;
        }

        public string generateOutcomeDocumentationReport(string token, string reportType, ReportData reportData)
        {
            string category = "";
            string title = "";
            string reportServerList = "Primary";
            string result = "";

            //result = rbdg.generateIncidentTrackingReport(token, category, title, reportServerList);

            return result;
        }

        public string generateOutcomeActivityReport(string token, string reportType, ReportData reportData)
        {
            string category = "";
            string title = "";
            string reportServerList = "Primary";
            string result = "";

            //result = rbdg.generateIncidentTrackingReport(token, category, title, reportServerList);

            return result;
        }

        public string generateDetailedCaseNotesReport(string token, string reportType, ReportData reportData)
        {
            string category = "";
            string title = "";
            string reportServerList = "Primary";
            string result = "";

            //result = rbdg.generateIncidentTrackingReport(token, category, title, reportServerList);

            return result;
        }

        public string generatejobActivityReport(string token, string reportType, ReportData reportData)
        {
            string category = "";
            string title = "";
            string reportServerList = "Primary";
            string result = "";

            //result = rbdg.generateIncidentTrackingReport(token, category, title, reportServerList);

            return result;
        }

        public string generateIncidentReport(string token, string reportType, ReportData reportData)
        {
            string category = "";
            string title = "";
            string reportServerList = "Primary";
            string result = "";

            //result = rbdg.generateIncidentTrackingReport(token, category, title, reportServerList);

            return result;
        }

        public void viewReport(string token, string reportScheduleId)
        {
            Attachment attachment = new Attachment();
            attachment.filename = "Case Note Report";
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

        public class ReportData
        {
            public string dayServiceLocation { get; set; }
            public string dayServiceServiceDate { get; set; }
            public string formsConsumer { get; set; }

        }

        public class ReportScheduleId
        {
            public string reportScheduleId { get; set; }
        }
    }
}