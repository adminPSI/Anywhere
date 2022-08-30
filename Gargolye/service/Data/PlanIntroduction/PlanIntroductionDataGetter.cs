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

namespace Anywhere.service.Data.PlanIntroduction
{
    public class PlanIntroductionDataGetter
    {
        private static Loger logger = new Loger();
        private string connectString = ConfigurationManager.ConnectionStrings["connection"].ToString();

        JavaScriptSerializer js = new JavaScriptSerializer();

        //public string insertPlanOutcomesOutcome(string token, string assessmentId, string outcome, string details, string history, string sectionId, string outcomeOrder, string summaryOfProgress, int status, string carryOverReason)
        //{
        //    if (tokenValidator(token) == false) return null;
        //    logger.debug("getPlanSpecificReviews ");
        //    List<string> list = new List<string>();
        //    list.Add(token);
        //    list.Add(assessmentId);
        //    list.Add(outcome);
        //    list.Add(details);
        //    list.Add(history);
        //    list.Add(sectionId);
        //    list.Add(outcomeOrder);
        //    list.Add(summaryOfProgress);
        //    list.Add(status.ToString());
        //    list.Add(carryOverReason);
        //    string text = "CALL DBA.ANYW_ISP_InsertPlanOutcomesOutcome(" + string.Join(",", list.Select(x => string.Format("'{0}'", removeUnsavableNoteText(x))).ToList()) + ")";
        //    try
        //    {
        //        return executeDataBaseCallJSON(text);
        //    }
        //    catch (Exception ex)
        //    {
        //        logger.error("4PODG", ex.Message + "ANYW_ISP_InsertPlanOutcomesOutcome(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")");
        //        return "4APODG: error ANYW_ISP_InsertPlanOutcomesOutcome";
        //    }
        //}

        public string updatePlanIntroduction(string token, string planId, string consumerId, string likeAdmire, string thingsImportantTo, string thingsImportantFor, string howToSupport, int usePlanImage, string consumerImage)
        {                                  
            if (tokenValidator(token) == false) return null;
            logger.debug("updatePlanIntroduction ");
            List<string> list = new List<string>();
            list.Add(token);
            list.Add(planId);
            list.Add(consumerId);
            list.Add(likeAdmire);
            list.Add(thingsImportantTo);
            list.Add(thingsImportantFor);
            list.Add(howToSupport);
            list.Add(usePlanImage.ToString());
            list.Add(consumerImage);
            string text = "CALL DBA.ANYW_ISP_UpdatePlanIntroduction(" + string.Join(",", list.Select(x => string.Format("'{0}'", removeUnsavableNoteText(x))).ToList()) + ")";
            try
            {
                return executeDataBaseCallJSON(text);
            }
            catch (Exception ex)
            {
                logger.error("4PODG", ex.Message + "ANYW_ISP_UpdatePlanIntroduction(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")");
                return "4APODG: error ANYW_ISP_UpdatePlanIntroduction";
            }
        }

        public string getPlanIntroduction(string token, string planId, string consumerId)
        {
            if (tokenValidator(token) == false) return null;
            logger.debug("getPlanIntroduction ");
            List<string> list = new List<string>();
            list.Add(token);
            list.Add(planId);
            list.Add(consumerId);
            string text = "CALL DBA.ANYW_ISP_GetPlanIntroduction(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")";
            try
            {
                return executeDataBaseCallJSON(text);
            }
            catch (Exception ex)
            {
                logger.error("1PODG", ex.Message + "ANYW_ISP_GetPlanIntroduction(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")");
                return "1APODG: error ANYW_ISP_GetPlanIntroduction";
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

        public System.IO.MemoryStream executeSQLReturnMemoryStream(string storedProdCall)
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
                }

            }
            catch (Exception ex)
            {
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