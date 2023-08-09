using Anywhere.Log;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Data.Odbc;
using System.IO;
using System.Linq;
using System.Web.Script.Serialization;

namespace Anywhere.service.Data
{
    public class PlanDataGetter
    {
        private static Loger logger = new Loger();
        private string connectString = ConfigurationManager.ConnectionStrings["connection"].ToString();

        #region UTILITY METHODS      
        public String convertToJSON(System.Data.Common.DbDataReader rdr)
        {
            string result = "[";
            List<string> arr = new List<string>();
            try
            {
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
                throw ex;
            }

            finally
            {
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
        public string getSessionUserId(string token, DistributedTransaction transaction)
        {
            try
            {
                logger.debug("getSessionUserId ");
                System.Data.Common.DbParameter[] args = new System.Data.Common.DbParameter[1];
                args[0] = (System.Data.Common.DbParameter)DbHelper.CreateParameter("@token", DbType.String, token);
                return DbHelper.ExecuteScalar(System.Data.CommandType.StoredProcedure, "CALL DBA.ANYW_getSessionUserId(?)", args, ref transaction).ToString();
            }
            catch (Exception ex)
            {
                logger.error("ADG", ex.Message + "ANYW_getSessionUserId(" + token + ")");
                throw ex;
            }
        }
        public Boolean validateToken(string token, DistributedTransaction transaction)
        {
            try
            {
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
        #endregion

        #region PLAN METHODS
        public int deleteConsumerPlan(string consumerPlanId, DistributedTransaction transaction)
        {
            try
            {
                logger.debug("deleteConsumerPlan ");
                System.Data.Common.DbParameter[] args = new System.Data.Common.DbParameter[1];
                args[0] = (System.Data.Common.DbParameter)DbHelper.CreateParameter("@consumerPlanId", DbType.String, consumerPlanId);

                // returns 1 if the row deleted or 0 if it was not deleted
                return (int)DbHelper.ExecuteScalar(System.Data.CommandType.StoredProcedure, "CALL DBA.ANYW_ISP_DeleteConsumerPlan(?)", args, ref transaction);
            }
            catch (Exception ex)
            {
                logger.error("ADG", ex.Message + "ANYW_ISP_DeleteConsumerPlan(" + consumerPlanId + ")");
                throw ex;
            }
        }
        public string getConsumerPlan(string consumerPlanId, DistributedTransaction transaction)
        {
            try
            {
                logger.debug("getConsumerPlan ");
                System.Data.Common.DbParameter[] args = new System.Data.Common.DbParameter[1];
                args[0] = (System.Data.Common.DbParameter)DbHelper.CreateParameter("@consumerPlanId", DbType.String, consumerPlanId);
                System.Data.Common.DbDataReader returnMsg = DbHelper.ExecuteReader(System.Data.CommandType.StoredProcedure, "CALL DBA.ANYW_ISP_getConsumerPlan(?)", args, ref transaction);
                return convertToJSON(returnMsg);
            }
            catch (Exception ex)
            {
                logger.error("ADG", ex.Message + "ANYW_ISP_getConsumerPlan(" + consumerPlanId + ")");
                throw ex;
            }
        }
        public string getConsumerPlans(string consumerId, DistributedTransaction transaction)
        {
            try
            {
                logger.debug("getConsumerPlans ");
                System.Data.Common.DbParameter[] args = new System.Data.Common.DbParameter[1];
                args[0] = (System.Data.Common.DbParameter)DbHelper.CreateParameter("@consumerId", DbType.String, consumerId);
                System.Data.Common.DbDataReader returnMsg = DbHelper.ExecuteReader(System.Data.CommandType.StoredProcedure, "CALL DBA.ANYW_ISP_getConsumerPlans(?)", args, ref transaction);
                return convertToJSON(returnMsg);
            }
            catch (Exception ex)
            {
                logger.error("ADG", ex.Message + "ANYW_ISP_getConsumerPlans(" + consumerId + ")");
                throw ex;
            }
        }
        public string getMostRecentConsumerPlanId(string consumerId, string assessmentVersionId, DistributedTransaction transaction)
        {
            try
            {
                logger.debug("getMostRecentConsumerPlanId ");
                System.Data.Common.DbParameter[] args = new System.Data.Common.DbParameter[2];
                args[0] = (System.Data.Common.DbParameter)DbHelper.CreateParameter("@consumerId", DbType.String, consumerId);
                args[1] = (System.Data.Common.DbParameter)DbHelper.CreateParameter("@assessmentVersionId", DbType.String, assessmentVersionId);
                // gets the most current versionId of the assessment given an existing versionId
                object result = DbHelper.ExecuteScalar(System.Data.CommandType.StoredProcedure, "CALL DBA.ANYW_ISP_getMostRecentConsumerPlanId(?, ?)", args, ref transaction);
                return result?.ToString();
            }
            catch (Exception ex)
            {
                logger.error("ADG", ex.Message + "ANYW_ISP_getMostRecentConsumerPlanId(" + consumerId + "," + assessmentVersionId + ")");
                throw ex;
            }
        }
        public string getNextRevisionNumber(string consumerPlanId, DistributedTransaction transaction)
        {
            try
            {
                logger.debug("getNextRevisionNumber ");
                System.Data.Common.DbParameter[] args = new System.Data.Common.DbParameter[1];
                args[0] = (System.Data.Common.DbParameter)DbHelper.CreateParameter("@assessmentVersionId", DbType.String, consumerPlanId);
                // gets the most current versionId of the assessment given an existing versionId
                string revisionNumber = DbHelper.ExecuteScalar(System.Data.CommandType.StoredProcedure, "CALL DBA.ANYW_ISP_getNextConsumerPlanRevisionNumber(?)", args, ref transaction).ToString();
                if (revisionNumber == "-1") throw new Exception("unable to fetch next revision number");
                return revisionNumber;
            }
            catch (Exception ex)
            {
                logger.error("ADG", ex.Message + "ANYW_ISP_getNextConsumerPlanRevisionNumber(" + consumerPlanId + ")");
                throw ex;
            }
        }
        public string insertConsumerPlan(string consumerId, string planYearStart, string planYearEnd, string effectiveStart, string effectiveEnd, string planType, string revisionNumber, string active, string updatedBy, string reviewDate, string priorPlanIdForApplicable, string priorPlanId, string salesForceCaseManagerId, DistributedTransaction transaction)
        {
            try
            {
                logger.debug("insertConsumerPlan ");
                System.Data.Common.DbParameter[] args = new System.Data.Common.DbParameter[13];
                args[0] = (System.Data.Common.DbParameter)DbHelper.CreateParameter("@consumerId", DbType.String, consumerId);
                args[1] = (System.Data.Common.DbParameter)DbHelper.CreateParameter("@planYearStart", DbType.Date, planYearStart);
                args[2] = (System.Data.Common.DbParameter)DbHelper.CreateParameter("@planYearEnd", DbType.Date, planYearEnd);
                args[3] = (System.Data.Common.DbParameter)DbHelper.CreateParameter("@effectiveStart", DbType.Date, effectiveStart);
                args[4] = (System.Data.Common.DbParameter)DbHelper.CreateParameter("@effectiveEnd", DbType.Date, effectiveEnd);
                args[5] = (System.Data.Common.DbParameter)DbHelper.CreateParameter("@planType", DbType.String, planType);
                args[6] = (System.Data.Common.DbParameter)DbHelper.CreateParameter("@revisionNumber", DbType.String, revisionNumber);
                args[7] = (System.Data.Common.DbParameter)DbHelper.CreateParameter("@active", DbType.String, active);
                args[8] = (System.Data.Common.DbParameter)DbHelper.CreateParameter("@updatedBy", DbType.String, updatedBy);
                args[9] = (System.Data.Common.DbParameter)DbHelper.CreateParameter("@reviewDate", DbType.String, reviewDate);
                args[10] = (System.Data.Common.DbParameter)DbHelper.CreateParameter("@priorPlanIdForApplicable", DbType.String, priorPlanIdForApplicable);
                args[11] = (System.Data.Common.DbParameter)DbHelper.CreateParameter("@priorPlanId", DbType.String, priorPlanId);
                args[12] = (System.Data.Common.DbParameter)DbHelper.CreateParameter("@salesForceCaseManagerId", DbType.String, salesForceCaseManagerId);
                // returns the consumerPlanId of the consumer plan that was just inserted
                return DbHelper.ExecuteScalar(System.Data.CommandType.StoredProcedure, "CALL DBA.ANYW_ISP_insertConsumerPlan(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", args, ref transaction).ToString();
                //System.Data.Common.DbDataReader returnMsg = DbHelper.ExecuteReader(System.Data.CommandType.StoredProcedure, "CALL DBA.ANYW_ISP_insertConsumerPlan(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", args, ref transaction);
                //return convertToJSON(returnMsg);
            }
            catch (Exception ex)
            {
                logger.error("ADG", ex.Message + "ANYW_ISP_insertConsumerPlan(" + consumerId + "," + planYearStart + "," + planYearEnd + "," + effectiveStart + "," + effectiveEnd + "," + planType + "," + revisionNumber + "," + active + "," + updatedBy + ")");
                throw ex;
            }
        }
        public int updateConsumerPlanReactivate(string consumerPlanId, DistributedTransaction transaction)
        {
            try
            {
                logger.debug("updateConsumerPlanReactivate ");
                System.Data.Common.DbParameter[] args = new System.Data.Common.DbParameter[1];
                args[0] = (System.Data.Common.DbParameter)DbHelper.CreateParameter("@consumerPlanId", DbType.String, consumerPlanId);
                // returns 1 if the row updated or 0 if it was not updated
                return (int)DbHelper.ExecuteScalar(System.Data.CommandType.StoredProcedure, "CALL DBA.ANYW_ISP_UpdateConsumerPlanReactivate(?)", args, ref transaction);
            }
            catch (Exception ex)
            {
                logger.error("ADG", ex.Message + "ANYW_ISP_UpdateConsumerPlanReactivate(" + consumerPlanId + ")");
                throw ex;
            }
        }
        public int updateConsumerPlanSetDates(string consumerPlanId, string planYearStart, string planYearEnd, string effectiveStart, string effectiveEnd, DistributedTransaction transaction)
        {
            try
            {
                logger.debug("updateConsumerPlanSetDates ");
                System.Data.Common.DbParameter[] args = new System.Data.Common.DbParameter[5];
                args[0] = (System.Data.Common.DbParameter)DbHelper.CreateParameter("@consumerPlanId", DbType.String, consumerPlanId);
                args[1] = (System.Data.Common.DbParameter)DbHelper.CreateParameter("@planYearStart", DbType.String, planYearStart);
                args[2] = (System.Data.Common.DbParameter)DbHelper.CreateParameter("@planYearEnd", DbType.String, planYearEnd);
                args[3] = (System.Data.Common.DbParameter)DbHelper.CreateParameter("@effectiveStart", DbType.String, effectiveStart);
                args[4] = (System.Data.Common.DbParameter)DbHelper.CreateParameter("@effectiveEnd", DbType.String, effectiveEnd);
                // returns 1 if the row updated or 0 if it was not updated
                return (int)DbHelper.ExecuteScalar(System.Data.CommandType.StoredProcedure, "CALL DBA.ANYW_ISP_UpdateConsumerPlanSetDates(?,?,?,?,?)", args, ref transaction);
            }
            catch (Exception ex)
            {
                logger.error("ADG", ex.Message + "ANYW_ISP_UpdateConsumerPlanSetDates(" + consumerPlanId + ", " + planYearStart + ", " + planYearEnd + ", " + effectiveStart + ", " + effectiveEnd + ")");
                throw ex;
            }
        }
        public int updateConsumerPlanSetInactive(string consumerPlanId, DistributedTransaction transaction)
        {
            try
            {
                logger.debug("updateConsumerPlanSetInactive ");
                System.Data.Common.DbParameter[] args = new System.Data.Common.DbParameter[1];
                args[0] = (System.Data.Common.DbParameter)DbHelper.CreateParameter("@consumerPlanId", DbType.String, consumerPlanId);
                // returns 1 if the row updated or 0 if it was not updated
                return (int)DbHelper.ExecuteScalar(System.Data.CommandType.StoredProcedure, "CALL DBA.ANYW_ISP_UpdateConsumerPlanSetInactive(?)", args, ref transaction);
            }
            catch (Exception ex)
            {
                logger.error("ADG", ex.Message + "ANYW_ISP_UpdateConsumerPlanSetInactive(" + consumerPlanId + ")");
                throw ex;
            }
        }
        public int updateConsumerPlanSetStatus(string consumerPlanId, string status, DistributedTransaction transaction)
        {
            try
            {
                logger.debug("updateConsumerPlanSetStatus ");
                System.Data.Common.DbParameter[] args = new System.Data.Common.DbParameter[2];
                args[0] = (System.Data.Common.DbParameter)DbHelper.CreateParameter("@consumerPlanId", DbType.String, consumerPlanId);
                args[1] = (System.Data.Common.DbParameter)DbHelper.CreateParameter("@status", DbType.String, status);
                // returns 1 if the row updated or 0 if it was not updated
                return (int)DbHelper.ExecuteScalar(System.Data.CommandType.StoredProcedure, "CALL DBA.ANYW_ISP_UpdateConsumerPlanSetStatus(?,?)", args, ref transaction);
            }
            catch (Exception ex)
            {
                logger.error("ADG", ex.Message + "ANYW_ISP_UpdateConsumerPlanSetStatus(" + consumerPlanId + ", " + status + ")");
                throw ex;
            }
        }
        #endregion

        #region ASSESSMENT METHODS
        public int deleteConsumerAssessmentAnswerRow(string consumerPlanId, string assessmentQuestionSetId, string rowNumber, DistributedTransaction transaction)
        {
            try
            {
                logger.debug("deleteConsumerAssessmentAnswerRow ");
                System.Data.Common.DbParameter[] args = new System.Data.Common.DbParameter[3];
                args[0] = (System.Data.Common.DbParameter)DbHelper.CreateParameter("@consumerPlanId", DbType.String, consumerPlanId);
                args[1] = (System.Data.Common.DbParameter)DbHelper.CreateParameter("@assessmentQuestionSetId", DbType.String, assessmentQuestionSetId);
                args[2] = (System.Data.Common.DbParameter)DbHelper.CreateParameter("@rowNumber", DbType.String, rowNumber);
                // returns 1 if the row deleted or 0 if it was not deleted
                return (int)DbHelper.ExecuteScalar(System.Data.CommandType.StoredProcedure, "CALL DBA.ANYW_ISP_DeleteConsumerAssessmentAnswerRow(?,?,?)", args, ref transaction);
            }
            catch (Exception ex)
            {
                logger.error("ADG", ex.Message + "ANYW_ISP_DeleteConsumerAssessmentAnswerRow(" + consumerPlanId + "," + assessmentQuestionSetId + "," + rowNumber + ")");
                throw ex;
            }
        }
        public string getConsumerAssessment(string consumerPlanId, string copy, DistributedTransaction transaction)
        {
            try
            {
                logger.debug("getConsumerAssessment ");
                System.Data.Common.DbParameter[] args = new System.Data.Common.DbParameter[2];
                args[0] = (System.Data.Common.DbParameter)DbHelper.CreateParameter("@consumerPlanId", DbType.String, consumerPlanId);
                args[1] = (System.Data.Common.DbParameter)DbHelper.CreateParameter("@copy", DbType.String, copy);
                System.Data.Common.DbDataReader returnMsg = DbHelper.ExecuteReader(System.Data.CommandType.StoredProcedure, "CALL DBA.ANYW_ISP_getConsumerAssessment(?,?)", args, ref transaction);
                return convertToJSON(returnMsg);
            }
            catch (Exception ex)
            {
                logger.error("ADG", ex.Message + "ANYW_ISP_getConsumerAssessment(" + consumerPlanId + ")");
                throw ex;
            }
        }

        public string getRisksForCarryOver(string planId)
        {
            logger.debug("getRisksForCarryOver ");
            List<string> list = new List<string>();
            list.Add(planId);
            string text = "CALL DBA.ANYW_ISP_getRisksForCarryOver(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")";
            try
            {
                return executeDataBaseCallJSON(text);
            }
            catch (Exception ex)
            {
                logger.error("3ADG", ex.Message + "ANYW_ISP_getRisksForCarryOver(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")");
                return "3ADG: error ANYW_ISP_getRisksForCarryOver";
            }
        }
        public string getQuestions(string questionSetId, DistributedTransaction transaction)
        {
            try
            {
                logger.debug("getQuestions ");
                System.Data.Common.DbParameter[] args = new System.Data.Common.DbParameter[1];
                args[0] = (System.Data.Common.DbParameter)DbHelper.CreateParameter("@questionSetId", DbType.String, questionSetId);
                System.Data.Common.DbDataReader returnMsg = DbHelper.ExecuteReader(System.Data.CommandType.StoredProcedure, "CALL DBA.ANYW_ISP_getQuestions(?)", args, ref transaction);
                return convertToJSON(returnMsg);
            }
            catch (Exception ex)
            {
                logger.error("ADG", ex.Message + "ANYW_ISP_getQuestions(" + questionSetId + ")");
                throw ex;
            }
        }

        public string getQuestionsWithoutHidden(string questionSetId, DistributedTransaction transaction)
        {
            try
            {
                logger.debug("getQuestions ");
                System.Data.Common.DbParameter[] args = new System.Data.Common.DbParameter[1];
                args[0] = (System.Data.Common.DbParameter)DbHelper.CreateParameter("@questionSetId", DbType.String, questionSetId);
                System.Data.Common.DbDataReader returnMsg = DbHelper.ExecuteReader(System.Data.CommandType.StoredProcedure, "CALL DBA.ANYW_ISP_getQuestionsWithoutHidden(?)", args, ref transaction);
                return convertToJSON(returnMsg);
            }
            catch (Exception ex)
            {
                logger.error("ADG", ex.Message + "ANYW_ISP_getQuestions(" + questionSetId + ")");
                throw ex;
            }
        }
        public string getQuestionSet(string questionSetId, DistributedTransaction transaction)
        {
            try
            {
                logger.debug("getQuestionSets ");
                System.Data.Common.DbParameter[] args = new System.Data.Common.DbParameter[1];
                args[0] = (System.Data.Common.DbParameter)DbHelper.CreateParameter("@questionSetId", DbType.String, questionSetId);
                System.Data.Common.DbDataReader returnMsg = DbHelper.ExecuteReader(System.Data.CommandType.StoredProcedure, "CALL DBA.ANYW_ISP_getQuestionSet(?)", args, ref transaction);
                return convertToJSON(returnMsg);
            }
            catch (Exception ex)
            {
                logger.error("ADG", ex.Message + "ANYW_ISP_getQuestionSet(" + questionSetId + ")");
                throw ex;
            }
        }
        public string getQuestionSets(string versionId, DistributedTransaction transaction)
        {
            try
            {
                logger.debug("getQuestionSets ");
                System.Data.Common.DbParameter[] args = new System.Data.Common.DbParameter[1];
                args[0] = (System.Data.Common.DbParameter)DbHelper.CreateParameter("@versionId", DbType.String, versionId);
                System.Data.Common.DbDataReader returnMsg = DbHelper.ExecuteReader(System.Data.CommandType.StoredProcedure, "CALL DBA.ANYW_ISP_getQuestionSets(?)", args, ref transaction);
                return convertToJSON(returnMsg);
            }
            catch (Exception ex)
            {
                logger.error("ADG", ex.Message + "ANYW_ISP_getQuestionSets(" + versionId + ")");
                throw ex;
            }
        }

        public string getCurrentAssessmentVersionId(string assessmentVersionId, string effectiveStartDate, DistributedTransaction transaction)
        {
            try
            {
                logger.debug("getCurrentAssessmentVersionId ");
                System.Data.Common.DbParameter[] args = new System.Data.Common.DbParameter[2];
                args[0] = (System.Data.Common.DbParameter)DbHelper.CreateParameter("@assessmentVersionId", DbType.String, assessmentVersionId);
                args[1] = (System.Data.Common.DbParameter)DbHelper.CreateParameter("@effectiveStartDate", DbType.String, effectiveStartDate);
                // gets the most current versionId of the assessment given an existing versionId
                object result = DbHelper.ExecuteScalar(System.Data.CommandType.StoredProcedure, "CALL DBA.ANYW_ISP_getCurrentAssessmentVersionId(?,?)", args, ref transaction);
                return result?.ToString();
            }
            catch (Exception ex)
            {
                logger.error("ADG", ex.Message + "ANYW_ISP_getCurrentAssessmentVersionId(" + assessmentVersionId + ", " + effectiveStartDate + ")");
                throw ex;
            }
        }
        public string getNextAssessmentAnswerRowNumber(string consumerPlanId, string questionSetId, DistributedTransaction transaction)
        {
            try
            {
                logger.debug("getNextAssessmentAnswerRowNumber ");
                System.Data.Common.DbParameter[] args = new System.Data.Common.DbParameter[2];
                args[0] = (System.Data.Common.DbParameter)DbHelper.CreateParameter("@consumerPlanId", DbType.String, consumerPlanId);
                args[1] = (System.Data.Common.DbParameter)DbHelper.CreateParameter("@questionSetId", DbType.String, questionSetId);
                // gets the most current answerRowNumber of the assessment given an existing consumer plan and question set 
                string answerRowNumber = DbHelper.ExecuteScalar(System.Data.CommandType.StoredProcedure, "CALL DBA.ANYW_ISP_getNextAssessmentAnswerRowNumber(?,?)", args, ref transaction).ToString();
                if (answerRowNumber == "-1") throw new Exception("unable to fetch next answer row number");
                return answerRowNumber;
            }
            catch (Exception ex)
            {
                logger.error("ADG", ex.Message + "ANYW_ISP_getNextAssessmentAnswerRowNumber(" + consumerPlanId + ", " + questionSetId + ")");
                throw ex;
            }
        }
        public string insertConsumerAssessmentAnswer(string consumerPlanId, string questionId, string answerRow, string answer, string updatedBy, string skipped, DistributedTransaction transaction)
        {
            try
            {
                logger.debug("insertConsumerAssessmentAnswer ");
                System.Data.Common.DbParameter[] args = new System.Data.Common.DbParameter[6];
                args[0] = (System.Data.Common.DbParameter)DbHelper.CreateParameter("@consumerPlanId", DbType.String, consumerPlanId);
                args[1] = (System.Data.Common.DbParameter)DbHelper.CreateParameter("@questionId", DbType.String, questionId);
                args[2] = (System.Data.Common.DbParameter)DbHelper.CreateParameter("@answerRow", DbType.String, answerRow);
                args[3] = (System.Data.Common.DbParameter)DbHelper.CreateParameter("@answer", DbType.String, answer);
                args[4] = (System.Data.Common.DbParameter)DbHelper.CreateParameter("@updatedBy", DbType.String, updatedBy);
                args[5] = (System.Data.Common.DbParameter)DbHelper.CreateParameter("@skipped", DbType.String, skipped);
                return DbHelper.ExecuteScalar(System.Data.CommandType.StoredProcedure, "CALL DBA.ANYW_ISP_insertConsumerAssessmentAnswer(?,?,?,?,?,?)", args, ref transaction).ToString();
            }
            catch (Exception ex)
            {
                logger.error("ADG", ex.Message + "ANYW_ISP_insertConsumerAssessmentAnswer(" + consumerPlanId + "," + questionId + "," + answerRow + "," + answer + "," + updatedBy + ")");
                throw ex;
            }
        }
        public int updateAssessmentAnswer(string answerId, string answer, string updatedBy, DistributedTransaction transaction)
        {
            try
            {
                logger.debug("updateAssessmentAnswer ");
                System.Data.Common.DbParameter[] args = new System.Data.Common.DbParameter[3];
                args[0] = (System.Data.Common.DbParameter)DbHelper.CreateParameter("@answerId", DbType.String, answerId);
                args[1] = (System.Data.Common.DbParameter)DbHelper.CreateParameter("@answer", DbType.String, answer);
                args[2] = (System.Data.Common.DbParameter)DbHelper.CreateParameter("@updatedBy", DbType.String, updatedBy);
                // returns 1 if the row updated or 0 if it was not updated
                return (int)DbHelper.ExecuteScalar(System.Data.CommandType.StoredProcedure, "CALL DBA.ANYW_ISP_updateConsumerAssessmentAnswer(?, ?, ?)", args, ref transaction);
            }
            catch (Exception ex)
            {
                logger.error("ADG", ex.Message + "ANYW_ISP_updateConsumerAssessmentAnswer(" + answerId + "," + answer + "," + updatedBy + ")");
                throw ex;
            }
        }
        public string getConsumerRelationships(string consumerId, string effectiveStartDate, string effectiveEndDate, string areInSalesForce, string planId, DistributedTransaction transaction)
        {
            try
            {
                logger.debug("updateAssessmentAnswer ");
                System.Data.Common.DbParameter[] args = new System.Data.Common.DbParameter[5];
                args[0] = (System.Data.Common.DbParameter)DbHelper.CreateParameter("@consumerId", DbType.String, consumerId);
                args[1] = (System.Data.Common.DbParameter)DbHelper.CreateParameter("@effectiveStartDate", DbType.String, effectiveStartDate);
                args[2] = (System.Data.Common.DbParameter)DbHelper.CreateParameter("@effectiveEndDate", DbType.String, effectiveEndDate);
                args[3] = (System.Data.Common.DbParameter)DbHelper.CreateParameter("@areInSalesForce", DbType.String, areInSalesForce);
                args[4] = (System.Data.Common.DbParameter)DbHelper.CreateParameter("@planId", DbType.String, planId);

                // returns 1 if the row updated or 0 if it was not updated
                return (string)DbHelper.ExecuteScalar(System.Data.CommandType.StoredProcedure, "CALL DBA.ANYW_ISP_GetConsumerRelationships(?, ?, ?, ?, ?)", args, ref transaction);
            }
            catch (Exception ex)
            {
                logger.error("ADG", ex.Message + "ANYW_ISP_GetConsumerRelationships(" + consumerId + "," + effectiveStartDate + "," + effectiveEndDate + "," + areInSalesForce + "," + planId + ")");
                throw ex;
            }
        }

        public string getConsumerNameInfo(string consumerId, DistributedTransaction transaction)
        {
            try
            {
                logger.debug("updateAssessmentAnswer ");
                System.Data.Common.DbParameter[] args = new System.Data.Common.DbParameter[3];
                args[0] = (System.Data.Common.DbParameter)DbHelper.CreateParameter("@consumerId", DbType.String, consumerId);
                // returns 1 if the row updated or 0 if it was not updated
                return (string)DbHelper.ExecuteScalar(System.Data.CommandType.StoredProcedure, "CALL DBA.ANYW_ISP_GetConsumerNameInfo(?)", args, ref transaction);
            }
            catch (Exception ex)
            {
                logger.error("ADG", ex.Message + "ANYW_ISP_GetConsumerNameInfo(" + consumerId + ")");
                throw ex;
            }
        }

        public int updateConsumerNameInfo(string consumerId, string firstName, string lastName, string middleName, string nickName, DistributedTransaction transaction)
        {
            try
            {
                logger.debug("updateAssessmentAnswer ");
                System.Data.Common.DbParameter[] args = new System.Data.Common.DbParameter[3];
                args[0] = (System.Data.Common.DbParameter)DbHelper.CreateParameter("@consumerId", DbType.String, consumerId);
                args[1] = (System.Data.Common.DbParameter)DbHelper.CreateParameter("@firstName", DbType.String, firstName);
                args[2] = (System.Data.Common.DbParameter)DbHelper.CreateParameter("@lastName", DbType.String, lastName);
                args[1] = (System.Data.Common.DbParameter)DbHelper.CreateParameter("@middleName", DbType.String, middleName);
                args[2] = (System.Data.Common.DbParameter)DbHelper.CreateParameter("@nickName", DbType.String, nickName);
                // returns 1 if the row updated or 0 if it was not updated
                return (int)DbHelper.ExecuteScalar(System.Data.CommandType.StoredProcedure, "CALL DBA.ANYW_ISP_UpdateConsumerNameInfo(?, ?, ?, ?, ?)", args, ref transaction);
            }
            catch (Exception ex)
            {
                logger.error("ADG", ex.Message + "ANYW_ISP_updateConsumerAssessmentAnswer(" + consumerId + "," + firstName + "," + lastName + "," + middleName + "," + nickName + ")");
                throw ex;
            }
        }

        public string updateConsumerPlanReviewDate(string token, string reviewDate, long planId)
        {
            if (tokenValidator(token) == false) return null;
            logger.debug("insertConsumerPlan ");
            List<string> list = new List<string>();
            list.Add(token);
            list.Add(reviewDate);
            list.Add(planId.ToString());
            string text = "CALL DBA.ANYW_ISP_UpdateConsumerPlanReviewDate(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")";
            try
            {
                return executeDataBaseCallJSON(text);
            }
            catch (Exception ex)
            {
                logger.error("3ADG", ex.Message + "ANYW_ISP_UpdateConsumerPlanReviewDate(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")");
                return "3ADG: error ANYW_ISP_UpdateConsumerPlanReviewDate";
            }
        }

        public string getQuestionSetsTwo(string planId, string targetAssessmentVersionId)
        {
            logger.debug("getQuestionSets ");
            List<string> list = new List<string>();
            list.Add(planId);
            list.Add(targetAssessmentVersionId);
            string text = "CALL DBA.ANYW_ISP_getQuestionSetsTwo(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")";
            try
            {
                return executeDataBaseCallJSON(text);
            }
            catch (Exception ex)
            {
                logger.error("4ADG", ex.Message + "ANYW_ISP_getQuestionSetsTwo(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")");
                return "4ADG: error ANYW_ISP_getQuestionSetsTwo";
            }
        }

        public string addPlanAttachment(string token, long assessmentId, string description, string attachmentType, string attachment, string section, long questionId, string signatureId)
        {
            if (tokenValidator(token) == false) return null;
            //if (tokenValidator(attachment) == false) return null;//ensuring attachment has no spaces so it can't be bad sql
            logger.debug("deleteCaseNoteAttachment");
            List<string> list = new List<string>();
            list.Add(token);
            list.Add(assessmentId.ToString());
            list.Add(description);
            list.Add(attachmentType);
            list.Add(attachment);
            list.Add(section);
            list.Add(questionId.ToString());
            list.Add(signatureId);
            string text = "CALL DBA.ANYW_ISP_AddPlanAttachment(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")";
            try
            {
                return executeDataBaseCallJSON(text);
            }
            catch (Exception ex)
            {
                logger.error("539.2", ex.Message + "ANYW_ISP_AddPlanAttachment(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")");
                return "539.2: error ANYW_ISP_AddPlanAttachment";
            }
        }

