using Anywhere.Log;
using Microsoft.Expression.Interactivity.Media;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Data.Odbc;
using System.IO;
using System.Linq;
using System.Web.Script.Serialization;
using static Anywhere.service.Data.CaseNoteSSA.CaseNoteSSAWorker;
using static Anywhere.service.Data.ConsumerFinances.ConsumerFinancesWorker;

namespace Anywhere.service.Data.ReportBuilder
{
    public class ReportBuilderDataGetter
    {
        private static Loger logger = new Loger();
        private string connectString = ConfigurationManager.ConnectionStrings["connection"].ToString();

        public bool tokenValidator(string token)
        {
            if (token.Contains(" "))
            {
                return false;
            }
            else
            {
                return true;
            }
        }

        public string removeUnsavableNoteText(string note)
        {
            if (note == "" || note is null)
            {
                return note;
            }
            if (note.Contains("'"))
            {
                note = note.Replace("'", "''");
            }
            if (note.Contains("\\"))
            {
                note = note.Replace("\\", "");
            }
            //if (note.Contains("\""))
            //{
            //    note = note.Replace("\"", "\"");
            //}
            return note;
        }

        public bool stringInjectionValidator(string uncheckedString)
        {
            string waitFor = "WAITFOR DELAY";
            string dropTable = "DROP TABLE";
            string deleteFrom = "DELETE FROM";
            if (uncheckedString.ToUpper().Contains(waitFor) || uncheckedString.ToUpper().Contains(dropTable) || uncheckedString.ToUpper().Contains(deleteFrom))
            {
                return false;
            }
            else
            {
                return true;
            }

        }
        public MemoryStream executeSQLReturnMemoryStream(string storedProdCall)
        {
            logger.debug("Attachment start");
            MemoryStream memorystream = new MemoryStream();
            OdbcConnection conn = null;
            OdbcCommand cmd;
            OdbcDataReader rdr = null;

            try
            {
                if (connectString.ToUpper().IndexOf("UID") == -1)
                {
                    connectString = connectString + "UID=anywhereuser;PWD=anywhere4u;";
                }
                conn = new OdbcConnection(connectString);

                cmd = new OdbcCommand(storedProdCall);
                cmd.CommandType = CommandType.Text;
                cmd.Connection = conn;

                conn.Open();
                logger.debug("Attachment connection open");
                var result = cmd.ExecuteReader();
                logger.debug("Attachment ExecuteReader done; entering result");
                if (result != null)
                {
                    logger.debug("Attachment result not null");
                    result.Read();
                    logger.debug("Attachment result.read done");
                    byte[] fileData = (byte[])result[0];
                    logger.debug("Attachment byte array made");
                    memorystream.Write(fileData, 0, fileData.Length);
                    logger.debug("Attachment data sent to memorystream");
                    //int bufferSize = 1000;
                    //byte[] outByte = new Byte[bufferSize];
                    //long retval;
                    //long startIndex = 0;

                    //// Reset the starting byte for the new BLOB.  
                    //startIndex = 0;

                    //// Read bytes into outByte[] and retain the number of bytes returned.  
                    //retval = result.GetBytes(1, startIndex, outByte, 0, bufferSize);
                    //while (retval == bufferSize)
                    //{
                    //    memorystream.Write(outByte);

                    //}

                    /*
                    logger.debug("Attachment result.Read done");
                    var fileLength = result.GetBytes(0, 0, null, 0, int.MaxValue);
                    logger.debug("Attachment quick test");
                    var blob = new Byte[fileLength];
                    logger.debug("Attachment new Blob");
                    result.GetBytes(0, 0, blob, 0, blob.Length);
                    logger.debug("Attachment get Bytes");
                    memorystream.Write(blob, 0, blob.Length);
                    logger.debug("Attachment memory stream write");
                    */
                }

            }
            catch (Exception ex)
            {
                //change now, calling method must catch this error, it helps make better logging 
                //more of a pain debugging
                throw ex;
            }

            finally
            {
                if (conn != null)
                {
                    conn.Close();
                    conn.Dispose();
                }
                if (rdr != null)
                {
                    rdr.Close();
                    rdr.Dispose();
                }
            }
            logger.debug("Attachment done");
            return memorystream;
        }

