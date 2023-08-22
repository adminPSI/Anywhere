using Anywhere.Log;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Data.Odbc;
using System.IO;
using System.Linq;
using System.Web.Script.Serialization;
using static Anywhere.service.Data.AnywhereWorker;

namespace Anywhere.service.Data
{
    public class WorkflowDataGetter
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
            if (tokenValidator(token) == false) return null;
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
        public Boolean validateToken(string token, DistributedTransaction transaction)
        {
            if (tokenValidator(token) == false) return false;
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

        #region WORKFOW TEMPLATE METHODS
        public string getWorkflowProcesses(DistributedTransaction transaction)
        {
            try
            {
                logger.debug("getWorkflowProcesses ");
                System.Data.Common.DbParameter[] args = new System.Data.Common.DbParameter[0];
                System.Data.Common.DbDataReader returnMsg = DbHelper.ExecuteReader(System.Data.CommandType.StoredProcedure, "CALL DBA.ANYW_WF_getProcesses()", args, ref transaction);
                return convertToJSON(returnMsg);
            }
            catch (Exception ex)
            {
                logger.error("WFDG", ex.Message + "ANYW_WF_getProcesses()");
                throw ex;
            }
        }
        public string getWorkflowTemplate(string templateId, DistributedTransaction transaction)
        {
            try
            {
                logger.debug("getWorkflowTemplate ");
                System.Data.Common.DbParameter[] args = new System.Data.Common.DbParameter[1];
                args[0] = (System.Data.Common.DbParameter)DbHelper.CreateParameter("@templateId", DbType.String, templateId);
                System.Data.Common.DbDataReader returnMsg = DbHelper.ExecuteReader(System.Data.CommandType.StoredProcedure, "CALL DBA.ANYW_WF_GetWorkflowTemplate(?)", args, ref transaction);
                return convertToJSON(returnMsg);
            }
            catch (Exception ex)
            {
                logger.error("WFDG", ex.Message + "ANYW_WF_GetWorkflowTemplate(" + templateId + ")");
                throw ex;
            }
        }
        public string getWorkflowTemplateGroups(string templateId, DistributedTransaction transaction)
        {
            try
            {
                logger.debug("getWorkflowTemplateGroups ");
                System.Data.Common.DbParameter[] args = new System.Data.Common.DbParameter[1];
                args[0] = (System.Data.Common.DbParameter)DbHelper.CreateParameter("@templateId", DbType.String, templateId);
                System.Data.Common.DbDataReader returnMsg = DbHelper.ExecuteReader(System.Data.CommandType.StoredProcedure, "CALL DBA.ANYW_WF_GetWorkflowTemplateGroups(?)", args, ref transaction);
                return convertToJSON(returnMsg);
            }
            catch (Exception ex)
            {
                logger.error("WFDG", ex.Message + "ANYW_WF_GetWorkflowTemplateGroups(" + templateId + ")");
                throw ex;
            }
        }
        public string getWorkflowTemplates(string processId, DistributedTransaction transaction)
        {
            try
            {
                logger.debug("getWorkflowTemplates ");
                System.Data.Common.DbParameter[] args = new System.Data.Common.DbParameter[1];
                args[0] = (System.Data.Common.DbParameter)DbHelper.CreateParameter("@processId", DbType.String, processId);
                System.Data.Common.DbDataReader returnMsg = DbHelper.ExecuteReader(System.Data.CommandType.StoredProcedure, "CALL DBA.ANYW_WF_GetWorkflowTemplates(?)", args, ref transaction);
                return convertToJSON(returnMsg);
            }
            catch (Exception ex)
            {
                logger.error("WFDG", ex.Message + "ANYW_WF_GetWorkflowTemplates(" + processId + ")");
                throw ex;
            }
        }
        public string getWorkflowTemplateStatuses(string templateId, DistributedTransaction transaction)
        {
            try
            {
                logger.debug("getWorkflowTemplateStatuses ");
                System.Data.Common.DbParameter[] args = new System.Data.Common.DbParameter[1];
                args[0] = (System.Data.Common.DbParameter)DbHelper.CreateParameter("@templateId", DbType.String, templateId);
                System.Data.Common.DbDataReader returnMsg = DbHelper.ExecuteReader(System.Data.CommandType.StoredProcedure, "CALL DBA.ANYW_WF_GetWorkflowTemplateStatuses(?)", args, ref transaction);
                return convertToJSON(returnMsg);
            }
            catch (Exception ex)
            {
                logger.error("WFDG", ex.Message + "ANYW_WF_GetWorkflowTemplateStatuses(" + templateId + ")");
                throw ex;
            }
        }
        public string getWorkflowTemplateStepDocuments(string stepId, string wantedFormDescriptions, string priorConsumerPlanId, DistributedTransaction transaction)
        {
            //wantedFormIds = "eac0d253-1586-41c4-a7f0-09e2848337ae,8A027884-33A4-4E5E-9455-61DFD45624D8";
           // string wantedFormDescriptions = "Workflow 1,Workflow 2";
            try
            {
                logger.debug("getWorkflowTemplateStepDocuments ");
                System.Data.Common.DbParameter[] args = new System.Data.Common.DbParameter[3];
                args[0] = (System.Data.Common.DbParameter)DbHelper.CreateParameter("@stepId", DbType.String, stepId);
                args[1] = (System.Data.Common.DbParameter)DbHelper.CreateParameter("@priorConsumerPlanId", DbType.String, priorConsumerPlanId);
                args[2] = (System.Data.Common.DbParameter)DbHelper.CreateParameter("@wantedFormDescriptions", DbType.String, wantedFormDescriptions);
                System.Data.Common.DbDataReader returnMsg = DbHelper.ExecuteReader(System.Data.CommandType.StoredProcedure, "CALL DBA.ANYW_WF_GetWorkflowTemplateStepDocuments(?, ?, ?)", args, ref transaction);
                return convertToJSON(returnMsg);
            }
            catch (Exception ex)
            {
                logger.error("WFDG", ex.Message + "ANYW_WF_GetWorkflowTemplateStepDocuments(" + stepId + ")");
                throw ex;
            }
        }
        public string getWorkflowTemplateStepEventActions(string stepEventId, DistributedTransaction transaction)
        {
            try
            {
                logger.debug("getWorkflowTemplateStepEventActions ");
                System.Data.Common.DbParameter[] args = new System.Data.Common.DbParameter[1];
                args[0] = (System.Data.Common.DbParameter)DbHelper.CreateParameter("@stepEventId", DbType.String, stepEventId);
                System.Data.Common.DbDataReader returnMsg = DbHelper.ExecuteReader(System.Data.CommandType.StoredProcedure, "CALL DBA.ANYW_WF_GetWorkflowTemplateStepEventActions(?)", args, ref transaction);
                return convertToJSON(returnMsg);
            }
            catch (Exception ex)
            {
                logger.error("WFDG", ex.Message + "ANYW_WF_GetWorkflowTemplateStepEventActions(" + stepEventId + ")");
                throw ex;
            }
        }
        public string getWorkflowTemplateStepEvents(string stepId, DistributedTransaction transaction)
        {
            try
            {
                logger.debug("getWorkflowTemplateStepEvents ");
                System.Data.Common.DbParameter[] args = new System.Data.Common.DbParameter[1];
                args[0] = (System.Data.Common.DbParameter)DbHelper.CreateParameter("@stepId", DbType.String, stepId);
                System.Data.Common.DbDataReader returnMsg = DbHelper.ExecuteReader(System.Data.CommandType.StoredProcedure, "CALL DBA.ANYW_WF_GetWorkflowTemplateStepEvents(?)", args, ref transaction);
                return convertToJSON(returnMsg);
            }
            catch (Exception ex)
            {
                logger.error("WFDG", ex.Message + "ANYW_WF_GetWorkflowTemplateStepEvents(" + stepId + ")");
                throw ex;
            }
        }
        public string getWorkflowTemplateSteps(string groupId, DistributedTransaction transaction)
        {
            try
            {
                logger.debug("getWorkflowTemplateSteps ");
                System.Data.Common.DbParameter[] args = new System.Data.Common.DbParameter[1];
                args[0] = (System.Data.Common.DbParameter)DbHelper.CreateParameter("@groupId", DbType.String, groupId);
                System.Data.Common.DbDataReader returnMsg = DbHelper.ExecuteReader(System.Data.CommandType.StoredProcedure, "CALL DBA.ANYW_WF_GetWorkflowTemplateSteps(?)", args, ref transaction);
                return convertToJSON(returnMsg);
            }
            catch (Exception ex)
            {
                logger.error("WFDG", ex.Message + "ANYW_WF_GetWorkflowTemplateSteps(" + groupId + ")");
                throw ex;
            }
        }
        #endregion

        #region WORKFLOW METHODS
        public string deleteWorkflows(int processId, string referenceId, DistributedTransaction transaction)
        {
            try
            {
                logger.debug("deleteWorkflows ");

                System.Data.Common.DbParameter[] args = new System.Data.Common.DbParameter[2];
                args[0] = (System.Data.Common.DbParameter)DbHelper.CreateParameter("@processId", DbType.Int32, processId);
                args[1] = (System.Data.Common.DbParameter)DbHelper.CreateParameter("@consumerPlanId", DbType.String, referenceId);
                // returns the number of rows deleted
                return DbHelper.ExecuteScalar(System.Data.CommandType.StoredProcedure, "CALL DBA.ANYW_WF_deleteWorkflows(?,?)", args, ref transaction).ToString();
            }
            catch (Exception ex)
            {
                logger.error("WFDG", ex.Message + "ANYW_WF_deleteWorkflows(" + processId + ", " + referenceId + ")");
                throw ex;
            }
        }
        public string deleteWorkflowStep(string stepId, DistributedTransaction transaction)
        {
            try
            {
                logger.debug("deleteWorkflowStep ");

                System.Data.Common.DbParameter[] args = new System.Data.Common.DbParameter[1];
                args[0] = (System.Data.Common.DbParameter)DbHelper.CreateParameter("@stepId", DbType.String, stepId);
                // returns the number of rows deleted
                return DbHelper.ExecuteScalar(System.Data.CommandType.StoredProcedure, "CALL DBA.ANYW_WF_deleteWorkflowStep(?)", args, ref transaction).ToString();
            }
            catch (Exception ex)
            {
                logger.error("WFDG", ex.Message + "ANYW_WF_deleteWorkflowStep(" + stepId + ")");
                throw ex;
            }
        }
        public string deleteWorkflowStepDocument(string documentId, DistributedTransaction transaction)
        {
            try
            {
                logger.debug("deleteWorkflowStepDocument ");

                System.Data.Common.DbParameter[] args = new System.Data.Common.DbParameter[1];
                args[0] = (System.Data.Common.DbParameter)DbHelper.CreateParameter("@documentId", DbType.String, documentId);
                // returns the number of rows deleted
                return DbHelper.ExecuteScalar(System.Data.CommandType.StoredProcedure, "CALL DBA.ANYW_WF_DeleteWorkflowStepDocument(?)", args, ref transaction).ToString();
            }
            catch (Exception ex)
            {
                logger.error("WFDG", ex.Message + "ANYW_WF_DeleteWorkflowStepDocument(" + documentId + ")");
                throw ex;
            }
        }

        public string deleteWorkflow(string workflowId, DistributedTransaction transaction)
        {
            try
            {
                logger.debug("deleteWorkflow ");

                System.Data.Common.DbParameter[] args = new System.Data.Common.DbParameter[1];
                args[0] = (System.Data.Common.DbParameter)DbHelper.CreateParameter("@workflowId", DbType.String, workflowId);
                // returns the number of rows deleted
                return DbHelper.ExecuteScalar(System.Data.CommandType.StoredProcedure, "CALL DBA.ANYW_WF_deleteWorkflow(?)", args, ref transaction).ToString();
            }
            catch (Exception ex)
            {
                logger.error("WFDG", ex.Message + "ANYW_WF_DeleteWorkflow(" + workflowId + ")");
                throw ex;
            }
        }

        public string getPeopleNames(string peopleId, DistributedTransaction transaction)
        {
            try
            {
                logger.debug("getPeopleNames ");
                System.Data.Common.DbParameter[] args = new System.Data.Common.DbParameter[1];
                args[0] = (System.Data.Common.DbParameter)DbHelper.CreateParameter("@peopleId", DbType.String, peopleId);
                // returns people names
                System.Data.Common.DbDataReader returnMsg = DbHelper.ExecuteReader(System.Data.CommandType.StoredProcedure, "CALL DBA.ANYW_GetPeopleNames(?)", args, ref transaction);
                return convertToJSON(returnMsg);
            }
            catch (Exception ex)
            {
                logger.error("WFDG", ex.Message + "ANYW_GetPeopleNames()");
                throw ex;
            }
        }

        public string getPeopleRelationships(string peopleId, DistributedTransaction transaction)
        {
            try
            {
                logger.debug("getPeopleRelationships ");
                System.Data.Common.DbParameter[] args = new System.Data.Common.DbParameter[1];
                args[0] = (System.Data.Common.DbParameter)DbHelper.CreateParameter("@peopleId", DbType.String, peopleId);
                // returns the relationship data for the given peopleId
                System.Data.Common.DbDataReader returnMsg = DbHelper.ExecuteReader(System.Data.CommandType.StoredProcedure, "CALL DBA.ANYW_GetPeopleRelationships(?)", args, ref transaction);
                return convertToJSON(returnMsg);
            }
            catch (Exception ex)
            {
                logger.error("WFDG", ex.Message + "ANYW_GetPeopleRelationships(" + peopleId + ")");
                throw ex;
            }
        }

        public string insertWFResponsiblePartyRelationships(string workflowTemplateID, string WFID, DistributedTransaction transaction)
        {
            try
            {
                logger.debug("insertWFResponsiblePartyRelationships ");
                System.Data.Common.DbParameter[] args = new System.Data.Common.DbParameter[2];
                args[0] = (System.Data.Common.DbParameter)DbHelper.CreateParameter("@workflowTemplateID", DbType.String, workflowTemplateID);
                args[1] = (System.Data.Common.DbParameter)DbHelper.CreateParameter("@WFID", DbType.String, WFID);

                return DbHelper.ExecuteScalar(System.Data.CommandType.StoredProcedure, "CALL DBA.ANYW_WF_insertWFResponsiblePartyRelationships(?, ?)", args, ref transaction).ToString();
            }
            catch (Exception ex)
            {
                logger.error("WFDG", ex.Message + "ANYW_WF_insertWFResponsiblePartyRelationships(" + workflowTemplateID + " " + WFID + ")");
                throw ex;
            }
        }

        public string updateWFResponsiblePartyIDs(string peopleId, string WFID, string WorkflowResponsibilityType, DistributedTransaction transaction)
        {
            try
            {
                logger.debug("updateWFResponsiblePartyIDs ");
                System.Data.Common.DbParameter[] args = new System.Data.Common.DbParameter[3];
                args[0] = (System.Data.Common.DbParameter)DbHelper.CreateParameter("@PeopleID", DbType.String, peopleId);
                args[1] = (System.Data.Common.DbParameter)DbHelper.CreateParameter("@WFID", DbType.String, WFID);
                args[2] = (System.Data.Common.DbParameter)DbHelper.CreateParameter("@WorkflowResponsibilityType", DbType.String, WorkflowResponsibilityType);

                return DbHelper.ExecuteScalar(System.Data.CommandType.StoredProcedure, "CALL DBA.ANYW_WF_updateWFResponsiblePartyIDs(?, ?, ?)", args, ref transaction).ToString();
            }
            catch (Exception ex)
            {
                logger.error("WFDG", ex.Message + "ANYW_WF_updateWFResponsiblePartyIDs(" + peopleId + "," + WFID + "," + WorkflowResponsibilityType + ")");
                throw ex;
            }
        }

        public string getResponsiblePartyIDforThisStep(string responsiblePartyType, string WFID, DistributedTransaction transaction)
        {

            try
            {
                logger.debug("getResponsiblePartyIDforThisStep ");
                System.Data.Common.DbParameter[] args = new System.Data.Common.DbParameter[2];
                args[0] = (System.Data.Common.DbParameter)DbHelper.CreateParameter("@ResponsiblePartyType", DbType.String, responsiblePartyType);
                args[1] = (System.Data.Common.DbParameter)DbHelper.CreateParameter("@WFID", DbType.String, WFID);
                // returns the responsible Party ID 
                System.Data.Common.DbDataReader returnMsg = DbHelper.ExecuteReader(System.Data.CommandType.StoredProcedure, "CALL DBA.ANYW_WF_getResponsiblePartyIDforThisStep(?,?)", args, ref transaction);
                return convertToJSON(returnMsg);

            }
            catch (Exception ex)
            {
                logger.error("WFDG", ex.Message + "ANYW_WF_getResponsiblePartyIDforThisStep(" + responsiblePartyType + "," + WFID + ")");
                throw ex;
            }

        }

        public string getResponsiblePartyIDforThisEditStep(string StepId, DistributedTransaction transaction)
        {

            try
            {
                logger.debug("getResponsiblePartyIDforThisEditStep ");
                System.Data.Common.DbParameter[] args = new System.Data.Common.DbParameter[1];
                args[0] = (System.Data.Common.DbParameter)DbHelper.CreateParameter("@StepId", DbType.String, StepId);
                // returns the responsible Party ID 
                System.Data.Common.DbDataReader returnMsg = DbHelper.ExecuteReader(System.Data.CommandType.StoredProcedure, "CALL DBA.ANYW_WF_getResponsiblePartyIDforThisEditStep(?)", args, ref transaction);
                return convertToJSON(returnMsg);

            }
            catch (Exception ex)
            {
                logger.error("WFDG", ex.Message + "ANYW_WF_getResponsiblePartyIDforThisEditStep(" + StepId + ")");
                throw ex;
            }

        }

        public string getWFResponsibleParties(string token, string workflowId)
        {
            logger.debug("getWFResponsibleParties ");
            List<string> list = new List<string>();
            list.Add(token);
            list.Add(workflowId);
            string text = "CALL DBA.ANYW_WF_getWFResponsibleParties(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")";
            try
            {
                return executeDataBaseCallJSON(text);
            }
            catch (Exception ex)
            {
                logger.error("501", ex.Message + "DBA.ANYW_WF_getWFResponsibleParties(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")");
                return "501: error DBA.ANYW_WF_getWFResponsibleParties";
            }

            // return convertToJSON(returnMsg);    
        }

