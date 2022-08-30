using iAnywhere.Data.SQLAnywhere;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data.SqlClient;
using System.Linq;
using System.Web;
using Anywhere.Log;
using System.Data;
using System.Web.Script.Serialization;
using System.Text;
using Newtonsoft.Json;
using static Anywhere.service.Data.AnywhereAttachmentWorker;

namespace Anywhere.service.Data.CaseNoteReportBuilder
{
    public class CaseNoteReportBuilderWorker
    {
        CaseNoteReportBuilderDataGetter cnrdG = new CaseNoteReportBuilderDataGetter();
        JavaScriptSerializer js = new JavaScriptSerializer();
        AnywhereWorker anywhereWorker = new AnywhereWorker();
        StringBuilder sb = new StringBuilder();
        //public ReportScheduleId[] generateCNDetailReport(string token, string userId, string billerId, string consumerId, string consumerName, string serviceStartDate, string serviceEndDate, string enteredDateStart, string enteredDateEnd,
        //    string billingCode, string location, string service, string need, string contact, string applicationName)
        public ReportScheduleId[] generateCNDetailReport(string token, string userId, string billerId, string consumerId, string consumerName, string serviceStartDate, string serviceEndDate, 
                                                        string location, string originallyEnteredStart, string originallyEnteredEnd, string billingCode, string service, string need, string contact, string applicationName)
        {
            string category = "Case Notes";
            string title = "Detailed Case Notes";
            string reportServerList = "Primary";
            string source = "Report Window";
            string filterSyntax = "";
            string result = "";

            filterSyntax = cnDetailReportFilterSyntaxBuilder(userId, billerId, consumerId, consumerName, serviceStartDate, serviceEndDate,
                                                         location, originallyEnteredStart, originallyEnteredEnd, billingCode, service, need, contact);
            result = cnrdG.generateCaseNoteReport(token, category, title, reportServerList, source, userId, billerId, consumerId, consumerName, serviceStartDate, serviceEndDate,
                                                         location, originallyEnteredStart, originallyEnteredEnd, billingCode, service, need, contact, filterSyntax);
            ReportScheduleId[] reportScheduleId = js.Deserialize<ReportScheduleId[]>(result);
            return reportScheduleId;
        }

        public ReportScheduleId[] generateCNTimeAnalysisReport(string token, string userId, string billerId, string consumerId, string billingCode, string serviceStartDate, string serviceEndDate, string applicationName)
        {
            string category = "Case Notes";
            string title = "Case Notes Time Analysis with Doc and Travel Time ANYWTEST";
            string reportServerList = "Primary";
            string source = "Report Window";
            string filterSyntax = "";
            string result = "";

            //filterSyntax = cnTimeReportFilterSyntaxBuilder(userId, billerId, consumerId, billingCode);
            result = cnrdG.generateCaseNoteTimeReport(token, category, title, reportServerList, source, userId, billerId, consumerId, billingCode, filterSyntax, serviceStartDate, serviceEndDate);
            ReportScheduleId[] reportScheduleId = js.Deserialize<ReportScheduleId[]>(result);
            return reportScheduleId;
        }

        public string cnDetailReportFilterSyntaxBuilder(string userId, string billerId, string consumerId, string consumerName, string serviceStartDate, string serviceEndDate,
                                                        string location, string originallyEnteredStart, string originallyEnteredEnd, string billingCode, string service, string need, string contact)
        {            
            string filterSyntax = "";
            string percent = "%";
           // sb.Clear();
            //sb.AppendFormat("User ID = '{0}' ", userId);
            if (contact.Equals("%"))
            {
                sb.AppendFormat("Contact = {0} or  Contact is null ", contact);
            }else
            {
                sb.AppendFormat("Contact = {0} ", contact);
            }
            if (consumerName.Equals("All"))
            {
                //sb.AppendFormat("and (Consumer Full Name like '{0}' or  Consumer Full Name is null) ", percent);
                sb.AppendFormat("Consumer Full Name = {0}  ", percent);
            }
            else
            {
                //sb.AppendFormat("and Consumer = '{0}' ", consumerName);
                sb.AppendFormat("Consumer Full Name = {0} ", consumerName);
            }
            //sb.AppendFormat("and User ID = {0} ", userId);
            //sb.AppendFormat("and Date of Service between '{0}' and '{1}' ", serviceStartDate, serviceEndDate);
            //sb.AppendFormat("and Originally Entered Date between '{0}' and '{1}' ", enteredDateStart, enteredDateEnd);
            //if (location.Equals("%"))
            //{
            //    sb.AppendFormat("and (Location like '{0}' or  location is null) ", location);
            //}else
            //{
            //    sb.AppendFormat("and Location = {0} ", location);
            //}
            if (billingCode.Equals("%"))
            {
                sb.AppendFormat("and (Service Code = {0} or  Service Code is null) ", billingCode);
            }else
            {
                sb.AppendFormat("and Service Code = {0} ", billingCode);
            }
            //if (service.Equals("%"))
            //{
            //    sb.AppendFormat("and (Service like '{0}' or  Service is null) ", service);
            //}else
            //{
            //    sb.AppendFormat("and Service = {0} ", service);
            //}
            //if (need.Equals("%"))
            //{
            //    sb.AppendFormat("and (Service Need like '{0}' or  Need is null) ", need);
            //}else
            //{
            //    sb.AppendFormat("and Service Need = {0} ", need);

            //}
            //if (contact.Equals("%"))
            //{
            //    sb.AppendFormat("and (Contact like '{0}' or  Contact is null) ", contact);
            //}else
            //{
            //    sb.AppendFormat("and Contact = {0} ", contact);
            //}

            filterSyntax = sb.ToString();
            return filterSyntax;
        }

