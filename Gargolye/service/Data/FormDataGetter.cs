using Anywhere.Log;
using OneSpanSign.Sdk;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using static Anywhere.service.Data.FormWorker;
using static Anywhere.service.Data.SimpleMar.SignInUser;

namespace Anywhere.service.Data
{
    public class FormDataGetter
    {
        private static Loger logger = new Loger();
        Anywhere.service.Data.WorkflowDataGetter wfdg = new Anywhere.service.Data.WorkflowDataGetter();

        // used to retrieve form templates for the Workflow Step Documents/Forms
        public string getFormTemplates(DistributedTransaction transaction)
        {


            try
            {
                logger.debug("getFormTemplates ");
                System.Data.Common.DbParameter[] args = new System.Data.Common.DbParameter[0];
                // returns people names
                System.Data.Common.DbDataReader returnMsg = DbHelper.ExecuteReader(System.Data.CommandType.StoredProcedure, "CALL DBA.ANYW_Forms_GetTemplates()", args, ref transaction);
                return wfdg.convertToJSON(returnMsg);
            }
            catch (Exception ex)
            {
                logger.error("WFDG", ex.Message + "ANYW_Forms_GetTemplates()");
                throw ex;
            }
        }

        // used to retrieve form templates for the Forms Module
        public string getUserFormTemplates(string userId, string hasAssignedFormTypes, string typeId, DistributedTransaction transaction)
        {
            Anywhere.service.Data.WorkflowDataGetter wfdg = new Anywhere.service.Data.WorkflowDataGetter();

            try
            {
                logger.debug("getUserFormTemplates ");
                System.Data.Common.DbParameter[] args = new System.Data.Common.DbParameter[3];
                args[0] = (System.Data.Common.DbParameter)DbHelper.CreateParameter("@userId", DbType.String, userId);
                args[1] = (System.Data.Common.DbParameter)DbHelper.CreateParameter("@hasAssignedFormTypes", DbType.String, hasAssignedFormTypes);
                args[2] = (System.Data.Common.DbParameter)DbHelper.CreateParameter("@typeId", DbType.String, typeId);
                System.Data.Common.DbDataReader returnMsg = DbHelper.ExecuteReader(System.Data.CommandType.StoredProcedure, "CALL DBA.ANYW_Forms_getUserFormTemplates(?,?,?)", args, ref transaction);
                return wfdg.convertToJSON(returnMsg);
            }
            catch (Exception ex)
            {
                logger.error("WFDG", ex.Message + "ANYW_Forms_GetUserFormTemplates()");
                throw ex;
            }
        }

        // used to retrieve form type for the Forms Module
        public string getFormType(DistributedTransaction transaction)
        {
            Anywhere.service.Data.WorkflowDataGetter wfdg = new Anywhere.service.Data.WorkflowDataGetter();

            try
            {
                logger.debug("getFormType");
                System.Data.Common.DbDataReader returnMsg = DbHelper.ExecuteReader(System.Data.CommandType.StoredProcedure, "CALL DBA.ANYW_Forms_getFormType()", ref transaction);
                return wfdg.convertToJSON(returnMsg);
            }
            catch (Exception ex)
            {
                logger.error("WFDG", ex.Message + "ANYW_Forms_getFormType()");
                throw ex;
            }
        }


        public System.IO.MemoryStream getFormTemplate(string formtemplateId)
        {
            logger.debug("getFormTemplate " + formtemplateId);
            List<string> list = new List<string>();
            list.Add(formtemplateId);
            string text = "CALL DBA.ANYW_Forms_GetFormTemplate(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")";

            Anywhere.Data.DataGetter dg = new Anywhere.Data.DataGetter();

            try
            {
                return dg.executeSQLReturnMemoryStream(text);

            }
            catch (Exception ex)
            {
                logger.error("WFDG", ex.Message + "ANYW_Forms_GetTemplates()");
                return null;
            }
        }

        public System.IO.MemoryStream getPDFDocument(string documentId)
        {
            logger.debug("getPDFDocument " + documentId);
            List<string> list = new List<string>();
            list.Add(documentId);
            string text = "CALL DBA.ANYW_Forms_GetPDFDocument(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")";