        public string getWFwithMissingResponsibleParties(string token, string workflowIds, DistributedTransaction transaction)
        {

            try
            {
                logger.debug("getWFwithMissingResponsibleParties ");
                System.Data.Common.DbParameter[] args = new System.Data.Common.DbParameter[1];
                args[0] = (System.Data.Common.DbParameter)DbHelper.CreateParameter("@workflowIds", DbType.String, workflowIds);
                // returns the responsible Party ID 
                System.Data.Common.DbDataReader returnMsg = DbHelper.ExecuteReader(System.Data.CommandType.StoredProcedure, "CALL DBA.ANYW_WF_getWFwithMissingResponsibleParties(?)", args, ref transaction);
                return convertToJSON(returnMsg);
            }

            catch (Exception ex)
            {
                logger.error("WFDG", ex.Message + "ANYW_WF_getWFwithMissingResponsibleParties(" + workflowIds + ")");
                return "501: error DBA.ANYW_WF_getWFwithMissingResponsibleParties";
            }
        }


        public string updateRelationshipResponsiblePartyID(string peopleId, string WFID, string responsiblePartyType, DistributedTransaction transaction)
        {
            try
            {
                logger.debug("updateRelationshipResponsiblePartyID ");
                System.Data.Common.DbParameter[] args = new System.Data.Common.DbParameter[3];
                args[0] = (System.Data.Common.DbParameter)DbHelper.CreateParameter("@PeopleID", DbType.String, peopleId == "null" ? null : peopleId);
                args[1] = (System.Data.Common.DbParameter)DbHelper.CreateParameter("@WFID", DbType.String, WFID);
                args[2] = (System.Data.Common.DbParameter)DbHelper.CreateParameter("@WorkflowResponsibilityType", DbType.String, responsiblePartyType);

                return DbHelper.ExecuteScalar(System.Data.CommandType.StoredProcedure, "CALL DBA.ANYW_WF_updateRelationshipResponsiblePartyID(?, ?, ?)", args, ref transaction).ToString();
            }
            catch (Exception ex)
            {
                logger.error("WFDG", ex.Message + "ANYW_WF_updateRelationshipResponsiblePartyID(" + peopleId + "," + WFID + "," + responsiblePartyType + ")");
                throw ex;
            }
        }