        public string cnTimeReportFilterSyntaxBuilder(string userId, string billerId, string consumerId, string consumerName, string serviceStartDate, string serviceEndDate)
        {
            StringBuilder sb = new StringBuilder();
            string filterSyntax = "";
            string percent = "%";
            sb.Clear();
            //sb.AppendFormat("User ID = '{0}' ", userId);
            if (consumerName.Equals("All"))
            {
                //sb.AppendFormat("and (Consumer Full Name like '{0}' or  Consumer Full Name is null) ", percent);
                sb.AppendFormat("Consumer Full Name = {0}  ", percent);
            }
            else
            {
                //sb.AppendFormat("and Consumer = '{0}' ", consumerName);
                sb.AppendFormat("Consumer Full Name = {0} ", consumerName);
            }
            sb.AppendFormat("and User ID = {0} ", userId);
            //sb.AppendFormat("and Date of Service between '{0}' and '{1}' ", serviceStartDate, serviceEndDate);
            //sb.AppendFormat("and Originally Entered Date between '{0}' and '{1}' ", enteredDateStart, enteredDateEnd);
            //if (location.Equals("%"))
            //{
            //    sb.AppendFormat("and (Location like '{0}' or  location is null) ", location);
            //}else
            //{
            //    sb.AppendFormat("and Location = {0} ", location);
            //}
            //if (billingCode.Equals("%"))
            //{
            //    sb.AppendFormat("and (Service Code like '{0}' or  Service Code is null) ", billingCode);
            //}else
            //{
            //    sb.AppendFormat("and Service Code = {0} ", billingCode);
            //}
            //if (service.Equals("%"))
            //{
            //    sb.AppendFormat("and (Service like '{0}' or  Service is null) ", service);
            //}else
            //{
            //    sb.AppendFormat("and Service = {0} ", service);
            //}
            //if (need.Equals("%"))
            //{
            //    sb.AppendFormat("and (Service Need like '{0}' or  Need is null) ", need);
            //}else
            //{
            //    sb.AppendFormat("and Service Need = {0} ", need);

            //}
            //if (contact.Equals("%"))
            //{
            //    sb.AppendFormat("and (Contact like '{0}' or  Contact is null) ", contact);
            //}else
            //{
            //    sb.AppendFormat("and Contact = {0} ", contact);
            //}

            filterSyntax = sb.ToString();
            return filterSyntax;
        }

        public string checkIfCNReportExists(string token, string reportScheduleId)
        {
            return cnrdG.checkIfCNReportExists(token, reportScheduleId);
        }

        public void viewCaseNoteReport(string token, string reportScheduleId)
        {
            Attachment attachment = new Attachment();
            attachment.filename = "Case Note Report";
            attachment.data = null;
            bool isTokenValid = anywhereWorker.ValidateToken(token);
            if (isTokenValid)
            {
                try
                {
                    //attachment.filename = dg.getCNAttachmentFileName(attachmentId);
                    attachment.data = cnrdG.viewCaseNoteReport(reportScheduleId);//reused
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
                    response.AddHeader("content-disposition", "attachment;filename=" + attachment.filename+".pdf" + ";");
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

        public class ReportScheduleId
        {
            public string reportScheduleId { get; set; }
        }
    }
}