            Anywhere.Data.DataGetter dg = new Anywhere.Data.DataGetter();

            try
            {
                return dg.executeSQLReturnMemoryStream(text);

            }
            catch (Exception ex)
            {
                logger.error("WFDG", ex.Message + "DBA.ANYW_Forms_GetPDFDocument()");
                return null;
            }
        }

        public System.IO.MemoryStream getConsumerFormData(string formId, string isTemplate)
        {
            logger.debug("getPDFDocument " + formId);
            List<string> list = new List<string>();
            list.Add(formId);
            list.Add(isTemplate);
            string text = "CALL DBA.ANYW_Forms_getConsumerFormData(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")";

            Anywhere.Data.DataGetter dg = new Anywhere.Data.DataGetter();

            try
            {
                return dg.executeSQLReturnMemoryStream(text);

            }
            catch (Exception ex)
            {
                logger.error("FDG", ex.Message + "DBA.ANYW_Forms_getConsumerFormData()");
                return null;
            }
        }


        public string insertConsumerForm(string userId, string consumerId, string formtemplateid, string formdata, string formCompleteDate, DistributedTransaction transaction)
        {
            try
            {
                logger.debug("insertConsumerForm ");
                System.Data.Common.DbParameter[] args = new System.Data.Common.DbParameter[5];
                args[0] = (System.Data.Common.DbParameter)DbHelper.CreateParameter("@userId", DbType.String, userId);
                args[1] = (System.Data.Common.DbParameter)DbHelper.CreateParameter("@consumerId", DbType.String, consumerId);
                args[2] = (System.Data.Common.DbParameter)DbHelper.CreateParameter("@formtemplateid", DbType.String, formtemplateid);
                args[3] = (System.Data.Common.DbParameter)DbHelper.CreateParameter("@formdata", DbType.String, formdata);
                args[4] = (System.Data.Common.DbParameter)DbHelper.CreateParameter("@formCompletionDate", DbType.String, formCompleteDate);

                // returns the formId of the document that was just inserted
                return DbHelper.ExecuteScalar(System.Data.CommandType.StoredProcedure, "CALL DBA.ANYW_Forms_insertConsumerForm(?, ?, ?, ?, ?)", args, ref transaction).ToString();
            }
            catch (Exception ex)
            {
                logger.error("WFDG", ex.Message + "ANYW_Forms_insertConsumerForm(" + userId + "," + consumerId + "," + formtemplateid + ")");
                throw ex;
            }
        }

        public string insertSeveralConsumerForm(string userId, string consumerId, string formtemplateid, string isTemplate, string formCompleteDate, DistributedTransaction transaction)
        {
            try
            {
                logger.debug("insertSeveralConsumerForm");
                System.Data.Common.DbParameter[] args = new System.Data.Common.DbParameter[5];
                args[0] = (System.Data.Common.DbParameter)DbHelper.CreateParameter("@userId", DbType.String, userId);
                args[1] = (System.Data.Common.DbParameter)DbHelper.CreateParameter("@consumerId", DbType.String, consumerId);
                args[2] = (System.Data.Common.DbParameter)DbHelper.CreateParameter("@formtemplateid", DbType.String, formtemplateid);
                args[3] = (System.Data.Common.DbParameter)DbHelper.CreateParameter("@isTemplate", DbType.String, isTemplate);
                args[4] = (System.Data.Common.DbParameter)DbHelper.CreateParameter("@formCompletionDate", DbType.String, formCompleteDate);

                // returns the formId of the document that was just inserted
                return DbHelper.ExecuteScalar(System.Data.CommandType.StoredProcedure, "CALL DBA.ANYW_Forms_insertSeveralConsumerForm(?, ?, ?, ?, ?)", args, ref transaction).ToString();
            }
            catch (Exception ex)
            {
                logger.error("WFDG", ex.Message + "ANYW_Forms_insertSeveralConsumerForm(" + userId + "," + consumerId + "," + formtemplateid + ")");
                throw ex;
            }
        }

        public string UpdateConsumerForm(string token, string formId, string formdata, DistributedTransaction transaction)
        {
            try
            {
                logger.debug("UpdateConsumerForm ");
                System.Data.Common.DbParameter[] args = new System.Data.Common.DbParameter[3];
                args[0] = (System.Data.Common.DbParameter)DbHelper.CreateParameter("@formId", DbType.String, formId);
                args[1] = (System.Data.Common.DbParameter)DbHelper.CreateParameter("@formdata", DbType.String, formdata);
                args[2] = (System.Data.Common.DbParameter)DbHelper.CreateParameter("@token", DbType.String, token);
                // returns the documentId of the document that was just inserted
                return DbHelper.ExecuteScalar(System.Data.CommandType.StoredProcedure, "CALL DBA.ANYW_Forms_UpdateConsumerForm(?,?,?)", args, ref transaction).ToString();
            }
            catch (Exception ex)
            {
                logger.error("WFDG", ex.Message + "ANYW_Forms_UpdateConsumerForm(" + formId + ")");
                throw ex;
            }
        }

        public string UpdateConsumerFormCompletionDate(string token, string formId, string formCompletionDate, DistributedTransaction transaction)
        {
            try
            {
                logger.debug("UpdateConsumerFormCompletionDate ");
                System.Data.Common.DbParameter[] args = new System.Data.Common.DbParameter[3];
                args[0] = (System.Data.Common.DbParameter)DbHelper.CreateParameter("@formId", DbType.String, formId);
                args[1] = (System.Data.Common.DbParameter)DbHelper.CreateParameter("@formCompletionDate", DbType.String, formCompletionDate);
                args[2] = (System.Data.Common.DbParameter)DbHelper.CreateParameter("@token", DbType.String, token);
                // returns the documentId of the document that was just inserted
                return DbHelper.ExecuteScalar(System.Data.CommandType.StoredProcedure, "CALL DBA.ANYW_Forms_UpdateConsumerFormCompletionDate(?,?,?)", args, ref transaction).ToString();
            }
            catch (Exception ex)
            {
                logger.error("WFDG", ex.Message + "ANYW_Forms_UpdateConsumerFormCompletionDate(" + formId + ")");
                throw ex;
            }
        }

        public string deleteConsumerForm(string formId, DistributedTransaction transaction)
        {
            try
            {
                logger.debug("DeleteConsumerForm ");

                System.Data.Common.DbParameter[] args = new System.Data.Common.DbParameter[1];
                args[0] = (System.Data.Common.DbParameter)DbHelper.CreateParameter("@dformId", DbType.String, formId);
                // returns the number of rows deleted
                return DbHelper.ExecuteScalar(System.Data.CommandType.StoredProcedure, "CALL DBA.ANYW_Forms_DeleteConsumerForm(?)", args, ref transaction).ToString();
            }
            catch (Exception ex)
            {
                logger.error("FDG", ex.Message + "ANYW_WF_DeleteConsumerForm(" + formId + ")");
                throw ex;
            }
        }


        public string getConsumerForms(string userId, string consumerId, string hasAssignedFormTypes, DistributedTransaction transaction)
        {
            try
            {
                logger.debug("getConsumerForms ");
                System.Data.Common.DbParameter[] args = new System.Data.Common.DbParameter[3];
                args[0] = (System.Data.Common.DbParameter)DbHelper.CreateParameter("@userId", DbType.String, userId);
                args[1] = (System.Data.Common.DbParameter)DbHelper.CreateParameter("@consumerId", DbType.String, consumerId);
                args[2] = (System.Data.Common.DbParameter)DbHelper.CreateParameter("@hasAssignedFormTypes", DbType.String, hasAssignedFormTypes);
                // returns the workflow document descriptions for the given workflowId
                System.Data.Common.DbDataReader returnMsg = DbHelper.ExecuteReader(System.Data.CommandType.StoredProcedure, "CALL DBA.ANYW_Forms_getConsumerForms(?, ?, ?)", args, ref transaction);
                return wfdg.convertToJSON(returnMsg);
            }
            catch (Exception ex)
            {
                logger.error("WFDG", ex.Message + "ANYW_WF_getConsumerForms(" + consumerId + ")");
                throw ex;
            }
        }


    }
}