        public string updateStepResponsiblePartyID(string WFID, string responsiblePartyType, DistributedTransaction transaction)
        {
            try
            {
                logger.debug("updateStepResponsiblePartyID ");
                System.Data.Common.DbParameter[] args = new System.Data.Common.DbParameter[2];
                args[0] = (System.Data.Common.DbParameter)DbHelper.CreateParameter("@WFID", DbType.String, WFID);
                args[1] = (System.Data.Common.DbParameter)DbHelper.CreateParameter("@WorkflowResponsibilityType", DbType.String, responsiblePartyType);

                return DbHelper.ExecuteScalar(System.Data.CommandType.StoredProcedure, "CALL DBA.ANYW_WF_updateStepResponsiblePartyID(?, ?)", args, ref transaction).ToString();
            }
            catch (Exception ex)
            {
                logger.error("WFDG", ex.Message + "ANYW_WF_updateStepResponsiblePartyID(" + WFID + "," + responsiblePartyType + ")");
                throw ex;
            }
        }

        public string getWorkflowActions(string workflowId, DistributedTransaction transaction)
        {
            try
            {
                logger.debug("getWorkflowActions ");
                System.Data.Common.DbParameter[] args = new System.Data.Common.DbParameter[1];
                args[0] = (System.Data.Common.DbParameter)DbHelper.CreateParameter("@workflowId", DbType.String, workflowId);
                // returns the workflow actions for the given workflowId
                System.Data.Common.DbDataReader returnMsg = DbHelper.ExecuteReader(System.Data.CommandType.StoredProcedure, "CALL DBA.ANYW_WF_getWorkflowActions(?)", args, ref transaction);
                return convertToJSON(returnMsg);
            }
            catch (Exception ex)
            {
                logger.error("WFDG", ex.Message + "ANYW_WF_getWorkflowActions(" + workflowId + ")");
                throw ex;
            }
        }
        public string getWorkflowDocumentDescriptions(string workflowId, DistributedTransaction transaction)
        {
            try
            {
                logger.debug("getWorkflowDocuments ");
                System.Data.Common.DbParameter[] args = new System.Data.Common.DbParameter[1];
                args[0] = (System.Data.Common.DbParameter)DbHelper.CreateParameter("@workflowId", DbType.String, workflowId);
                // returns the workflow document descriptions for the given workflowId
                System.Data.Common.DbDataReader returnMsg = DbHelper.ExecuteReader(System.Data.CommandType.StoredProcedure, "CALL DBA.ANYW_WF_getWorkflowDocumentDescriptions(?)", args, ref transaction);
                return convertToJSON(returnMsg);
            }
            catch (Exception ex)
            {
                logger.error("WFDG", ex.Message + "ANYW_WF_getWorkflowDocumentDescriptions(" + workflowId + ")");
                throw ex;
            }
        }
        public string getWorkflowEvents(string workflowId, DistributedTransaction transaction)
        {
            try
            {
                logger.debug("getWorkflowEvents ");
                System.Data.Common.DbParameter[] args = new System.Data.Common.DbParameter[1];
                args[0] = (System.Data.Common.DbParameter)DbHelper.CreateParameter("@workflowId", DbType.String, workflowId);
                // returns the workflow events for the given workflowId
                System.Data.Common.DbDataReader returnMsg = DbHelper.ExecuteReader(System.Data.CommandType.StoredProcedure, "CALL DBA.ANYW_WF_getWorkflowEvents(?)", args, ref transaction);
                return convertToJSON(returnMsg);
            }
            catch (Exception ex)
            {
                logger.error("WFDG", ex.Message + "ANYW_WF_getWorkflowEvents(" + workflowId + ")");
                throw ex;
            }
        }
        public string getWorkflowGroups(string workflowId, DistributedTransaction transaction)
        {
            try
            {
                logger.debug("getWorkflowGroups ");
                System.Data.Common.DbParameter[] args = new System.Data.Common.DbParameter[1];
                args[0] = (System.Data.Common.DbParameter)DbHelper.CreateParameter("@workflowId", DbType.String, workflowId);
                // returns the workflow groups for the given workflowId
                System.Data.Common.DbDataReader returnMsg = DbHelper.ExecuteReader(System.Data.CommandType.StoredProcedure, "CALL DBA.ANYW_WF_getWorkflowGroups(?)", args, ref transaction);
                return convertToJSON(returnMsg);
            }
            catch (Exception ex)
            {
                logger.error("WFDG", ex.Message + "ANYW_WF_getWorkflowGroups(" + workflowId + ")");
                throw ex;
            }
        }
        public string getWorkflows(string processId, string referenceId, DistributedTransaction transaction)
        {
            try
            {
                logger.debug("getWorkflows ");
                System.Data.Common.DbParameter[] args = new System.Data.Common.DbParameter[2];
                args[0] = (System.Data.Common.DbParameter)DbHelper.CreateParameter("@processId", DbType.String, processId);
                args[1] = (System.Data.Common.DbParameter)DbHelper.CreateParameter("@referenceId", DbType.String, referenceId);
                // returns the workflows data for the given processId and referenceId
                System.Data.Common.DbDataReader returnMsg = DbHelper.ExecuteReader(System.Data.CommandType.StoredProcedure, "CALL DBA.ANYW_WF_getWorkflows(?,?)", args, ref transaction);
                return convertToJSON(returnMsg);
            }
            catch (Exception ex)
            {
                logger.error("WFDG", ex.Message + "ANYW_WF_getWorkflows(" + processId + "," + referenceId + ")");
                throw ex;
            }
        }
        public string getWorkflowStatuses(string workflowId, DistributedTransaction transaction)
        {
            try
            {
                logger.debug("getWorkflowStatuses ");
                System.Data.Common.DbParameter[] args = new System.Data.Common.DbParameter[1];
                args[0] = (System.Data.Common.DbParameter)DbHelper.CreateParameter("@workflowId", DbType.String, workflowId);
                // returns the workflow statuses for the given workflowId
                System.Data.Common.DbDataReader returnMsg = DbHelper.ExecuteReader(System.Data.CommandType.StoredProcedure, "CALL DBA.ANYW_WF_getWorkflowStatuses(?)", args, ref transaction);
                return convertToJSON(returnMsg);
            }
            catch (Exception ex)
            {
                logger.error("WFDG", ex.Message + "ANYW_WF_getWorkflowStatuses(" + workflowId + ")");
                throw ex;
            }
        }

