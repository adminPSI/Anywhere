using Anywhere.Log;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Data.Odbc;
using System.IO;
using System.Linq;
using System.Web.Script.Serialization;

namespace Anywhere.service.Data.PlanDiscoveryAssessmentSummary
{
    public class PlanDiscoveryAssessmentSummaryDataGetter
    {
        private static Loger logger = new Loger();
        private string connectString = ConfigurationManager.ConnectionStrings["connection"].ToString();

        public string getAssessmentSummaryQuestions(string token, long anywAssessmentId)
        {
            if (tokenValidator(token) == false) return null;
            logger.debug("getAssessmentSummaryQuestions ");
            List<string> list = new List<string>();
            list.Add(token);
            list.Add(anywAssessmentId.ToString());
            string text = "CALL DBA.ANYW_ISP_GetAssessmentSummaryQuestions(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")";
            try
            {
                return executeDataBaseCallJSON(text);
            }
            catch (Exception ex)
            {
                logger.error("1DG", ex.Message + "ANYW_ISP_GetAssessmentSummaryQuestions(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")");
                return "1DG: error ANYW_ISP_GetAssessmentSummaryQuestions";
            }
        }

        public string getAdditionalAssessmentSummaryQuestions(long anywAssessmentId)
        {
            logger.debug("getAssessmentSummaryQuestions ");
            List<string> list = new List<string>();
            list.Add(anywAssessmentId.ToString());
            string text = "CALL DBA.ANYW_ISP_GetAdditionalAssessmentSummaryQuestions(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")";
            try
            {
                return executeDataBaseCallJSON(text);
            }
            catch (Exception ex)
            {
                logger.error("2DG", ex.Message + "ANYW_ISP_GetAdditionalAssessmentSummaryQuestions(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")");
                return "2DG: error ANYW_ISP_GetAdditionalAssessmentSummaryQuestions";
            }
        }

        public string insertAssessmentSummaryAnswer(long anywAssessmentId, long questionId, int answerRow, string answer, string userId)
        {
            logger.debug("getAssessmentSummaryQuestions ");
            List<string> list = new List<string>();
            list.Add(anywAssessmentId.ToString());
            list.Add(questionId.ToString());
            list.Add(answerRow.ToString());
            list.Add(answer);
            list.Add(userId);
            string text = "CALL DBA.ANYW_ISP_InsertAssessmentSummaryAnswer(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")";
            try
            {
                return executeDataBaseCallJSON(text);
            }
            catch (Exception ex)
            {
                logger.error("2DG", ex.Message + "ANYW_ISP_InsertAssessmentSummaryAnswer(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")");
                return "2DG: error ANYW_ISP_InsertAssessmentSummaryAnswer";
            }
        }

        public string updateAssessmentSummaryAnswer(long anywAssessmentId, long answerId, string answer, string userId)
        {
            logger.debug("getAssessmentSummaryQuestions ");
            List<string> list = new List<string>();
            list.Add(anywAssessmentId.ToString());
            list.Add(answerId.ToString());
            list.Add(answer);
            list.Add(userId);
            string text = "CALL DBA.ANYW_ISP_UpdateAssessmentSummaryAnswer(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")";
            try
            {
                return executeDataBaseCallJSON(text);
            }
            catch (Exception ex)
            {
                logger.error("2DG", ex.Message + "ANYW_ISP_UpdateAssessmentSummaryAnswer(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")");
                return "2DG: error ANYW_ISP_UpdateAssessmentSummaryAnswer";
            }
        }

        public string updateAdditionalAssessmentSummaryAnswer(long anywAssessmentId, string aloneTimeAmount, string providerBackUp)
        {
            logger.debug("getAssessmentSummaryQuestions ");
            List<string> list = new List<string>();
            list.Add(anywAssessmentId.ToString());
            list.Add(aloneTimeAmount);
            list.Add(providerBackUp);
            string text = "CALL DBA.ANYW_ISP_UpdateAdditionalAssessmentSummaryAnswer(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")";
            try
            {
                return executeDataBaseCallJSON(text);
            }
            catch (Exception ex)
            {
                logger.error("2DG", ex.Message + "ANYW_ISP_UpdateAdditionalAssessmentSummaryAnswer(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")");
                return "2DG: error ANYW_ISP_UpdateAdditionalAssessmentSummaryAnswer";
            }
        }

        public string updateBestWayToConnect(string token, long anywAssessmentId, int bestWayId)
        {
            if (tokenValidator(token) == false) return null;
            logger.debug("getAssessmentSummaryQuestions ");
            List<string> list = new List<string>();
            list.Add(anywAssessmentId.ToString());
            list.Add(bestWayId.ToString());
            string text = "CALL DBA.ANYW_ISP_UpdateBestWayToConnect(" + string.Join(",", list.Select(x => string.Format("'{0}'", removeUnsavableNoteText(x))).ToList()) + ")";
            try
            {
                return executeDataBaseCallJSON(text);
            }
            catch (Exception ex)
            {
                logger.error("1DG", ex.Message + "ANYW_ISP_UpdateBestWayToConnect(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")");
                return "1DG: error ANYW_ISP_UpdateBestWayToConnect";
            }
        }

        public string updatePlaceOnPath(string token, long anywAssessmentId, int placeId)
        {
            if (tokenValidator(token) == false) return null;
            logger.debug("getAssessmentSummaryQuestions ");
            List<string> list = new List<string>();
            list.Add(anywAssessmentId.ToString());
            list.Add(placeId.ToString());
            string text = "CALL DBA.ANYW_ISP_UpdatePlaceOnPath(" + string.Join(",", list.Select(x => string.Format("'{0}'", removeUnsavableNoteText(x))).ToList()) + ")";
            try
            {
                return executeDataBaseCallJSON(text);
            }
            catch (Exception ex)
            {
                logger.error("1DG", ex.Message + "ANYW_ISP_UpdatePlaceOnPath(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")");
                return "1DG: error ANYW_ISP_UpdatePlaceOnPath";
            }
        }

        public string updateMoreDetail(string token, long anywAssessmentId, string detail)
        {
            if (tokenValidator(token) == false) return null;
            if (stringInjectionValidator(detail) == false) return null;
            logger.debug("getAssessmentSummaryQuestions ");
            List<string> list = new List<string>();
            list.Add(anywAssessmentId.ToString());
            list.Add(detail);
            string text = "CALL DBA.ANYW_ISP_UpdateMoreDetail(" + string.Join(",", list.Select(x => string.Format("'{0}'", removeUnsavableNoteText(x))).ToList()) + ")";
            try
            {
                return executeDataBaseCallJSON(text);
            }
            catch (Exception ex)
            {
                logger.error("1DG", ex.Message + "ANYW_ISP_UpdateMoreDetail(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")");
                return "1DG: error ANYW_ISP_UpdateMoreDetail";
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

        public Boolean validateToken(string token, DistributedTransaction transaction)
        {
            try
            {
                if (tokenValidator(token) == false) return false;
                logger.debug("validateToken ");
                System.Data.Common.DbParameter[] args = new System.Data.Common.DbParameter[1];
                args[0] = (System.Data.Common.DbParameter)DbHelper.CreateParameter("@token", DbType.String, token);
                object obj = DbHelper.ExecuteScalar(System.Data.CommandType.StoredProcedure, "CALL DBA.ANYW_TokenCheck(?)", args, ref transaction);
                return (obj == null) ? true : false;
            }
            catch (Exception ex)
            {
                logger.error("ADG", ex.Message + "ANYW_TokenCheck(" + token + ")");
                throw ex;
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