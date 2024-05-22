using Anywhere.Data;
using Anywhere.Log;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Data.Odbc;
using System.IO;
using System.Linq;
using System.Management.Automation.Language;
using System.Web.Script.Serialization;
using static Anywhere.service.Data.SimpleMar.SignInUser;

namespace Anywhere.service.Data.DocumentConversion
{
    public class AllAttachmentsDataGetter
    {
        private static Loger logger = new Loger();
        private string connectString = ConfigurationManager.ConnectionStrings["connection"].ToString();
        JavaScriptSerializer js = new JavaScriptSerializer();
        DataGetter dg = new DataGetter();

        public string getPlanAndWorkFlowAttachments(string assessmentId)
        {
            List<string> list = new List<string>();
            list.Add(assessmentId);
            string text = "CALL DBA.ANYW_ISP_GetPlanAndWorkflowAttachmentsForSelection(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")";
            try
            {
                return executeDataBaseCallJSON(text);
            }
            catch (Exception ex)
            {
                logger.error("647", ex.Message + "ANYW_ISP_GetPlanAndWorkflowAttachmentsForSelection(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")");
                return "647: error ANYW_ISP_GetPlanAttachmentsWithOrdering";
            }
        }
        
        public string setUploadUserId(string token, string planId)
        {
            if (ValidateToken(token) == false)
            {
                return "invalid token";
            }
            List<string> list = new List<string>();
            list.Add(token);
            list.Add(planId);
            string text = "CALL DBA.ANYW_ISP_SetUploadUserId(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")";
            try
            {
                return executeDataBaseCallJSON(text);
            }
            catch (Exception ex)
            {
                logger.error("647.5", ex.Message + "ANYW_ISP_SetUploadUserId(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")");
                return "647.5: error ANYW_ISP_SetUploadUserId";
            }
        }


        public MemoryStream GetAttachmentData(string attachmentId)
        {
            logger.debug("GetAttachmentData " + attachmentId);
            List<string> list = new List<string>();
            list.Add(attachmentId);
            string text = "CALL DBA.ANYW_ISP_GetAttachmentData(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")";
            try
            {
                //MemoryStream temp = new MemoryStream();
                //temp = executeSQLReturnMemoryStream("SELECT Attachment from Attachments where Attachment_ID = " + attachmentId);
                //temp = executeSQLReturnMemoryStream(text);
                return executeSQLReturnMemoryStream(text);
            }
            catch (Exception ex)
            {
                logger.error("640", ex.Message + "ANYW_ISP_GetAttachmentData(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")");
                return null;
            }
        }

        public string getPlanAttachmentFileName(string attachmentId, string section)
        {
            logger.debug("GetIndividualAttachment " + attachmentId);
            List<string> list = new List<string>();
            list.Add(attachmentId);
            string text = "CALL DBA.ANYW_ISP_GetAttachmentFileName(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")";
            try
            {
                return executeDataBaseCallRaw(text);
            }
            catch (Exception ex)
            {
                logger.error("640.1", ex.Message + "ANYW_ISP_GetAttachmentFileName(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")");
                return "640.1: error ANYW_ISP_GetAttachmentFileName";
            }
        }

        public string getPlanAttachmentsWithOrdering(string assessmentId)
        {
            List<string> list = new List<string>();
            list.Add(assessmentId);
            string text = "CALL DBA.ANYW_ISP_GetPlanAttachmentsWithOrdering(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")";
            try
            {
                return executeDataBaseCallJSON(text);
            }
            catch (Exception ex)
            {
                logger.error("647", ex.Message + "ANYW_ISP_GetPlanAttachmentsWithOrdering(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")");
                return "647: error ANYW_ISP_GetPlanAttachmentsWithOrdering";
            }
        }

        public string getWorkFlowAttachmentswithOrdering(string assessmentId)
        {
            List<string> list = new List<string>();
            list.Add(assessmentId);
            string text = "CALL DBA.ANYW_ISP_GetWorkFlowAttachmentsWithOrdering(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")";
            try
            {
                return executeDataBaseCallJSON(text);
            }
            catch (Exception ex)
            {
                logger.error("647", ex.Message + "ANYW_ISP_GetWorkFlowAttachmentsWithOrdering(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")");
                return "647: error ANYW_ISP_GetWorkFlowAttachmentsWithOrdering";
            }
        }

        public string getCFAttachmentFileName(string attachmentId)
        {
            logger.debug("GetIndividualAttachment " + attachmentId);
            List<string> list = new List<string>();
            list.Add(attachmentId);
            string text = "CALL DBA.ANYW_getCFAttachmentFileName(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")";
            try
            {
                return executeDataBaseCallRaw(text);
            }
            catch (Exception ex)
            {
                logger.error("640.1", ex.Message + "ANYW_getCFAttachmentFileName(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")");
                return "640.1: error ANYW_getCFAttachmentFileName";
            }
        }

        public MemoryStream GetCFAttachmentData(string attachmentId)
        {
            logger.debug("GetAttachmentData " + attachmentId);
            List<string> list = new List<string>();
            list.Add(attachmentId);
            string text = "CALL DBA.ANYW_GetCFAttachmentData(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")";
            try
            {
                return executeSQLReturnMemoryStream(text);
            }
            catch (Exception ex)
            {
                logger.error("640", ex.Message + "ANYW_GetCFAttachmentData(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")");
                return null;
            }
        }

        public string getReportSectionOrder()
        {
            try
            {
                return executeDataBaseCallJSON("CALL DBA.ANYW_ISP_GetReportSectionOrder();");
            }
            catch (Exception ex)
            {
                logger.error("551", ex.Message + " ANYW_ISP_GetReportSectionOrder()");
                return "551: Error getting case load restriction";
            }
        }

        public string SendReportViaEmail(string email, string report)
        {
            logger.debug("GetAttachmentData " + email);
            List<string> list = new List<string>();
            list.Add(email);
            list.Add(report);
            string text = "CALL DBA.ANYW_ISP_SendReportViaEmail(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")";
            try
            {
                return executeDataBaseCallRaw(text);
            }
            catch (Exception ex)
            {
                logger.error("640", ex.Message + "ANYW_ISP_SendReportViaEmail(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")");
                return null;
            }
        }

        public string getDefaultEmailsForFinalization(string token)
        {
            logger.debug("getDefaultEmailsForFinalization");
            List<string> list = new List<string>();
            list.Add(token);

            string text = "CALL DBA.ANYW_ISP_getDefaultFinalizationEmailAddresses(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")";
            try
            {
                return executeDataBaseCallJSON(text);
            }
            catch (Exception ex)
            {
                logger.error("640", ex.Message + "ANYW_ISP_getDefaultFinalizationEmailAddresses(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")");
                return null;
            }
        }

        public bool ValidateToken(string token)
        {
            return dg.validateToken(token);
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

        private string executeDataBaseCallRaw(string storedProdCall)
        {
            OdbcConnection conn = null;
            OdbcCommand cmd;
            OdbcDataReader rdr = null;

            List<string> arr = new List<string>();

            try
            {
                if (connectString.IndexOf("UID=") == -1)
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
                        var fake = val.GetType();
                        string str = val.ToString();
                        if (fake.IsArray)
                        {
                            byte[] temp = (byte[])rdr.GetValue(ordinal);
                            str = System.Text.Encoding.UTF32.GetString(temp);
                        }
                        arr.Add(str);
                    }
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

            return String.Join(",", arr);
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
                    js.MaxJsonLength = Int32.MaxValue;
                    arr.Add(js.Serialize(holder));
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