        public string getWorkflowStatusForAction(string workflowId, string oldStatusId, DistributedTransaction transaction)
        {
            try
            {
                logger.debug("getWorkflowStatuses ");
                System.Data.Common.DbParameter[] args = new System.Data.Common.DbParameter[2];
                args[0] = (System.Data.Common.DbParameter)DbHelper.CreateParameter("@workflowId", DbType.String, workflowId);
                args[1] = (System.Data.Common.DbParameter)DbHelper.CreateParameter("@oldStatusId", DbType.String, oldStatusId);
                // returns the workflow statuses for the given workflowId
                System.Data.Common.DbDataReader returnMsg = DbHelper.ExecuteReader(System.Data.CommandType.StoredProcedure, "CALL DBA.ANYW_WF_getWorkflowStatusForAction(?,?)", args, ref transaction);
                return convertToJSON(returnMsg);
            }
            catch (Exception ex)
            {
                logger.error("WFDG", ex.Message + "ANYW_WF_getWorkflowStatuses(" + workflowId + ")");
                throw ex;
            }
        }
        public string getWorkflowSteps(string workflowId, DistributedTransaction transaction)
        {
            try
            {
                logger.debug("getWorkflowSteps ");
                System.Data.Common.DbParameter[] args = new System.Data.Common.DbParameter[1];
                args[0] = (System.Data.Common.DbParameter)DbHelper.CreateParameter("@workflowId", DbType.String, workflowId);
                // returns the workflow steps for the given workflowId
                System.Data.Common.DbDataReader returnMsg = DbHelper.ExecuteReader(System.Data.CommandType.StoredProcedure, "CALL DBA.ANYW_WF_getWorkflowSteps(?)", args, ref transaction);
                return convertToJSON(returnMsg);
            }
            catch (Exception ex)
            {
                logger.error("WFDG", ex.Message + "ANYW_WF_getWorkflowSteps(" + workflowId + ")");
                throw ex;
            }
        }
        public string insertAttachment(string attachmentType, string attachment, DistributedTransaction transaction)
        {
            try
            {
                logger.debug("insertAttachment ");
                System.Data.Common.DbParameter[] args = new System.Data.Common.DbParameter[2];
                args[0] = (System.Data.Common.DbParameter)DbHelper.CreateParameter("@attachmentType", DbType.String, attachmentType);
                args[1] = (System.Data.Common.DbParameter)DbHelper.CreateParameter("@attachment", DbType.String, attachment);
                // returns the attachmentId of the attachment that was just inserted
                return DbHelper.ExecuteScalar(System.Data.CommandType.StoredProcedure, "CALL DBA.ANYW_insertAttachment(?, ?)", args, ref transaction).ToString();
            }
            catch (Exception ex)
            {
                logger.error("WFDG", ex.Message + "ANYW_insertAttachment(" + attachmentType + "," + attachment + ")");
                throw ex;
            }
        }

        public string isWorkflowAutoCreated(string workflowName)
        {
            try
            {
                logger.debug("isWorkflowAutoCreated ");

                System.Data.Common.DbParameter[] args = new System.Data.Common.DbParameter[1];
                args[0] = (System.Data.Common.DbParameter)DbHelper.CreateParameter("@workflowName", DbType.String, workflowName);
                // returns 1 or NULL -- 1 indicates the workFlow was Auto Created, if NULL returned from SP then return Empty String
                return (DbHelper.ExecuteScalar(System.Data.CommandType.StoredProcedure, "CALL DBA.ANYW_WF_isWorkflowAutoCreated(?)", args) ?? String.Empty).ToString();
            }
            catch (Exception ex)
            {
                logger.error("WFDG", ex.Message + "ANYW_WF_isWorkflowAutoCreated(" + workflowName + ")");
                throw ex;
            }
        }

