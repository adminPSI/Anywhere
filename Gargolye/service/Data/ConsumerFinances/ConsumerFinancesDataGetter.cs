using Anywhere.Log;
using OneSpanSign.Sdk;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using static Anywhere.service.Data.SimpleMar.SignInUser;

namespace Anywhere.service.Data.ConsumerFinances
{
    public class ConsumerFinancesDataGetter
    {
        private static Loger logger = new Loger();
        Anywhere.service.Data.WorkflowDataGetter wfdg = new Anywhere.service.Data.WorkflowDataGetter();
        Anywhere.Data.DataGetter dg = new Anywhere.Data.DataGetter();

        public string getAccountTransectionEntries(string token, string consumerIds, string activityStartDate, string activityEndDate, string accountName, string payee, string category, string minamount, string maxamount, string checkNo, string balance, string enteredBy, string isattachment, DistributedTransaction transaction, string transectionType)
        {
            try
            {
                logger.debug("getAccountTransectionEntries");
                System.Data.Common.DbParameter[] args = new System.Data.Common.DbParameter[13];
                args[0] = (System.Data.Common.DbParameter)DbHelper.CreateParameter("@consumerIds", DbType.String, consumerIds);
                args[1] = (System.Data.Common.DbParameter)DbHelper.CreateParameter("@activityStartDate", DbType.String, activityStartDate);
                args[2] = (System.Data.Common.DbParameter)DbHelper.CreateParameter("@activityEndDate", DbType.String, activityEndDate);
                args[3] = (System.Data.Common.DbParameter)DbHelper.CreateParameter("@accountName", DbType.String, accountName);
                args[4] = (System.Data.Common.DbParameter)DbHelper.CreateParameter("@payee", DbType.String, payee);
                args[5] = (System.Data.Common.DbParameter)DbHelper.CreateParameter("@category", DbType.String, category);
                args[6] = (System.Data.Common.DbParameter)DbHelper.CreateParameter("@minamount", DbType.String, minamount);
                args[7] = (System.Data.Common.DbParameter)DbHelper.CreateParameter("@maxamount", DbType.String, maxamount);
                args[8] = (System.Data.Common.DbParameter)DbHelper.CreateParameter("@checkNo", DbType.String, checkNo);
                args[9] = (System.Data.Common.DbParameter)DbHelper.CreateParameter("@balance", DbType.String, balance);
                args[10] = (System.Data.Common.DbParameter)DbHelper.CreateParameter("@enteredBy", DbType.String, enteredBy);
                args[11] = (System.Data.Common.DbParameter)DbHelper.CreateParameter("@isattachment", DbType.String, isattachment);
                args[12] = (System.Data.Common.DbParameter)DbHelper.CreateParameter("@transectionType", DbType.String, transectionType);

                System.Data.Common.DbDataReader returnMsg = DbHelper.ExecuteReader(System.Data.CommandType.StoredProcedure, "CALL DBA.ANYW_getConsumerFinancesEntries(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", args, ref transaction);
                return wfdg.convertToJSON(returnMsg);
            }
            catch (Exception ex)
            {
                logger.error("WFDG", ex.Message + "ANYW_getConsumerFinancesEntries(" + consumerIds + ")");
                throw ex;
            }
        }

        public string getActiveAccount(DistributedTransaction transaction, string consumerId)
        {
            try
            {
                logger.debug("getActiveAccount");
                System.Data.Common.DbParameter[] args = new System.Data.Common.DbParameter[1];
                args[0] = (System.Data.Common.DbParameter)DbHelper.CreateParameter("@consumerId", DbType.String, consumerId);

                System.Data.Common.DbDataReader returnMsg = DbHelper.ExecuteReader(System.Data.CommandType.StoredProcedure, "CALL DBA.ANYW_getActiveAccounts(?)", args, ref transaction);
                return wfdg.convertToJSON(returnMsg);
            }
            catch (Exception ex)
            {
                logger.error("WFDG", ex.Message + "ANYW_getActiveAccounts()");
                throw ex;
            }
        }

        public string getPayees(DistributedTransaction transaction, string consumerId)
        {
            try
            {
                logger.debug("getPayees");
                System.Data.Common.DbParameter[] args = new System.Data.Common.DbParameter[1];
                args[0] = (System.Data.Common.DbParameter)DbHelper.CreateParameter("@ConsumerID", DbType.String, consumerId);
                System.Data.Common.DbDataReader returnMsg = DbHelper.ExecuteReader(System.Data.CommandType.StoredProcedure, "CALL DBA.ANYW_getPayees(?)", args, ref transaction);
                return wfdg.convertToJSON(returnMsg);
            }
            catch (Exception ex)
            {
                logger.error("WFDG", ex.Message + "ANYW_getPayees()");
                throw ex;
            }
        }

