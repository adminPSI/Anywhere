using Anywhere.Log;
using System;
using System.Data;
using System.Data.Odbc;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Anywhere.service.Data.ConsumerFinances
{
    public class ConsumerFinancesDataGetter
    {
        private static Loger logger = new Loger();
        Anywhere.service.Data.WorkflowDataGetter wfdg = new Anywhere.service.Data.WorkflowDataGetter();
        Anywhere.Data.DataGetter dg = new Anywhere.Data.DataGetter();

        //data for OOD Entries Listing on OOD Module Landing Page
        public string getAccountTransectionEntries(string token, string consumerIds, string activityStartDate,string activityEndDate, string accountName, string payee, string category, string amount, string checkNo, string balance, string enteredBy, DistributedTransaction transaction)
        {
            try
            {
                logger.debug("getAccountTransectionEntries ");
                System.Data.Common.DbParameter[] args = new System.Data.Common.DbParameter[10];
                args[0] = (System.Data.Common.DbParameter)DbHelper.CreateParameter("@consumerIds", DbType.String, consumerIds);
                args[1] = (System.Data.Common.DbParameter)DbHelper.CreateParameter("@activityStartDate", DbType.String, activityStartDate);
                args[2] = (System.Data.Common.DbParameter)DbHelper.CreateParameter("@activityEndDate", DbType.String, activityEndDate);
                args[3] = (System.Data.Common.DbParameter)DbHelper.CreateParameter("@accountName", DbType.String, accountName);
                args[4] = (System.Data.Common.DbParameter)DbHelper.CreateParameter("@payee", DbType.String, payee);
                args[5] = (System.Data.Common.DbParameter)DbHelper.CreateParameter("@category", DbType.String, category);
                args[6] = (System.Data.Common.DbParameter)DbHelper.CreateParameter("@amount", DbType.String, amount);
                args[7] = (System.Data.Common.DbParameter)DbHelper.CreateParameter("@checkNo", DbType.String, checkNo);
                args[8] = (System.Data.Common.DbParameter)DbHelper.CreateParameter("@balance", DbType.String, balance);
                args[9] = (System.Data.Common.DbParameter)DbHelper.CreateParameter("@enteredBy", DbType.String, enteredBy);

                // returns the workflow document descriptions for the given workflowId
                System.Data.Common.DbDataReader returnMsg = DbHelper.ExecuteReader(System.Data.CommandType.StoredProcedure, "CALL DBA.ANYW_getConsumerFinancesEntries(?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", args, ref transaction);
                return wfdg.convertToJSON(returnMsg);
            }
            catch (Exception ex)
            {
                logger.error("WFDG", ex.Message + "ANYW_WF_getOODEntries(" + consumerIds + ")");
                throw ex;
            }
        }
        // Active Employee data for OOD Entries Listing Filter
        public string getActiveAccount(DistributedTransaction transaction)
        {

            try
            {
                logger.debug("getActiveAccount");
                System.Data.Common.DbDataReader returnMsg = DbHelper.ExecuteReader(System.Data.CommandType.StoredProcedure, "CALL DBA.ANYW_getActiveAccounts()", ref transaction);
                return wfdg.convertToJSON(returnMsg);
            }
            catch (Exception ex)
            {
                logger.error("WFDG", ex.Message + "ANYW_getActiveAccounts()");
                throw ex;
            }
        }
  

    }
}