        public string insertWorkflow(string processId, string name, string reference_id, string description, string currentStatusId, DistributedTransaction transaction)
        {
            try
            {
                logger.debug("insertWorkflow ");
                System.Data.Common.DbParameter[] args = new System.Data.Common.DbParameter[5];
                args[0] = (System.Data.Common.DbParameter)DbHelper.CreateParameter("@processId", DbType.String, processId);
                args[1] = (System.Data.Common.DbParameter)DbHelper.CreateParameter("@name", DbType.String, name);
                args[2] = (System.Data.Common.DbParameter)DbHelper.CreateParameter("@reference_id", DbType.String, reference_id);
                args[3] = (System.Data.Common.DbParameter)DbHelper.CreateParameter("@description", DbType.String, description);
                args[4] = (System.Data.Common.DbParameter)DbHelper.CreateParameter("@currentStatusId", DbType.String, currentStatusId);
                // returns the workflowId of the workflow that was just inserted
                return DbHelper.ExecuteScalar(System.Data.CommandType.StoredProcedure, "CALL DBA.ANYW_WF_insertWorkflow(?, ?, ?, ?, ?)", args, ref transaction).ToString();
            }
            catch (Exception ex)
            {
                logger.error("WFDG", ex.Message + "ANYW_WF_insertWorkflow(" + processId + "," + name + "," + reference_id + "," + description + "," + currentStatusId + ")");
                throw ex;
            }
        }
        public string insertWorkflowGroup(string workflowId, string groupOrder, string groupName, DistributedTransaction transaction)
        {
            try
            {
                logger.debug("insertWorkflowGroup ");
                System.Data.Common.DbParameter[] args = new System.Data.Common.DbParameter[3];
                args[0] = (System.Data.Common.DbParameter)DbHelper.CreateParameter("@workflowId", DbType.String, workflowId);
                args[1] = (System.Data.Common.DbParameter)DbHelper.CreateParameter("@groupOrder", DbType.String, groupOrder);
                args[2] = (System.Data.Common.DbParameter)DbHelper.CreateParameter("@groupName", DbType.String, groupName);
                // returns the groupId of the group that was just inserted
                return DbHelper.ExecuteScalar(System.Data.CommandType.StoredProcedure, "CALL DBA.ANYW_WF_InsertWorkflowGroup(?, ?, ?)", args, ref transaction).ToString();
            }
            catch (Exception ex)
            {
                logger.error("WFDG", ex.Message + "ANYW_WF_InsertWorkflowGroup(" + workflowId + "," + groupOrder + "," + groupName + ")");
                throw ex;
            }
        }
        public string insertWorkflowStatus(string workflowId, string order, string description, DistributedTransaction transaction)
        {
            try
            {
                logger.debug("insertWorfklowStatus ");
                System.Data.Common.DbParameter[] args = new System.Data.Common.DbParameter[3];
                args[0] = (System.Data.Common.DbParameter)DbHelper.CreateParameter("@workflowId", DbType.String, workflowId);
                args[1] = (System.Data.Common.DbParameter)DbHelper.CreateParameter("@order", DbType.String, order);
                args[2] = (System.Data.Common.DbParameter)DbHelper.CreateParameter("@description", DbType.String, description);
                // returns the statusId of the status that was just inserted
                return DbHelper.ExecuteScalar(System.Data.CommandType.StoredProcedure, "CALL DBA.ANYW_WF_InsertWorkflowStatus(?, ?, ?)", args, ref transaction).ToString();
            }
            catch (Exception ex)
            {
                logger.error("WFDG", ex.Message + "ANYW_WF_InsertWorkflowStatus(" + workflowId + "," + description + ")");
                throw ex;
            }
        }
        public string insertWorkflowResponsibilityTypes(string workflowId, string order, string description, DistributedTransaction transaction)
        {
            try
            {
                logger.debug("insertWorfklowStatus ");
                System.Data.Common.DbParameter[] args = new System.Data.Common.DbParameter[3];
                args[0] = (System.Data.Common.DbParameter)DbHelper.CreateParameter("@workflowId", DbType.String, workflowId);
                args[1] = (System.Data.Common.DbParameter)DbHelper.CreateParameter("@order", DbType.String, order);
                args[2] = (System.Data.Common.DbParameter)DbHelper.CreateParameter("@description", DbType.String, description);
                // returns the statusId of the status that was just inserted
                return DbHelper.ExecuteScalar(System.Data.CommandType.StoredProcedure, "CALL DBA.ANYW_WF_InsertWorkflowResponsibilityTypes(?, ?, ?)", args, ref transaction).ToString();
            }
            catch (Exception ex)
            {
                logger.error("WFDG", ex.Message + "ANYW_WF_InsertWorkflowStatus(" + workflowId + "," + description + ")");
                throw ex;
            }
        }

        public string insertWorkflowStep(string groupId, string stepOrder, string description, string responsiblePartyId, string responsiblePartytype, string isChecklist, string dueDate, string startDate, string doneDate, string comments, string isApplicable, string allowStepEdit, string powerBIReporting, DistributedTransaction transaction)
        {
            try
            {
                logger.debug("insertWorkflowStep ");
                System.Data.Common.DbParameter[] args = new System.Data.Common.DbParameter[13];
                args[0] = (System.Data.Common.DbParameter)DbHelper.CreateParameter("@groupId", DbType.String, groupId);
                args[1] = (System.Data.Common.DbParameter)DbHelper.CreateParameter("@stepOrder", DbType.Int32, Int32.Parse(stepOrder));
                args[2] = (System.Data.Common.DbParameter)DbHelper.CreateParameter("@description", DbType.String, description);
                args[3] = (System.Data.Common.DbParameter)DbHelper.CreateParameter("@responsiblePartyId", DbType.String, responsiblePartyId == "" ? null : responsiblePartyId);
                args[4] = (System.Data.Common.DbParameter)DbHelper.CreateParameter("@responsiblePartytype", DbType.String, responsiblePartytype == "" ? null : responsiblePartytype);
                args[5] = (System.Data.Common.DbParameter)DbHelper.CreateParameter("@isChecklist", DbType.Boolean, bool.Parse(isChecklist));
                args[6] = (System.Data.Common.DbParameter)DbHelper.CreateParameter("@dueDate", DbType.Date, dueDate == null || dueDate.Equals("") ? null : dueDate);
                args[7] = (System.Data.Common.DbParameter)DbHelper.CreateParameter("@startDate", DbType.Date, startDate == null || startDate.Equals("") ? null : startDate);
                args[8] = (System.Data.Common.DbParameter)DbHelper.CreateParameter("@doneDate", DbType.Date, doneDate == null || doneDate.Equals("") ? null : doneDate);
                args[9] = (System.Data.Common.DbParameter)DbHelper.CreateParameter("@comments", DbType.String, comments);
                args[10] = (System.Data.Common.DbParameter)DbHelper.CreateParameter("@isApplicable", DbType.Boolean, bool.Parse(isApplicable));
                args[11] = (System.Data.Common.DbParameter)DbHelper.CreateParameter("@allowStepEdit", DbType.Boolean, bool.Parse(allowStepEdit));
                args[12] = (System.Data.Common.DbParameter)DbHelper.CreateParameter("@powerBIReporting", DbType.String, powerBIReporting);
                // returns the stepId of the step that was just inserted
                return DbHelper.ExecuteScalar(System.Data.CommandType.StoredProcedure, "CALL DBA.ANYW_WF_InsertWorkflowStep(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", args, ref transaction).ToString();
            }
            catch (Exception ex)
            {
                logger.error("WFDG", ex.Message + "ANYW_WF_InsertWorkflowStep(" + groupId + "," + stepOrder + "," + description + "," + responsiblePartyId + "," + responsiblePartytype + "," + isChecklist + "," + dueDate + "," + startDate + "," + doneDate + "," + comments + "," + isApplicable + ")");
                throw ex;
            }
        }
        public string insertWorkflowStepDocument(string stepId, string docOrder, string description, string attachmentId, string comments, string documentEdited, DistributedTransaction transaction)
        {
            try
            {
                logger.debug("insertWorkflowStepDocument ");
                System.Data.Common.DbParameter[] args = new System.Data.Common.DbParameter[6];
                args[0] = (System.Data.Common.DbParameter)DbHelper.CreateParameter("@stepId", DbType.String, stepId);
                args[1] = (System.Data.Common.DbParameter)DbHelper.CreateParameter("@docOrder", DbType.String, docOrder);
                args[2] = (System.Data.Common.DbParameter)DbHelper.CreateParameter("@description", DbType.String, description);
                args[3] = (System.Data.Common.DbParameter)DbHelper.CreateParameter("@attachmentId", DbType.String, attachmentId);
                args[4] = (System.Data.Common.DbParameter)DbHelper.CreateParameter("@comments", DbType.String, comments);
                args[5] = (System.Data.Common.DbParameter)DbHelper.CreateParameter("@documentEdited", DbType.String, documentEdited);
                // returns the documentId of the document that was just inserted
                return DbHelper.ExecuteScalar(System.Data.CommandType.StoredProcedure, "CALL DBA.ANYW_WF_InsertWorkflowStepDocument(?, ?, ?, ?, ?, ?)", args, ref transaction).ToString();
            }
            catch (Exception ex)
            {
                logger.error("WFDG", ex.Message + "ANYW_WF_InsertWorkflowStepDocument(" + stepId + "," + docOrder + "," + description + "," + attachmentId + "," + comments + "," + documentEdited + ")");
                throw ex;
            }
        }