        public string getCatogories(DistributedTransaction transaction, string categoryID)
        {
            List<string> list = new List<string>();
            list.Add(categoryID);
            try
            {
                logger.debug("getCatogories");
                System.Data.Common.DbDataReader returnMsg = DbHelper.ExecuteReader(System.Data.CommandType.StoredProcedure, "CALL DBA.ANYW_getCatagories(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")", ref transaction);
                return wfdg.convertToJSON(returnMsg);
            }
            catch (Exception ex)
            {
                logger.error("WFDG", ex.Message + "ANYW_getCatogories()");
                throw ex;
            }

        }

        public string getSubCatogories(DistributedTransaction transaction, string category)
        {
            List<string> list = new List<string>();
            list.Add(category);
            try
            {
                logger.debug("getSubCatogories");
                System.Data.Common.DbDataReader returnMsg = DbHelper.ExecuteReader(System.Data.CommandType.StoredProcedure, "CALL DBA.ANYW_getSubCatagories(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")", ref transaction);
                return wfdg.convertToJSON(returnMsg);
            }
            catch (Exception ex)
            {
                logger.error("WFDG", ex.Message + "ANYW_getSubCatogories()");
                throw ex;
            }

        }

        public string getCategoriesSubCategories(DistributedTransaction transaction, string categoryID)
        {
            List<string> list = new List<string>();
            list.Add(categoryID);
            try
            {
                logger.debug("getCategoriesSubCategories");
                System.Data.Common.DbDataReader returnMsg = DbHelper.ExecuteReader(System.Data.CommandType.StoredProcedure, "CALL DBA.ANYW_getCategoriesSubCategories(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")", ref transaction);
                return wfdg.convertToJSON(returnMsg);
            }
            catch (Exception ex)
            {
                logger.error("WFDG", ex.Message + "ANYW_getCategoriesSubCategories()");
                throw ex;
            }
        }

        public string getCategoriesSubCategoriesByPayee(DistributedTransaction transaction, string categoryID)
        {
            List<string> list = new List<string>();
            list.Add(categoryID);
            try
            {
                logger.debug("getCategoriesSubCategoriesByPayee");
                System.Data.Common.DbDataReader returnMsg = DbHelper.ExecuteReader(System.Data.CommandType.StoredProcedure, "CALL DBA.ANYW_getCategoriesSubCategoriesByPayee(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")", ref transaction);
                return wfdg.convertToJSON(returnMsg);
            }
            catch (Exception ex)
            {
                logger.error("WFDG", ex.Message + "ANYW_getCategoriesSubCategoriesByPayee()");
                throw ex;
            }
        }

        public string insertPayee(string payeeName, string address1, string address2, string city, string state, string zipcode, string userId, string consumerId, DistributedTransaction transaction)
        {
            try
            {
                logger.debug("insertPayee");
                System.Data.Common.DbParameter[] args = new System.Data.Common.DbParameter[8];
                args[0] = (System.Data.Common.DbParameter)DbHelper.CreateParameter("@payeeName", DbType.String, payeeName);
                args[1] = (System.Data.Common.DbParameter)DbHelper.CreateParameter("@address1", DbType.String, address1);
                args[2] = (System.Data.Common.DbParameter)DbHelper.CreateParameter("@address2", DbType.String, address2);
                args[3] = (System.Data.Common.DbParameter)DbHelper.CreateParameter("@city", DbType.String, city); 
                args[4] = (System.Data.Common.DbParameter)DbHelper.CreateParameter("@state", DbType.String, state);
                args[5] = (System.Data.Common.DbParameter)DbHelper.CreateParameter("@zipcode", DbType.String, zipcode);
                args[6] = (System.Data.Common.DbParameter)DbHelper.CreateParameter("@userId", DbType.String, userId);
                args[7] = (System.Data.Common.DbParameter)DbHelper.CreateParameter("@ConsumerID", DbType.String, consumerId);

                return DbHelper.ExecuteScalar(System.Data.CommandType.StoredProcedure, "CALL DBA.ANYW_insertPayee(?, ?, ?, ?, ?, ?, ?, ?)", args, ref transaction).ToString();
            }
            catch (Exception ex)
            {
                logger.error("WFDG", ex.Message + "ANYW_insertPayee(" + payeeName + "," + address1 + "," + city + ")");
                throw ex;
            }
        }