        public string executeDataBaseCallJSON(string storedProdCall)
        {
            OdbcConnection conn = null;
            OdbcCommand cmd;
            OdbcDataReader rdr = null;
            string result = "[";

            List<string> arr = new List<string>();

            try
            {
                if (connectString.ToUpper().IndexOf("UID") == -1)
                {
                    connectString = connectString + "UID=anywhereuser;PWD=anywhere4u;";
                }
                conn = new OdbcConnection(connectString);

                cmd = new OdbcCommand(storedProdCall);
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Connection = conn;

                conn.Open();
                rdr = cmd.ExecuteReader();

                // iterate through results
                while (rdr.Read())
                {
                    Dictionary<string, string> holder = new Dictionary<string, string>();
                    for (int ordinal = 0; ordinal < rdr.FieldCount; ordinal++)
                    {

                        var val = rdr.GetValue(ordinal);
                        string str = val.ToString();
                        holder[rdr.GetName(ordinal)] = str;
                    }
                    arr.Add((new JavaScriptSerializer()).Serialize(holder));
                }

            }
            catch (Exception ex)
            {
                //change now, calling method must catch this error, it helps make better logging 
                //more of a pain debugging
                throw ex;
            }

            finally
            {
                if (conn != null)
                {
                    conn.Close();
                    conn.Dispose();
                }
                if (rdr != null)
                {
                    rdr.Close();
                    rdr.Dispose();
                }
            }

            return result + String.Join(",", arr) + "]";
        }

        public string generateIndividualDayServiceActivityReport(string token, string category, string title, string reportServerList, string location, string serviceDate)
        {
            if (tokenValidator(token) == false) return null;
            logger.debug("generateIndividualDayServiceActivityReport ");
            List<string> list = new List<string>();
            list.Add(token);
            list.Add(category);
            list.Add(title);
            list.Add(reportServerList);
            list.Add(location);
            list.Add(serviceDate);
            string text = "CALL DBA.ANYW_GenerateIndividualDayServiceActivityReport(" + string.Join(",", list.Select(x => string.Format("'{0}'", removeUnsavableNoteText(x))).ToList()) + ")";
            try
            {
                return executeDataBaseCallJSON(text);
            }
            catch (Exception ex)
            {
                logger.error("1ITR", ex.Message + "ANYW_GenerateIndividualDayServiceActivityReport(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")");
                return "1ITR: error ANYW_GenerateIndividualDayServiceActivityReport";
            }
        }

        public string generateformListingReport(string token, string category, string title, string reportServerList, string consumer)
        {
            if (tokenValidator(token) == false) return null;
            logger.debug("generateformListingReport ");
            List<string> list = new List<string>();
            list.Add(token);
            list.Add(category);
            list.Add(title);
            list.Add(reportServerList);
            list.Add(consumer);
            string text = "CALL DBA.ANYW_GenerateformListingReport(" + string.Join(",", list.Select(x => string.Format("'{0}'", removeUnsavableNoteText(x))).ToList()) + ")";
            try
            {
                return executeDataBaseCallJSON(text);
            }
            catch (Exception ex)
            {
                logger.error("1ITR", ex.Message + "ANYW_GenerateformListingReport(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")");
                return "1ITR: error ANYW_GenerateformListingReport";
            }
        }