        public string updatePlanAttachmentsenttoDODD(string attachmentId, string senttoDODD)
        {

            logger.debug("updatePlanAttachmentsenttoDODD");
            List<string> list = new List<string>();
            list.Add(attachmentId);
            list.Add(senttoDODD);

            string text = "CALL DBA.ANYW_ISP_UpdatePlanAttachmentsenttoDODD(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")";
            try
            {
                return executeDataBaseCallJSON(text);
            }
            catch (Exception ex)
            {
                logger.error("539.2", ex.Message + "ANYW_ISP_UpdatePlanAttachmentsenttoDODD(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")");
                return "539.2: error ANYW_ISP_UpdatePlanAttachmentsenttoDODD";
            }
        }


        public string deletePlanAttachment(string token, long planId, string attachmentId)
        {
            if (tokenValidator(token) == false) return null;
            if (tokenValidator(attachmentId) == false) return null;//ensuring attachmentId has no spaces so it can't be bad sql
            logger.debug("deleteCaseNoteAttachment");
            List<string> list = new List<string>();
            list.Add(token);
            list.Add(planId.ToString());
            list.Add(attachmentId);
            string text = "CALL DBA.ANYW_ISP_DeleteAttachment(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")";
            try
            {
                return executeDataBaseCallJSON(text);
            }
            catch (Exception ex)
            {
                logger.error("539.2", ex.Message + "ANYW_ISP_DeleteAttachment(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")");
                return "539.2: error ANYW_ISP_DeleteAttachment";
            }
        }

        public string updatePlanSectionApplicable(string token, long planId, long sectionId, string applicable)
        {
            if (tokenValidator(token) == false) return null;
            logger.debug("deleteCaseNoteAttachment");
            List<string> list = new List<string>();
            list.Add(token);
            list.Add(planId.ToString());
            list.Add(sectionId.ToString());
            list.Add(applicable);
            string text = "CALL DBA.ANYW_ISP_UpdatePlanSectionApplicable(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")";
            try
            {
                return executeDataBaseCallJSON(text);
            }
            catch (Exception ex)
            {
                logger.error("539.3", ex.Message + "ANYW_ISP_UpdatePlanSectionApplicable(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")");
                return "539.3: error ANYW_ISP_UpdatePlanSectionApplicable";
            }
        }

        public string getPlanAttachmentsList(string token, long planId, string section)
        {
            if (tokenValidator(token) == false) return null;
            logger.debug("getPlanAttachmentsList");
            List<string> list = new List<string>();
            list.Add(token);
            list.Add(planId.ToString());
            list.Add(section);
            string text = "CALL DBA.ANYW_ISP_GetPlanAttachments(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")";
            try
            {
                return executeDataBaseCallJSON(text);
            }
            catch (Exception ex)
            {
                logger.error("539.4", ex.Message + "ANYW_ISP_GetPlanAttachments(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")");
                return "539.4: error ANYW_ISP_GetPlanAttachments";
            }
        }

        public string carryOverApplicable(string consumerPlanId, string priorPlanId, string effectiveStart)
        {
            logger.debug("getPlanAttachmentsList");
            List<string> list = new List<string>();
            list.Add(consumerPlanId);
            list.Add(priorPlanId);
            list.Add(effectiveStart);
            string text = "CALL DBA.ANYW_ISP_InsertApplicableValueSettingsRevision(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")";
            try
            {
                return executeDataBaseCallJSON(text);
            }
            catch (Exception ex)
            {
                logger.error("539.4", ex.Message + "ANYW_ISP_InsertApplicableValueSettingsRevision(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")");
                return "539.4: error ANYW_ISP_InsertApplicableValueSettingsRevision";
            }
        }

        

        public string carryoverPlanAttachment(string token, long consumerPlanId, long priorConsumerPlanId, string oldAttachmentId, long questionId, long planAttachmentId)
        {
            if (tokenValidator(token) == false) return null;
            if (tokenValidator(oldAttachmentId) == false) return null;
            logger.debug("getPlanAttachmentsList");
            List<string> list = new List<string>();
            list.Add(token);
            list.Add(consumerPlanId.ToString());
            list.Add(priorConsumerPlanId.ToString());
            list.Add(oldAttachmentId);
            list.Add(questionId.ToString());
            list.Add(planAttachmentId.ToString());
            string text = "CALL DBA.ANYW_ISP_CarryOverAttachments(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")";
            try
            {
                return executeDataBaseCallJSON(text);
            }
            catch (Exception ex)
            {
                logger.error("539.5", ex.Message + "ANYW_ISP_CarryOverAttachments(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")");
                return "539.5: error ANYW_ISP_CarryOverAttachments";
            }
        }

        public string deleteAttachmentsWithPlan(string consumerPlanId)
        {
            logger.debug("getPlanAttachmentsList");
            List<string> list = new List<string>();
            list.Add(consumerPlanId);
            string text = "CALL DBA.ANYW_ISP_DeleteAttachmentsWithPlan(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")";
            try
            {
                return executeDataBaseCallJSON(text);
            }
            catch (Exception ex)
            {
                logger.error("539.6", ex.Message + "ANYW_ISP_DeleteAttachmentsWithPlan(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")");
                return "539.6: error ANYW_ISP_DeleteAttachmentsWithPlan";
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

        private string executeDataBaseCall(string storedProdCall)
        {
            return executeDataBaseCall(storedProdCall, "results", "result");
        }

        private string executeDataBaseCall(string storedProdCall, string collectionTag, string dataRowTag)
        {
            OdbcConnection conn = null;
            OdbcCommand cmd;
            OdbcDataReader rdr = null;
            string result = "<" + collectionTag + ">";

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
                    result = result + "<" + dataRowTag + ">";

                    for (int ordinal = 0; ordinal < rdr.FieldCount; ordinal++)
                    {
                        result = result + "<" + rdr.GetName(ordinal) + ">" + rdr.GetValue(ordinal) + "</" + rdr.GetName(ordinal) + ">";
                    }
                    result = result + "</" + dataRowTag + ">";
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

            return result + "</" + collectionTag + ">";

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
        #endregion

    }
}