        public string updateAccount(string token, string date, string amount, string amountType, string account, string payee, string category, string subCategory, string checkNo, string description, string receipt, string userId, DistributedTransaction transaction, string regId, string runningBalance)
        {
            try
            {
                logger.debug("updateAccount");
                System.Data.Common.DbParameter[] args = new System.Data.Common.DbParameter[13];
                args[0] = (System.Data.Common.DbParameter)DbHelper.CreateParameter("@date", DbType.String, date);
                args[1] = (System.Data.Common.DbParameter)DbHelper.CreateParameter("@amount", DbType.Double, amount);
                args[2] = (System.Data.Common.DbParameter)DbHelper.CreateParameter("@amountType", DbType.String, amountType);
                args[3] = (System.Data.Common.DbParameter)DbHelper.CreateParameter("@account", DbType.Double, account);
                args[4] = (System.Data.Common.DbParameter)DbHelper.CreateParameter("@payee", DbType.String, payee);
                args[5] = (System.Data.Common.DbParameter)DbHelper.CreateParameter("@category", DbType.String, category);
                args[6] = (System.Data.Common.DbParameter)DbHelper.CreateParameter("@subCategory", DbType.String, subCategory);
                args[7] = (System.Data.Common.DbParameter)DbHelper.CreateParameter("@checkNo", DbType.String, checkNo);
                args[8] = (System.Data.Common.DbParameter)DbHelper.CreateParameter("@description", DbType.String, description);
                args[9] = (System.Data.Common.DbParameter)DbHelper.CreateParameter("@receipt", DbType.String, receipt);
                args[10] = (System.Data.Common.DbParameter)DbHelper.CreateParameter("@userId", DbType.String, userId);
                args[11] = (System.Data.Common.DbParameter)DbHelper.CreateParameter("@regId", DbType.String, regId);
                args[12] = (System.Data.Common.DbParameter)DbHelper.CreateParameter("@runningBalance", DbType.String, runningBalance);
                return DbHelper.ExecuteScalar(System.Data.CommandType.StoredProcedure, "CALL DBA.ANYW_updateAccount(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", args, ref transaction).ToString();
            }
            catch (Exception ex)
            {
                logger.error("WFDG", ex.Message + "ANYW_updateAccount(" + date + "," + amount + "," + account + ")");
                throw ex;
            }

        }

        public string insertAccount(string token, string date, string amount, string amountType, string account, string payee, string category, string subCategory, string checkNo, string description, string receipt, string userId, DistributedTransaction transaction, string runningBalance)
        {
            try
            {
                logger.debug("insertAccount");
                System.Data.Common.DbParameter[] args = new System.Data.Common.DbParameter[12];
                args[0] = (System.Data.Common.DbParameter)DbHelper.CreateParameter("@date", DbType.String, date);
                args[1] = (System.Data.Common.DbParameter)DbHelper.CreateParameter("@amount", DbType.String, amount);
                args[2] = (System.Data.Common.DbParameter)DbHelper.CreateParameter("@amountType", DbType.String, amountType);
                args[3] = (System.Data.Common.DbParameter)DbHelper.CreateParameter("@account", DbType.Double, account);
                args[4] = (System.Data.Common.DbParameter)DbHelper.CreateParameter("@payee", DbType.String, payee);
                args[5] = (System.Data.Common.DbParameter)DbHelper.CreateParameter("@category", DbType.String, category);
                args[6] = (System.Data.Common.DbParameter)DbHelper.CreateParameter("@subCategory", DbType.String, subCategory);
                args[7] = (System.Data.Common.DbParameter)DbHelper.CreateParameter("@checkNo", DbType.String, checkNo);
                args[8] = (System.Data.Common.DbParameter)DbHelper.CreateParameter("@description", DbType.String, description);
                args[9] = (System.Data.Common.DbParameter)DbHelper.CreateParameter("@receipt", DbType.String, receipt);
                args[10] = (System.Data.Common.DbParameter)DbHelper.CreateParameter("@userId", DbType.String, userId);
                args[11] = (System.Data.Common.DbParameter)DbHelper.CreateParameter("@runningBalance", DbType.String, runningBalance);
                return DbHelper.ExecuteScalar(System.Data.CommandType.StoredProcedure, "CALL DBA.ANYW_insertAccount(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", args, ref transaction).ToString();
            }
            catch (Exception ex)
            {
                logger.error("WFDG", ex.Message + "ANYW_insertAccount(" + date + "," + userId + "," + account + ")");
                throw ex;
            }

        }