        public string generateDetailedCaseNotesReport(string token, string category, string title, string reportServerList, string billerId, string consumerId, string consumerName,
                                              string serviceStartDate, string serviceEndDate, string location, string originallyEnteredStart, string originallyEnteredEnd, string billCodeText, string service,
                                              string need, string contact)
        {
            if (tokenValidator(token) == false) return null;
            if (billCodeText == null)
            {
                billCodeText = "All";
            }
            logger.debug("generateDetailedCaseNotesReport ");
            string source = "";
            string filterSyntax = "";
            List<string> list = new List<string>();
            list.Add(token);
            list.Add(category);
            list.Add(title);
            list.Add(reportServerList);
            list.Add(source);
            list.Add(billerId);
            list.Add(consumerId);
            list.Add(consumerName);
            list.Add(serviceStartDate);
            list.Add(serviceEndDate);
            list.Add(location);
            list.Add(originallyEnteredStart);
            list.Add(originallyEnteredEnd);
            list.Add(billCodeText);
            list.Add(service);
            list.Add(need);
            list.Add(contact);
            list.Add(filterSyntax);
            string text = "CALL DBA.ANYW_CaseNotes_GenerateReport(" + string.Join(",", list.Select(x => string.Format("'{0}'", removeUnsavableNoteText(x))).ToList()) + ")";
            try
            {
                return executeDataBaseCallJSON(text);
            }
            catch (Exception ex)
            {
                logger.error("1CNR", ex.Message + "ANYW_CaseNotes_GenerateReport(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")");
                return "1CNR: error ANYW_CaseNotes_GenerateDetailReport";
            }
        }

        public string generateCaseNoteTimeReport(string token, string category, string title, string reportServerList, string billerId, string consumerId, string billCodeText, string serviceStartDate, string serviceEndDate)
        {
            if (tokenValidator(token) == false) return null;
            if (billCodeText == null)
            {
                billCodeText = "All";
            }
            string source = "";
            string filterSyntax = "";
            logger.debug("generateCaseNoteReport ");
            List<string> list = new List<string>();
            list.Add(token);
            list.Add(category);
            list.Add(title);
            list.Add(reportServerList);
            list.Add(source);
            list.Add(billerId);
            list.Add(consumerId);
            list.Add(billCodeText);
            list.Add(filterSyntax);
            list.Add(serviceStartDate);
            list.Add(serviceEndDate);
            string text = "CALL DBA.ANYW_CaseNotes_GenerateTimeReport(" + string.Join(",", list.Select(x => string.Format("'{0}'", removeUnsavableNoteText(x))).ToList()) + ")";
            try
            {
                return executeDataBaseCallJSON(text);
            }
            catch (Exception ex)
            {
                logger.error("1CNR", ex.Message + "ANYW_CaseNotes_GenerateReport(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")");
                return "1CNR: error ANYW_CaseNotes_GenerateDetailReport";
            }
        }

        public string generateMinutesByDateReport(string token, string category, string title, string reportServerList, string billerId, string consumerId, string consumerName,
                                              string serviceStartDate, string serviceEndDate, string location, string originallyEnteredStart, string originallyEnteredEnd, string billCodeText, string service,
                                              string need, string contact)
        { 
            if (tokenValidator(token) == false) return null;
            if (billCodeText == null)
            {
                billCodeText = "All";
            }
            logger.debug("generateDetailedCaseNotesReport ");
            string source = "";
            string filterSyntax = "";
            List<string> list = new List<string>();
            list.Add(token);
            list.Add(category);
            list.Add(title);
            list.Add(reportServerList);
            list.Add(source);
            list.Add(billerId);
            list.Add(billCodeText);
            list.Add(consumerId);
            list.Add(consumerName);
            list.Add(serviceStartDate);
            list.Add(serviceEndDate);
            list.Add(location);
            list.Add(originallyEnteredStart);
            list.Add(originallyEnteredEnd);
            list.Add(service);
            list.Add(need);
            list.Add(contact);
            list.Add(filterSyntax);
            string text = "CALL DBA.ANYW_CaseNotes_GenerateMinutesByDateReport(" + string.Join(",", list.Select(x => string.Format("'{0}'", removeUnsavableNoteText(x))).ToList()) + ")";
            try
            {
                return executeDataBaseCallJSON(text);
            }
            catch (Exception ex)
            {
                logger.error("1CNR", ex.Message + "ANYW_CaseNotes_GenerateMinutesByDateReport(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")");
                return "1CNR: error ANYW_CaseNotes_GenerateMinutesByDateReport";
            }
        }

