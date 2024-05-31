using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Text.RegularExpressions;
using System.Data;
using System.Data.Odbc;
using System.IO;
using System.Linq;
using System.Web.Script.Serialization;
using Anywhere.Log;
using System.Configuration;
using static Anywhere.service.Data.WaitingListAssessment.WaitingListWorker;
using Org.BouncyCastle.Bcpg.OpenPgp;

namespace Anywhere.service.Data.WaitingListAssessment
{
    public class WaitingListDataGetter
    {
        private static Loger logger = new Loger();
        //private static readonly log4net.ILog logger = log4net.LogManager.GetLogger(typeof(DataGetter));
        private string connectString = ConfigurationManager.ConnectionStrings["connection"].ToString();

        public string getLandingPageForConsumer(string token, double consumerId)
        {
            if (tokenValidator(token) == false) return null;
            logger.debug("getLandingPageForConsumer " + token);
            List<string> list = new List<string>();
            list.Add(token);
            list.Add(consumerId.ToString());
            string text = "CALL DBA.ANYW_WaitingList_ConsumerLandingPage(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")";
            try
            {
                return executeDataBaseCallJSON(text);
            }
            catch (Exception ex)
            {
                logger.error("1WL", ex.Message + "ANYW_WaitingList_ConsumerLandingPage(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")");
                return "1WL: error ANYW_WaitingList_ConsumerLandingPage";
            }
        }