        public string updateWorkflowStepDocument(string docId, string attachmentId, string documentEdited, DistributedTransaction transaction)
        {
            try
            {
                logger.debug("updateWorkflowStepDocument ");
                System.Data.Common.DbParameter[] args = new System.Data.Common.DbParameter[3];
                args[0] = (System.Data.Common.DbParameter)DbHelper.CreateParameter("@stepDocumentId", DbType.String, docId);
                args[1] = (System.Data.Common.DbParameter)DbHelper.CreateParameter("@attachmentId", DbType.String, attachmentId);
                args[2] = (System.Data.Common.DbParameter)DbHelper.CreateParameter("@documentEdited", DbType.String, documentEdited);
                // returns the documentId of the document that was just inserted
                return DbHelper.ExecuteScalar(System.Data.CommandType.StoredProcedure, "CALL DBA.ANYW_WF_UpdateWorkflowStepDocument(?, ?, ?)", args, ref transaction).ToString();
            }
            catch (Exception ex)
            {
                logger.error("WFDG", ex.Message + "ANYW_WF_UpdateWorkflowStepDocument(" + docId + "," + attachmentId + "," + documentEdited + ")");
                throw ex;
            }
        }

        public string updateWorkflowStepDocumentsenttoDODD(string workflowstepdocId, string senttoDODD)
        {
            try
            {
                logger.debug("updateWorkflowStepDocument ");
                System.Data.Common.DbParameter[] args = new System.Data.Common.DbParameter[2];
                args[0] = (System.Data.Common.DbParameter)DbHelper.CreateParameter("@workflowstepdocId", DbType.String, workflowstepdocId);
                args[1] = (System.Data.Common.DbParameter)DbHelper.CreateParameter("@senttoDODD", DbType.String, senttoDODD);
                // returns the documentId of the document that was just inserted
                return DbHelper.ExecuteScalar(System.Data.CommandType.StoredProcedure, "CALL DBA.ANYW_WF_UpdateWorkflowStepDocumentsenttoDODD(?, ?)", args).ToString();
            }
            catch (Exception ex)
            {
                logger.error("WFDG", ex.Message + "ANYW_WF_UpdateWorkflowStepDocumentsenttoDODD(" + workflowstepdocId + "," + senttoDODD + ")");
                throw ex;
            }
        }

        public string insertWorkflowStepEvent(string stepId, string eventId, string eventParameter, string eventDescription, DistributedTransaction transaction)
        {
            try
            {
                logger.debug("insertWorkflowStepEvent ");
                System.Data.Common.DbParameter[] args = new System.Data.Common.DbParameter[4];
                args[0] = (System.Data.Common.DbParameter)DbHelper.CreateParameter("@stepId", DbType.String, stepId);
                args[1] = (System.Data.Common.DbParameter)DbHelper.CreateParameter("@eventId", DbType.String, eventId);
                args[2] = (System.Data.Common.DbParameter)DbHelper.CreateParameter("@eventParameter", DbType.String, eventParameter);
                args[3] = (System.Data.Common.DbParameter)DbHelper.CreateParameter("@eventDescription", DbType.String, eventDescription);
                // returns the stepEventId of the stepEvent that was just inserted
                return DbHelper.ExecuteScalar(System.Data.CommandType.StoredProcedure, "CALL DBA.ANYW_WF_InsertWorkflowStepEvent(?, ?, ?, ?)", args, ref transaction).ToString();
            }
            catch (Exception ex)
            {
                logger.error("WFDG", ex.Message + "ANYW_WF_InsertWorkflowStepEvent(" + stepId + "," + eventId + "," + ")");
                throw ex;
            }
        }
        public string insertWorkflowStepEventAction(string stepEventId, string actionId, string actionParameter, string actionDescription, DistributedTransaction transaction)
        {
            try
            {
                logger.debug("insertWorkflowStepEventAction ");
                System.Data.Common.DbParameter[] args = new System.Data.Common.DbParameter[4];
                args[0] = (System.Data.Common.DbParameter)DbHelper.CreateParameter("@stepEventId", DbType.String, stepEventId);
                args[1] = (System.Data.Common.DbParameter)DbHelper.CreateParameter("@actionId", DbType.String, actionId);
                args[2] = (System.Data.Common.DbParameter)DbHelper.CreateParameter("@actionParameter", DbType.String, actionParameter);
                args[3] = (System.Data.Common.DbParameter)DbHelper.CreateParameter("@actionDescription", DbType.String, actionDescription);
                // returns the stepEventId of the stepEvent that was just inserted
                return DbHelper.ExecuteScalar(System.Data.CommandType.StoredProcedure, "CALL DBA.ANYW_WF_InsertWorkflowStepEventAction(?, ?, ?, ?)", args, ref transaction).ToString();
            }
            catch (Exception ex)
            {
                logger.error("WFDG", ex.Message + "ANYW_WF_InsertWorkflowStepEventAction(" + stepEventId + "," + actionId + "," + ")");
                throw ex;
            }
        }
        public string setWorkflowStatus(string workflowId, string statusId, DistributedTransaction transaction)
        {
            try
            {
                logger.debug("setWorkflowStatus ");
                System.Data.Common.DbParameter[] args = new System.Data.Common.DbParameter[2];
                args[0] = (System.Data.Common.DbParameter)DbHelper.CreateParameter("@workflowId", DbType.String, workflowId);
                args[1] = (System.Data.Common.DbParameter)DbHelper.CreateParameter("@statusId", DbType.String, statusId);
                // returns the number of rows updated
                //return DbHelper.ExecuteScalar(System.Data.CommandType.StoredProcedure, "CALL DBA.ANYW_WF_setWorkflowStatus(?, ?)", args, ref transaction).ToString();

                System.Data.Common.DbDataReader returnMsg = DbHelper.ExecuteReader(System.Data.CommandType.StoredProcedure, "CALL DBA.ANYW_WF_setWorkflowStatus(?, ?)", args, ref transaction);
                return convertToJSON(returnMsg);
            }
            catch (Exception ex)
            {
                logger.error("WFDG", ex.Message + "ANYW_WF_setWorkflowStatus(" + workflowId + "," + statusId + "," + ")");
                throw ex;
            }
        }
        public string setWorkflowStepDocumentOrder(string documentId, string docOrder, DistributedTransaction transaction)
        {
            try
            {
                logger.debug("setWorkflowStepDocumentOrder ");
                System.Data.Common.DbParameter[] args = new System.Data.Common.DbParameter[2];
                args[0] = (System.Data.Common.DbParameter)DbHelper.CreateParameter("@documentId", DbType.String, documentId);
                args[1] = (System.Data.Common.DbParameter)DbHelper.CreateParameter("@docOrder", DbType.String, docOrder);
                // returns the number of rows updated
                return DbHelper.ExecuteScalar(System.Data.CommandType.StoredProcedure, "CALL DBA.ANYW_WF_setWorkflowStepDocumentOrder(?, ?)", args, ref transaction).ToString();
            }
            catch (Exception ex)
            {
                logger.error("WFDG", ex.Message + "ANYW_WF_setWorkflowStepDocumentOrder(" + documentId + "," + docOrder + "," + ")");
                throw ex;
            }
        }
        public string setWorkflowStepOrder(string stepId, string stepOrder, DistributedTransaction transaction)
        {
            try
            {
                logger.debug("setWorkflowStepOrder ");
                System.Data.Common.DbParameter[] args = new System.Data.Common.DbParameter[2];
                args[0] = (System.Data.Common.DbParameter)DbHelper.CreateParameter("@stepId", DbType.String, stepId);
                args[1] = (System.Data.Common.DbParameter)DbHelper.CreateParameter("@stepOrder", DbType.String, stepOrder);
                // returns the number of rows updated
                return DbHelper.ExecuteScalar(System.Data.CommandType.StoredProcedure, "CALL DBA.ANYW_WF_setWorkflowStepOrder(?, ?)", args, ref transaction).ToString();
            }
            catch (Exception ex)
            {
                logger.error("WFDG", ex.Message + "ANYW_WF_setWorkflowStepOrder(" + stepId + "," + stepOrder + "," + ")");
                throw ex;
            }
        }
        public string setWorkflowStepDoneDate(string stepId, string doneDate, DistributedTransaction transaction)
        {
            try
            {
                logger.debug("setWorkflowStepDoneDate ");
                System.Data.Common.DbParameter[] args = new System.Data.Common.DbParameter[2];
                args[0] = (System.Data.Common.DbParameter)DbHelper.CreateParameter("@stepId", DbType.String, stepId);
                args[1] = (System.Data.Common.DbParameter)DbHelper.CreateParameter("@doneDate", DbType.Date, doneDate);
                // returns the number of rows updated
                return DbHelper.ExecuteScalar(System.Data.CommandType.StoredProcedure, "CALL DBA.ANYW_WF_setWorkflowStepDoneDate(?, ?)", args, ref transaction).ToString();
            }
            catch (Exception ex)
            {
                logger.error("WFDG", ex.Message + "ANYW_WF_setWorkflowStepOrder(" + stepId + "," + doneDate + "," + ")");
                throw ex;
            }
        }