        public string generateTXXCaseNotesReport(string token, string category, string title, string reportServerList, string billerId, string consumerId, string billingCode, string serviceStartDate, string serviceEndDate)
        {
            if (tokenValidator(token) == false) return null;
            logger.debug("generateTXXCaseNotesReport ");
            string source = "";
            List<string> list = new List<string>();
            list.Add(token);
            list.Add(category);
            list.Add(title);
            list.Add(reportServerList);
            list.Add(source);
            //list.Add(userId);
            list.Add(billerId);
            list.Add(consumerId);
            list.Add(billingCode);
            list.Add(serviceStartDate);
            list.Add(serviceEndDate);
            string text = "CALL DBA.ANYW_GenerateTXXCaseNotesReport(" + string.Join(",", list.Select(x => string.Format("'{0}'", removeUnsavableNoteText(x))).ToList()) + ")";
            try
            {
                return executeDataBaseCallJSON(text);
            }
            catch (Exception ex)
            {
                logger.error("1CNR", ex.Message + "ANYW_GenerateTXXCaseNotesReport(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")");
                return "1CNR: error ANYW_GenerateTXXCaseNotesReport";
            }
        }

        public string generateOutcomeDocumentationReport(string token, string category, string title, string reportServerList, string outcomesDate, string outcomesConsumer, string outcomesType)
        {
            if (tokenValidator(token) == false) return null;
            logger.debug("generateOutcomeDocumentationReport ");
            List<string> list = new List<string>();
            list.Add(token);
            list.Add(category);
            list.Add(title);
            list.Add(reportServerList);
            list.Add(outcomesDate); 
            list.Add(outcomesConsumer);
            //list.Add(outcomesService);
            list.Add(outcomesType);
            string text = "CALL DBA.ANYW_GenerateOutcomeDocumentationReport(" + string.Join(",", list.Select(x => string.Format("'{0}'", removeUnsavableNoteText(x))).ToList()) + ")";
            try
            {
                return executeDataBaseCallJSON(text);
            }
            catch (Exception ex)
            {
                logger.error("1ITR", ex.Message + "ANYW_GenerateOutcomeDocumentationReport(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")");
                return "1ITR: error ANYW_GenerateOutcomeDocumentationReport";
            }
        }

        public string generateOutcomeActivityReport(string token, string category, string title, string reportServerList, string outcomesService, string outcomesDate, string outcomesConsumer)
        {
            if (tokenValidator(token) == false) return null;
            logger.debug("generateOutcomeActivityReport ");
            List<string> list = new List<string>();
            list.Add(token);
            list.Add(category);
            list.Add(title);
            list.Add(reportServerList);
            list.Add(outcomesDate);
            list.Add(outcomesConsumer);
            //list.Add(outcomesService);
            string text = "CALL DBA.ANYW_GenerateOutcomeActivityReport(" + string.Join(",", list.Select(x => string.Format("'{0}'", removeUnsavableNoteText(x))).ToList()) + ")";
            try
            {
                return executeDataBaseCallJSON(text);
            }
            catch (Exception ex)
            {
                logger.error("1ITR", ex.Message + "ANYW_GenerateOutcomeActivityReport(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")");
                return "1ITR: error ANYW_GenerateOutcomeActivityReport";
            }
        }

        public string generateJobActivityReport(string token, string category, string title, string reportServerList, string location, string job, string startDate, string endDate, string selectedDate)
        {
            if (tokenValidator(token) == false) return null;
            logger.debug("generatejobActivityReport ");
            List<string> list = new List<string>();
            list.Add(token);
            list.Add(category);
            list.Add(title);
            list.Add(reportServerList);
            list.Add(location); 
            list.Add(job);
            list.Add(startDate);
            list.Add(endDate);
            list.Add(selectedDate);
            string text = "CALL DBA.ANYW_GeneratejobActivityReport(" + string.Join(",", list.Select(x => string.Format("'{0}'", removeUnsavableNoteText(x))).ToList()) + ")";
            try
            {
                return executeDataBaseCallJSON(text);
            }
            catch (Exception ex)
            {
                logger.error("1ITR", ex.Message + "ANYW_GeneratejobActivityReport(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")");
                return "1ITR: error ANYW_GeneratejobActivityReport";
            }
        }