        public string getWaitingListAssessment(int waitingListAssessmentId)
        {            
            List<string> list = new List<string>();
            list.Add(waitingListAssessmentId.ToString());
            string text = "CALL DBA.ANYW_WaitingList_GetAssessment(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")";
            try
            {
                return executeDataBaseCallJSON(text);
            }
            catch (Exception ex)
            {
                logger.error("2WL", ex.Message + "ANYW_WaitingList_GetAssessment(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")");
                return "2WL: error ANYW_WaitingList_GetAssessment";
            }
        }

        public string getWaitingListFundingSources()
        {
            List<string> list = new List<string>();
            string text = "CALL DBA.ANYW_WaitingList_GetFundingSources(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")";
            try
            {
                return executeDataBaseCallJSON(text);
            }
            catch (Exception ex)
            {
                logger.error("2WL", ex.Message + "ANYW_WaitingList_GetFundingSources(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")");
                return "2WL: error ANYW_WaitingList_GetFundingSources";
            }
        }

        public string insertUpdateWaitingListValue(int id, int linkId, string tableName, string columnName, string linkColumnName, string idNameForWhere, string propertyValue, string propertyValueTwo, char insertOrUpdate)
        {
            if (stringInjectionValidator(propertyValue) == false) return null;
            if(stringInjectionValidator(propertyValueTwo) == false) return null;
            List<string> list = new List<string>();
            list.Add(id.ToString());
            list.Add(linkId.ToString());
            list.Add(tableName);
            list.Add(columnName);
            list.Add(linkColumnName);
            list.Add(idNameForWhere);
            list.Add(propertyValue);
            list.Add(propertyValueTwo);
            list.Add(insertOrUpdate.ToString());
            string text = "CALL DBA.ANYW_WaitingList_InsertUpdateWaitingListValue(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")";
            try
            {
                return executeDataBaseCallJSON(text);
            }
            catch (Exception ex)
            {
                logger.error("2WL", ex.Message + "ANYW_WaitingList_InsertUpdateWaitingListValue(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")");
                return "2WL: error ANYW_WaitingList_InsertUpdateWaitingListValue";
            }
        }

        public string addWLSupportingDocument(string token, long waitingListInformationId, string description, char includeOnEmail, string attachmentType, string attachment)
        {
            if (tokenValidator(token) == false) return null;
            if (stringInjectionValidator(description) == false) return null;
            List<string> list = new List<string>();
            list.Add(token);
            list.Add(waitingListInformationId.ToString());
            list.Add(description);
            list.Add(includeOnEmail.ToString());
            list.Add(attachmentType);
            list.Add(attachment);
            string text = "CALL DBA.ANYW_WaitingList_AddSupportingDocument(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")";
            try
            {
                return executeDataBaseCallJSON(text);
            }
            catch (Exception ex)
            {
                logger.error("3WL", ex.Message + "ANYW_WaitingList_AddSupportingDocument(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")");
                return "3WL: error ANYW_WaitingList_AddSupportingDocument";
            }
        }
        public string getWLSupportingDocumentList(string token, long waitingListInformationId)
        {
            if (tokenValidator(token) == false) return null;
            List<string> list = new List<string>();
            list.Add(token);
            list.Add(waitingListInformationId.ToString());
            string text = "CALL DBA.ANYW_WaitingList_GetSupportingDocumentList(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")";
            try
            {
                return executeDataBaseCallJSON(text);
            }
            catch (Exception ex)
            {
                logger.error("4WL", ex.Message + "ANYW_WaitingList_GetSupportingDocumentList(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")");
                return "4WL: error ANYW_WaitingList_GetSupportingDocumentList";
            }
        }

        public string deleteFromWaitingList(string id, string tableName, string columnForId)
        {
            List<string> list = new List<string>();
            list.Add(id);
            list.Add(tableName);
            list.Add(columnForId);
            string text = "CALL DBA.ANYW_WaitingList_DeleteFromWaitingList(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")";
            try
            {
                return executeDataBaseCallJSON(text);
            }
            catch (Exception ex)
            {
                logger.error("5WL", ex.Message + "ANYW_WaitingList_DeleteFromWaitingList(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")");
                return "5WL: error ANYW_WaitingList_DeleteFromWaitingList";
            }
        }

        public string deleteSupportingDocument(string token, string attachmentId)
        {
            if (tokenValidator(token) == false) return null;
            List<string> list = new List<string>();
            list.Add(token);
            list.Add(attachmentId);
            string text = "CALL DBA.ANYW_WaitingList_DeleteDocument(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")";
            try
            {
                return executeDataBaseCallJSON(text);
            }
            catch (Exception ex)
            {
                logger.error("5WL", ex.Message + "ANYW_WaitingList_DeleteDocument(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")");
                return "5WL: error ANYW_WaitingList_DeleteDocument";
            }
        }

        public string deleteWaitingListParticipant(string token, int participantId)
        {
            if (tokenValidator(token) == false) return null;
            List<string> list = new List<string>();
            list.Add(token);
            list.Add(participantId.ToString());       
            string text = "CALL DBA.ANYW_WaitingList_DeleteParticipant(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")";
            try
            {
                return executeDataBaseCallJSON(text);
            }
            catch (Exception ex)
            {
                logger.error("6WL", ex.Message + "ANYW_WaitingList_DeleteParticipant(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")");
                return "6WL: error ANYW_WaitingList_DeleteParticipant";
            }
        }

        public MemoryStream viewSupportingDocInBrowser(string token, string attachmentId)
        {
            logger.debug("viewSupportingDocInBrowser " + attachmentId);
            List<string> list = new List<string>();
            list.Add(token);
            list.Add(attachmentId.ToString());
            string text = "CALL DBA.ANYW_WaitingList_GetAttachmentData(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")";
            try
            {
                //MemoryStream temp = new MemoryStream();
                //temp = executeSQLReturnMemoryStream("SELECT Attachment from Attachments where Attachment_ID = " + attachmentId);
                //temp = executeSQLReturnMemoryStream(text);
                return executeSQLReturnMemoryStream(text);
            }
            catch (Exception ex)
            {
                logger.error("640", ex.Message + "ANYW_WaitingList_GetAttachmentData(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")");
                return null;
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

        public bool consumerIdStringValidator(string consumerIdString)
        {
            var regex = new Regex(@"^[0 - 9,| ] *$");
            //var regex = @"^[0 - 9, ] *$";
            //RegexStringValidator regexStringValidator = new RegexStringValidator(regex);
            try
            {
                // regexStringValidator.Validate(consumerIdString);
                regex.Matches(consumerIdString);
                return true;
            }
            catch
            {
                return false;
            }
        }

        public bool stringInjectionValidator(string uncheckedString)
        {
            string waitFor = "WAITFOR DELAY";
            string dropTable = "DROP TABLE";
            string deleteFrom = "DELETE FROM";
            if (!string.IsNullOrWhiteSpace(uncheckedString) && (uncheckedString.ToUpper().Contains(waitFor) || uncheckedString.ToUpper().Contains(dropTable) || uncheckedString.ToUpper().Contains(deleteFrom)))
            {
                return false;
            }
            else
            {
                return true;
            }

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
    }
}