        public string insertAccountRegisterAttachments(string token, string registerID, string attachId, string description, string userId, DistributedTransaction transaction)
        {
            try
            {
                logger.debug("insertAccount");
                System.Data.Common.DbParameter[] args = new System.Data.Common.DbParameter[4];
                args[0] = (System.Data.Common.DbParameter)DbHelper.CreateParameter("@registerID", DbType.String, registerID);
                args[1] = (System.Data.Common.DbParameter)DbHelper.CreateParameter("@attachmentId", DbType.String, attachId);
                args[2] = (System.Data.Common.DbParameter)DbHelper.CreateParameter("@description", DbType.String, description);
                args[3] = (System.Data.Common.DbParameter)DbHelper.CreateParameter("@userId", DbType.String, userId);

                return DbHelper.ExecuteScalar(System.Data.CommandType.StoredProcedure, "CALL DBA.ANYW_insertAccountRegisterAttachments(?, ?, ?, ?)", args, ref transaction).ToString();
            }
            catch (Exception ex)
            {
                logger.error("WFDG", ex.Message + "ANYW_insertAccountRegisterAttachments(" + registerID + "," + attachId + "," + userId + ")");
                throw ex;
            }

        }

        public string getAccountEntriesById(string token, string registerId, DistributedTransaction transaction)
        {
            try
            {
                logger.debug("getAccountEntriesById ");
                System.Data.Common.DbParameter[] args = new System.Data.Common.DbParameter[1];
                args[0] = (System.Data.Common.DbParameter)DbHelper.CreateParameter("@registerId", DbType.String, registerId);

                System.Data.Common.DbDataReader returnMsg = DbHelper.ExecuteReader(System.Data.CommandType.StoredProcedure, "CALL DBA.ANYW_getConsumerFinancesEntryById(?)", args, ref transaction);
                return wfdg.convertToJSON(returnMsg);
            }
            catch (Exception ex)
            {
                logger.error("WFDG", ex.Message + "ANYW_getConsumerFinancesEntryById(" + registerId + ")");
                throw ex;
            }
        }

        public string deleteConsumerFinanceAccount(string token, string registerId, DistributedTransaction transaction)
        {
            try
            {
                logger.debug("deleteConsumerFinanceAccount ");
                System.Data.Common.DbParameter[] args = new System.Data.Common.DbParameter[1];
                args[0] = (System.Data.Common.DbParameter)DbHelper.CreateParameter("@registerId", DbType.String, registerId);

                System.Data.Common.DbDataReader returnMsg = DbHelper.ExecuteReader(System.Data.CommandType.StoredProcedure, "CALL DBA.ANYW_deleteConsumerFinancesAccount(?)", args, ref transaction);
                return wfdg.convertToJSON(returnMsg);
            }
            catch (Exception ex)
            {
                logger.error("WFDG", ex.Message + "ANYW_deleteConsumerFinancesAccount(" + registerId + ")");
                throw ex;
            }
        }

        public string getCFAttachmentsList(DistributedTransaction transaction, string regId)
        {
            List<string> list = new List<string>();
            list.Add(regId);
            try
            {
                logger.debug("getConsumerFinanceAttachmentsList");
                System.Data.Common.DbDataReader returnMsg = DbHelper.ExecuteReader(System.Data.CommandType.StoredProcedure, "CALL DBA.ANYW_getConsumerFinanceAttachmentsList(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")", ref transaction);
                return wfdg.convertToJSON(returnMsg);
            }
            catch (Exception ex)
            {
                logger.error("WFDG", ex.Message + "ANYW_getConsumerFinanceAttachmentsList()");
                throw ex;
            }

        }

        public string getConsumerNameByID(string token, string consumersId, DistributedTransaction transaction)
        {
            try
            {
                logger.debug("getAccountEntriesById ");
                System.Data.Common.DbParameter[] args = new System.Data.Common.DbParameter[1];
                args[0] = (System.Data.Common.DbParameter)DbHelper.CreateParameter("@consumersId", DbType.String, consumersId);

                System.Data.Common.DbDataReader returnMsg = DbHelper.ExecuteReader(System.Data.CommandType.StoredProcedure, "CALL DBA.ANYW_getConsumerNameById(?)", args, ref transaction);
                return wfdg.convertToJSON(returnMsg);
            }
            catch (Exception ex)
            {
                logger.error("WFDG", ex.Message + "ANYW_getConsumerFinancesEntryById(" + consumersId + ")");
                throw ex;
            }
        }

