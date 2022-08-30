using Anywhere.Log;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Data.Odbc;
using System.IO;
using System.Linq;
using System.Web;
using System.Web.Script.Serialization;

namespace Anywhere.service.Data.CaseNoteReportBuilder
{
    public class CaseNoteReportBuilderDataGetter
    {
        private static Loger logger = new Loger();
        private string connectString = ConfigurationManager.ConnectionStrings["connection"].ToString();

        public string generateCaseNoteReport(string token, string category, string title, string reportServerList, string source, string userId, string billerId, string consumerId, string consumerName,
                                              string serviceStartDate, string serviceEndDate, string location, string originallyEnteredStart, string originallyEnteredEnd, string billingCode, string service,
                                              string need, string contact, string filterSyntax)
        {
            if (tokenValidator(token) == false) return null;
            if (stringInjectionValidator(filterSyntax) == false) return null;
            logger.debug("generateCaseNoteReport ");
            List<string> list = new List<string>();
            list.Add(token);
            list.Add(category);
            list.Add(title);
            list.Add(reportServerList);
            list.Add(source);
            //list.Add(userId);
            list.Add(billerId);
            list.Add(consumerId);
            list.Add(consumerName);
            list.Add(serviceStartDate);
            list.Add(serviceEndDate);
            list.Add(location);
            list.Add(originallyEnteredStart);
            list.Add(originallyEnteredEnd);
            list.Add(billingCode);
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

        public string generateCaseNoteTimeReport(string token, string category, string title, string reportServerList, string source, string userId, string billerId, string consumerId, string billingCode, 
                                             string filterSyntax, string serviceStartDate, string serviceEndDate)
        {
            if (tokenValidator(token) == false) return null;
            if (stringInjectionValidator(filterSyntax) == false) return null;
            logger.debug("generateCaseNoteReport ");
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

        public string checkIfCNReportExists(string token, string reportScheduleId)
        {
            if (tokenValidator(token) == false) return null;
            logger.debug("checkIfCNReportExists ");
            List<string> list = new List<string>();
            list.Add(reportScheduleId);
            string text = "CALL DBA.ANYW_CaseNotes_CheckIfCNReportExists(" + string.Join(",", list.Select(x => string.Format("'{0}'", removeUnsavableNoteText(x))).ToList()) + ")";
            try
            {
                return executeDataBaseCallJSON(text);
            }
            catch (Exception ex)
            {
                logger.error("1CNR", ex.Message + "ANYW_CaseNotes_CheckIfCNReportExists(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")");
                return "1CNR: error ANYW_CaseNotes_CheckIfCNReportExists";
            }
        }

        public MemoryStream viewCaseNoteReport(string reportScheduleId)
        {
            logger.debug("viewCaseNoteReport " + reportScheduleId);
            List<string> list = new List<string>();
            list.Add(reportScheduleId);
            string text = "CALL DBA.ANYW_CaseNotes_GetReport(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")";
            try
            {
                //MemoryStream temp = new MemoryStream();
                //temp = executeSQLReturnMemoryStream("SELECT Attachment from Attachments where Attachment_ID = " + attachmentId);
                //temp = executeSQLReturnMemoryStream(text);
                return executeSQLReturnMemoryStream(text);
            }
            catch (Exception ex)
            {
                logger.error("640", ex.Message + "CALL DBA.ANYW_CaseNotes_GetReport(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")");
                return null;
            }
        }

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
    }
}