        public string setWorkflowStepDueDate(string stepId, string dueDate, DistributedTransaction transaction)
        {
            try
            {
                logger.debug("setWorkflowStepDueDate ");
                System.Data.Common.DbParameter[] args = new System.Data.Common.DbParameter[2];
                args[0] = (System.Data.Common.DbParameter)DbHelper.CreateParameter("@stepId", DbType.String, stepId);
                args[1] = (System.Data.Common.DbParameter)DbHelper.CreateParameter("@dueDate", DbType.Date, dueDate);
                // returns the number of rows updated
                return DbHelper.ExecuteScalar(System.Data.CommandType.StoredProcedure, "CALL DBA.ANYW_WF_setWorkflowStepDueDate(?, ?)", args, ref transaction).ToString();
            }
            catch (Exception ex)
            {
                logger.error("WFDG", ex.Message + "ANYW_WF_setWorkflowStepOrder(" + stepId + "," + dueDate + "," + ")");
                throw ex;
            }
        }

        public string setWorkflowStepStartDate(string stepId, string startDate, DistributedTransaction transaction)
        {
            try
            {
                logger.debug("setWorkflowStepStartDate ");
                System.Data.Common.DbParameter[] args = new System.Data.Common.DbParameter[2];
                args[0] = (System.Data.Common.DbParameter)DbHelper.CreateParameter("@stepId", DbType.String, stepId);
                args[1] = (System.Data.Common.DbParameter)DbHelper.CreateParameter("@startDate", DbType.Date, startDate);
                // returns the number of rows updated
                return DbHelper.ExecuteScalar(System.Data.CommandType.StoredProcedure, "CALL DBA.ANYW_WF_setWorkflowStepStartDate(?, ?)", args, ref transaction).ToString();
            }
            catch (Exception ex)
            {
                logger.error("WFDG", ex.Message + "ANYW_WF_setWorkflowStepOrder(" + stepId + "," + startDate + "," + ")");
                throw ex;
            }
        }
        public string updateWorkflowStep(string @stepId, string @groupId, string @stepOrder, string @description, string @responsiblePartyId, string @isChecklist, string @dueDate, string @startDate, string @doneDate, string @comments, string @isApplicable, DistributedTransaction transaction)
        {
            try
            {
                logger.debug("updateWorkflowStep ");

                System.Data.Common.DbParameter[] args = new System.Data.Common.DbParameter[11];
                args[0] = (System.Data.Common.DbParameter)DbHelper.CreateParameter("@stepId", DbType.String, stepId);
                args[1] = (System.Data.Common.DbParameter)DbHelper.CreateParameter("@groupId", DbType.String, groupId);
                args[2] = (System.Data.Common.DbParameter)DbHelper.CreateParameter("@stepOrder", DbType.String, stepOrder);
                args[3] = (System.Data.Common.DbParameter)DbHelper.CreateParameter("@description", DbType.String, description);
                args[4] = (System.Data.Common.DbParameter)DbHelper.CreateParameter("@responsiblePartyId", DbType.String, responsiblePartyId == "" ? null : responsiblePartyId);
                args[5] = (System.Data.Common.DbParameter)DbHelper.CreateParameter("@isChecklist", DbType.Boolean, bool.Parse(isChecklist));
                args[6] = (System.Data.Common.DbParameter)DbHelper.CreateParameter("@dueDate", DbType.Date, dueDate == null || dueDate.Equals("") ? null : dueDate);
                args[7] = (System.Data.Common.DbParameter)DbHelper.CreateParameter("@startDate", DbType.Date, startDate == null || startDate.Equals("") ? null : startDate);
                args[8] = (System.Data.Common.DbParameter)DbHelper.CreateParameter("@doneDate", DbType.Date, doneDate == null || doneDate.Equals("") ? null : doneDate);
                args[9] = (System.Data.Common.DbParameter)DbHelper.CreateParameter("@comments", DbType.String, comments);
                args[10] = (System.Data.Common.DbParameter)DbHelper.CreateParameter("@isApplicable", DbType.Boolean, bool.Parse(isApplicable));
                // returns the number of rows updated
                return DbHelper.ExecuteScalar(System.Data.CommandType.StoredProcedure, "CALL DBA.ANYW_WF_updateWorkflowStep(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", args, ref transaction).ToString();
            }
            catch (Exception ex)
            {
                logger.error("WFDG", ex.Message + "ANYW_WF_updateWorkflowStep(" + stepId + "," + groupId + "," + stepOrder + "," + description + "," + responsiblePartyId + "," + isChecklist + "," + dueDate + "," + startDate + "," + doneDate + "," + comments + "," + isApplicable + ")");
                throw ex;
            }
        }

        public string processWorkflowStepEvent(string eventId, string eventType, string eventTypeId, string stepId, DistributedTransaction transaction)
        {
            try
            {
                logger.debug("processWorkflowStepEvent ");
                System.Data.Common.DbParameter[] args = new System.Data.Common.DbParameter[4];
                args[0] = (System.Data.Common.DbParameter)DbHelper.CreateParameter("@eventId", DbType.String, eventId);
                args[1] = (System.Data.Common.DbParameter)DbHelper.CreateParameter("@eventType", DbType.String, eventType);
                args[2] = (System.Data.Common.DbParameter)DbHelper.CreateParameter("@eventTypeId", DbType.String, eventTypeId);
                args[3] = (System.Data.Common.DbParameter)DbHelper.CreateParameter("@stepId", DbType.String, stepId);

                System.Data.Common.DbDataReader returnMsg = DbHelper.ExecuteReader(System.Data.CommandType.StoredProcedure, "CALL DBA.ANYW_WF_processWorkflowStepEvent(?, ?, ?, ?)", args, ref transaction);
                return convertToJSON(returnMsg);

            }
            catch (Exception ex)
            {
                logger.error("WFDG", ex.Message + "ANYW_WF_processWorkflowStepEvent");
                throw ex;
            }

        }