        public string deleteCFAttachment(string token, string attachmentId, DistributedTransaction transaction)
        {
            try
            {
                logger.debug("deleteCFAttachment");
                System.Data.Common.DbParameter[] args = new System.Data.Common.DbParameter[1];
                args[0] = (System.Data.Common.DbParameter)DbHelper.CreateParameter("@attachmentId", DbType.String, attachmentId);

                System.Data.Common.DbDataReader returnMsg = DbHelper.ExecuteReader(System.Data.CommandType.StoredProcedure, "CALL DBA.ANYW_deleteCFAttachment(?)", args, ref transaction);
                return wfdg.convertToJSON(returnMsg);
            }
            catch (Exception ex)
            {
                logger.error("WFDG", ex.Message + "ANYW_deleteCFAttachment(" + attachmentId + ")");
                throw ex;
            }
        }

        public string getActiveUsedBy(DistributedTransaction transaction)
        {
            try
            {
                logger.debug("getActiveUsedBy");
                System.Data.Common.DbDataReader returnMsg = DbHelper.ExecuteReader(System.Data.CommandType.StoredProcedure, "CALL DBA.ANYW_getActiveUsedBy", ref transaction);
                return wfdg.convertToJSON(returnMsg);
            }
            catch (Exception ex)
            {
                logger.error("WFDG", ex.Message + "ANYW_getActiveUsedBy()");
                throw ex;
            }
        }

        public string getPastAccountRunningBalance(string date, string account, DistributedTransaction transaction)
        {
            try
            {
                logger.debug("getPastAccountRunningBalance");
                System.Data.Common.DbParameter[] args = new System.Data.Common.DbParameter[2];
                args[0] = (System.Data.Common.DbParameter)DbHelper.CreateParameter("@date", DbType.String, date);
                args[1] = (System.Data.Common.DbParameter)DbHelper.CreateParameter("@account", DbType.Double, account);

                System.Data.Common.DbDataReader returnMsg = DbHelper.ExecuteReader(System.Data.CommandType.StoredProcedure, "CALL DBA.ANYW_GetPastAccountRunningBalance(?, ?)", args, ref transaction);
                return wfdg.convertToJSON(returnMsg);
            }
            catch (Exception ex)
            {
                logger.error("WFDG", ex.Message + "ANYW_GetPastAccountRunningBalance(" + date + "," + account + ")");
                throw ex;
            }

        }

        public string getNextAccountRunningBalance(string date, string account, DistributedTransaction transaction)
        {
            try
            {
                logger.debug("getNextAccountRunningBalance"); 
                System.Data.Common.DbParameter[] args = new System.Data.Common.DbParameter[2];
                args[0] = (System.Data.Common.DbParameter)DbHelper.CreateParameter("@date", DbType.String, date);
                args[1] = (System.Data.Common.DbParameter)DbHelper.CreateParameter("@account", DbType.Double, account);

                System.Data.Common.DbDataReader returnMsg = DbHelper.ExecuteReader(System.Data.CommandType.StoredProcedure, "CALL DBA.ANYW_GetNextAccountRunningBalance(?, ?)", args, ref transaction);
                return wfdg.convertToJSON(returnMsg);
            }
            catch (Exception ex)
            {
                logger.error("WFDG", ex.Message + "ANYW_GetNextAccountRunningBalance(" + date + "," + account + ")");
                throw ex;
            }

        }

        public string updateRunningBalance(string amount, DistributedTransaction transaction, string regId)
        {
            try
            {
                logger.debug("updateRunningBalance");
                System.Data.Common.DbParameter[] args = new System.Data.Common.DbParameter[2];
                args[0] = (System.Data.Common.DbParameter)DbHelper.CreateParameter("@amount", DbType.Double, amount);
                args[1] = (System.Data.Common.DbParameter)DbHelper.CreateParameter("@regId", DbType.String, regId);

                System.Data.Common.DbDataReader returnMsg = DbHelper.ExecuteReader(System.Data.CommandType.StoredProcedure, "CALL DBA.ANYW_updateRunningBalance(?,?)", args, ref transaction);
                return wfdg.convertToJSON(returnMsg);
            }
            catch (Exception ex)
            {
                logger.error("WFDG", ex.Message + "ANYW_updateRunningBalance(" + amount + "," + regId + ")");
                throw ex;
            }

        }



    }
}