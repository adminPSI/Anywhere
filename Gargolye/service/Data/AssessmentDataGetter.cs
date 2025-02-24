using Anywhere.Log;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Data.Odbc;
using System.IO;
using System.Linq;
using System.Web.Script.Serialization;
using static Anywhere.service.Data.Authorization.AuthorizationWorker;

namespace Anywhere.service.Data
{
    public class AssessmentDataGetter
    {
        private static Loger logger = new Loger();
        private string connectString = ConfigurationManager.ConnectionStrings["connection"].ToString();
        Anywhere.service.Data.WorkflowDataGetter wfdg = new Anywhere.service.Data.WorkflowDataGetter();

        public string authorizationGetPageData(string token)
        {
            if (tokenValidator(token) == false) return null;
            logger.debug("authorizationGetPageData");
            List<string> list = new List<string>();
            list.Add(token);
            string text = "CALL DBA.ANYW_Authorization_GetPageData(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")";
            try
            {
                return executeDataBaseCallJSON(text);
            }
            catch (Exception ex)
            {
                logger.error("539.4", ex.Message + "ANYW_Authorization_GetPageData(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")");
                return "539.4: error ANYW_Authorization_GetPageData";
            }
        }

        public string getConsumerPlans(string token, string consumerId)
        {
            if (tokenValidator(token) == false) return null;
            logger.debug("getConsumerPlans ");
            List<string> list = new List<string>();
            list.Add(token);
            list.Add(consumerId);
            string text = "CALL DBA.ANYW_ISP_getConsumerPlans(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")";
            try
            {
                return executeDataBaseCallJSON(text);
            }
            catch (Exception ex)
            {
                logger.error("1ADG", ex.Message + "ANYW_ISP_getConsumerPlans(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")");
                return "1ADG: error ANYW_ISP_getConsumerPlans";
            }
        }

        public string getConsumerAssessment(string token, string copy, string consumerPlanId)
        {
            if (tokenValidator(token) == false) return null;
            logger.debug("getConsumerAssessment ");
            List<string> list = new List<string>();
            list.Add(token);
            list.Add(consumerPlanId);
            list.Add(copy);
            string text = "CALL DBA.ANYW_ISP_getConsumerAssessment(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")";
            try
            {
                return executeDataBaseCallJSON(text);
            }
            catch (Exception ex)
            {
                logger.error("2ADG", ex.Message + "ANYW_ISP_getConsumerAssessment(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")");
                return "1ADG: error ANYW_ISP_getConsumerAssessment";
            }
        }

        public string getReportTitle(string planId)
        {
            logger.debug("getConsumerAssessment ");
            List<string> list = new List<string>();
            list.Add(planId);
            string text = "CALL DBA.ANYW_ISP_GetReportTitle(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")";
            try
            {
                return executeDataBaseCallJSON(text);
            }
            catch (Exception ex)
            {
                logger.error("2ADG", ex.Message + "ANYW_ISP_GetReportTitle(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")");
                return "1ADG: error ANYW_ISP_GetReportTitle";
            }
        }

        public string insertConsumerPlan(string token, string consumerId, string planType, string planYearStart, string planYearEnd, string effectiveStart, string effectiveEnd, string active, string reviewDate, string salesForceCaseManagerId)
        {
            if (tokenValidator(token) == false) return null;
            logger.debug("insertConsumerPlan ");
            List<string> list = new List<string>();
            list.Add(token);
            list.Add(consumerId);
            list.Add(planType);
            list.Add(planYearStart);
            list.Add(planYearEnd);
            list.Add(effectiveStart);
            list.Add(effectiveEnd);
            list.Add(active);
            list.Add(reviewDate);
            list.Add(salesForceCaseManagerId);

            string text = "CALL DBA.ANYW_ISP_insertConsumerPlan(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")";
            try
            {
                return executeDataBaseCallJSON(text);
            }
            catch (Exception ex)
            {
                logger.error("3ADG", ex.Message + "ANYW_ISP_insertConsumerPlan(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")");
                return "3ADG: error ANYW_ISP_insertConsumerPlan";
            }
        }

        public string runReOrderSQL(string token)
        {
            if (tokenValidator(token) == false) return null;
            logger.debug("insertConsumerPlan ");
            List<string> list = new List<string>();
            list.Add(token);

            string text = "CALL DBA.ANYW_ISP_RunReOrderSQL(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")";
            try
            {
                return executeDataBaseCallJSON(text);
            }
            catch (Exception ex)
            {
                logger.error("3ADG", ex.Message + "ANYW_ISP_RunReOrderSQL(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")");
                return "3ADG: error ANYW_ISP_RunReOrderSQL";
            }
        }

        public string switchPlanType(string token, string consumerPlanId, string planType, string revisionNumber, string planYearStart, string planYearEnd, string effectiveStartDate, string effectiveEndDate, string reviewDate, string prevPlanId)
        {
            if (tokenValidator(token) == false) return null;
            logger.debug("insertConsumerPlan ");
            List<string> list = new List<string>();
            list.Add(consumerPlanId);
            list.Add(planType);
            list.Add(revisionNumber);
            list.Add(planYearStart);
            list.Add(planYearEnd);
            list.Add(effectiveStartDate);
            list.Add(effectiveEndDate);
            list.Add(reviewDate);
            list.Add(prevPlanId);
            string text = "CALL DBA.ANYW_ISP_SwitchPlanType(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")";
            try
            {
                executeDataBaseCallJSON(text);
                return "Success";
            }
            catch (Exception ex)
            {
                logger.error("3ADG", ex.Message + "ANYW_ISP_SwitchPlanType(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")");
                return "3ADG: error ANYW_ISP_SwitchPlanType";
            }
        }

        public string validateToken(string token)
        {
            if (tokenValidator(token) == false) return null;
            List<string> list = new List<string>();
            list.Add(token);
            string text = "CALL DBA.ANYW_TokenCheck(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")";
            try
            {
                return executeDataBaseCallJSON(text);
            }
            catch (Exception ex)
            {
                logger.error("ADG", ex.Message + "ANYW_TokenCheck(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")");
                return "ADG: error ANYW_TokenCheck";
            }
        }

        public string getQuestionSets(string versionId)
        {
            logger.debug("getQuestionSets ");
            List<string> list = new List<string>();
            list.Add(versionId);
            string text = "CALL DBA.ANYW_ISP_getQuestionSets(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")";
            try
            {
                return executeDataBaseCallJSON(text);
            }
            catch (Exception ex)
            {
                logger.error("4ADG", ex.Message + "ANYW_ISP_getQuestionSets(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")");
                return "4ADG: error ANYW_ISP_getQuestionSets";
            }
        }

        public string getQuestions(string questionSetId)
        {
            logger.debug("getQuestionSets ");
            List<string> list = new List<string>();
            list.Add(questionSetId);
            string text = "CALL DBA.ANYW_ISP_getQuestions(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")";
            try
            {
                return executeDataBaseCallJSON(text);
            }
            catch (Exception ex)
            {
                logger.error("5ADG", ex.Message + "ANYW_ISP_getQuestions(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")");
                return "5ADG: error ANYW_ISP_getQuestions";
            }
        }


        public string insertConsumerAssessmentAnswer(string consumerPlanId, string questionId, string answerRow, string answer, string skipped)
        {
            logger.debug("insertConsumerAssessmentAnswer ");
            List<string> list = new List<string>();
            list.Add(consumerPlanId);
            list.Add(questionId);
            list.Add(answerRow);
            list.Add(answer);
            list.Add(skipped);
            string text = "CALL DBA.ANYW_ISP_insertConsumerAssessmentAnswer(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")";
            try
            {
                return executeDataBaseCallJSON(text);
            }
            catch (Exception ex)
            {
                logger.error("6ADG", ex.Message + "ANYW_ISP_insertConsumerAssessmentAnswer(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")");
                return "6ADG: error ANYW_ISP_insertConsumerAssessmentAnswer";
            }
        }

        public string insertPlanReportToBeTranferredToONET(string token, string report, long planId)
        {
            if (tokenValidator(token) == false) return null;
            logger.debug("insertPlanReportToBeTranferredToONET ");
            List<string> list = new List<string>();
            list.Add(token);
            list.Add(report);
            list.Add(planId.ToString());
            string text = "CALL DBA.ANYW_ISP_InsertPlanReportToBeTranferredToONET(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")";
            try
            {
                return executeDataBaseCallJSON(text);
            }
            catch (Exception ex)
            {
                logger.error("6ADG", ex.Message + "ANYW_ISP_InsertPlanReportToBeTranferredToONET(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")");
                return "6ADG: error ANYW_ISP_InsertPlanReportToBeTranferredToONET";
            }
        }

        public string getSentToONETDate(string token, string planId)
        {
            if (tokenValidator(token) == false) return null;
            logger.debug("getSentToONETDate ");
            List<string> list = new List<string>();
            list.Add(token);
            list.Add(planId.ToString());
            string text = "CALL DBA.ANYW_ISP_getSentToONETDate(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")";
            try
            {
                return executeDataBaseCallJSON(text);
            }
            catch (Exception ex)
            {
                logger.error("6ADG", ex.Message + "ANYW_ISP_InsertPlanReportToBeTranferredToONET(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")");
                return "6ADG: error ANYW_ISP_InsertPlanReportToBeTranferredToONET";
            }
        }

        public string transferPlanReportToONET(string token, long planId)
        {
            if (tokenValidator(token) == false) return null;
            logger.debug("insertPlanReportToBeTranferredToONET ");
            List<string> list = new List<string>();
            list.Add(token);
            list.Add(planId.ToString());
            string text = "CALL DBA.ANYW_ISP_TransferPlanReportToONET(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")";
            try
            {
                return executeDataBaseCallJSON(text);
            }
            catch (Exception ex)
            {
                logger.error("7ADG", ex.Message + "ANYW_ISP_TransferPlanReportToONET(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")");
                return "7ADG: error ANYW_ISP_TransferPlanReportToONET";
            }
        }

        //public string updateConsumerAssessmentAnswer(string answerId, string answer)
        //{
        //    logger.debug("updateConsumerAssessmentAnswer ");
        //    List<string> list = new List<string>();
        //    list.Add(answerId);
        //    list.Add(answer);
        //    string text = "CALL DBA.ANYW_ISP_updateConsumerAssessmentAnswer(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")";
        //    try
        //    {
        //        return executeDataBaseCallJSON(text);
        //    }
        //    catch (Exception ex)
        //    {
        //        logger.error("7ADG", ex.Message + "ANYW_ISP_updateConsumerAssessmentAnswer(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")");
        //        return "7ADG: error ANYW_ISP_updateConsumerAssessmentAnswer";
        //    }
        //}        

        public void updateAssessmentAnswer(string answerId, string answer, DistributedTransaction transaction)
        {
            try
            {

                logger.debug("updateAssessmentAnswer ");
                System.Data.Common.DbParameter[] args = new System.Data.Common.DbParameter[2];
                args[0] = (System.Data.Common.DbParameter)DbHelper.CreateParameter("@answerId", DbType.Int64, answerId);
                args[1] = (System.Data.Common.DbParameter)DbHelper.CreateParameter("@answer", DbType.String, answer);
                DbHelper.ExecuteNonQuery(System.Data.CommandType.StoredProcedure, "CALL DBA.ANYW_ISP_updateConsumerAssessmentAnswer(?, ?)", args, ref transaction);

            }
            catch (Exception ex)
            {
                logger.error("7ADG", ex.Message + "ANYW_ISP_updateConsumerAssessmentAnswer(" + answerId + "," + answer + ")");
                throw ex;
            }
        }

        public string getServiceVendors(string token)
        {
            if (tokenValidator(token) == false) return null;
            logger.debug("getServiceVendors ");
            List<string> list = new List<string>();
            list.Add(token);
            string text = "CALL DBA.ANYW_ISP_GetServiceVendors(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")";
            try
            {
                return executeDataBaseCallJSON(text);
            }
            catch (Exception ex)
            {
                logger.error("8ADG", ex.Message + "ANYW_ISP_GetServiceVendors(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")");
                return "8ADG: error ANYW_ISP_GetServiceVendors";
            }
        }

        public string getMatchSources(string token)
        {
            if (tokenValidator(token) == false) return null;
            logger.debug("getMatchSources ");
            List<string> list = new List<string>();
            list.Add(token);
            string text = "CALL DBA.ANYW_Authorization_GetMatchSources(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")";
            try
            {
                return executeDataBaseCallJSON(text);
            }
            catch (Exception ex)
            {
                logger.error("8ADG", ex.Message + "ANYW_Authorization_GetMatchSources(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")");
                return "8ADG: error ANYW_Authorization_GetMatchSources";
            }
        }

        public string getAllActiveVendors(string token)
        {
            if (tokenValidator(token) == false) return null;
            logger.debug("getAllActiveVendors ");
            List<string> list = new List<string>();
            list.Add(token);
            string text = "CALL DBA.ANYW_ISP_getAllActiveVendors(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")";
            try
            {
                return executeDataBaseCallJSON(text);
            }
            catch (Exception ex)
            {
                logger.error("8ADG", ex.Message + "ANYW_ISP_getAllActiveVendors(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")");
                return "8ADG: error ANYW_ISP_getAllActiveVendors";
            }
        }

        public string updateAfterSuccessfullPlanDownload(string token, string consumerId)
        {
            if (tokenValidator(token) == false) return null;
            logger.debug("updateAfterSuccessfullPlanDownload ");
            List<string> list = new List<string>();
            list.Add(token);
            list.Add(consumerId);
            string text = "CALL DBA.ANYW_Plan_UpdateAfterSuccessfullPlanDownload(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")";
            try
            {
                return executeDataBaseCallJSON(text);
            }
            catch (Exception ex)
            {
                logger.error("8ADG", ex.Message + "ANYW_Plan_UpdateAfterSuccessfullPlanDownload(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")");
                return "8ADG: error ANYW_Plan_UpdateAfterSuccessfullPlanDownload";
            }
        }


        public string getPaidSupportsVendors(string fundingSourceName, string serviceName, string areInSalesForce)
        {
            logger.debug("getServiceVendors ");
            List<string> list = new List<string>();
            list.Add(fundingSourceName);
            list.Add(serviceName);
            list.Add(areInSalesForce);
            string text = "CALL DBA.ANYW_ISP_GetPaidSupportsVendors(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")";
            try
            {
                return executeDataBaseCallJSON(text);
            }
            catch (Exception ex)
            {
                logger.error("8ADG", ex.Message + "ANYW_ISP_GetPaidSupportsVendors(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")");
                return "8ADG: error ANYW_ISP_GetPaidSupportsVendors";
            }
        }

        public string getServiceTypes(string token)
        {
            if (tokenValidator(token) == false) return null;
            logger.debug("getServiceTypes ");
            List<string> list = new List<string>();
            list.Add(token);
            string text = "CALL DBA.ANYW_ISP_GetServiceTypes(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")";
            try
            {
                return executeDataBaseCallJSON(text);
            }
            catch (Exception ex)
            {
                logger.error("9ADG", ex.Message + "ANYW_ISP_GetServiceTypes(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")");
                return "9ADG: error ANYW_ISP_GetServiceTypes";
            }
        }

        public string getFundingSource(string token)
        {
            if (tokenValidator(token) == false) return null;
            logger.debug("getServiceTypes ");
            List<string> list = new List<string>();
            list.Add(token);
            string text = "CALL DBA.ANYW_ISP_GetFundingSource(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")";
            try
            {
                return executeDataBaseCallJSON(text);
            }
            catch (Exception ex)
            {
                logger.error("10ADG", ex.Message + "ANYW_ISP_GetFundingSource(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")");
                return "10ADG: error ANYW_ISP_GetFundingSource";
            }
        }

        public string getAssessmentAreas(string token)
        {
            if (tokenValidator(token) == false) return null;
            logger.debug("getServiceTypes ");
            List<string> list = new List<string>();
            list.Add(token);
            string text = "CALL DBA.ANYW_ISP_GetAssessmentAreas(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")";
            try
            {
                return executeDataBaseCallJSON(text);
            }
            catch (Exception ex)
            {
                logger.error("11ADG", ex.Message + "ANYW_ISP_GetAssessmentAreas(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")");
                return "11ADG: error ANYW_ISP_GetAssessmentAreas";
            }
        }

        public string getConsumerRelationships(string token, long consumerId, string effectiveStartDate, string effectiveEndDate, string areInSalesForce, string planId)
        {
            if (tokenValidator(token) == false) return null;
            planId = planId.TrimEnd(',');
            logger.debug("getConsumerRelationships ");
            List<string> list = new List<string>();
            //list.Add(token);
            list.Add(consumerId.ToString());
            list.Add(effectiveStartDate);
            list.Add(effectiveEndDate);
            list.Add(areInSalesForce);
            list.Add(planId);
            string text = "CALL DBA.ANYW_ISP_GetConsumerRelationships(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")";
            try
            {
                return executeDataBaseCallJSON(text);
            }
            catch (Exception ex)
            {
                logger.error("1APCIDG", ex.Message + "ANYW_ISP_GetConsumerRelationships(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")");
                return "1APCIDG: error ANYW_ISP_GetConsumerRelationships";
            }
        }

        public string getVendors(string token)
        {
            if (tokenValidator(token) == false) return null;
            logger.debug("getVendors ");

            string text = "CALL DBA.ANYW_ISP_GetActiveVendors()";
            try
            {
                return executeDataBaseCallJSON(text);
            }
            catch (Exception ex)
            {
                logger.error("1APCIDG", ex.Message + "ANYW_ISP_GetActiveVendors()");
                return "1APCIDG: error ANYW_ISP_GetActiveVendors";
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

        public string getAssessmentEntries(string token, string consumerIds, string methodology, string score, string startDateFrom, string startDateTo, string endDateFrom, string endDateTo, string priorAuthApplFrom, string priorAuthApplTo, string priorAuthRecFrom, string priorAuthRecTo, string priorAuthAmtFrom, string priorAuthAmtTo, DistributedTransaction transaction)
        {
            try
            {
                priorAuthAmtTo = priorAuthAmtTo.Length > 7 ? priorAuthAmtTo.Remove(7) : priorAuthAmtTo;
                priorAuthAmtFrom = priorAuthAmtFrom.Length > 7 ? priorAuthAmtFrom.Remove(7) : priorAuthAmtFrom;
                logger.debug("getAssessmentEntries");
                System.Data.Common.DbParameter[] args = new System.Data.Common.DbParameter[13];
                args[0] = (System.Data.Common.DbParameter)DbHelper.CreateParameter("@consumerIds", DbType.String, consumerIds);
                args[1] = (System.Data.Common.DbParameter)DbHelper.CreateParameter("@methodology", DbType.String, methodology);
                args[2] = (System.Data.Common.DbParameter)DbHelper.CreateParameter("@score", DbType.String, score);
                args[3] = (System.Data.Common.DbParameter)DbHelper.CreateParameter("@startDateFrom", DbType.String, startDateFrom);
                args[4] = (System.Data.Common.DbParameter)DbHelper.CreateParameter("@startDateTo", DbType.String, startDateTo);
                args[5] = (System.Data.Common.DbParameter)DbHelper.CreateParameter("@endDateFrom", DbType.String, endDateFrom);
                args[6] = (System.Data.Common.DbParameter)DbHelper.CreateParameter("@endDateTo", DbType.String, endDateTo);
                args[7] = (System.Data.Common.DbParameter)DbHelper.CreateParameter("@priorAuthApplFrom", DbType.String, priorAuthApplFrom);
                args[8] = (System.Data.Common.DbParameter)DbHelper.CreateParameter("@priorAuthApplTo", DbType.String, priorAuthApplTo);
                args[9] = (System.Data.Common.DbParameter)DbHelper.CreateParameter("@priorAuthRecFrom", DbType.String, priorAuthRecFrom);
                args[10] = (System.Data.Common.DbParameter)DbHelper.CreateParameter("@priorAuthRecTo", DbType.String, priorAuthRecTo);
                args[11] = (System.Data.Common.DbParameter)DbHelper.CreateParameter("@priorAuthAmtFrom", DbType.String, priorAuthAmtFrom);
                args[12] = (System.Data.Common.DbParameter)DbHelper.CreateParameter("@priorAuthAmtTo", DbType.String, priorAuthAmtTo);

                System.Data.Common.DbDataReader returnMsg = DbHelper.ExecuteReader(System.Data.CommandType.StoredProcedure, "CALL DBA.ANYW_Authorization_GetAssessmentEntries(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", args, ref transaction);
                return wfdg.convertToJSON(returnMsg);
            }
            catch (Exception ex)
            {
                logger.error("WFDG", ex.Message + "ANYW_Authorization_GetAssessmentEntries(" + consumerIds + ")");
                throw ex;
            }
        }

        public string getScore(DistributedTransaction transaction, string methodologyID)
        {
            List<string> list = new List<string>();
            list.Add(methodologyID);
            try
            {
                logger.debug("getScore");
                System.Data.Common.DbDataReader returnMsg = DbHelper.ExecuteReader(System.Data.CommandType.StoredProcedure, "CALL DBA.ANYW_Authorization_getScore(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")", ref transaction);
                return wfdg.convertToJSON(returnMsg);
            }
            catch (Exception ex)
            {
                logger.error("WFDG", ex.Message + "ANYW_Authorization_getScore()");
                throw ex;
            }

        }

        public string authorizationGetLandingPageData(string token)
        {
            if (tokenValidator(token) == false) return null;
            logger.debug("getUserPermissions " + token);

            List<string> list = new List<string>();
            list.Add(token);
            string text = "CALL DBA.ANYW_Authorization_getLandingPage(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")";
            try
            {
                return executeDataBaseCallJSON(text);
            }
            catch (Exception ex)
            {

                logger.error("653", ex.Message + "ANYW_Authorization_getLandingPage(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")");
                return "653: error ANYW_User_Permissions";

            }
        }

        public string getVendorInfo(string token, string vendor, string DDNumber, string localNumber, string goodStanding, string homeServices, string takingNewReferrals, string fundingSource, string serviceCode, DistributedTransaction transaction)
        {
            try
            {
                logger.debug("getVendorInfo");
                System.Data.Common.DbParameter[] args = new System.Data.Common.DbParameter[9];
                args[0] = (System.Data.Common.DbParameter)DbHelper.CreateParameter("@token", DbType.String, token);
                args[1] = (System.Data.Common.DbParameter)DbHelper.CreateParameter("@vendor", DbType.String, vendor);
                args[2] = (System.Data.Common.DbParameter)DbHelper.CreateParameter("@DDNumber", DbType.String, DDNumber);
                args[3] = (System.Data.Common.DbParameter)DbHelper.CreateParameter("@localNumber", DbType.String, localNumber);
                args[4] = (System.Data.Common.DbParameter)DbHelper.CreateParameter("@goodStanding", DbType.String, goodStanding);
                args[5] = (System.Data.Common.DbParameter)DbHelper.CreateParameter("@homeServices", DbType.String, homeServices);
                args[6] = (System.Data.Common.DbParameter)DbHelper.CreateParameter("@takingNewReferrals", DbType.String, takingNewReferrals);
                args[7] = (System.Data.Common.DbParameter)DbHelper.CreateParameter("@fundingSource", DbType.String, fundingSource);
                args[8] = (System.Data.Common.DbParameter)DbHelper.CreateParameter("@serviceCode", DbType.String, serviceCode);

                System.Data.Common.DbDataReader returnMsg = DbHelper.ExecuteReader(System.Data.CommandType.StoredProcedure, "CALL DBA.ANYW_Authorization_getVendorInfo(?,?,?,?,?,?,?,?,?)", args, ref transaction);
                return wfdg.convertToJSON(returnMsg);
            }
            catch (Exception ex)
            {
                logger.error("WFDG", ex.Message + "ANYW_Authorization_getVendorInfo()");
                throw ex;
            }

        }

        public string getVendor(DistributedTransaction transaction, string token)
        {
            try
            {
                logger.debug("getVendor");
                System.Data.Common.DbParameter[] args = new System.Data.Common.DbParameter[1];
                args[0] = (System.Data.Common.DbParameter)DbHelper.CreateParameter("@token", DbType.String, token);

                System.Data.Common.DbDataReader returnMsg = DbHelper.ExecuteReader(System.Data.CommandType.StoredProcedure, "CALL DBA.ANYW_Authorization_getVendor(?)", args, ref transaction);
                return wfdg.convertToJSON(returnMsg);
            }
            catch (Exception ex)
            {
                logger.error("WFDG", ex.Message + "ANYW_Authorization_getVendor()");
                throw ex;
            }

        }

        public string getFundingSource(DistributedTransaction transaction, string token)
        {
            try
            {
                logger.debug("getFundingSource");
                System.Data.Common.DbParameter[] args = new System.Data.Common.DbParameter[1];
                args[0] = (System.Data.Common.DbParameter)DbHelper.CreateParameter("@token", DbType.String, token);

                System.Data.Common.DbDataReader returnMsg = DbHelper.ExecuteReader(System.Data.CommandType.StoredProcedure, "CALL DBA.ANYW_Authorization_getFundingSource(?)", args, ref transaction);
                return wfdg.convertToJSON(returnMsg);
            }
            catch (Exception ex)
            {
                logger.error("WFDG", ex.Message + "ANYW_Authorization_getFundingSource()");
                throw ex;
            }
        }

        public string getServiceCode(DistributedTransaction transaction, string token)
        {
            try
            {
                logger.debug("getServiceCode");
                System.Data.Common.DbParameter[] args = new System.Data.Common.DbParameter[1];
                args[0] = (System.Data.Common.DbParameter)DbHelper.CreateParameter("@token", DbType.String, token);

                System.Data.Common.DbDataReader returnMsg = DbHelper.ExecuteReader(System.Data.CommandType.StoredProcedure, "CALL DBA.ANYW_Authorization_getServiceCode(?)", args, ref transaction);
                return wfdg.convertToJSON(returnMsg);
            }
            catch (Exception ex)
            {
                logger.error("WFDG", ex.Message + "ANYW_Authorization_getServiceCode()");
                throw ex;
            }
        }

        public string getVendorEntriesById(string token, string vendorID, DistributedTransaction transaction)
        {
            try
            {
                logger.debug("getVendorEntriesById");
                System.Data.Common.DbParameter[] args = new System.Data.Common.DbParameter[1];
                args[0] = (System.Data.Common.DbParameter)DbHelper.CreateParameter("@vendorID", DbType.String, vendorID);

                System.Data.Common.DbDataReader returnMsg = DbHelper.ExecuteReader(System.Data.CommandType.StoredProcedure, "CALL DBA.ANYW_Authorization_getVendorEntriesById(?)", args, ref transaction);
                return wfdg.convertToJSON(returnMsg);
            }
            catch (Exception ex)
            {
                logger.error("WFDG", ex.Message + "ANYW_Authorization_getVendorEntriesById()");
                throw ex;
            }
        }

        public string getVenderServicesEntries(string token, string vendorID, DistributedTransaction transaction)
        {
            try
            {
                logger.debug("getVenderServicesEntries");
                System.Data.Common.DbParameter[] args = new System.Data.Common.DbParameter[1];
                args[0] = (System.Data.Common.DbParameter)DbHelper.CreateParameter("@vendorID", DbType.String, vendorID);

                System.Data.Common.DbDataReader returnMsg = DbHelper.ExecuteReader(System.Data.CommandType.StoredProcedure, "CALL DBA.ANYW_Authorization_getVenderServicesEntries(?)", args, ref transaction);
                return wfdg.convertToJSON(returnMsg);
            }
            catch (Exception ex)
            {
                logger.error("WFDG", ex.Message + "ANYW_Authorization_getVenderServicesEntries()");
                throw ex;
            }
        }

        public string getVenderUCREntries(string token, string vendorID, DistributedTransaction transaction)
        {
            try
            {
                logger.debug("getVenderUCREntries");
                System.Data.Common.DbParameter[] args = new System.Data.Common.DbParameter[1];
                args[0] = (System.Data.Common.DbParameter)DbHelper.CreateParameter("@vendorID", DbType.String, vendorID);

                System.Data.Common.DbDataReader returnMsg = DbHelper.ExecuteReader(System.Data.CommandType.StoredProcedure, "CALL DBA.ANYW_Authorization_getVenderUCREntries(?)", args, ref transaction);
                return wfdg.convertToJSON(returnMsg);
            }
            catch (Exception ex)
            {
                logger.error("WFDG", ex.Message + "ANYW_Authorization_getVenderUCREntries()");
                throw ex;
            }
        }

        public string getProviderTypeEntries(string token, string vendorID, DistributedTransaction transaction)
        {
            try
            {
                logger.debug("getProviderTypeEntries");
                System.Data.Common.DbParameter[] args = new System.Data.Common.DbParameter[1];
                args[0] = (System.Data.Common.DbParameter)DbHelper.CreateParameter("@vendorID", DbType.String, vendorID);

                System.Data.Common.DbDataReader returnMsg = DbHelper.ExecuteReader(System.Data.CommandType.StoredProcedure, "CALL DBA.ANYW_Authorization_getProviderTypeEntries(?)", args, ref transaction);
                return wfdg.convertToJSON(returnMsg);
            }
            catch (Exception ex)
            {
                logger.error("WFDG", ex.Message + "ANYW_Authorization_getProviderTypeEntries()");
                throw ex;
            }
        }

        public string getVenderCertificationEntries(string token, string vendorID, DistributedTransaction transaction)
        {
            try
            {
                logger.debug("getVenderCertificationEntries");
                System.Data.Common.DbParameter[] args = new System.Data.Common.DbParameter[1];
                args[0] = (System.Data.Common.DbParameter)DbHelper.CreateParameter("@vendorID", DbType.String, vendorID);

                System.Data.Common.DbDataReader returnMsg = DbHelper.ExecuteReader(System.Data.CommandType.StoredProcedure, "CALL DBA.ANYW_Authorization_getVenderCertificationEntries(?)", args, ref transaction);
                return wfdg.convertToJSON(returnMsg);
            }
            catch (Exception ex)
            {
                logger.error("WFDG", ex.Message + "ANYW_Authorization_getVenderCertificationEntries()");
                throw ex;
            }
        }

        public string getVenderLocationReviewEntries(string token, string vendorID, DistributedTransaction transaction)
        {
            try
            {
                logger.debug("getVenderLocationReviewEntries");
                System.Data.Common.DbParameter[] args = new System.Data.Common.DbParameter[1];
                args[0] = (System.Data.Common.DbParameter)DbHelper.CreateParameter("@vendorID", DbType.String, vendorID);

                System.Data.Common.DbDataReader returnMsg = DbHelper.ExecuteReader(System.Data.CommandType.StoredProcedure, "CALL DBA.ANYW_Authorization_getVenderLocationReviewEntries(?)", args, ref transaction);
                return wfdg.convertToJSON(returnMsg);
            }
            catch (Exception ex)
            {
                logger.error("WFDG", ex.Message + "ANYW_Authorization_getVenderLocationReviewEntries()");
                throw ex;
            }
        }

    }
}