        public string sendNotification(string eventType, string workFlowId, string stepId, string To_Option, string To_Addresses, string CC_Option, string CC_Addresses, string BCC_Option, string BCC_Addresses, string From_Option, string From_Address, string Subject, string Body, DistributedTransaction transaction)
        {
            try
            {
                logger.debug("sendNotification ");
                System.Data.Common.DbParameter[] args = new System.Data.Common.DbParameter[13];
                // args[0] = (System.Data.Common.DbParameter)DbHelper.CreateParameter("@eventId", DbType.String, eventId);
                args[0] = (System.Data.Common.DbParameter)DbHelper.CreateParameter("@eventType", DbType.String, eventType);
                args[1] = (System.Data.Common.DbParameter)DbHelper.CreateParameter("@workFlowId", DbType.String, workFlowId);
                args[2] = (System.Data.Common.DbParameter)DbHelper.CreateParameter("@stepId", DbType.String, stepId);
                args[3] = (System.Data.Common.DbParameter)DbHelper.CreateParameter("@To_Option", DbType.String, To_Option);
                args[4] = (System.Data.Common.DbParameter)DbHelper.CreateParameter("@To_Addresses", DbType.String, To_Addresses);
                args[5] = (System.Data.Common.DbParameter)DbHelper.CreateParameter("@CC_Option", DbType.String, CC_Option);
                args[6] = (System.Data.Common.DbParameter)DbHelper.CreateParameter("@CC_Addresses", DbType.String, CC_Addresses);
                args[7] = (System.Data.Common.DbParameter)DbHelper.CreateParameter("@BCC_Option", DbType.String, BCC_Option);
                args[8] = (System.Data.Common.DbParameter)DbHelper.CreateParameter("@BCC_Addresses", DbType.String, BCC_Addresses);
                args[9] = (System.Data.Common.DbParameter)DbHelper.CreateParameter("@From_Option", DbType.String, From_Option);
                args[10] = (System.Data.Common.DbParameter)DbHelper.CreateParameter("@From_Address", DbType.String, From_Address);
                args[11] = (System.Data.Common.DbParameter)DbHelper.CreateParameter("@Subject", DbType.String, Subject);
                args[12] = (System.Data.Common.DbParameter)DbHelper.CreateParameter("@Body", DbType.String, Body);
                // args[3] = (System.Data.Common.DbParameter)DbHelper.CreateParameter("@modifiedValue", DbType.String, modifiedValue);

                System.Data.Common.DbDataReader returnMsg = DbHelper.ExecuteReader(System.Data.CommandType.StoredProcedure, "CALL DBA.ANYW_WF_SendNotification(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", args, ref transaction);
                return convertToJSON(returnMsg);

            }
            catch (Exception ex)
            {
                logger.error("WFDG", ex.Message + "ANYW_WF_SendNotification");
                return "[]";
            }

        }

        public string getPlanfromWorkFlowId(string workflowId, DistributedTransaction transaction)
        {
            try
            {
                logger.debug("ANYW_ISP_getPlanfromWorkFlowId ");
                System.Data.Common.DbParameter[] args = new System.Data.Common.DbParameter[1];
                args[0] = (System.Data.Common.DbParameter)DbHelper.CreateParameter("@WFId", DbType.String, workflowId);

                System.Data.Common.DbDataReader returnMsg = DbHelper.ExecuteReader(System.Data.CommandType.StoredProcedure, "CALL DBA.ANYW_ISP_getPlanfromWorkFlowId(?)", args, ref transaction);
                return convertToJSON(returnMsg);

            }
            catch (Exception ex)
            {
                logger.error("WFDG", ex.Message + "ANYW_ISP_getPlanfromWorkFlowId");
                throw ex;
            }

        }

        public string getWorkFlowStepInfo(string stepId, DistributedTransaction transaction)
        {
            try
            {
                logger.debug("ANYW_WF_getWorkflowStepInfo ");
                System.Data.Common.DbParameter[] args = new System.Data.Common.DbParameter[1];
                args[0] = (System.Data.Common.DbParameter)DbHelper.CreateParameter("@stepId", DbType.String, stepId);

                System.Data.Common.DbDataReader returnMsg = DbHelper.ExecuteReader(System.Data.CommandType.StoredProcedure, "CALL DBA.ANYW_WF_getWorkflowStepInfo(?)", args, ref transaction);
                return convertToJSON(returnMsg);

            }
            catch (Exception ex)
            {
                logger.error("WFDG", ex.Message + "ANYW_WF_getWorkflowStepInfo");
                throw ex;
            }

        }

        public string getManualWorkflowList(string token, string processId, string planId)
        {
            logger.debug("getLocationsJSON ");
            List<string> list = new List<string>();
            list.Add(token);
            list.Add(processId);
            list.Add(planId);
            string text = "CALL DBA.DBA.ANYW_WF_GetManualWorkflowList(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")";
            try
            {
                return executeDataBaseCallJSON(text);
            }
            catch (Exception ex)
            {
                logger.error("501", ex.Message + "DBA.ANYW_WF_GetManualWorkflowList(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")");
                return "501: error DBA.ANYW_WF_GetManualWorkflowList";
            }
        }
        #endregion

        public string getWorkFlowFormsfromPreviousPlan(string token, string selectedWFTemplateIds, string previousPlanId)
        {
            logger.debug("getWorkFlowFormsfromPreviousPlan ");
            List<string> list = new List<string>();
            list.Add(token);
            list.Add(selectedWFTemplateIds);
            list.Add(previousPlanId);

            string text = "CALL DBA.ANYW_WF_getWorkFlowFormsfromPreviousPlan(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")";
            try
            {
                return executeDataBaseCallJSON(text);
            }
            catch (Exception ex)
            {
                logger.error("501", ex.Message + "DBA.ANYW_WF_getWorkFlowFormsfromPreviousPlan(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")");
                return "501: error ANYW_WF_getWorkFlowFormsfromPreviousPlan";
            }
        }


        #region WORKFLOW DASHBOARD WIDGETS        
        public string getDashboardPlanWorkflowWidget(string responsiblePartyId, DistributedTransaction transaction)
        {
            // Plan Widget Data
            // returns plan data and workflow steps for a given responsible party (the peopleId of the user logged in)
            // if responsiblePartyId is left null, it returns data for all responsible parties so that we leave it open 
            // for other widgets like supervisors that want to see incomplete steps and who is responsible
            try
            {
                logger.debug("getDashboardPlanWorkflowWidget ");
                System.Data.Common.DbParameter[] args = new System.Data.Common.DbParameter[1];
                args[0] = (System.Data.Common.DbParameter)DbHelper.CreateParameter("@responsiblePartyId", DbType.String, responsiblePartyId);
                // returns consumer plan and workflow step data 
                System.Data.Common.DbDataReader returnMsg = DbHelper.ExecuteReader(System.Data.CommandType.StoredProcedure, "CALL DBA.ANYW_Dashboard_PlanWorkflowWidget(?)", args, ref transaction);


                return convertToJSON(returnMsg);
            }
            catch (Exception ex)
            {
                logger.error("WFDG", ex.Message + "ANYW_Dashboard_PlanWorkflowWidget(" + responsiblePartyId + ")");
                throw ex;
            }
        }
        #endregion
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

    }
}