        public string generateIncidentReportingLog(string token, string category, string title, string reportServerList, string location, string consumer, string fromDate, string toDate)
        {
            if (tokenValidator(token) == false) return null;
            logger.debug("generateIncidentReport ");

            List<string> list = new List<string>();
            list.Add(token);
            list.Add(category);
            list.Add(title);
            list.Add(reportServerList);
            list.Add(location);
            list.Add(consumer);
            list.Add(fromDate);
            list.Add(toDate);
            string text = "CALL DBA.ANYW_GenerateIndividualReportingLog(" + string.Join(",", list.Select(x => string.Format("'{0}'", removeUnsavableNoteText(x))).ToList()) + ")";
            try
            {
                return executeDataBaseCallJSON(text);
            }
            catch (Exception ex)
            {
                logger.error("1ITR", ex.Message + "ANYW_GenerateIndividualReportingLog(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")");
                return "1ITR: error ANYW_GenerateIndividualReportingLog";
            }
        }

        public string generateWaitingListAssessmentReport(string token, string category, string title, string reportServerList, string waitingListId)
        {
            if (tokenValidator(token) == false) return null;
            logger.debug("generateWaitingListAssessmentReport ");

            List<string> list = new List<string>();
            list.Add(token);
            list.Add(category);
            list.Add(title);
            list.Add(reportServerList);
            list.Add(waitingListId);
            string text = "CALL DBA.ANYW_WaitingList_GenerateWaitingListAssessmentReport(" + string.Join(",", list.Select(x => string.Format("'{0}'", removeUnsavableNoteText(x))).ToList()) + ")";
            try
            {
                return executeDataBaseCallJSON(text);
            }
            catch (Exception ex)
            {
                logger.error("1ITR", ex.Message + "ANYW_WaitingList_GenerateWaitingListAssessmentReport(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")");
                return "1ITR: error ANYW_WaitingList_GenerateWaitingListAssessmentReport";
            }
        }

        public string sendWaitingListReport(string token, string reportScheduleId, string header, string body, string waitingListId)
        {
            if (tokenValidator(token) == false) return null;
            logger.debug("sendWaitingListAssessmentReport  ");
            List<string> list = new List<string>();
            list.Add(reportScheduleId);
            list.Add(header);
            list.Add(body);
            list.Add(waitingListId);
            string text = "CALL DBA.ANYW_WaitingList_SendWaitingListAssessmentReport (" + string.Join(",", list.Select(x => string.Format("'{0}'", removeUnsavableNoteText(x))).ToList()) + ")";
            try
            {
                return executeDataBaseCallJSON(text);
            }
            catch (Exception ex)
            {
                logger.error("1ITR", ex.Message + "ANYW_WaitingList_SendWaitingListAssessmentReport (" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")");
                return "1ITR: error ANYW_WaitingList_SendWaitingListAssessmentReport ";
            }
        }

        public string checkIfReportExists(string token, string reportRequestId)
        {
            if (tokenValidator(token) == false) return null;
            logger.debug("checkIfReportExists  ");
            List<string> list = new List<string>();
            list.Add(reportRequestId);
            string text = "CALL DBA.ANYW_CheckIfReportExists (" + string.Join(",", list.Select(x => string.Format("'{0}'", removeUnsavableNoteText(x))).ToList()) + ")";
            try
            {
                return executeDataBaseCallJSON(text);
            }
            catch (Exception ex)
            {
                logger.error("1CNR", ex.Message + "ANYW_CheckIfReportExists (" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")");
                return "1CNR: error ANYW_CheckIfReportExists ";
            }
        }

        public MemoryStream viewReport(string reportScheduleId)
        {
            logger.debug("viewReport " + reportScheduleId);
            List<string> list = new List<string>();
            list.Add(reportScheduleId);
            string text = "CALL DBA.ANYW_ViewReport(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")";
            try
            {
                //MemoryStream temp = new MemoryStream();
                //temp = executeSQLReturnMemoryStream("SELECT Attachment from Attachments where Attachment_ID = " + attachmentId);
                //temp = executeSQLReturnMemoryStream(text);
                return executeSQLReturnMemoryStream(text);
            }
            catch (Exception ex)
            {
                logger.error("640", ex.Message + "CALL DBA.ANYW_ViewReport(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")");
                return null;
            }
        }


    }
}